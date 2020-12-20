const express = require("express");

const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

const hr = require("../models/hr");
const academic = require("../models/academic");
const timeCalculations = require("../components/timeCalculations");

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
				return res.send(h);
			}

			const a = await academic.findById(decoded.id);
			return res.send(a);
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
			const doc = await academic.findById(decoded.id);

			if (input.gender === "male" || input.gender === "female") {
				doc.gender = input.gender;
			}

			if (input.password) {
				doc.password = await bcrypt.hash(input.password, salt);
				doc.altered = true;
			}

			if (input.personalInfo) {
				doc.personalInfo = input.personalInfo;
			}

			if (decoded.type === "hr") {
				if (input.salary) {
					doc.salary = input.salary;
				}
			}

			await doc.save();
			res.send(`profile updated successfully\n ${doc}`);
		} catch (err) {
			console.log(err);
		}
	});

router.post("/myProfile/resetPassword", async (req, res) => {
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
	res.send("password updated successfully");
});

router.get("/myProfile/signIn", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	await calc.signIn(doc);
	await doc.save();
	res.send("signed in successfully");
});

router.get("/myProfile/signOut", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	await calc.signOut(doc);
	doc.missingHours = calc.calculateMissingHours(doc);
	doc.missingDays = calc.calculateMissingDays(doc);

	await doc.save();
	res.send("signed in successfully");
});

router.post("/myProfile/viewAttendanceRecords", async (req, res) => {
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
	res.send(arr);
});

router.post("/myProfile/viewMissingDays", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	doc.missingDays = calc.calculateMissingDays(doc);
	await doc.save();

	res.send(`number of missing days for this month => ${doc.missingDays}`);
});

router.post("/myProfile/viewMissingHours", async (req, res) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	let doc;
	if (decoded.type === "hr") {
		doc = await hr.findById(decoded.id);
	} else {
		doc = await academic.findById(decoded.id);
	}

	doc.missingHours = calc.calculateMissingHours(doc);
	await doc.save();

	if (doc.missingHours === 0) {
		res.send(`you have no missing or extra hours for this month`);
	}

	if (doc.missingHours > 0) {
		res.send(`missing hours for this month => ${doc.missingHours}`);
	}

	if (doc.missingHours < 0) {
		res.send(`extra hours for this month => ${-doc.missingHours}`);
	}
});

module.exports = router;

//TODO:
//other fields that hr or academic can update
