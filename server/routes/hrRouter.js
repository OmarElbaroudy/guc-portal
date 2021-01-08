const express = require("express");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");

const Academic = require("../models/academic");
const HR = require("../models/hr");
const Faculty = require("../models/faculty");
const Location = require("../models/locations");
const Department = require("../models/department");
const Course = require("../models/course");
const Requests = require("../models/requests");
const timeCalculations = require("../components/timeCalculations");

const calc = new timeCalculations();
const router = express.Router();

//4.4 HR
const auth = async (req, res, next) => {
	const token = req.header("auth-token");
	const decoded = jwt_decode(token);

	if (decoded.type === "hr") {
		const h = await HR.findOne({
			_id: decoded.id,
		});

		if (!h) return res.status(403).send("unauthorized access");
		next();
	}
};

router
	.route("/hr/location")
	.post(auth, async (req, res) => {
		try {
			let t = req.body.type;
			if (
				t == "lab" ||
				t == " tutorial room" ||
				t == "lecture hall" ||
				t == "office"
			) {
				const x = await Location.findOne({
					name: req.body.name,
				});
				if (!x) {
					if (req.body.maxCapacity) {
						const u = parseInt(req.body.maxCapacity);
						if (isNaN(u)) {
							return res.status(454).send("not a valid number");
						}
					} else {
						res.status.send("please enter maxCapacity");
					}
					let loc = new Location({
						name: req.body.name,
						maxCapacity: req.body.maxCapacity,
						type: req.body.type,
					});
					await loc.save();
					res.send("inserted successfully");
				} else {
					res.status(403).send("Cannot use This location name as it already exists");
				}
			} else {
				res.send(
					"location type should only be lab,tutorial room, lecture hall or office"
				);
			}
		} catch (err) {
			console.log(err);
		}
	})

	//update location
	.put(auth, async (req, res) => {
		try {
			const vals = req.body;
			const x = await Location.findOne({
				name: req.body.name,
			});
			if (x) {
				let loc = {};
				if (vals.maxCapacity) {
					const u = parseInt(req.body.maxCapacity);
					if (isNaN(u)) {
						return res.status(455).send("not a valid number");
					}
					if (vals.maxCapacity < x.currCapacity) {
						return res
							.status(403)
							.send(
								"Cannot update because the new capacity is less than the current capacity"
							);
					} else {
						loc.maxCapacity = vals.maxCapacity;
					}
				}
				if (vals.newName) {
					loc.name = vals.newName;
				} else {
					loc.name = vals.name;
				}
				if (vals.type) {
					loc.type = vals.type;
				}
				loc.schedule = x.schedule;
				loc.currCapacity = x.currCapacity;
				const temp = await Location.findOneAndUpdate({ name: req.body.name }, loc, {
					new: true,
				});
				await temp.save();
				res.send("location updated successfully");
			} else {
				res.status(403).send("this location does not exist");
			}
		} catch (err) {
			console.log(err);
		}
	});

router.route("/hr/deleteLocation").delete(auth, async (req, res) => {
	try {
		const x = await Location.findOne({
			name: req.body.name,
		});
		const u = await Academic.findOne({ officeLocationId: x._id });
		if (u || x.schedule.length !== 0) {
			return res
				.status(403)
				.send(
					"cannot delete this location as it is occupied by an instructor/session"
				);
		} else {
			await Location.deleteOne({ name: req.body.name });
			res.send("deleted successfully");
		}
	} catch (err) {
		console.log(err);
	}
});
router.route("/hr/viewAllStaffMembers").get(async(req,res)=>{
	try{
		const h=await HR.find()
		const a=await Academic.find()
		const result=h.concat(a);
		
		res.json(result)
		//res.json([])
	}
	catch(err){
		res.json(err);
	}
})

