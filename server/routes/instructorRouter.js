const express = require("express");
const academic = require("../models/academic");
const courses = require("../models/course");
const locations = require("../models/locations");
const jwt_decode = require("jwt-decode");
const getterRoutes = require("../components/getterRoutes");
const router = express.Router();
const getter = new getterRoutes();

const app = express();
let ac = "";

const numOfDefined = (array) => {
	let number = 0;
	for (const entry of array) {
		if (entry.instructorId !== undefined) number++;
	}
	return number;
};

const getCourseIdByName = async (name) => {
	const ret = await courses.findOne({ name: name });
	return ret ? ret._id : undefined;
};
const getAcademicIdById = async (id) => {
	const ret = await academic.findOne({ id: id });
	return ret ? ret._id : undefined;
};
const getLocationIdByName = async (name) => {
	const ret = await locations.findOne({ name: name });
	return ret ? ret._id : undefined;
};

const auth = async (req, res, next) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	ac = await academic.findOne({
		_id: decoded.id,
		"courses.position": "instructor",
	});
	if (!ac) return res.status(403).send("unauthorized access");

	next();
};

router.route("/instructor/viewCoursesCoverage").get(auth, async (req, res) => {
	let response = [];
	for (const entry of ac.courses) {
		if (entry.position !== "instructor") continue;
		const output = await courses.findOne({
			_id: entry.courseId,
		});
		let courseCoverage;

		if (output) {
			if (output.schedule.length !== 0)
				courseCoverage =
					(numOfDefined(output.schedule) / output.schedule.length) * 100;
			else courseCoverage = 0;
			response.push({ course: output.name, coverage: courseCoverage + " %" });
		}
	}
	res.json(response);
});

router.route("/instructor/viewAssignedSlots").get(auth, async (req, res) => {
	let response = [];
	for (const entry of ac.courses) {
		const output = await courses.findOne({
			_id: entry.courseId,
		});

		if (output) {
			let schedule = [];
			for (const entry of output.schedule) {
				const courseInst = await academic.findOne({
					_id: entry.instructorId,
				});
				let courseName = "no instructor";
				if (courseInst) courseName = courseInst.name + "(" + courseInst.id + ")";
				let session = {
					course: courseName,
					weekDay: entry.weekDay,
					slot: entry.slot,
					location: await getter.getLocationNameById(entry.locationId),
					type: entry.type,
				};
				schedule.push(session);
			}

			response.push({ course: output.name, AssignedSlots: schedule });
		}
	}

	res.json(response);
});

router
	.route("/instructor/viewCourseOrDepartmentStaff")
	.post(auth, async (req, res) => {
		let response = [];
		if (req.body.input === "department") {
			const output = await academic.find({
				departmentId: ac.departmentId,
			});
			if (output) response.push({ departmentId: ac.departmentId, Staff: output });
		} else if (req.body.input === "course") {
			for (const entry of ac.courses) {
				console.log(entry);
				const output = await academic.find({
					"courses.courseId": entry.courseId,
				});
				if (output.length != 0)
					response.push({ courseId: entry.courseId, Staff: output });
			}
		}
		res.json(response);
	});

