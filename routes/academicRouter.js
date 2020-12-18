const express = require("express");
const jwt_decode = require("jwt-decode");
const requests = require("../models/requests");
const courses = require("../models/course");
const academics = require("../models/academic");
const departments = require("../models/department");
const locations = require("../models/locations");

const router = express.Router();

//TODO:
//academic member can still direct a replacement request to
//hod regardless of it's state

const dateDiff = (slotDate, curDate) => {
	return (slotDate.getTime() - curDate.getTime()) / (1000 * 3600 * 24);
};

const getCourseNameById = async (id) => {
	return await courses.findById(id).name;
};

const getCourseIdByName = async (name) => {
	const ret = await courses.findOne({ name: name });
	return ret ? ret._id : undefined;
};

const getLocationNameById = async (id) => {
	return await locations.findById(id).name;
};

const getLocationIdByName = async (name) => {
	const ret = await locations.findOne({ name: name });
	return ret ? ret._id : undefined;
};

const getCurDate = () => {
	const y = new Date().getFullYear();
	const m = new Date().getMonth();
	const d = new Date().getDate();
	return new Date(Date.UTC(y, m, d));
};

//4.4 Academic Member
const auth = async (req, res, next) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	if (decoded.type === "academic") {
		const ac = await academics.findById(decoded.id);
		if (!ac) return res.status(403).send("unauthorized access");
		next();
	}
};

router.get("/ac/viewSchedule", auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		const cur = await academics.findById(decoded.id);

		let sessions = [];
		let curDate = getCurDate();

		for (const reqID of cur.receivedRequests) {
			const request = await requests.findOne({
				_id: reqID,
			});

			if (
				request &&
				request.type === "replacement" &&
				request.status === "accepted" &&
				request.replacement.status === "accepted" &&
				dateDiff(request.replacement.slotDate, curDate) < 7 &&
				dateDiff(request.replacement.slotDate, curDate) >= 0
			) {
				let session = {
					slot: request.replacement.slot,
					weekDay: request.replacement.slotDate.getDay(),
					location: await getLocationNameById(request.replacement.location),
					course: await getCourseNameById(request.replacement.course),
				};

				sessions.push(session);
			}
		}

		for (const session of cur.schedule) {
			sessions.push({
				slot: session.slot,
				weekDay: session.weekDay,
				location: await getLocationNameById(session.location),
				course: await getCourseNameById(session.courseId),
			});
		}

		res.send(sessions);
	} catch (err) {
		console.log(err);
	}
});

router
	.route("/ac/replacement")
	.post(auth, async (req, res) => {
		try {
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);
			const input = req.body; //id receiver, slot, location, {year, month, day}, course

			const sender = await academics.findById(decoded.id);
			const receiver = await academics.findById(input.id);
			const courseId = await getCourseIdByName(input.course);

			if (!receiver) return res.status(405).send("invalid receiver id");

			let fst = false;
			sender.courses.forEach((item) => {
				fst |= item.courseId.equals(courseId) && item.position === "academic";
			});

			let snd = false;
			receiver.courses.forEach((item) => {
				snd |= item.courseId.equals(courseId) && item.position === "academic";
			});

			if (!fst || !snd) return res.status(406).send("invalid course");

			let slotDate = new Date(
				Date.UTC(input.day.year, input.day.month - 1, input.day.day)
			);

			let weekDay = slotDate.getDay();
			let flag = false;

			sender.schedule.forEach((session) => {
				flag |=
					session.weekDay === parseInt(weekDay) &&
					session.courseId.equals(courseId) &&
					session.slot === parseInt(input.slot);
			});

			if (!flag) return res.status(408).send("invalid slot");

			const Request = {
				status: "pending",
				type: "Replacement",
				department: sender.department,
				senderId: sender._id,
				receiverId: receiver._id,
				issueDate: getCurDate(),
				replacement: {
					course: courseId,
					slot: input.slot,
					locationId: await getLocationIdByName(input.location),
					slotDate: slotDate,
					academicResponse: "pending",
				},
			};

			const arr = await requests.insertMany(Request);
			const reqID = arr[0]._id;

			sender.sentRequests.push(reqID);
			receiver.receivedRequests.push(reqID);

			await sender.save();
			await receiver.save();

			res.send("request sent successfully");
		} catch (err) {
			console.log(err);
		}
	})

	.get(auth, async (req, res) => {
		try {
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);

			let replacements = [];
			const sender = await academics.findById(decoded.id);

			if (!sender) return res.status(408).send("no such academic member");

			for (const reqID of sender.sentRequests) {
				const request = await requests.findOne({
					_id: reqID,
					type: "replacement",
				});

				if (!request) res.status(409).send("no requests");

				let replacementReq = {
					course: await getCourseNameById(request.replacement.course),
					slotDate: request.replacement.slotDate,
					slot: request.replacement.slot,
					location: await getLocationNameById(request.replacement.location),
					status: request.replacement.status,
					hodStatus: request.status,
					receiver: request.receiver,
					issueDate: request.issueDate,
				};

				replacements.push(replacementReq);
			}

			for (const reqID of sender.receivedRequests) {
				const request = await requests.findOne({
					_id: reqID,
					type: "Replacement",
				});

				let replacementReq = {
					course: await getCourseNameById(request.replacement.course),
					slotDate: request.replacement.slotDate,
					slot: request.replacement.slot,
					location: await getLocationNameById(request.replacement.location),
					status: request.replacement.status,
					hodStatus: request.status,
					sender: request.sender,
					issueDate: request.issueDate,
				};

				replacements.push(replacementReq);
			}
			res.send(replacements);
		} catch (err) {
			console.log(err);
		}
	});

