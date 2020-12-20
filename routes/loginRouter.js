const express = require("express");
const bcrypt = require("bcryptjs");
const hr = require("../models/hr");
const jwt = require("jsonwebtoken");
const requests = require("../models/requests");
const academic = require("../models/academic");
const timeCalculations = require("../components/timeCalculations");

const router = express.Router();
const calc = new timeCalculations();
const key = "iehfoeihfpwhoqhfiu083028430bvf";

router.post("/login", async (req, res) => {
	const email = req.body.email;
	const h = await hr.findOne({ email: email });
	const a = await academic.findOne({ email: email });

	if (!h && !a) {
		return res.status(402).send("This email doesn't exist");
	}

	let user = h !== null ? h : a;
	const verified = await bcrypt.compare(req.body.password, user.password);

	if (!verified) {
		return res.status(403).send("wrong password");
	}

	const payload = { id: user._id, type: h !== null ? "hr" : "academic" };
	const token = jwt.sign(payload, key);

	const reqID = user.notifications;
	const arr = await requests.find({
		_id: { $in: reqID },
	});

	user = calc.update(user);
	user.notifications = [];
	await user.save();

	res.header("auth-token", token);
	res.send(`login successful\n you have ${arr.length} notifications\n ${arr}`);
});

module.exports = router;
