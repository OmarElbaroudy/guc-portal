const express = require("express");

const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

const hr = require("../models/hr");
const academic = require("../models/academic");
const timeCalculations = require("../components/timeCalculations");
const requests = require("../models/requests");

const router = express.Router();
const calc = new timeCalculations();

router
	.route("/myProfile")
	.get(async (req, res) => {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		try {
			if (decoded.type === "hr") {
				const h = await hr.findById(decoded.id);
				return res.json(h);
			}

			const a = await academic.findById(decoded.id);
			return res.json(a);
		} catch (err) {
			console.log(err);
		}
	})
	.put(async (req, res) => {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const salt = await bcrypt.genSalt(10);
		const input = req.body;
		try {
			let doc = await academic.findById(decoded.id);

			if (!doc) {
				doc = await hr.findById(decoded.id);
			}
			if (input.gender === "male" || input.gender === "female") {
				doc.gender = input.gender;
			}

			if (input.password) {
				doc.password = await bcrypt.hash(input.password, salt);
				doc.altered = true;
			}

			if (input.personalInfo && input.personalInfo !== "undefined") {
				doc.personalInfo = input.personalInfo;
			}

			await doc.save();
			res.json("done");
		} catch (err) {
			console.log(err);
		}
	});

router.post("api/myProfile/resetPassword", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	const newPassword = req.body.newPassword;
	const salt = await bcrypt.genSalt(10);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	doc.altered = true;
	doc.password = await bcrypt.hash(newPassword, salt);

	await doc.save();
	res.json({ message: "password updated successfully" });
});

router.get("api/myProfile/signIn", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		let doc;
		if (decoded.type === "hr") {
			doc = await hr.findById(decoded.id);
		} else {
			doc = await academic.findById(decoded.id);
		}

		await calc.signIn(doc);
		await doc.save();
		res.json({ message: "signed in successfully", variant: "success"});
	} catch (e) {
		res.json({ message: "you can't sign in on a friday", variant: "danger" });
	}
});

router.get("api/myProfile/signOut", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	try {
		let doc;
		if (decoded.type === "hr") {
			doc = await hr.findById(decoded.id);
		} else {
			doc = await academic.findById(decoded.id);
		}

		await calc.signOut(doc);
		doc.missingHours = await calc.calculateMissingHours(doc);
		doc.missingDays = await calc.calculateMissingDays(doc);

		await doc.save();
		return res.json({ message: "signed out successfully", variant: "success" });
	} catch (e) {
		res.json({ message: "you can't sign out on a friday", variant: "danger" });
	}
});

router.post("api/myProfile/viewAttendanceRecords", async (req, res) => {
	//month number or 0 for all
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);
	const month = req.body.month - 1;

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	let arr = calc.viewAttendanceRecords(month, doc);
	res.json(arr);
});

router.get("api/myProfile/viewMissingDays", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	doc.missingDays = await calc.calculateMissingDays(doc);
	await doc.save();

	res.json(doc.missingDays);
});

router.get("api/myProfile/viewMissingHours", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	doc.missingHours = await calc.calculateMissingHours(doc);
	await doc.save();

	res.json(doc.missingHours);
});

router.get("api/myProfile/notifications", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	const reqID = doc.notifications;
	const arr = await requests.find({
		_id: { $in: reqID },
	});

	let cntA = 0,
		cntR = 0;
	for (const entry of arr) {
		const status = entry.status;
		cntA += status === "accepted" ? 1 : 0;
		cntR += status === "Rejected" ? 1 : 0;
	}

	doc.notifications = [];
	await doc.save();

	let password = doc.altered;

	res.json({ accepted: cntA, rejected: cntR, altered: password });
});

module.exports = router;
