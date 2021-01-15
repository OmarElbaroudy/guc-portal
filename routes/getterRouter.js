const express = require("express");
const getterRoutes = require("../components/getterRoutes");

const router = express.Router();
const getter = new getterRoutes();

const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = "iehfoeihfpwhoqhfiu083028430bvf";

const loadTokens = async function () {
	try {
		let data = fs.readFileSync("blackList.json");
		let dataString = data.toString();
		return await JSON.parse(dataString);
	} catch (error) {
		return [];
	}
};

const validToken = function (arr, token) {
	return !arr.includes(token);
};

const auth = async (req, res, next) => {
	if (!req.header("auth-token")) {
		return res.status(403).send("unauthenticated access");
	}

	jwt.verify(req.header("auth-token"), key);
	if (!validToken(await loadTokens(), req.header("auth-token"))) {
		return res.status(450).send("this token is blackListed please login again");
	}
	next();
};

router.post("/api/getCourseNameById", auth, async (req, res) => {
	const id = req.body.id;
	const courseName = await getter.getCourseNameById(id);
	return res.json(courseName);
});

router.post("/api/getStaffNameById", auth, async (req, res) => {
	const id = req.body.id;
	const staffName = await getter.getStaffNameById(id);
	return res.json(staffName);
});

router.post("/api/getCourseIdByName", auth, async (req, res) => {
	const name = req.body.name;
	const courseId = await getter.getCourseIdByName(name);
	return res.json(courseId);
});

router.post("/api/getDepNameById", auth, async (req, res) => {
	const id = req.body.id;
	const depName = await getter.getDepNameById(id);
	return res.json(depName);
});

router.post("/api/getDepIdByName", auth, async (req, res) => {
	const name = req.body.name;
	const depId = await getter.getDepIdByName(name);
	return res.json({
		depId: depId,
	});
});

router.post("/api/getLocationNameById", auth, async (req, res) => {
	const id = req.body.id;
	const locName = await getter.getLocationNameById(id);
	return res.json({
		name: locName,
	});
});

router.post("/api/getLocationIdByName", auth, async (req, res) => {
	const name = req.body.name;
	const id = await getter.getLocationIdByName(name);
	return res.json({
		id: id,
	});
});

router.post("/api/getFacultyNameById", auth, async (req, res) => {
	const id = req.body.id;
	const name = await getter.getFacultyNameById(id);
	return res.json({
		name: name,
	});
});

router.post("/api/getFacultyIdByName", auth, async (req, res) => {
	const name = req.body.name;
	const id = await getter.getFacultyIdByName(name);
	return res.json({
		id: id,
	});
});

router.post("/api/getId", auth, async (req, res) => {
	const id = await getter.getId(req.body.id);
	return res.json(id);
});

router.post("/api/getCoursesInDep", auth, async (req, res) => {
	const arr = await getter.getCoursesInDep(req.body.id);
	return res.json(arr);
});

router.post("/api/isHod", auth, async (req, res) => {
	const valid = await getter.isHod(req.body.depId, req.body.userId);
	return res.json(valid);
});

module.exports = router;