//TODO:
//check for valid inputs

router.post("/ac/slotRequest", auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const input = req.body; //slot, weekday and course in req.body

		const sender = await academics.findById(decoded.id);
		if (!sender) res.status(410).send("invalid id");

		let flag = false;
		for (const course of sender.courses) {
			const courseName = await getCourseNameById(course.courseId);
			if (courseName === input.name && course.position !== "coordinator")
				flag = true;
		}

		if (!flag) return res.send("you don't teach this course");

		const course = await course.findOne({
			name: input.courseName,
		});

		const coordinatorId = course.coordinatorId;
		const coordinator = await academics.findById(coordinatorId);

		if (!course) res.status(411).send("invalid course");

		let curDate = getCurDate();
		const request = {
			status: "pending",
			type: "slotLinking",
			sender: sender._id,
			receiver: coordinatorId,
			issueDate: curDate,
			slotLinking: {
				course: course._id,
				slot: input.slot,
				weekDay: input.weekDay,
			},
		};

		const arr = await requests.insertMany(request);
		const reqID = arr[0]._id;

		sender.sentRequests.push(reqID);
		coordinator.receivedRequests.push(reqID);

		await sender.save();
		await coordinator.save();
		res.send("slotLinking request sent successfully");
	} catch (err) {
		console.log(err);
	}
});

router.post("/ac/changeDayOff", auth, async (req, res) => {
	//day off as number from 0 to 6 and comment
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);

		const sender = await academics.findById(decoded.id);

		const newDayOff = req.body.newDayOff;
		const comment = req.body.comment ? req.body.comment : "";

		if (newDayOff < 0 || newDayOff > 6)
			return res.status(412).send("invalid day, off day must be between 0 and 6");

		if (newDayOff === sender.day_off)
			return res.send("this is already your day off");

		const hodId = await departments.findById(sender.department).hodId;
		const hod = await academics.findById(hodId);

		const request = {
			status: "pending",
			type: "changeDayOff",
			sender: sender._id,
			receiver: hodId,
			issueDate: getCurDate(),
			newDayOff: newDayOff,
			senderComment: comment,
		};

		const arr = await requests.insertMany(request);
		const reqID = arr[0]._id;

		sender.sentRequests.push(reqID);
		hod.receivedRequests.push(reqID);

		await sender.save();
		await hod.save();
		res.send("change day off request sent successfully");
	} catch (err) {
		console.log(err);
	}
});