router.route("/hr/registerMember").post(auth, async (req, res) => {
	try {
		//should remove id as it should be done automatically
		if (
			!req.body.name ||
			!req.body.salary ||
			!req.body.officeLocation ||
			!req.body.email
		) {
			return res
				.status(403)
				.send(
					"each member should have name, salary, email, office location and id"
				);
		} else {
			const u = parseInt(req.body.salary);
			if (isNaN(u)) {
				return res.status(456).send("not a valid number");
			}
			const temp = await Location.findOne({ name: req.body.officeLocation });
			if (!temp) {
				return res.status(403).send("this location does not exist");
			}
			if (temp.type !== "office") {
				return res.status(403).send("this location is not an office");
			}
			if (temp.maxCapacity == temp.currCapacity) {
				return res.status(403).send("this location is full");
			}
			const loc = await Location.findOne({ name: req.body.officeLocation });
			if (req.body.type === "hr") {
				const x = new HR({
					name: req.body.name,
					id: "hr-" + (parseInt(await HR.count()) + 1),
					officeLocation: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					personalInfo: req.body.personalInfo,
					password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
				});

				await x.save();
			}
			if (req.body.type === "academic") {
				const x = new Academic({
					name: req.body.name,
					id: "ac-" + (parseInt(await Academic.count()) + 1),
					office_location: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					personalInfo: req.body.personalInfo,
					password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
				});
				await x.save();
			}
			res.send("Member Registered successfully");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/addFaculty").post(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (!x) {
			const f = new Faculty({ name: req.body.name });
			await f.save();
			res.send(f);
		} else {
			res.status(403).send("this faculty already exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateFaculty").put(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.findOneAndUpdate(
				{ name: req.body.name },
				{ name: req.body.newName },
				{ new: true }
			);
			res.send("name changed successfully");
		} else {
			res.status(403).send("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteFaculty").delete(auth, async (req, res) => {
	try {
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.deleteOne({ name: req.body.name });
			const dep = await Department.findOne({
				facultyId: x._id,
			});
			res.send("deleted successfully");
			while (dep) {
				const dep = await Department.findOneAndUpdate(
					{ facultyId: x._id },
					{ facultyId: undefined },
					{ new: true }
				);
				await dep.save();
			}
		} else {
			res.status(403).send("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/addDepartment").post(auth, async (req, res) => {
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});

		if (!x) {
			if (!req.body.faculty) {
				const d = new Department({ name: req.body.name });
				await d.save();
				res.send("inserted successfully");
			} else {
				const f = await Faculty.findOne({ name: req.body.faculty });
				const d = new Department({ name: req.body.name, facultyId: f._id });
				await d.save();
				res.send("inserted successfully");
			}
		} else {
			res.status(403).send("this department already exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateDepartment").put(auth, async (req, res) => {
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});

		if (x) {
			if (req.body.newName) {
				x.name = req.body.newName;
			}
			if (req.body.newFaculty) {
				const f = await Faculty.findOne({ name: req.body.newFaculty });
				if (f) {
					x.facultyId = f._id;
				}
			}

			await Department.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});

			res.send("department updated successfully");
		} else {
			res.status(403).send("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteDepartment").delete(auth, async (req, res) => {
	//delete in course and academic
	try {
		const x = await Department.findOne({
			name: req.body.name,
		});
		if (x) {
			const temp = await Course.find({ departmentId: x._id });
			for (const entry of temp) {
				entry.departmentId = undefined;
				await entry.save();
			}
			const temp1 = await Academic.find({ departmentId: x._id });
			for (const entry of temp1) {
				entry.departmentId = undefined;
				await entry.save();
			}
			await Department.findByIdAndDelete(x._id);
			res.send("deleted successfully");
		} else {
			res.send("not found");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/addCourse").post(async (req, res) => {
	try {
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (x) {
			return res.status(403).send("this course already exist");
		} else {
			if (!req.body.department) {
				return res.status(403).send("please enter a department");
			} else {
				const d = await Department.findOne({ name: req.body.department });
				if (!d) {
					return res.status(403).send("please enter a correct department");
				}

				const hodId = d.hodId ? d.hodId : undefined;
				const c = new Course({
					name: req.body.name,
					departmentId: d._id,
					facultyId: d.facultyId,
					hodId: hodId,
				});
				await c.save();
				res.send("course added");
			}
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateCourse").put(async (req, res) => {
	try {
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).send("this course does not exist");
		} else {
			if (req.body.department) {
				const d = await Department.findOne({ name: req.body.department });
				if (d) {
					x.departmentId = d._id;
					x.facultyId = d.facultyId;
				}
			}

			if (req.body.newName) {
				x.name = req.body.newName;
			}

			await Course.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});
			res.send("updated successfully");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteCourse").delete(async (req, res) => {
	try {
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).send("this course does not exist");
		} else {
			//delete replacement requests for this course
			const r = await Requests.find({ type: "replacement" });
			for (const entry of r) {
				if (entry.replacement.courseId) {
					if (entry.replacement.courseId.equals(x._id)) {
						await Requests.findByIdAndDelete(entry._id);
					}
				}
			}

			//delete slotLinking requests for this course

			const r1 = await Requests.find({ type: "slotLinking" });
			for (const entry of r1) {
				if (entry.slotLinking.courseId) {
					if (entry.slotLinking.courseId.equals(x._id)) {
						await Requests.findByIdAndDelete(entry._id);
					}
				}
			}

			//delete this course from instructor and location schedules

			for (let i = 0; i < x.schedule.length; i++) {
				const loc = await Location.findById(x.schedule[i].locationId);
				for (let j = 0; j < loc.schedule.length; j++) {
					loc.schedule = await loc.schedule.filter(function (value) {
						return !value.courseId.equals(x._id);
					});
					await loc.save();
				}

				const inst = await Academic.findById(x.schedule[i].instructorId);
				for (let j = 0; j < inst.schedule.length; j++) {
					inst.schedule = await inst.schedule.filter(function (value) {
						return !value.courseId.equals(x._id);
					});
					await inst.save();
				}
			}

			let arr = await Academic.find({
				"courses.courseId": x._id,
			});

			for (const entry of arr) {
				entry.courses = await entry.courses.filter((value) => {
					return !value.courseId.equals(x._id);
				});

				await entry.save();
			}

			await Course.findOneAndDelete({ _id: x._id });
			res.send("deleted successfully");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateStaffMember").put(async (req, res) => {
	try {
		const h = await HR.findOne({
			id: req.body.id,
		});
		if (!h) {
			const a = await Academic.findOne({
				id: req.body.id,
			});
			if (!a) {
				return res.status(403).send("this user does not exist");
			} else {
				if (req.body.name) {
					a.name = req.body.name;
				}
				if (req.body.email) {
					const temp = await Academic.findOne({ email: req.body.email });
					if (!temp) {
						a.email = req.body.email;
					}
				}

				if (req.body.officeLocation) {
					const temp = await Location.findOne({ name: req.body.officeLocation });
					if (!temp) {
						return res.status(403).send("this location does not exist");
					}

					if (temp.type !== "office") {
						return res.status(403).send("this location is not an office");
					}
					if (temp.capacity == temp.currCapacity) {
						return res.status(403).send("this location is full");
					}
					const loc = await Location.findOne({ name: req.body.officeLocation });
					a.officeLocationId = loc._id;
				}

				if (req.body.salary) {
					const z = parseInt(req.body.salary);
					if (isNaN(z)) {
						return res.status(457).send("not a valid number");
					}
					a.salary = req.body.salary;
				}

				await Academic.findOneAndUpdate({ id: req.body.id }, a, {
					new: true,
				});

				res.send("academic updated successfully");
			}
		} else {
			if (req.body.name) {
				h.name = req.body.name;
			}
			if (req.body.email) {
				const temp = await HR.findOne({ email: req.body.email });
				if (!temp) {
					h.email = req.body.email;
				}
			}

			if (req.body.officeLocation) {
				const temp = await Location.findOne({ name: req.body.officeLocation });
				if (!temp) {
					return res.status(403).send("this location does not exist");
				}
				if (temp.type !== "office") {
					return res.status(403).send("this location is not an office");
				}
				if (temp.capacity == temp.currCapacity) {
					return res.status(403).send("this location is full");
				}

				const loc = await Location.findOne({ name: req.body.officeLocation });
				h.officeLocationId = loc._id;
			}
			if (req.body.salary) {
				h.salary = req.body.salary;
			}

			await HR.findOneAndUpdate({ id: req.body.id }, h, { new: true });
			res.send("hr updated successfully");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteStaffMember").put(async (req, res) => {
	try {
		let acad = false;
		let x = await HR.findOne({
			id: req.body.id,
		});

		if (!x) {
			x = await Academic.findOne({
				id: req.body.id,
			});

			if (!x) {
				return res.status(403).return("this staff member does not exist");
			}

			acad = true;
		}

		const r = await Requests.find({ senderId: x._id });

		for (let i = 0; i < r.length; i++) {
			const temp = await Requests.findOneAndDelete({ _id: r[i]._id });
			if (temp.type === "replacement") {
				const departmentId = temp.departmentId;
				const hodId = (await Department.findOne({ _id: departmentId })).hodId;
				const hod = await Academic.findOne({ _id: hodId });

				hod.receivedRequestsId = await hod.receivedRequestsId.filter(function (
					value
				) {
					return !value.equals(temp._id);
				});

				await hod.save();
			}

			const rcvr = await Academic.findOne({ _id: temp.receiverId });

			if (rcvr) {
				rcvr.receivedRequestsId = await rcvr.receivedRequestsId.filter(function (
					value
				) {
					return !value.equals(temp._id);
				});
			}

			await rcvr.save();
		}

		const r1 = await Requests.find({ receiverId: x._id });
		for (let i = 0; i < r1.length; i++) {
			const temp = await Requests.findOneAndDelete({ _id: r1[i]._id });
			const sndr = await Academic.findOne({ _id: temp.senderId });
			sndr.sentRequestsId = await sndr.sentRequestsId.filter(function (value) {
				return !value.equals(temp._id);
			});
		}

		if (acad) {
			let loc = await Location.find({
				"schedule.instructorId": { $in: [x._id] },
			});

			for (let i = 0; i < loc.length; i++) {
				loc[i].schedule = await loc[i].schedule.filter(function (value) {
					return !value.instructorId || !value.instructorId.equals(x._id);
				});

				await loc[i].save();
			}

			let cour = await Course.find({
				"schedule.instructorId": { $in: [x._id] },
			});

			for (let i = 0; i < cour.length; i++) {
				cour[i].schedule = await cour[i].schedule.filter(function (value) {
					return !value.instructorId || !value.instructorId.equals(x._id);
				});

				await cour[i].save();
			}

			for (let i = 0; i < x.courses; i++) {
				const z = await Course.findOne({ _id: x.courses[i].courseId });

				z.instructorId = await z.instructorId.filter(function (value) {
					return !value.equals(x._id);
				});

				z.academicId = await z.academicId.filter(function (value) {
					return !value.equals(x._id);
				});

				if (z.coordinatorId.equals(x._id)) {
					z.coordinatorId = undefined;
				}

				if (z.hodId.equals(x._id)) {
					z.hodId = undefined;
				}

				await z.save();
			}

			await Academic.findOneAndDelete({ _id: x._id });
			const h=await HR.find()
			const a=await Academic.find()
			const result=h.concat(a);
			res.json(result)
		} else {
			await HR.findOneAndDelete({ _id: x._id });
			const h=await HR.find()
			const a=await Academic.find()
			const result=h.concat(a);
			res.json(result)
		}
	} catch (err) {
		console.log(err);
	}
});

/////////////////////////////////////////////////////////////////////

router.post("/hr/addSignInOut", auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const input = req.body;

		const cur = await HR.findById(decoded.id);

		let doc = await Academic.findOne({
			id: input.id,
		});

		if (!doc)
			doc = await HR.findOne({
				id: input.id,
			});

		if (!doc) {
			return res.status(430).send("not a valid id");
		}

		if (doc._id.equals(cur._id)) {
			return res.send("you can't add missing signIns or signOuts for yourself");
		}

		if (input.signIn) {
			const signInDate = new Date(
				Date.UTC(input.signIn.year, input.signIn.month - 1, input.signIn.day)
			);
			const signInTime = new Date(
				Date.UTC(
					input.signIn.year,
					input.signIn.month - 1,
					input.signIn.day,
					input.signIn.hour,
					input.signIn.minute
				)
			);

			await calc.signIn(doc, signInDate, signInTime);
		}

		if (input.signOut) {
			const signOutDate = new Date(
				Date.UTC(input.signOut.year, input.signOut.month - 1, input.signOut.day)
			);
			const signOutTime = new Date(
				Date.UTC(
					input.signOut.year,
					input.signOut.month - 1,
					input.signOut.day,
					input.signOut.hour,
					input.signOut.minute
				)
			);

			await calc.signOut(doc, signOutDate, signOutTime);
		}

		doc.missingHours = calc.calculateMissingHours(doc);
		doc.missingDays = calc.calculateMissingDays(doc);
		await doc.save();

		res.send("added signIn/Out successfully");
	} catch (err) {
		console.log(err);
	}
});

router.post("/hr/viewAttendanceRecords", auth, async (req, res) => {
	try {
		const input = req.body;
		const doc = await Academic.findOne({
			id: input.id,
		});

		if (!doc) {
			return res.status(430).send("not a valid id");
		}
		const curMonth = new Date(Date.UTC()).getMonth();
		const arr = calc.viewAttendanceRecords(curMonth, doc);

		res.send(arr);
	} catch (err) {
		console.log(err);
	}
});

router.get("/hr/viewMissingHoursMembers", auth, async (req, res) => {
	try {
		let ac = await Academic.find({
			missingHours: { $gt: 0 },
		});

		let hr = await HR.find({
			missingHours: { $gt: 0 },
		});

		res.send(ac.concat(hr));
	} catch (err) {
		console.log(err);
	}
});

router.get("/hr/viewMissingDaysMembers", auth, async (req, res) => {
	try {
		let ac = await Academic.find({
			missingDays: { $gt: 0 },
		});

		let hr = await HR.find({
			missingDays: { $gt: 0 },
		});

		res.send(ac.concat(hr));
	} catch (err) {
		console.log(err);
	}
});
///////////////////////////////////////////////////////////////
//extras

router.post("/hr/assignHod", auth, async (req, res) => {
	const hodId = req.body.hodId;
	const dep = req.body.department;

	const hod = await Academic.findOne({ id: hodId });
	const department = await Department.findOne({ name: dep });

	if (!hod) {
		return res.status(451).send("invalid hod id");
	}

	if (!department) {
		return res.status(452).send("invalid department name");
	}

	if (!hod.departmentId || !hod.departmentId.equals(department._id)) {
		return res.status(453).send("this staff member is not in this department");
	}

	if (department.hodId) {
		return res.status(454).send("this department already has hod");
	}

	department.hodId = hod._id;
	const arr = await Course.find({ departmentId: department._id });
	for (const cur of arr) {
		cur.hodId = hod._id;
		hod.courses.push({ courseId: cur._id, position: "hod" });
		await cur.save();
	}

	await hod.save();
	await department.save();

	res.send("assigned academic as hod successfully");
});

router.post("/hr/assignDepartment", auth, async (req, res) => {
	const id = req.body.id;
	const dep = req.body.department;

	const doc = await Academic.findOne({ id: id });
	const department = await Department.findOne({ name: dep });

	if (!doc) {
		return res.status(453).send("invalid academic id");
	}

	if (!department) {
		return res.status(454).send("invalid department name");
	}

	doc.departmentId = department._id;
	department.staffMemberId.push(doc._id);

	await department.save();
	await doc.save();

	res.send("assigned department to academic successfully");
});

module.exports = router;
