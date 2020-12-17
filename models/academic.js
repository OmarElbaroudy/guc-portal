const mongoose = require("mongoose");
const schema = mongoose.Schema;


//TODO:
//camelCase
//notifications
//compensated boolean in requests
//changed password boolean in academic

const session = new schema({
	course: String,
	location: String,
	weekDay: Number, //0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday ....
    slot: Number, //1 for first, 2 for second, 3 for third ...
});

const course = new schema({
	name: String,
	position: String, //coordinator, academic or instructor
});

const AcademicSchema = new schema({
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
	attendance_records: Array,
	sign_in_out: Array,

	missing_days: {
		type: Number,
		default: 0,
	},
	missing_hours: {
		type: Number,
		default: 0,
	},
	extra_hours: {
		type: Number,
		default: 0,
	},
    accidental_leaves_balance: {
		type: Number,
		default: 6,
    },
    annual_leaves_balance : Number,
    salary: Number,
    office_location: String,
    day_off: Number,
    courses: [course], 
    department: String,
    faculty: String,
    gender:String,
    Schedule: [session],
    personalInfo : String,
    sent_requests : Array,
    received_requests : Array,
})

module.exports = mongoose.model("Academic", AcademicSchema);
