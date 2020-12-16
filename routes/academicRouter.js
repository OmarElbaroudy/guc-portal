const express = require("express");
const jwt_decode = require("jwt-decode");
const Academic = require("../models/academic");
const Requests = require("../models/requests");
const Course = require("../models/course");
const router = express.Router();

const dateDiff = (slotDate, curDate) => {
	return (slotDate - curDate.getTime()) / (1000 * 3600 * 24);
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
router.route("/ac/viewSchedule").get(auth, async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		const cur = await Academic.findOne({
			id: decoded.id,
		});

		let sessions = [];
		const y = new Date().getFullYear();
		const m = new Date().getMonth();
		const d = new Date().getDate();
		let curDate = new Date(Date.UTC(y, m, d));

		for (const reqID of cur.sent_requests) {
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

router.route("/ac/ReplacementRequest")
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

			if (!flag) {
				return res.status(408).send("invalid slot");
			}
			const y = new Date().getFullYear();
			const m = new Date().getMonth();
			const d = new Date().getDate();
			let curDate = new Date(Date.UTC(y, m, d));

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

			sender.save();
			receiver.save();

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

	router.route("/ac/slotRequest")//need to check valid inputs
	.post(auth, async (req, res) =>{
		try {
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);
			const input = req.body; //slot,weekday and course in req.body

			const sender = await Academic.findOne({
				id: decoded.id
			});
			if(!sender || sender.type==="HOD"||sender.type==="CI") res.status(410).send("invalid academic member");
			const course = await Course.findOne({
				name : input.course_name
			});
			//console.log(sender.type); undefined
			const coordinator_ID = course.coordinator_ID;
			const coordinator = await Academic.findOne({
				id: coordinator_ID
			});
			if (!course) res.status(411).send("invalid course");
			const y = new Date().getFullYear();
			const m = new Date().getMonth();
			const d = new Date().getDate();
			let curDate = new Date(Date.UTC(y, m, d));
			const Request = {
					Status: "pending",
					type: "slotLinking",
					sender: sender.id,
					receiver: coordinator_ID,
					issue_date: curDate,
					slotLinking: {course: input.course_name, slot: input.slot,weekDay:input.weekDay }					
				};
	
				const arr = await Requests.insertMany(Request);
				const reqID = arr[0]._id;

				sender.sent_requests.push(reqID);
				coordinator.received_requests.push(reqID);
	
				sender.save();
				coordinator.save();
				res.send("slotLinking request sent successfully");
		}
		catch(err){
			console.log(err);
		}
	});

module.exports = router;
