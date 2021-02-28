const express = require("express");
const bcrypt = require("bcryptjs");
const hr = require("../models/hr");
const jwt = require("jsonwebtoken");
const academic = require("../models/academic");
const timeCalculations = require("../components/timeCalculations");

const router = express.Router();
const calc = new timeCalculations();
const key = process.env.SECRET;

router.post("/api/login", async (req, res) => {
	const email = req.body.email;
	const h = await hr.findOne({ email: email });
	const a = await academic.findOne({ email: email });
	if (!h && !a) {
		return res.status(408).json("This email doesn't exist");
	}

	let user = h !== null ? h : a;
	const verified = await bcrypt.compare(req.body.password, user.password);
	if (!verified) {
		return res.status(409).json("wrong password");
	}

	const payload = { id: user._id, type: h !== null ? "hr" : "academic" };
	const token = jwt.sign(payload, key);

	calc.update(user);
	user.missingHours = await calc.calculateMissingHours(user);
	user.missingDays = await calc.calculateMissingDays(user);
	await user.save();

	res.header("auth-token", token);
	const t = h !== null ? "hr" : "academic";
	return res.status(201).json({
		token: token,
		message: "login successful",
		user: user,
		type: t,
	});
});

router.get("/api/spectatorHr", async (req, res) => {
	let h = await hr.findOne({ email: "spectatorHr@gmail.com" });
	if (!h) {
		const cur = new hr({
			name: "spectator",
			email: "spectatorHr@gmail.com",
			id: "hr-" + (parseInt(await hr.count()) + 1),
			gender: "male",
			salary: "5000",
			dayOff: 6,
		});
		await cur.save();
	}

	h = await hr.findOne({ email: "spectatorHr@gmail.com" });
	h.password = await bcrypt.hash("123456", await bcrypt.genSalt(10));
	h.altered = true;
	await h.save();

	return res.json("done");
});

router.get("/api/spectatorAc", async (req, res) => {
	let a = await academic.findOne({ email: "spectatorAc@gmail.com" });
	if (!a) {
		const cur = new academic({
			name: "spectator",
			email: "spectatorAc@gmail.com",
			id: "ac-" + (parseInt(await academic.count()) + 1),
			gender: "male",
			salary: "5000",
			dayOff: 6,
		});
		await cur.save();
	}

	a = await academic.findOne({ email: "spectatorAc@gmail.com" });
	a.password = await bcrypt.hash("123456", await bcrypt.genSalt(10));
	a.altered = true;
	await a.save();

	return res.json("done");
});

module.exports = router;
