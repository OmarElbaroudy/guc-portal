const express = require("express");
const getterRoutes = require("../components/getterRoutes");

const router = express.Router();
const getter = new getterRoutes();

router.post("/getCourseNameById", async (req, res) => {
	const id = req.body.id;
	const courseName = await getter.getCourseNameById(id);
	return res.json(courseName);
});

router.post("/getCourseIdByName", async (req, res) => {
	const name = req.body.name;
	const courseId = await getter.getCourseIdByName(name);
	return res.json(courseId);
});

router.post("/getDepNameById", async (req, res) => {
	const id = req.body.id;
	const depName = await getter.getDepNameById(id);
	return res.json(depName);
});

router.post("/getDepIdByName", async (req, res) => {
	const name = req.body.name;
	const depId = await getter.getCourseNameById(name);
	return res.json(depId);
});

router.post("/getLocationNameById", async (req, res) => {
	const id = req.body.id;
	const depId = await getter.getCourseNameById(id);
	return res.json(depId);
});

router.post("/getLocationIdByName", async (req, res) => {
	const name = req.body.name;
	const locName = await getter.getCourseNameById(name);
	return res.json(locName);
});

router.post("/getId", async (req, res) => {
	const id = await getter.getCourseNameById(req.body.id);
	return res.json(id);
});

router.post("/getCoursesInDep", async (req, res) => {
	const arr = await getter.getCoursesInDep(req.body.id);
	return res.json(arr);
});

module.exports = router;
