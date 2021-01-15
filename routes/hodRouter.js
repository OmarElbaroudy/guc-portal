const express = require("express");
const academic = require("../models/academic");
const course = require("../models/course");
const jwt_decode = require("jwt-decode");
const requests = require("../models/requests");
const locations = require("../models/locations");
const getterRoutes = require("../components/getterRoutes");
const mongoose = require("mongoose");
const router = express.Router();
const getter = new getterRoutes();

const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = "iehfoeihfpwhoqhfiu083028430bvf";

const loadTokens = async function () {
	try {
		let data = fs.readFileSync("blackList.json");
		let dataString = data.toString();
		return await JSON.parse(dataString);
	} catch (error) {
		return [];
	}
};

const validToken = function (arr, token) {
	return !arr.includes(token);
};

const auth = async (req, res, next) => {
	if (!req.header("auth-token")) {
		return res.status(403).send("unauthenticated access");
	}

	jwt.verify(req.header("auth-token"), key);
	if (!validToken(await loadTokens(), req.header("auth-token"))) {
		return res.status(450).send("this token is blackListed please login again");
	}

	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	if (decoded.type === "academic") {
		const cur = await academic.findById(decoded.id);
		if (!cur) return res.status(403).send("unauthorized access");

		next();
	}
};

const courseAuth = async (req, res, next) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	if (decoded.type === "academic") {
		const cur = await academic.findById(decoded.id);
		if (!cur) return res.status(403).send("unauthorized access");

		const courseID = await course.findOne(
			{ name: req.body.courseName },
			{ _id: 1 }
		);
		if (courseID) {
			const courseObject = await cur.courses.filter(function (value) {
				return courseID.equals(value.courseId);
			});

			if (courseObject[0].position !== "hod")
				return res.status(403).send("unauthorized access");

			next();
		} else res.json("wrong course");
	}
};

router
	.route("/api/HOD/assign_course_instructor")
	.put(auth, courseAuth, async (req, res) => {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);

		const cur = await academic.findById(decoded.id);
		try {
			if (cur) {
				const x = await academic.findOne({
					id: req.body.id,
				});
				const c = await course.findOne({
					name: req.body.courseName,
				});
				if (c) {
					if (req.body.type === "instructor") c.instructorId.push(x._id);
					else c.academicId.push(x._id);
					await c.save();
				} else {
					console.log("not found");
					res.json("not found");
				}
				if (x) {
					x.courses.push({ courseId: c._id, position: req.body.type });
					await x.save();
					res.json(x);
				} else {
					console.log("not found");
					res.send("not found");
				}
			}
		} catch {
			res.send("err");
		}
	});
router
	.route("/api/HOD/delete_course_instructor")
	.put(auth, courseAuth, async (req, res) => {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		try {
			const cur = await academic.findById(decoded.id);
			const l = [];
			const locs = [];
			if (cur) {
				const x = await academic.findOne({
					id: req.body.id,
				});
				const c = await course.findOne({
					name: req.body.courseName,
				});
				if (c) {
					c.schedule = c.schedule.filter(function (value) {
						if (value.instructorId)
							if (value.instructorId.equals(x._id)) {
								value.instructorId = undefined;
								l.push(value.locationId);
							}
						return true;
					});
					c.instructorId = c.instructorId.filter(function (value) {
						return !value.equals(x._id);
					});
					c.academicId = c.academicId.filter(function (value) {
						return !value.equals(x._id);
					});

					await c.save();

					for (let i = 0; i < l.length; i++) {
						let obj = await locations.findById(l[i]);
						locs.push(obj);
					}

					for (let i = 0; i < locs.length; i++) {
						locs[i].schedule = locs[i].schedule.filter(function (value) {
							if (value.instructorId)
								if (value.instructorId.equals(x._id) && value.courseId.equals(c._id))
									value.instructorId = undefined;
							return true;
						});

						const filter = { name: locs[i].name };
						const update = { schedule: locs[i].schedule };
						await locations.findOneAndUpdate(filter, update, {
							new: true,
						});
					}
				} else {
					console.log("course not found");
					res.send("course not found");
				}
				if (x) {
					x.schedule = x.schedule.filter(function (value) {
						return !value.courseId.equals(c._id);
					});
					x.courses = x.courses.filter(function (value) {
						return !value.courseId.equals(c._id);
					});

					await x.save();
					res.json(x);
				} else {
					console.log("user not found");
					res.send("user not found");
				}
				res.send("instructor removed successfully");
			}
		} catch (err) {
			res.json(err);
		}
	});

