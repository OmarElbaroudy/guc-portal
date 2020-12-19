const express = require("express");
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

const academic = require("../models/academic");
const requests = require("../models/requests");
const hr = require("../models/hr");

const router = express.Router();

const getCurDate = () => {
	const y = new Date().getFullYear();
	const m = new Date().getMonth();
	const d = new Date().getDate();
	return new Date(Date.UTC(y, m, d));
};

const idxOfRecord = (curDate, doc) => {
	for (let i = 0; i < doc.attendanceRecords.length; i++) {
		if (doc.attendanceRecords[i].day.getTime() === curDate.getTime()) {
			return i;
		}
	}
	return -1;
};

const getCurTime = () => {
	return new Date(Date.UTC()).getTime();
};

const calculateTotalTime = (a, b) => {
	let sum = 0;
	for (let i = 0, j = 0; i < a.length && j < b.length; j++) {
		while (i + 1 < a.length && a[i + 1] < b[j]) i++;
		if (a[i] < b[j]) {
			sum += b[j] - a[i];
			i++;
		}
	}

	return sum;
};

const getStartDate = (now) => {
	let year = now.getFullYear();
	let month = now.getMonth();
	let day = now.getDate();

	if (day >= 11) {
		return new Date(Date.UTC(year, month, 11));
	}

	month = month === 0 ? 11 : month - 1;
	year -= month === 11 ? 1 : 0;

	return new Date(Date.UTC(year, month, 11));
};

const getEndDate = (startDate) => {
	let day = 10;
	let month = startDate.getMonth() === 11 ? 0 : startDate.getMonth() + 1;
	let year = month === 0 ? startDate.getFullYear() + 1 : startDate.getFullYear();

	return new Date(Date.UTC(year, month, day));
};

const calculateTotalInMonth = (startDate, endDate, dayOff, flag) => {
	let ret = 0;
	let tot = flag ? 8 * 60 + 24 : 1;
	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		if (d.getDay() === 5 || d.getDay() === dayOff) continue;
		ret += tot;
	}

	return ret;
};

const calculateMissingHours = (doc) => {
	const now = getCurDate();
	let sum = 0;
	for (let d = getStartDate(now); d <= now; d.setDate(d.getDate() + 1)) {
		let idx = idxOfRecord(d, doc);
		if (idx > -1) {
			sum += doc.attendanceRecords[idx].totalTime;
		}
	}

	const totalTimeInMonth = calculateTotalInMonth(
		getStartDate(now),
		getEndDate(getStartDate(now)),
		doc.dayOff,
		true
	);

	return (sum - totalTimeInMonth) / 60;
};

const calculateMissingDays = (doc) => {
	const now = getCurDate();
	let sum = 0;
	for (let d = getStartDate(now); d <= now; d.setDate(d.getDate() + 1)) {
		let idx = idxOfRecord(d, doc);
		if (
			idx > -1 &&
			doc.attendanceRecords[idx].totalTime > 0 &&
			(doc.attendanceRecords[idx].compensation ||
				doc.attendanceRecords[idx].weekDay !== doc.dayOff)
		) {
			sum += 1;
		}
	}
	return sum;
};

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

	const curDate = getCurDate();
	let idx = idxOfRecord(curDate, doc);
	if (idx > -1) {
		doc.attendanceRecords.push({
			day: curDate,
			weekDay: curDate.getDay(),
		});
		idx = doc.attendanceRecords.length - 1;
	}

	doc.attendanceRecords[idx].signIn.push(getCurTime());
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

	const curDate = getCurDate();
	let idx = idxOfRecord(curDate, doc);
	if (idx > -1) {
		doc.attendanceRecords.push({
			day: curDate,
			weekDay: curDate.getDay(),
		});
		idx = doc.attendanceRecords.length - 1;
	}

	doc.attendanceRecords[idx].signOut.push(getCurTime());
	doc.attendanceRecords[idx].totalTime = calculateTotalTime(
		doc.attendanceRecords.signIn,
		doc.attendanceRecords.signOut
	);

	if (
		curDate.getDay() === doc.dayOff &&
		doc.attendanceRecords[idx].totalTime > 0
	) {
		//search for accepted compensation leaves that have been accepted but not
		//yet compensated prior to today if found then  compensation is true
		const reqID = doc.sentRequestsId;
		const arr = await requests.find({
			_id: { $in: reqID },
			status: "accepted",
			type: "compensation",
			compensated: false,
		});

		for (const request of arr) {
			if (curDate >= request.targetDate) {
				request.compensated = true;
				doc.compensation = true;
				await request.save();
				break;
			}
		}

		doc.missingHours = calculateMissingHours(doc);
		doc.missingDays = calculateMissingDays(doc);

		await doc.save();
	}

	res.send("signed in successfully");
});

module.exports = router;

//TODO:
//other fields that hr or academic can update