router
	.route("/instructor/assignSlotToAcademic")
	.post(auth, async (req, res) => {
		try {
			let courseId = await getCourseIdByName(req.body.course);
			let course = await courses.findOne({
				_id: courseId,
			});

			if (!course) {
				res.json("this course doesn't exist");
				return;
			}

			let instructor = await academic.findOne({
				"courses.courseId": courseId,
				_id: ac._id,
				"courses.position": "instructor",
			});
			if (!instructor) {
				res.json("You are not the instructor of this course");
				return;
			}
			let academicMember = await academic.findOne({
				"courses.courseId": courseId,
				_id: await getAcademicIdById(req.body.academic),
			});
			if (academicMember.dayOff === req.body.weekDay)
				return res.json("can't assign a slot on the staff member day off");
			if (!academicMember) {
				res.json("This academic either doesn't exist or doesn't teach this course");
				return;
			}
			let location = await locations.findOne({
				name: req.body.location,
			});
			if (!location) {
				res.json("this location is incorrect");
				return;
			}
			if (
				req.body.weekDay > 6 ||
				req.body.weekDay < 0 ||
				req.body.slot > 5 ||
				req.body.slot < 1
			) {
				res.json("check your slot or weekDay input");
				return;
			}
			if (
				req.body.type != "tutorial" &&
				req.body.type != "lecture" &&
				req.body.type != "practical"
			) {
				res.json("slot type is incorrect");
				return;
			}
			let slot = await courses.findOne({
				_id: courseId,
				instructorId: { $in: [ac._id] },
				"schedule.locationId": await getLocationIdByName(req.body.location),
				"schedule.weekDay": req.body.weekDay,
				"schedule.slot": req.body.slot,
				"schedule.type": req.body.type,
			});
			if (!slot) {
				console.log("here");
				res.json("This slot doesn't exist");
				return;
			}

			let slotAssigned = await courses.findOne({
				_id: courseId,
				instructorId: { $in: [ac._id] },
				"schedule.locationId": await getLocationIdByName(req.body.location),
				"schedule.weekDay": req.body.weekDay,
				"schedule.slot": req.body.slot,
				"schedule.type": req.body.type,
			});
			let flag = false;
			for (const session of slotAssigned.schedule) {
				if (
					session.weekDay === req.body.weekDay &&
					session.slot === req.body.slot &&
					session.type === req.body.type &&
					session.instructorId
				)
					flag = true;
			}
			if (flag) {
				res.json("This slot is already assigned");
				return;
			}

			for (const entry of location.schedule) {
				if (
					entry.courseId.equals(await getCourseIdByName(req.body.course)) &&
					entry.weekDay === req.body.weekDay &&
					entry.slot === req.body.slot &&
					entry.type === req.body.type
				) {
					entry.instructorId = await getAcademicIdById(req.body.academic);
					await location.save();
					break;
				}
			}

			for (const entry of slot.schedule) {
				if (
					entry.locationId.equals(await getLocationIdByName(req.body.location)) &&
					entry.weekDay === req.body.weekDay &&
					entry.slot === req.body.slot &&
					entry.type === req.body.type
				) {
					entry.instructorId = await getAcademicIdById(req.body.academic);
					await slot.save();
					break;
				}
			}

			academicMember.schedule.push({
				courseId: await getCourseIdByName(req.body.course),
				locationId: await getLocationIdByName(req.body.location),
				weekDay: req.body.weekDay,
				slot: req.body.slot,
				type: req.body.type,
			});

			await academicMember.save();

			res.json("Assignment made successfully");
		} catch (err) {
			console.log(err);
		}
	});
router.route("/instructor/updateSlotAssignment").put(auth, async (req, res) => {
	try {
		const comparedCourse = await getCourseIdByName(req.body.course);
		const comparedLocation = await getLocationIdByName(req.body.location);
		let courseId = await getCourseIdByName(req.body.course);
		let course = await courses.findOne({
			_id: courseId,
		});

		if (!course) {
			return res.json("this course doesn't exist");
		}

		let instructor = await academic.findOne({
			"courses.courseId": courseId,
			_id: ac._id,
			"courses.position": "instructor",
		});

		if (!instructor) {
			res.json("You are not the instructor of this course");
			return;
		}
		let academicMember = await academic.findOne({
			"courses.courseId": courseId,
			_id: await getAcademicIdById(req.body.academic),
		});

		if (!academicMember) {
			res.json("This academic either doesn't exist or doesn't teach this course");
			return;
		}
		let academicMember2 = await academic.findOne({
			"courses.courseId": courseId,
			_id: await getAcademicIdById(req.body.academic2),
		});
		if (!academicMember2) {
			res.json(
				"The new academic either doesn't exist or doesn't teach this course"
			);
			return;
		}
		let location = await locations.findOne({
			name: req.body.location,
		});
		if (!location) {
			res.json("this location is incorrect");
			return;
		}
		if (
			req.body.weekDay > 6 ||
			req.body.weekDay < 0 ||
			req.body.slot > 5 ||
			req.body.slot < 1
		) {
			res.json("check your slot or weekDay input");
			return;
		}
		if (
			req.body.type != "tutorial" &&
			req.body.type != "lecture" &&
			req.body.type != "practical"
		) {
			res.json("slot type is incorrect");
			return;
		}

		let slot = await courses.findOne({
			_id: courseId,
			instructorId: { $in: [ac._id] },
			"schedule.locationId": await getLocationIdByName(req.body.location),
			"schedule.weekDay": req.body.weekDay,
			"schedule.slot": req.body.slot,
			"schedule.type": req.body.type,
		});

		if (!slot) {
			res.json("This slot doesn't exist");
			return;
		}

		let slotAssigned = await courses.findOne({
			_id: courseId,
			instructorId: { $in: [ac._id] },
			"schedule.instructorId": { $in: [academicMember._id] },
			"schedule.locationId": await getLocationIdByName(req.body.location),
			"schedule.weekDay": req.body.weekDay,
			"schedule.slot": req.body.slot,
			"schedule.type": req.body.type,
		});

		if (!slotAssigned) {
			res.json("This slot is not assigned");
			return;
		}

		for (const entry of location.schedule) {
			if (
				entry.courseId.equals(comparedCourse) &&
				entry.instructorId &&
				entry.instructorId.equals(await getAcademicIdById(req.body.academic)) &&
				entry.weekDay === req.body.weekDay &&
				entry.slot === req.body.slot &&
				entry.type === req.body.type
			) {
				entry.instructorId = await getAcademicIdById(req.body.academic2);
				await location.save();
				break;
			}
		}

		for (const entry of slot.schedule) {
			if (
				entry.locationId.equals(comparedLocation) &&
				entry.instructorId &&
				entry.instructorId.equals(await getAcademicIdById(req.body.academic)) &&
				entry.weekDay === req.body.weekDay &&
				entry.slot === req.body.slot &&
				entry.type === req.body.type
			) {
				entry.instructorId = await getAcademicIdById(req.body.academic2);
				await slot.save();
				break;
			}
		}

		academicMember.schedule = await academicMember.schedule.filter(function (
			value
		) {
			return (
				!value.courseId.equals(comparedCourse) ||
				!value.locationId.equals(comparedLocation) ||
				value.weekDay !== req.body.weekDay ||
				value.slot !== req.body.slot ||
				value.type !== req.body.type
			);
		});
		await academicMember.save();

		academicMember2.schedule.push({
			courseId: comparedCourse,
			locationId: comparedLocation,
			weekDay: req.body.weekDay,
			slot: req.body.slot,
			type: req.body.type,
		});
		await academicMember2.save();

		res.json("Assignment updated successfully");
	} catch (err) {
		console.log(err);
	}
});

