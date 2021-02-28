const express = require("express");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");

const Academic = require("../models/academic");
const HR = require("../models/hr");
const Faculty = require("../models/faculty");
const Location = require("../models/locations");
const Department = require("../models/department");
const Course = require("../models/course");
const Requests = require("../models/requests");
const timeCalculations = require("../components/timeCalculations");

const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = "iehfoeihfpwhoqhfiu083028430bvf";

const calc = new timeCalculations();
const router = express.Router();

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

//4.4 HR
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

	if (decoded.type === "hr") {
		const h = await HR.findOne({
			_id: decoded.id,
		});

		if (!h) return res.status(403).send("unauthorized access");
		next();
	}
};

router
	.route("/api/hr/location")
	.post(auth, async (req, res) => {
		try {
			let t = req.body.type;
			if (t === "lab" || t === "room" || t === "hall" || t === "office") {
				const x = await Location.findOne({
					name: req.body.name,
				});
				if (!x) {
					if (req.body.maxCapacity) {
						const u = parseInt(req.body.maxCapacity);
						if (isNaN(u)) {
							return res.status(454).json("not a valid number");
						}
					} else {
						res.status.json("please enter maxCapacity");
					}
					let loc = new Location({
						name: req.body.name,
						maxCapacity: req.body.maxCapacity,
						type: req.body.type,
					});
					await loc.save();
					const w = await Location.find();
					res.json(w);
				} else {
					res.status(403).json("Cannot use This location name as it already exists");
				}
			} else {
				res.json(
					"location type should only be lab,tutorial room, lecture hall or office"
				);
			}
		} catch (err) {
			console.log(err);
		}
	})

	//update location
	.put(auth, async (req, res) => {
		try {
			const vals = req.body;
			const x = await Location.findOne({
				name: req.body.name,
			});
			if (x) {
				let loc = {};
				if (vals.maxCapacity) {
					const u = parseInt(req.body.maxCapacity);
					if (isNaN(u)) {
						return res.status(455).send("not a valid number");
					}
					if (vals.maxCapacity < x.currCapacity) {
						return res
							.status(403)
							.send(
								"Cannot update because the new capacity is less than the current capacity"
							);
					} else {
						loc.maxCapacity = vals.maxCapacity;
					}
				}
				if (vals.newName) {
					loc.name = vals.newName;
				} else {
					loc.name = vals.name;
				}
				if (vals.type) {
					loc.type = vals.type;
				}
				loc.schedule = x.schedule;
				loc.currCapacity = x.currCapacity;
				const temp = await Location.findOneAndUpdate({ name: req.body.name }, loc, {
					new: true,
				});
				await temp.save();
				const w = await Location.find();
				res.json(w);
			} else {
				res.status(403).send("this location does not exist");
			}
		} catch (err) {
			console.log(err);
		}
	});

router.route("/api/hr/deleteLocation").delete(auth, async (req, res) => {
	try {
		const x = await Location.findOne({
			name: req.body.name,
		});
		const u = await Academic.findOne({ officeLocationId: x._id });
		if (u || x.schedule.length !== 0) {
			return res.json(
				"cannot delete this location as it is occupied by an instructor/session"
			);
		} else {
			await Location.deleteOne({ name: req.body.name });
			const o = await Location.find();
			res.json(o);
		}
	} catch (err) {
		console.log(err);
	}
});
router.route("/api/hr/viewAllStaffMembers").get(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const me = await HR.findOne({
			_id: decoded.id,
		});

		const h = await HR.find();
		const a = await Academic.find();
		let result = h.concat(a);

		result = result.filter((element) => {
			return element.id !== me.id;
		});

		res.json(result);
	} catch (err) {
		res.json(err);
	}
});

router.route("/api/hr/viewAllLocations").get(async (req, res) => {
	try {
		const l = await Location.find();
		res.json(l);
	} catch (err) {
		res.json(err);
	}
});

router.route("/api/hr/viewAllFaculties").get(async (req, res) => {
	try {
		const f = await Faculty.find();

		res.json(f);
	} catch (err) {
		res.json(err);
	}
});

router.route("/api/hr/viewAllDepartments").get(async (req, res) => {
	try {
		const d = await Department.find();

		res.json(d);
	} catch (err) {
		res.json(err);
	}
});

router.route("/api/hr/viewAllCourses").get(async (req, res) => {
	try {
		const c = await Course.find();

		res.json(c);
	} catch (err) {
		res.json(err);
	}
});

