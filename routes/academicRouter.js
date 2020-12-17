const express = require("express");
const jwt_decode = require("jwt-decode");
const Academic = require("../models/academic");
const Requests = require("../models/requests");
const Course = require("../models/course");
const academic = require("../models/academic");
const department = require("../models/department");
const requests = require("../models/requests");
const router = express.Router();

//TODO:
//academic member can still direct a replacement request to
//hod regardless of it's state

const dateDiff = (slotDate, curDate) => {
	return (slotDate - curDate.getTime()) / (1000 * 3600 * 24);
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
		const ac = await Academic.findOne({
			id: decoded.id,
		});

		if (!ac) {
			return res.status(403).send("unauthorized access");
		}

		next();
	}
};

router.get("/ac/viewSchedule", auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		const cur = await Academic.findOne({
			id: decoded.id,
		});

		let sessions = [];
		let curDate = getCurDate();

		for (const reqID of cur.received_requests) {
			const request = await Requests.findOne({
				_id: reqID,
			});

			if (
				request &&
				request.type === "Replacement" &&
				request.Status === "accepted" &&
				request.replacementRequest.status === "accepted" &&
				dateDiff(request.replacementRequest.slotDate, curDate) < 7 &&
				dateDiff(request.replacementRequest.slotDate, curDate) >= 0
			) {
				let session = {
					slot: request.replacementRequest.slot,
					weekDay: request.replacementRequest.slotDate.getDay(),
					location: request.replacementRequest.location,
					course: request.replacementRequest.course,
				};

				sessions.push(session);
			}
		}
		res.send(sessions.concat(cur.Schedule)); //should have replacements if present
	} catch (err) {
		console.log(err);
	}
});

