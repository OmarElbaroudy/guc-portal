const mongoose = require("mongoose");
const schema = mongoose.Schema;

const session = new schema({
	courseId: schema.Types.ObjectId,
	locationId: schema.Types.ObjectId,
	weekDay: {
		type: Number,
		enum: [0, 1, 2, 3, 4, 6], //0 for sunday
	},
	slot: {
		type: Number,
		min: 1,
		max: 5,
	},
	type: {
		type: String,
		enum: ["lecture", "tutorial", "practical"],
	},
});

const course = new schema({
	courseId: schema.Types.ObjectId,
	position: {
		type: String,
		enum: ["coordinator", "academic", "instructor", "hod"],
	},
});

const annualLeaveBalance = new schema({
	balance: {
		type: Number,
		default: 0,
	},
	lastUpdated: Date,
});

const accidentalLeaveBalance = new schema({
	balance: {
		type: Number,
		default: 0,
	},
	lastUpdated: Date,
});

const attendanceRecord = new schema({
	day: Date, //yyyy mm dd in utc
	signIn: Array, //milliseconds utc
	signOut: Array, //milliseconds utc
	totalTime: {
		type: Number,
		default: 0,
	}, //milliseconds utc
	weekDay: {
		//corresponding weekday
		type: Number,
		enum: [0, 1, 2, 3, 4, 6], //0 for sunday
	},
	compensation: {
		//true if weekday is the day off and compensation
		//leave has been accepted (must be within the same month)
		type: Boolean,
		default: false,
	},
});

const academicSchema = new schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		default: "123456",
	},
	id: {
		type: String,
		unique: true,
	},

	name: String,
	missingHours: Number,
	missingDays: Number,
	attendanceRecords: [attendanceRecord],
	accidentalLeaveBalance: accidentalLeaveBalance,
	annualLeaveBalance: annualLeaveBalance,
	altered: {
		//for first time password change
		type: Boolean,
		default: false,
	},
	salary: Number,
	officeLocationId: schema.Types.ObjectId,
	dayOff: {
		type: Number,
		enum: [0, 1, 2, 3, 4, 6], //0 for sunday
	},
	courses: [course],
	departmentId: schema.Types.ObjectId,
	facultyId: schema.Types.ObjectId,
	gender: { type: String, enum: ["male", "female"] },
	schedule: [session],
	personalInfo: String,
	sentRequestsId: Array,
	receivedRequestsId: Array,
	notifications: Array, //requestIds
});

module.exports = mongoose.model("academic", academicSchema);
