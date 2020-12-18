const express = require("express");
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

const academic = require("../models/academic");
const hr = require("../models/hr");

const router = express.Router();

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

			doc.save();
			res.send(`profile updated successfully\n ${doc}`);
		} catch (err) {
			console.log(err);
		}
	});

module.exports = router;

//TODO:
//other fields that hr or academic can update
