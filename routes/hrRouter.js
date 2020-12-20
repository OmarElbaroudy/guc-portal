const express = require("express");
const jwt_decode = require("jwt-decode");
const Academic = require("../models/academic");
const HR = require("../models/hr");
const Faculty=require("../models/faculty")
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
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);
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
					if(req.body.maxCapacity){
						const u=parseInt(req.body.maxCapacity)
					}
					else{
						res.status.send("please enter maxCapacity")
					}
					let loc = new Location({
						name: req.body.name,
						maxCapacity: req.body.maxCapacity,
						type: req.body.type,
					});
					await loc.save();
					res.send("inserted successfully")
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
			const token = req.header("auth-token");
			const decoded = jwt_decode(token);
			const vals = req.body;
			const x = await Location.findOne({
				name: req.body.name,
			});
			if (x) {
				let loc = {};
				if (vals.maxCapacity) {
					const u=parseInt(req.body.maxCapacity)
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
				res.send("location updated successfully")

			} else {
				res.status(403).send("this location does not exist");
			}
		} catch (err) {
			console.log(err);
		}
	});

router.route("/hr/deleteLocation").delete(auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const vals = req.body;
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
			const result = await Location.deleteOne({ name: req.body.name });
			res.send(result);
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/registerMember").post(auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const vals = req.body;
		
		//should remove id as it should be done automatically
		if (
			!req.body.id ||
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
			const u=parseInt(req.body.salary)
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
					id: "hr-"+HR.count(),
					officeLocation: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					personalInfo: req.body.personalInfo,
				});
				await x.save();
			}
			if (req.body.type === "academic") {
				const x = new Academic({
					name: req.body.name,
					id: "ac-"+Academic.count(),
					office_location: loc._id,
					email: req.body.email,
					salary: req.body.salary,
					dayOff: 6,
					personalInfo: req.body.personalInfo,
				});
				await x.save();
			}
			res.send("Member Registered successfully")
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/addFaculty").post(auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Faculty.findOne({
			name: req.body.name
		});
		if (!x) {
			const f= new Faculty({ name: req.body.name });
			await f.save()
			res.send(f)
		} else {
			res.status(403).send("this faculty already exist");
		}
	} catch (err) {
		console.log(err)
	}
});

router.route("/hr/updateFaculty").put(auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.findOneAndUpdate(
				{ name: req.body.name },
				{ name: req.body.newName },
				{ new: true }
			);
			res.send("name changed successfully")
		} else {
			res.status(403).send("this faculty does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteFaculty").delete(auth, async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Faculty.findOne({
			name: req.body.name,
		});
		if (x) {
			await Faculty.deleteOne({ name: req.body.name });
			const dep = await Department.findOne({
				facultyId: x._id,
			});
			res.send("deleted successfully")
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
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Department.findOne({
			name: req.body.name,
		});
		if (!x) {
			if (!req.body.faculty) {
				const d=new Department({ name: req.body.name });
				await d.save()
				res.send("inserted successfully")
			} else {
				const f = await Faculty.findOne({ name: req.body.faculty });
				const d=new Department({ name: req.body.name ,facultyId:f._id});
				await d.save()
				res.send("inserted successfully")
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
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Department.findOne({
			name: req.body.name,
		});
		if (x) {
			if (req.body.newName) {
				x.name = req.body.newName;
			}
			if (req.body.newFaculty) {
				const f = await Faculty.findOne({ name: req.body.newFaculty });
				if(f){
				x.facultyId=f._id;
				}
			}
			const d = await Department.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});

			// else{
			//     const f=await Faculty.findOne({name:req.body.faculty})
			//     const d=await Department.insertOne({name:req.body.name},{name:req.body.newName,name:},{new:true})
			// }
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
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Department.findOne({
			name: req.body.name,
		});
		if (x) {
			const temp = await Course.find({ departmentId: x._id });
			for(const entry of temp){
				entry.departmentId=undefined
				await entry.save()
			}
			const temp1 = await Academic.find({ departmentId: x._id });
			for(const entry of temp1){
				entry.departmentId=undefined
				await entry.save()
			}
			await Department.findByIdAndDelete(x._id);
			res.send("deleted successfully")
		}
		else{
			res.send("not found")
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/addCourse").post(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
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
				if(!d){
					return res.status(403).send("please enter a correct department");

				}
				const c = new Course({
					name: req.body.name,
					departmentId: d._id,
					facultyId: d.facultyId,
				});
				await c.save();
				res.send("course added")
			}
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateCourse").put(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).send("this course does not exist");
		} else {
			if (req.body.department) {
				const d = await Department.findOne({ name: req.body.department });
				if(d){
					x.departmentId = d._id;
					x.facultyId=d.facultyId;
				}
			}
			if (req.body.newName) {
				x.name = req.body.newName;
			}
			const c = await Course.findOneAndUpdate({ name: req.body.name }, x, {
				new: true,
			});
			res.send("updated successfully")
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteCourse").delete(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await Course.findOne({
			name: req.body.name,
		});
		if (!x) {
			return res.status(403).send("this course does not exist");
		} else {
			//delete replacement requests for this course
			const r = await Requests.find({ type: "replacement" });
			for(const entry of r){
				if(entry.replacement.courseId){
					if(entry.replacement.courseId.equals(x._id)){
						const z=await Requests.findByIdAndDelete(entry._id)
					}
				}
			}
			// for(const entry of temp1){
			// 	entry.departmentId=undefined
			// 	await entry.save()
			// }
				// const temp = r[i].filter(function (value) {
				// 	return value.replacement.courseId.equals(x._id);
				// });

			//delete slotLinking requests for this course

			const r1 = await Requests.find({ type: "slotLinking" });
			for(const entry of r1){
				if(entry.slotLinking.courseId){
					if(entry.slotLinking.courseId.equals(x._id)){
						const z=await Requests.findByIdAndDelete(entry._id)
					}
				}
			}
			// r = await Requests.find({ type: "slotLinking" });
			// temp = r.filter(function (value) {
			// 	return value.slotLinking.courseId.equals(x._id);
			// });
			// for (let i = 0; i < temp.length; i++) {
			// 	await Requests.findByIdAndDelete(temp[i]._id);
			// }

			//delete this course from instructor and location schedules

			for (let i = 0; i < x.schedule.length; i++) {
				const loc = Location.findById(x.schedule[i].locationId);
				for (let j = 0; j < loc.schedule.length; j++) {
					loc.schedule = loc.schedule.filter(function (value) {
						return !value.courseId.equals(x._id);
					});
					await loc.save();
				}
				const inst = Academic.findById(x.schedule[i].instructorId);
				for (let j = 0; j < inst.schedule.length; j++) {
					inst.schedule = inst.schedule.filter(function (value) {
						return !value.courseId.equals(x._id);
					});
					await inst.save();
				}
			}
			const e=await Course.findByIdAndDelete(x._id)
			res.send("deleted successfully")
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/updateStaffMember").put(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
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
				// if (req.body.id) {
				// 	const temp = await Academic.findOne({ id: req.body.id });
				// }
				if (req.body.officeLocation) {
					const temp = Location.findOne({ name: req.body.officeLocation });
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
					const z=parseInt(req.body.salary)
					a.salary = req.body.salary;
				}

				const t = await Academic.findOneAndUpdate({ id: req.body.id }, a, {
					new: true,
				});
				res.send("academic updated successfully")
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
			if (req.body.id) {
				const temp = await HR.findOne({ id: req.body.id });
			}
			if (req.body.officeLocation) {
				const temp = Location.findOne({ name: req.body.officeLocation });
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

			const t = await HR.findOneAndUpdate({ id: req.body.id }, h, { new: true });
			res.send("hr updated successfully")
		}
	} catch (err) {
		console.log(err);
	}
});

