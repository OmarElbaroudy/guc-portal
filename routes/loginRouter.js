const express = require("express");
const Academic = require("../models/academic");
const bcrypt = require("bcryptjs");
const hr = require("../models/hr");
const jwt = require("jsonwebtoken");

const router = express.Router();
const key = "iehfoeihfpwhoqhfiu083028430bvf";

router.post("/login", async (req, res) => {
	const email = req.body.email;
	const h = await hr.findOne({ email: email });
	const a = await Academic.findOne({ email: email });

	if (!h && !a) {
		return res.status(402).send("This email doesn't exist");
	}

	const user = h !== null ? h : a;
	const verified = await bcrypt.compare(req.body.password, user.password);
	//const verified = user.password === req.body.password;
	if (!verified) {
		return res.status(403).send("wrong password");
	}

	const payload = { id: user._id, type: h !== null ? "hr" : "academic" };
	const token = jwt.sign(payload, key);

	res.header("auth-token", token);
	res.send("login successful");
});

module.exports = router;
