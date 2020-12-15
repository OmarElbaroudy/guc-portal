const express = require("express");
const jwt_decode = require("jwt-decode");
const Academic = require("../models/academic");
const Requests = require("../models/requests");
const router = express.Router();

const dateDiff = (slotDate, curDate) => {
	return slotDate.getTime() - curDate.getTime() / (1000 * 3600 * 24);
}

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
		const curDate = new Date(
			new Date().getFullYear,
			new Date().getMonth,
			new Date().getDate
		);

		for (const reqID of cur.received_requests) {
			const request = await Requests.findOne({
				_id: reqID,
			});

			if (
				request.type === "Replacement" &&
				request.status === "accepted" &&
				request.replacementRequest.status === "accepted" &&
				dateDiff(request.replacementRequest.slotDate, curDate) < 8
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

			let slotDate = new Date(input.day.year, input.day.month, input.day.day);
			let weekDay = slotDate.getDay();

			let flag = false;
			sender.Schedule.forEach((session) => {
				flag |=
					session.day === weekDay &&
					session.course === input.course &&
					session.slot === input.slot;
			});

			if (!flag) return res.status(407).send("invalid slot");
			const curDate = new Date(
				new Date().getFullYear,
				new Date().getMonth,
				new Date().getDate
			);

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
					date: slotDate,
				},
			};

			let reqID;
			await Requests.insertOne(Request, (err, doc) => {
				reqID = doc._id;
			});

			sender.sent_requests.push(reqID);
			receiver.received_requests.push(reqID);

			sender.save();
			receiver.save();
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
				id : decoded.id
			});
			
			if (!ac)	return res.status(408).send("no such academic member");

			for (const reqID of ac.sent_requests) {
				const request = await Requests.findOne({ //check request.sender is decoded.id or
														 //request.receiver is decoded.id
					_id: reqID,
					type: "Replacement"
				});
					let replacementReq = {
						course:request.replacementRequest.course,
						slotDate : request.replacementRequest.slotDate,
						slot : request.replacementRequest.slot,
						location : request.replacementRequest.location,
						status : request.replacementRequest.status //accepted or rejected by receiver ta
					};
					replacements.push(replacementReq);
				}
			for (const reqID of ac.received_requests) {
				const request = await Requests.findOne({
					_id: reqID,
					type: "Replacement"
				});
				let replacementReq = {
					course:request.replacementRequest.course,
					slotDate : request.replacementRequest.slotDate,
					slot : request.replacementRequest.slot,
					location : request.replacementRequest.location,
					status : request.replacementRequest.status //accepted or rejected by receiver ta
				};
				replacements.push(replacementReq);
				
			}
			res.send(replacements);
		} catch (err) {
			console.log(err);
		}
	});

module.exports = router;