router
	.route("/ac/ReplacementRequest")
	.post(auth, async (req, res) => {
		try {
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);
			const input = req.body; //id receiver, slot, location, {year, month, day}, course

			const sender = await Academic.findOne({
				id: decoded.id,
			});

			const receiver = await Academic.findOne({
				id: input.id,
			});

			if (!receiver) return res.status(405).send("invalid receiver id");

			let fst = false;
			sender.courses.forEach((item) => {
				fst |= item.name === input.course && item.position === "academic";
			});

			let snd = false;
			receiver.courses.forEach((item) => {
				snd |= item.name === input.course && item.position === "academic";
			});

			if (!fst || !snd) return res.status(406).send("invalid course");

			let slotDate = new Date(
				Date.UTC(input.day.year, input.day.month - 1, input.day.day)
			);
			let weekDay = slotDate.getDay();

			let flag = false;
			sender.Schedule.forEach((session) => {
				flag |=
					session.weekDay === parseInt(weekDay) &&
					session.course === input.course &&
					session.slot === parseInt(input.slot);
			});

			if (!flag) return res.status(408).send("invalid slot");

			let curDate = getCurDate();

			const Request = {
				Status: "pending",
				type: "Replacement",
				department: sender.department,
				sender: sender.id,
				receiver: receiver.id,
				issue_date: curDate,
				replacementRequest: {
					course: input.course,
					slot: input.slot,
					location: input.location,
					slotDate: slotDate,
					status: "pending",
				},
			};

			const arr = await Requests.insertMany(Request);
			const reqID = arr[0]._id;

			sender.sent_requests.push(reqID);
			receiver.received_requests.push(reqID);

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
			const ac = await Academic.findOne({
				id: decoded.id,
			});

			if (!ac) return res.status(408).send("no such academic member");

			for (const reqID of ac.sent_requests) {
				const request = await Requests.findOne({
					_id: reqID,
					type: "Replacement",
				});

				if (!request) res.status(409).send("no requests");

				let replacementReq = {
					course: request.replacementRequest.course,
					slotDate: request.replacementRequest.slotDate,
					slot: request.replacementRequest.slot,
					location: request.replacementRequest.location,
					status: request.replacementRequest.status,
					hodStatus: request.status,
					receiver: request.receiver,
					issue_date: request.issue_date,
				};

				replacements.push(replacementReq);
			}

			for (const reqID of ac.received_requests) {
				const request = await Requests.findOne({
					_id: reqID,
					type: "Replacement",
				});

				let replacementReq = {
					course: request.replacementRequest.course,
					slotDate: request.replacementRequest.slotDate,
					slot: request.replacementRequest.slot,
					location: request.replacementRequest.location,
					status: request.replacementRequest.status,
					hodStatus: request.status,
					sender: request.sender,
					issue_date: request.issue_date,
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
		const input = req.body; //slot,weekday and course in req.body

		const sender = await Academic.findOne({
			id: decoded.id,
		});
		if (!sender) res.status(410).send("invalid id");

		let flag = false;
		for (const course of sender.courses) {
			if (course.name === input.name && course.position !== "coordinator")
				flag = true;
		}

		if (!flag) return res.send("you don't teach this course");

		const course = await Course.findOne({
			name: input.course_name,
		});

		const coordinator_ID = course.coordinator_ID;
		const coordinator = await Academic.findOne({
			id: coordinator_ID,
		});

		if (!course) res.status(411).send("invalid course");

		let curDate = getCurDate();
		const Request = {
			Status: "pending",
			type: "slotLinking",
			sender: sender.id,
			receiver: coordinator_ID,
			issue_date: curDate,
			slotLinking: {
				course: input.course_name,
				slot: input.slot,
				weekDay: input.weekDay,
			},
		};

		const arr = await Requests.insertMany(Request);
		const reqID = arr[0]._id;

		sender.sent_requests.push(reqID);
		coordinator.received_requests.push(reqID);

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

		const sender = await academic.findOne({ id: decoded.id });

		const newDayOff = req.body.newDayOff;
		const comment = req.body.comment ? req.body.comment : "";

		if (newDayOff < 0 || newDayOff > 6)
			return res.status(412).send("invalid day, off day must be between 0 and 6");

		if (newDayOff === sender.day_off)
			return res.send("this is already your day off");

		const hod = await department.findOne({
			name: sender.department,
		});

		let curDate = getCurDate();

		const request = {
			Status: "pending",
			type: "changeDayOff",
			sender: sender.id,
			receiver: hod.hod_ID,
			issue_date: curDate,
			new_day_off: newDayOff,
			sender_comment: comment,
		};

		const arr = await Requests.insertMany(request);
		const reqID = arr[0]._id;

		sender.sent_requests.push(reqID);
		hod.received_requests.push(reqID);

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

		const sender = await academic.findOne({ id: decoded.id });
		if (!sender) return res.status(413).send("invalid id");

		//maternity => check for female , proof documents

		//accidental => check accidental leave balance and annual leave balance
		//deduce the balance in hod

		//sick => current date <= target day + 3,  proof documents

		//compensation
		//day missed must have passed
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

		const sender = await academic.findOne({ id: decoded.id });
		if (!sender) return res.status(413).send("invalid id");
		const reqID = sender.sent_requests;

		if (status === "all") {
			return academic.find({
				_id: { $in: reqID },
			});
		} else {
			return academic.find({
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

		const sender = await academic.findOne({ id: decoded.id });
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
			del.type === "Replacement" &&
			dateDiff(del.replacementRequest.slotDate, curDate) > 0;

		flag |= del.targetDate && dateDiff(del.targetDate, curDate) > 0;

		if (flag) {
			const delID = del._id;
			if (del.type === "Replacement") {
				const hodID = await department.find({
					name: del.department,
				}).hod_ID;

				const hod = await academic.findOne({
					id: hodID,
				});

				const idx = hod.received_requests.indexOf(delID);
				if (idx > -1) {
					hod.received_requests.splice(idx, 1);
				}

				await hod.save();
			}

			if (del.receiver) {
				const receiver = await academic.findOne({
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
