const express = require("express");
const getterRoutes = require("../components/getterRoutes");

const router = express.Router();
const getter = new getterRoutes();

router.post("/api/getCourseNameById", async (req, res) => {
	const id = req.body.id;
	const courseName = await getter.getCourseNameById(id);
	return res.json(courseName);
});

router.post("/api/getStaffNameById", async (req, res) => {
	const id = req.body.id;
	const staffName = await getter.getStaffNameById(id);
	return res.json(staffName);
});

router.post("/api/getCourseIdByName", async (req, res) => {
	const name = req.body.name;
	const courseId = await getter.getCourseIdByName(name);
	return res.json(courseId);
});

router.post("/api/getDepNameById", async (req, res) => {
	const id = req.body.id;
	const depName = await getter.getDepNameById(id);
	return res.json(depName);
});

router.post("/api/getDepIdByName", async (req, res) => {
	const name = req.body.name;
	const depId = await getter.getDepIdByName(name);
	return res.json({
		depId: depId,
	});
});

router.post("/api/getLocationNameById", async (req, res) => {
	const id = req.body.id;
	const locName = await getter.getLocationNameById(id);
	return res.json({
		name: locName,
	});
});

router.post("/api/getLocationIdByName", async (req, res) => {
	const name = req.body.name;
	const id = await getter.getLocationIdByName(name);
	return res.json({
		id: id,
	});
});


router.post("/api/getFacultyNameById", async (req, res) => {
	const id = req.body.id;
	const name = await getter.getFacultyNameById(id);
	return res.json({
		name: name,
	});
});

router.post("/api/getFacultyIdByName", async (req, res) => {
	const name = req.body.name;
	const id = await getter.getFacultyIdByName(name);
	return res.json({
		id: id,
	});
});

router.post("/api/getId", async (req, res) => {
	const id = await getter.getId(req.body.id);
	return res.json(id);
});

router.post("/api/getCoursesInDep", async (req, res) => {
	const arr = await getter.getCoursesInDep(req.body.id);
	return res.json(arr);
});

router.post("/api/isHod", async (req, res) => {
	const valid = await getter.isHod(req.body.depId, req.body.userId);
	return res.json(valid);
});

module.exports = router;