router.route("/instructor/deleteSlotAssignment").put(auth, async (req, res) => {
	try {
		const comparedCourse = await getCourseIdByName(req.body.course);
		const comparedLocation = await getLocationIdByName(req.body.location);
		const comparedAcademic = await getAcademicIdById(req.body.academic);

		let courseId = await getCourseIdByName(req.body.course);
		let course = await courses.findOne({
			_id: courseId,
		});

		if (!course) {
			res.json("this course doesn't exist");
			return;
		}

		let instructor = await academic.findOne({
			"courses.courseId": courseId,
			_id: ac._id,
			"courses.position": "instructor",
		});
		if (!instructor) {
			res.json("You are not the instructor of this course");
			return;
		}
		let academicMember = await academic.findOne({
			"courses.courseId": courseId,
			_id: await getAcademicIdById(req.body.academic),
		});
		if (!academicMember) {
			res.json("This academic either doesn't exist or doesn't teach this course");
			return;
		}
		let location = await locations.findOne({
			name: req.body.location,
		});
		if (!location) {
			res.json("this location is incorrect");
			return;
		}
		if (
			req.body.weekDay > 6 ||
			req.body.weekDay < 0 ||
			req.body.slot > 5 ||
			req.body.slot < 1
		) {
			res.json("check your slot or weekDay input");
			return;
		}
		if (
			req.body.type != "tutorial" &&
			req.body.type != "lecture" &&
			req.body.type != "practical"
		) {
			res.json("slot type is incorrect");
			return;
		}
		let slot = await courses.findOne({
			_id: courseId,
			instructorId: { $in: [ac._id] },
			"schedule.locationId": await getLocationIdByName(req.body.location),
			"schedule.weekDay": req.body.weekDay,
			"schedule.slot": req.body.slot,
			"schedule.type": req.body.type,
		});
		if (!slot) {
			res.json("This slot doesn't exist");
			return;
		}

		let slotAssigned = await courses.findOne({
			_id: courseId,
			instructorId: { $in: [ac._id] },
			"schedule.locationId": await getLocationIdByName(req.body.location),
			"schedule.weekDay": req.body.weekDay,
			"schedule.slot": req.body.slot,
			"schedule.type": req.body.type,
		});

		let flag = false;
		for (const session of slotAssigned.schedule) {
			if (
				session.weekDay === req.body.weekDay &&
				session.slot === req.body.slot &&
				session.type === req.body.type &&
				session.instructorId
			)
				flag = true;
		}

		if (!flag) {
			res.json("This slot is not assigned");
			return;
		}

		for (const entry of location.schedule) {
			if (
				entry.courseId.equals(comparedCourse) &&
				entry.instructorId &&
				entry.instructorId.equals(comparedAcademic) &&
				entry.weekDay === req.body.weekDay &&
				entry.slot === req.body.slot &&
				entry.type === req.body.type
			) {
				entry.instructorId = undefined;
				await location.save();
				break;
			}
		}

		for (const entry of slot.schedule) {
			if (
				entry.locationId.equals(await getLocationIdByName(req.body.location)) &&
				entry.instructorId &&
				entry.instructorId.equals(await getAcademicIdById(req.body.academic)) &&
				entry.weekDay === req.body.weekDay &&
				entry.slot === req.body.slot &&
				entry.type === req.body.type
			) {
				entry.instructorId = undefined;
				await slot.save();
				break;
			}
		}

		academicMember.schedule = await academicMember.schedule.filter(function (
			value
		) {
			return (
				!value.courseId.equals(comparedCourse) ||
				!value.locationId.equals(comparedLocation) ||
				value.weekDay !== req.body.weekDay ||
				value.slot !== req.body.slot ||
				value.type !== req.body.type
			);
		});
		await academicMember.save();

		res.json("Assignment deleted successfully");
	} catch (err) {
		console.log(err);
	}
});