router.route("/api/HOD/view_staff").post(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			const c = await course.findOne({
				name: req.body.courseName,
			});
			if (c) {
				if (!c.hodId.equals(cur._id)) {
					return res.status(458).json("you are not the hod of this course");
				}

				let arr = c.instructorId;
				arr = arr.concat(c.academicId);
				academic
					.find({ _id: { $in: arr } })
					.then((doc) => {
						res.json(doc);
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				academic
					.find({ departmentId: cur.departmentId })
					.then((doc) => {
						res.json(doc);
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	} catch (e) {
		console.log(e);
	}
});

router
	.route("/api/HOD/update_course_instructor")
	.put(auth, courseAuth, async (req, res) => {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);

		let inst = false;
		const cur = await academic.findById(decoded.id);
		try {
			if (cur) {
				const x = await academic.findOne({
					id: req.body.orgId,
				});
				const y = await academic.findOne({
					id: req.body.updId,
				});
				const c = await course.findOne({
					name: req.body.courseName,
				});

				if (!x || !y) {
					return res.status(460).json("wrong course");
				}

				if (!c) {
					return res.status(460).json("wrong course");
				}

				if (c) {
					if (
						c.hodId.equals(x._id) ||
						(c.coordinatorId && c.coordinatorId.equals(x._id))
					) {
						return res.status(460).json("wrong course");
					}

					c.instructorId = c.instructorId.filter(function (value) {
						if (value.equals(x._id)) inst = true;
						return !value.equals(x._id);
					});
					if (inst) c.instructorId.push(y._id);
					else {
						c.academicId = c.academicId.filter(function (value) {
							return !value.equals(x._id);
						});
						c.academicId.push(y._id);
					}
				}
				const loc = [];
				x.schedule = x.schedule.filter(function (value) {
					if (value.courseId.equals(c._id)) y.schedule.push(value);
					return !value.courseId.equals(c._id);
				});

				for (var i = 0; i < c.schedule.length; i++) {
					if (
						c.schedule[i].instructorId &&
						c.schedule[i].instructorId.equals(x._id)
					) {
						loc.push(c.schedule[i].locationId);
						c.schedule[i].instructorId = y._id;
					}
				}
				await c.save();

				const locs = [];

				for (let i = 0; i < loc.length; i++) {
					var obj = await locations.findOne({ _id: loc[i] });
					locs.push(obj);
				}

				for (let i = 0; i < locs.length; i++) {
					let flag = false;
					locs[i].schedule = locs[i].schedule.filter(function (value) {
						if (
							value.instructorId &&
							value.instructorId.equals(x._id) &&
							value.courseId.equals(c._id)
						) {
							value.instructorId = y._id;
							flag = true;
						}
						return true;
					});
					if (flag) {
						await locs[i].save();
					}
				}

				let pos;

				if (x) {
					x.courses = x.courses.filter(function (value) {
						if (value.courseId.equals(c._id)) {
							pos = value.position;
							return false;
						}
						return true;
					});

					await x.save();
				} else {
					res.send("old user not found");
				}

				if (y) {
					y.courses.push({ courseId: c._id, position: pos });
					await y.save();
					res.json({ old: x, new: y });
				} else {
					res.send("new user not found");
				}
			}
		} catch (err) {
			console.log(err);
		}
	});
router.route("/api/HOD/view_day_off").post(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		const cur = await academic.findById(decoded.id);

		if (cur) {
			const s = await academic.findOne({
				id: req.body.id,
			});
			if (s) {
				res.send(s.dayOff.toString());
			} else {
				academic
					.find({ departmentId: cur.departmentId }, { dayOff: 1, name: 1, _id: 1 })
					.then((doc) => {
						res.json(doc);
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	} catch {
		res.send("err");
	}
});
router.route("/api/HOD/view_requests").get(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			requests
				.find({ departmentId: cur.departmentId })
				.then((doc) => {
					const ret = doc.filter((req) => {
						return req.type !== "slotLinking";
					});

					return res.json(ret);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	} catch {
		res.send("err");
	}
});
const numOfNotUndefined = (array) => {
	let number = 0;
	for (const entry of array) {
		if (entry.instructorId !== undefined) number++;
	}
	return number;
};
router.route("/api/HOD/view_course_coverage").get(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			let response = [];
			for (const entry of cur.courses) {
				if (entry.position !== "hod") continue;

				const output = await course.findOne({
					_id: entry.courseId,
				});

				if (output) {
					let courseCoverage;
					if (output.schedule.length !== 0)
						courseCoverage =
							(numOfNotUndefined(output.schedule) / output.schedule.length) * 100;
					else courseCoverage = 0;
					response.push({
						course: output.name,
						coverage: courseCoverage + " %",
					});
				}
			}

			res.json(response);
		}
	} catch {
		res.send("err");
	}
});
router.route("/api/HOD/view_course_schedule").post(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			const c = await course.findOne({
				name: req.body.courseName,
			});

			if (c) {
				let schedule = [];

				for (const entry of c.schedule) {
					let courseInst = await academic.findOne({
						_id: entry.instructorId,
					});
					if (!courseInst) courseInst = { name: "no instructor", id: "" };

					const courseName = courseInst.name + "(" + courseInst.id + ")";
					let session = {
						course: courseName,
						weekDay: entry.weekDay,
						slot: entry.slot,
						location: await getter.getLocationNameById(entry.locationId),
						type: entry.type,
					};
					schedule.push(session);
				}

				return res.json(schedule);
			}
		}
	} catch (e) {
		console.log(e);
	}
});
router.route("/api/HOD/accept_requests").put(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			const request = await requests.findById(
				mongoose.Types.ObjectId(req.body._id)
			);
			if (request.status === "pending") {
				request.status = "accepted";
				request.receiverComment = req.body.comment;
				const sender = await academic.findById(request.senderId);
				sender.notifications.push(request._id);

				await request.save();
				await sender.save();

				if (request.type === "changeDayOff") {
					const cc = [];

					sender.dayOff = request.newDayOff;
					sender.schedule = sender.schedule.filter(function (value) {
						if (value.weekDay === sender.dayOff) {
							cc.push(value.courseId);
						}
						return value.weekDay !== sender.dayOff;
					});
					const c = [];
					for (let i = 0; i < cc.length; i++) {
						let obj = await course.findById(cc[i]);
						c.push(obj);
					}
					const l = new Array();
					for (let i = 0; i < c.length; i++) {
						c[i].schedule = c[i].schedule.filter(function (value) {
							if (value.instructorId)
								if (
									value.instructorId.equals(sender._id) &&
									value.weekDay === sender.dayOff
								) {
									value.instructorId = undefined;
									l.push(value.locationId);
								}
							return true;
						});
						const filter = { name: c[i].name };
						const update = { schedule: c[i].schedule };
						await course.findOneAndUpdate(filter, update, {
							new: true,
						});
					}
					const locs = [];
					for (let i = 0; i < l.length; i++) {
						let obj = await locations.findById(l[i]);
						locs.push(obj);
					}

					for (var i = 0; i < locs.length; i++) {
						locs[i].schedule = locs[i].schedule.filter(function (value) {
							if (value.instructorId)
								if (
									value.instructorId.equals(sender._id) &&
									value.weekDay === sender.dayOff
								)
									value.instructorId = undefined;
							return true;
						});

						const filter = { name: locs[i].name };
						const update = { schedule: locs[i].schedule };

						await locations.findOneAndUpdate(filter, update, {
							new: true,
						});
					}

					request.status = "accepted";
					await request.save();
					await sender.save();
				}

				return res.json(request);
			} else {
				return res.json("this request is already accepted/rejected");
			}
		}
	} catch (e) {
		console.log(e);
	}
});
router.route("/api/HOD/reject_requests").put(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	const cur = await academic.findById(decoded.id);
	try {
		if (cur) {
			const request = await requests.findById(
				mongoose.Types.ObjectId(req.body._id)
			);
			if (request.status === "pending") {
				request.status = "rejected";
				const sender = await academic.findById(request.senderId);
				sender.notifications.push(request._id);
				request.receiverComment = req.body.comment;
				await request.save();
				await sender.save();
				res.json(request);
			} else {
				res.send("this request is already accepted/rejected");
			}
		}
	} catch {
		res.send("err");
	}
});
module.exports = router;