router.post("/ac/leaveRequest", auth, async (req, res) => {
	try {
		//maternity, accidental, sick, compensation
		//targetDay,
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const input = req.body;
		const comment = req.body.comment ? req.body.comment : "";
		let request = [];
		const sender = await academics.findOne({ id: decoded.id });
		if (!sender) return res.status(413).send("invalid id");

		const departmentId = sender.departmentId;
		const hodId = await departments.findById(departmentId).hodId;
		const hod = await academics.findOne({ id: hodId });
		let curDate = getCurDate();
		const type = input.type;
		//maternity => check for female , proof documents
		if (type === "maternity") {
			if (sender.gender === "male") {
				return res.status(413).send("males cannot submit maternity leaves");
			} else {
				request = {
					Status: "pending",
					type: "maternity",
					senderComment: comment,
					departmentId: departmentId,
					senderId: sender.id,
					receiverId: hod.id,
					issue_date: curDate,
					targetDate: input.targetDate,
				};
			}
		}
		//accidental => check accidental leave balance and annual leave balance
		//deduct the balance in hod
		if (type === "accidental") {
			if (
				sender.accidentalLeaveBalance.balance <= 0 ||
				sender.annualLeaveBalance.balance <= 0
			) {
				return res.status(414).send("you consumed all your balance");
			} else {
				request = {
					Status: "pending",
					type: "accidental",
					senderComment: comment,
					departmentId: departmentId,
					senderId: sender.id,
					receiverId: hod.id,
					issue_date: curDate,
					targetDate: input.targetDate,
				};
			}
		}
		//sick => current date <= target day + 3,  proof documents
		if (type === "sick") {
			if (dateDiff(curDate, input.targetDate) > 3) {
				return res
					.status(415)
					.send("you cannot submit a sick leave after more than 3 days");
			}
		} else {
			request = {
				Status: "pending",
				type: "sick",
				senderComment: comment,
				departmentId: departmentId,
				senderId: sender.id,
				receiverId: hod.id,
				issue_date: curDate,
				targetDate: input.targetDate,
			};
		}
		//compensation
		if (type === "compensation") {
			if (comment != "") {
				request = {
					Status: "pending",
					type: "compensation",
					senderComment: comment,
					departmentId: departmentId,
					senderId: sender.id,
					receiverId: hod.id,
					issue_date: curDate,
					targetDate: input.targetDate,
				};
			} else {
				return res.status(416).send("compensation leaves must have a reason");
			}
		}
		
		if (type === "annual") {
			if (sender.annualLeaveBalance.balance <= 0) {
				return res.status(416).send("you consumed all your annual leaves");
			}
			if (dateDiff(input.targetDate, curDate) <= 0) {
				return res
					.status(416)
					.send("Annual leaves should be submitted before the targeted day");
			}
			request = {
				Status: "pending",
				type: "annual",
				senderComment: comment,
				departmentId: departmentId,
				senderId: sender.id,
				receiverId: hod.id,
				issue_date: curDate,
				targetDate: input.targetDate,
			};
		}

		const arr = await requests.insertMany(request);
		const reqID = arr[0]._id;

		sender.sentRequests.push(reqID);
		hod.receivedRequests.push(reqID);

		await sender.save();
		await hod.save();
		res.send("change day off request sent successfully");
	} catch (err) {
		console.log(err);
	}
});

//TODO:
//validate input
router.post("/ac/viewSubmittedRequests", auth, async (req, res) => {
	try {
		//status : all, accepted, pending, rejected,
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const status = req.body.status;

		const sender = await academics.findById(decoded.id);
		if (!sender) return res.status(413).send("invalid id");
		const reqID = sender.sentRequests;

		if (status === "all") {
			return academics.find({
				_id: { $in: reqID },
			});
		} else {
			return academics.find({
				_id: { $in: reqID },
				status: status,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

router.post("/ac/cancelRequest", auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);

		const sender = await academics.findById(decoded.id);
		if (!sender) return res.status(413).send("invalid id");

		const del = requests.find({
			_id: req.body._id,
		});

		if (!del) return res.status(414).send("no such request");
		const curDate = getCurDate();

		if (!sender.sent_requests.includes(del._id))
			return res.status(415).send("user not owner of request");

		let flag = false;
		flag |= del.status === "pending";

		flag |=
			del.type === "replacement" &&
			dateDiff(del.replacement.slotDate, curDate) > 0;

		flag |= del.targetDate && dateDiff(del.targetDate, curDate) > 0;

		if (flag) {
			const delID = del._id;
			if (del.type === "replacement") {
				const hodID = await departments.find({
					name: del.department,
				}).hod_ID;

				const hod = await academics.findOne({
					id: hodID,
				});

				const idx = hod.received_requests.indexOf(delID);
				if (idx > -1) {
					hod.received_requests.splice(idx, 1);
				}

				await hod.save();
			}

			if (del.receiver) {
				const receiver = await academics.findOne({
					id: del.receiver,
				});

				const idx = receiver.received_requests.indexOf(delID);

				if (idx > -1) {
					receiver.received_requests.splice.indexOf(idx, 1);
				}

				await receiver.save();
			}

			const idx = sender.sent_requests.indexOf(delID);
			sender.sent_requests.splice(idx, 1);

			await sender.save();
			await requests.deleteOne({ _id: delID });
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