router.route("/hr/deleteStaffMember").put(async (req, res) => {
	try {
		const token = req.header("auth-token");
		const decoded = jwt_decode(token);
		const x = await HR.findOne({
			id: req.body.id,
		});
		let t = "hr";
		if (!x) {
			const x = await Academic.findOne({
				id: req.body.id,
			});
			if (!x) {
				res.status(403).return("this staff member does not exist");
			}
			let t = "academic";
		}
		//delete request sent/received by this staff member

		do {
			const temp = await Requests.findOneAndDelete({ senderId: x._id });
			if (temp.type === "replacememnt") {
				const departmentId = temp.departmentId;
				const hodId = (await departments.findById(departmentId)).hodId;
				const hod = await academics.findById(hodId);
				hod.receivedRequestsId = hod.receivedRequestsId.filter(function (value) {
					return !value.equals(temp._id);
				});
				hod.save();
			}
			const rcvr = await Academic.findOneById(temp.receiverId);
			if (rcvr) {
				rcvr.receivedRequestsId = rcvr.receivedRequestsId.filter(function (value) {
					return !value.equals(temp._id);
				});
			}
		} while (temp);

		do {
			const temp = await Requests.findOneAndDelete({ receiverId: x._id });
			const sndr = await Academic.findOneById(temp.senderId);
			sndr.sentRequestsId = sndr.receivedRequestsId.filter(function (value) {
				return !value.equals(temp._id);
			});
		} while (temp);

		//delete staff member from any course and department

		if (type === "academic") {
			for (let i = 0; i < x.course; i++) {
				const z = await Course.findById(x.course[i].courseId);
				z.instructorId = z.InstructorId.filter(function (value) {
					return !value.equals(x._id);
				});
				z.academicId = z.academicId.filter(function (value) {
					return !value.equals(x._id);
				});
				z.coordinatorId = z.coordinatorId.filter(function (value) {
					return !value.equals(x._id);
				});
				if (z.hod.equals(x._id)) {
					z.hod = undefined;
				}
				await z.save();
			}
		}

		//todo
		//delete instructorId from loc and course schedules


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

			doc = await calc.signIn(doc, signInDate, signInTime);
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

			doc = await calc.signOut(doc, signOutDate, signOutTime);
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

module.exports = router;