router.route("/instructor/deleteAcademic").put(auth, async (req, res) => {
	try {
		const courseId = await getCourseIdByName(req.body.course);
		let cur = await academic.findOne({
			"courses.courseId": courseId,
			_id: ac._id,
			"courses.position": "instructor",
		});

		const l = [];
		const locs = [];
		if (!cur) return res.json("you are not an instructor of this course");
		if (cur) {
			const x = await academic.findOne({
				id: req.body.academic,
			});
			const c = await courses.findOne({
				name: req.body.course,
			});
			if (!x.courses.includes({ courseId: c._id, position: "academic" }))
				return res.json("the staff member is not an academic in this course");
			if (c) {
				c.schedule = c.schedule.filter(function (value) {
					if (value.instructorId)
						if (value.instructorId.equals(x._id)) {
							value.instructorId = undefined;
							l.push(value.locationId);
						}
					return true;
				});
				c.academicId = c.academicId.filter(function (value) {
					return !value.equals(x._id);
				});
				await c.save();

				for (var i = 0; i < l.length; i++) {
					var obj = await locations.findById(l[i]);
					locs.push(obj);
				}

				for (let i = 0; i < locs.length; i++) {
					locs[i].schedule = locs[i].schedule.filter(function (value) {
						if (value.instructorId)
							if (value.instructorId.equals(x._id) && value.courseId.equals(c._id))
								value.instructorId = undefined;
						return true;
					});

					const filter = { name: locs[i].name };
					const update = { schedule: locs[i].schedule };
					await locations.findOneAndUpdate(filter, update, {
						new: true,
					});
				}
			} else {
				console.log("not found");
				res.json("Wrong course name");
			}
			if (x) {
				x.schedule = x.schedule.filter(function (value) {
					return !value.courseId.equals(c._id);
				});
				x.courses = x.courses.filter(function (value) {
					return !value.courseId.equals(c._id) && value.position === "academic";
				});

				await x.save();
			} else {
				console.log("not found");
				res.send("not found");
			}
			res.json(x);
		}
	} catch (err) {
		console.log(err);
	}
});

router
	.route("/instructor/assignCourseCoordinator")
	.post(auth, async (req, res) => {
		try {
			let courseId = await getCourseIdByName(req.body.course);
			let course = await courses.findOne({
				_id: courseId,
			});

			if (!course) {
				res.json("this course doesn't exist");
				return;
      }
      
      if(course.coordinatorId){
        return res.json("this course already has a coordinator");
      }

			let instructor = await academic.findOne({
				"courses.courseId": courseId,
				_id: ac._id,
				"courses.position": "instructor",
			});

			if (!instructor) {
				res.json("You are not the instructor of this course");
				return;
			}

			const curId = await getAcademicIdById(req.body.id);
			let academicMember = await academic.findOne({
				_id: curId,
			});

			if (!academicMember) {
				return res.json("This academic doesn't exist");
			}

			let flag = false;
			if (academicMember.courses) {
				for (const course of academicMember.courses) {
					flag |= course.position === "coordinator";
				}
			}

			if (flag) {
				return res.json(
					"this academic member is already a coordinator of another course"
				);
			}

			course.coordinatorId = academicMember._id;
			await course.save();

			academicMember.courses.push({
				courseId: courseId,
				position: "coordinator",
			});

			await academicMember.save();
			return res.json(academicMember);
		} catch (err) {
			console.log(err);
		}
	});

module.exports = router;
