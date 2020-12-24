const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendanceRecord = new schema({
	day: Date, //yyyy mm dd in utc
	signIn: Array, //milliseconds utc
	signOut: Array, //milliseconds utc
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

const hrSchema = new schema({
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
	altered: {
		//for first time password change
		type: Boolean,
		default: false,
	},
	name: String,
	dayOff: {
		type: Number,
		enum: [6], //0 for sunday
	},
	attendanceRecords: [attendanceRecord],
	accidentalLeaveBalance: accidentalLeaveBalance,
	annualLeaveBalance: annualLeaveBalance,
	missingHours: Number,
	missingDays: Number,
	salary: Number,
	gender: { type: String, enum: ["male", "female"] },
	officeLocationId: schema.Types.ObjectId,
	personalInfo: String,
});

module.exports = mongoose.model("hr", hrSchema);
