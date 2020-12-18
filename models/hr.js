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
	name: String,
	attendanceRecords: [attendanceRecord],
	salary: Number,
	gender: { type: String, enum: ["male", "female"] },
	officeLocationId: schema.Types.ObjectId,
	personalInfo: String,
});

module.exports = mongoose.model("HR", hrSchema);