router.route("/api/hr/registerMember").post(auth, async (req, res) => {
	try {
		//should remove id as it should be done automatically
		if (
			!req.body.name ||
			!req.body.salary ||
			!req.body.officeLocation ||
			!req.body.email
		) {
			return res
				.status(408)
				.json("each member should have name, salary, email, and office location");
		} else {
			const u = parseInt(req.body.salary);
			if (isNaN(u)) {
				return res.status(456).json("not a valid number");
			}
			const temp = await Location.findOne({ name: req.body.officeLocation });
			if (!temp) {
				return res.status(409).json("this location does not exist");
			}
			if (temp.type !== "office") {
				return res.status(410).json("this location is not an office");
			}
			if (temp.maxCapacity == temp.currCapacity) {
				return res.status(411).json("this location is full");
			}

			let flag = false;
			flag |= (await HR.find({ email: req.body.email })).length > 0;
			flag |= (await Academic.find({ email: req.body.email })).length > 0;

			if (flag) {
				return res.json("email already exists");
			}

			const loc = await Location.findOne({ name: req.body.officeLocation });
			if (req.body.type === "hr") {
				const x = new HR({
					name: req.body.name,
					id: "hr-" + (parseInt(await HR.count()) + 1),
					officeLocationId: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					gender: req.body.gender,
					personalInfo: req.body.personalInfo,
					password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
				});

				await x.save();
			}
			if (req.body.type === "academic") {
				const x = new Academic({
					name: req.body.name,
					id: "ac-" + (parseInt(await Academic.count()) + 1),
					officeLocationId: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					gender: req.body.gender,
					personalInfo: req.body.personalInfo,
					password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
				});
				await x.save();
			}

			const h = await HR.find();
			const a = await Academic.find();
			const result = h.concat(a);

			loc.currCapacity++;
			await loc.save();

			return res.json(result);
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/addFaculty").post(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (!x) {
			const f = new Faculty({ name: req.body.name });
			await f.save();
			const w = await Faculty.find();
			console.log(w);
			res.json(w);
		} else {
			res.status(403).send("this faculty already exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/updateFaculty").put(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.findOneAndUpdate(
				{ name: req.body.name },
				{ name: req.body.newName },
				{ new: true }
			);
			const w = await Faculty.find();
			res.json(w);
		} else {
			res.status(403).send("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/deleteFaculty").delete(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.deleteOne({ name: req.body.name });
			const dep = await Department.findOne({
				facultyId: x._id,
			});

			if (dep) {
				const dep = await Department.findOneAndUpdate(
					{ facultyId: x._id },
					{ facultyId: undefined },
					{ new: true }
				);

				await dep.save();
			}

			const o = await Faculty.find();
			res.json(o);
		} else {
			res.status(403).json("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/addDepartment").post(auth, async (req, res) => {
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});

		if (!x) {
			if (!req.body.faculty) {
				const d = new Department({ name: req.body.name });
				await d.save();
				const o = await Department.find();
				res.json(o);
			} else {
				const f = await Faculty.findOne({ name: req.body.faculty });
				if (!f) return res.status(403).json("no faculty with such name");
				const d = new Department({ name: req.body.name, facultyId: f._id });
				await d.save();
				const o = await Department.find();
				res.json(o);
			}
		} else {
			res.status(403).json("this department already exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/updateDepartment").put(auth, async (req, res) => {
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});

		if (x) {
			if (req.body.newName) {
				x.name = req.body.newName;
			}
			if (req.body.newFaculty) {
				const f = await Faculty.findOne({ name: req.body.newFaculty });
				if (f) {
					x.facultyId = f._id;
				} else {
					return res.status(403).json("this faculty does not exist");
				}
			}

			await Department.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});

			const o = await Department.find();
			res.json(o);
		} else {
			res.status(403).json("this department already exists");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/deleteDepartment").delete(auth, async (req, res) => {
	//delete in course and academic
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});
		if (x) {
			const temp = await Course.find({ departmentId: x._id });
			for (const entry of temp) {
				entry.departmentId = undefined;
				await entry.save();
			}
			const temp1 = await Academic.find({ departmentId: x._id });
			for (const entry of temp1) {
				entry.departmentId = undefined;
				await entry.save();
			}
			await Department.findByIdAndDelete(x._id);

			const o = await Department.find();
			res.json(o);
		} else {
			res.send("not found");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/addCourse").post(async (req, res) => {
	try {
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (x) {
			return res.status(403).json("this course already exist");
		} else {
			if (!req.body.department) {
				return res.status(403).json("please enter a department");
			} else {
				const d = await Department.findOne({ name: req.body.department });
				if (!d) {
					return res.status(403).json("please enter a correct department");
				}

				const hodId = d.hodId ? d.hodId : undefined;
				const c = new Course({
					name: req.body.name,
					departmentId: d._id,
					facultyId: d.facultyId,
					hodId: hodId,
				});
				await c.save();
				const w = await Course.find();
				res.json(w);
			}
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/updateCourse").put(async (req, res) => {
	try {
		console.log(req.body.department);
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).json("this course does not exist");
		} else {
			if (req.body.department) {
				const d = await Department.findOne({ name: req.body.department });
				if (d) {
					x.departmentId = d._id;
					x.facultyId = d.facultyId;
				}
			}

			if (req.body.newName) {
				x.name = req.body.newName;
			}

			await Course.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});
			const w = await Course.find();
			res.json(w);
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/deleteCourse").delete(async (req, res) => {
	try {
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).json("this course does not exist");
		} else {
			//delete replacement requests for this course
			const r = await Requests.find({ type: "replacement" });
			for (const entry of r) {
				if (entry.replacement.courseId) {
					if (entry.replacement.courseId.equals(x._id)) {
						await Requests.findByIdAndDelete(entry._id);
					}
				}
			}

			//delete slotLinking requests for this course

			const r1 = await Requests.find({ type: "slotLinking" });
			for (const entry of r1) {
				if (entry.slotLinking.courseId) {
					if (entry.slotLinking.courseId.equals(x._id)) {
						await Requests.findByIdAndDelete(entry._id);
					}
				}
			}

			//delete this course from instructor and location schedules

			for (let i = 0; i < x.schedule.length; i++) {
				const loc = await Location.findById(x.schedule[i].locationId);
				for (let j = 0; j < loc.schedule.length; j++) {
					loc.schedule = await loc.schedule.filter(function (value) {
						return !value.courseId.equals(x._id);
					});
					await loc.save();
				}

				const inst = await Academic.findById(x.schedule[i].instructorId);
				if (inst) {
					for (let j = 0; j < inst.schedule.length; j++) {
						inst.schedule = await inst.schedule.filter(function (value) {
							return !value.courseId.equals(x._id);
						});
						await inst.save();
					}
				}
			}

			let arr = await Academic.find({
				"courses.courseId": x._id,
			});

			for (const entry of arr) {
				entry.courses = await entry.courses.filter((value) => {
					return !value.courseId.equals(x._id);
				});

				await entry.save();
			}

			await Course.findOneAndDelete({ _id: x._id });
			const o = await Course.find();
			res.json(o);
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/updateStaffMember").put(async (req, res) => {
	try {
		const h = await HR.findOne({
			id: req.body.id,
		});
		if (!h) {
			const a = await Academic.findOne({
				id: req.body.id,
			});
			if (!a) {
				return res.status(403).json("this user does not exist");
			} else {
				if (req.body.name) {
					a.name = req.body.name;
				}
				if (req.body.email) {
					const temp = await Academic.findOne({ email: req.body.email });
					const temp2 = await HR.findOne({ email: req.body.email });
					if (!temp && !temp2) {
						a.email = req.body.email;
					} else {
						return res.json("email already exists");
					}
				}

				if (req.body.officeLocation) {
					const temp = await Location.findOne({
						name: req.body.officeLocation,
					});
					if (!temp) {
						return res.status(403).json("this location does not exist");
					}

					if (temp.type !== "office") {
						return res.status(403).json("this location is not an office");
					}
					if (temp.capacity == temp.currCapacity) {
						return res.status(403).json("this location is full");
					}
					const loc = await Location.findOne({ name: req.body.officeLocation });
					a.officeLocationId = loc._id;
				}

				if (req.body.salary) {
					const z = parseInt(req.body.salary);
					if (isNaN(z)) {
						return res.status(457).json("not a valid number");
					}
					a.salary = req.body.salary;
				}

				await Academic.findOneAndUpdate({ id: req.body.id }, a, {
					new: true,
				});

				const z = await HR.find();
				const w = await Academic.find();
				const result = z.concat(w);
				console.log("reached router 2");
				res.json(result);
			}
		} else {
			if (req.body.name) {
				h.name = req.body.name;
			}
			if (req.body.email) {
				console.log("if1");
				const temp = await HR.findOne({ email: req.body.email });
				if (!temp) {
					console.log("if2");
					h.email = req.body.email;
				}
			}

			if (req.body.officeLocation) {
				const temp = await Location.findOne({ name: req.body.officeLocation });
				if (!temp) {
					return res.status(403).json("this location does not exist");
				}
				if (temp.type !== "office") {
					return res.status(403).json("this location is not an office");
				}
				if (temp.capacity == temp.currCapacity) {
					return res.status(403).json("this location is full");
				}

				const loc = await Location.findOne({ name: req.body.officeLocation });
				h.officeLocationId = loc._id;
			}
			if (req.body.salary) {
				h.salary = req.body.salary;
			}

			await HR.findOneAndUpdate({ id: req.body.id }, h, { new: true });
			const z = await HR.find();
			const w = await Academic.find();
			const result = z.concat(w);
			console.log("reached router 2");
			res.json(result);
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/api/hr/deleteStaffMember").put(async (req, res) => {
	try {
		let acad = false;
		let x = await HR.findOne({
			id: req.body.id,
		});

		if (!x) {
			x = await Academic.findOne({
				id: req.body.id,
			});

			if (!x) {
				return res.status(403).json("this staff member does not exist");
			}

			acad = true;
		}

		const r = await Requests.find({ senderId: x._id });

		for (let i = 0; i < r.length; i++) {
			const temp = await Requests.findOneAndDelete({ _id: r[i]._id });
			if (temp.type === "replacement") {
				const departmentId = temp.departmentId;
				const hodId = (await Department.findOne({ _id: departmentId })).hodId;
				const hod = await Academic.findOne({ _id: hodId });

				hod.receivedRequestsId = await hod.receivedRequestsId.filter(function (
					value
				) {
					return !value.equals(temp._id);
				});

				await hod.save();
			}

			const rcvr = await Academic.findOne({ _id: temp.receiverId });

			if (rcvr) {
				rcvr.receivedRequestsId = await rcvr.receivedRequestsId.filter(function (
					value
				) {
					return !value.equals(temp._id);
				});
			}

			await rcvr.save();
		}

		const r1 = await Requests.find({ receiverId: x._id });
		for (let i = 0; i < r1.length; i++) {
			const temp = await Requests.findOneAndDelete({ _id: r1[i]._id });
			const sndr = await Academic.findOne({ _id: temp.senderId });
			sndr.sentRequestsId = await sndr.sentRequestsId.filter(function (value) {
				return !value.equals(temp._id);
			});
		}

		if (acad) {
			let loc = await Location.find({
				"schedule.instructorId": { $in: [x._id] },
			});

			for (let i = 0; i < loc.length; i++) {
				//delete th slot of the staff member
				// loc[i].schedule = await loc[i].schedule.filter(function (value) {
				// 	return !value.instructorId || !value.instructorId.equals(x._id);
				// });

				//set the instructor id in the slot to undefined
				loc[i].schedule = await loc[i].schedule.map((obj) => {
					if (obj.instructorId && obj.instructorId.equals(x._id))
						obj.instructorId = undefined;
					return obj;
				});

				await loc[i].save();
			}

			let cour = await Course.find({
				"schedule.instructorId": { $in: [x._id] },
			});

			for (let i = 0; i < cour.length; i++) {
				//delete th slot of the staff member
				// cour[i].schedule = await cour[i].schedule.filter(function (value) {
				//   return !value.instructorId || !value.instructorId.equals(x._id);
				// });

				//set the instructor id in the slot to undefined
				cour[i].schedule = await cour[i].schedule.map((obj) => {
					if (obj.instructorId && obj.instructorId.equals(x._id))
						obj.instructorId = undefined;
					return obj;
				});

				await cour[i].save();
			}

			for (let i = 0; i < x.courses; i++) {
				const z = await Course.findOne({ _id: x.courses[i].courseId });

				z.instructorId = await z.instructorId.filter(function (value) {
					return !value.equals(x._id);
				});

				z.academicId = await z.academicId.filter(function (value) {
					return !value.equals(x._id);
				});

				if (z.coordinatorId.equals(x._id)) {
					z.coordinatorId = undefined;
				}

				if (z.hodId.equals(x._id)) {
					z.hodId = undefined;
				}

				await z.save();
			}

			await Academic.findOneAndDelete({ _id: x._id });
			const h = await HR.find();
			const a = await Academic.find();
			const result = h.concat(a);
			res.json(result);
		} else {
			await HR.findOneAndDelete({ _id: x._id });
			const h = await HR.find();
			const a = await Academic.find();
			const result = h.concat(a);
			res.json(result);
		}
	} catch (err) {
		console.log(err);
	}
});

/////////////////////////////////////////////////////////////////////

router.post("/api/hr/addSignInOut", auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const input = req.body;
		const cur = await HR.findById(decoded.id);

		let doc = await Academic.findOne({
			id: input.id,
		});

		if (!doc)
			doc = await HR.findOne({
				id: input.id,
			});

		if (!doc) {
			return res.status(430).json("not a valid id");
		}

		if (doc._id.equals(cur._id)) {
			return res.json("you can't add missing signIns or signOuts for yourself");
		}

		if (input.signIn && input.signIn.year === null) {
			return res.json("please specify a date");
		}

		if (input.signOut && input.signOut.year === null) {
			return res.json("please specify a date");
		}

		if (input.signIn) {
			const signInDate = new Date(
				Date.UTC(input.signIn.year, input.signIn.month - 1, input.signIn.day)
			);

			const signInTime = new Date(
				Date.UTC(
					input.signIn.year,
					input.signIn.month - 1,
					input.signIn.day,
					input.signIn.hour,
					input.signIn.minute
				)
			);

			if (signInTime.getDay() === 5) {
				return res.json("you can't sign in on a Friday");
			}

			await calc.signIn(doc, signInDate, signInTime);
		}

		if (input.signOut) {
			const signOutDate = new Date(
				Date.UTC(input.signOut.year, input.signOut.month - 1, input.signOut.day)
			);
			const signOutTime = new Date(
				Date.UTC(
					input.signOut.year,
					input.signOut.month - 1,
					input.signOut.day,
					input.signOut.hour,
					input.signOut.minute
				)
			);

			if (signOutTime.getDay() === 5) {
				return res.json("you can't sign in on a Friday");
			}

			await calc.signOut(doc, signOutDate, signOutTime);
		}

		doc.missingHours = await calc.calculateMissingHours(doc);
		doc.missingDays = await calc.calculateMissingDays(doc);
		await doc.save();

		return res.json("done");
	} catch (err) {
		console.log(err);
	}
});

router.post("/api/hr/viewAttendanceRecords", auth, async (req, res) => {
	try {
		const input = req.body;
		const doc = await Academic.findOne({
			id: input.id,
		});

		if (!doc) {
			return res.json("not a valid id");
		}

		const curMonth = new Date(Date.UTC()).getMonth();
		const arr = calc.viewAttendanceRecords(curMonth, doc);

		res.json(arr);
	} catch (err) {
		console.log(err);
	}
});

router.get("/api/hr/viewMissingHoursMembers", auth, async (req, res) => {
	try {
		let ac = await Academic.find({
			missingHours: { $gt: 0 },
		});

		let hr = await HR.find({
			missingHours: { $gt: 0 },
		});

		res.json(ac.concat(hr));
	} catch (err) {
		console.log(err);
	}
});

router.get("/api/hr/viewMissingDaysMembers", auth, async (req, res) => {
	try {
		let ac = await Academic.find({
			missingDays: { $gt: 0 },
		});

		let hr = await HR.find({
			missingDays: { $gt: 0 },
		});

		res.json(ac.concat(hr));
	} catch (err) {
		console.log(err);
	}
});
///////////////////////////////////////////////////////////////
//extras

router.post("/api/hr/assignHod", auth, async (req, res) => {
	const hodId = req.body.hodId;
	const dep = req.body.department;

	const hod = await Academic.findOne({ id: hodId });
	const department = await Department.findOne({ name: dep });

	if (!hod) {
		return res.status(451).json("invalid hod id");
	}

	if (!department) {
		return res.status(452).json("invalid department name");
	}

	if (!hod.departmentId || !hod.departmentId.equals(department._id)) {
		return res.status(453).json("this staff member is not in this department");
	}

	if (department.hodId) {
		return res.status(454).json("this department already has hod");
	}

	department.hodId = hod._id;
	const arr = await Course.find({ departmentId: department._id });
	for (const cur of arr) {
		cur.hodId = hod._id;
		hod.courses.push({ courseId: cur._id, position: "hod" });
		await cur.save();
	}

	await hod.save();
	await department.save();

	res.json(department);
});

router.post("/api/hr/assignDepartment", auth, async (req, res) => {
	const id = req.body.id;
	const dep = req.body.department;

	const doc = await Academic.findOne({ id: id });
	const department = await Department.findOne({ name: dep });

	if (!doc) {
		return res.status(453).json("invalid academic id");
	}

	if (!department) {
		return res.status(454).json("invalid department name");
	}

	doc.departmentId = department._id;
	department.staffMemberId.push(doc._id);

	await department.save();
	await doc.save();

	res.json(doc);
});

module.exports = router;
