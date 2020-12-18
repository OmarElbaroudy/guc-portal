const mongoose = require("mongoose");
const schema = mongoose.Schema;

const session = new schema({
	instructorId: schema.Types.ObjectId, //if undefined slot has not been linked yet
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

const courseSchema = new schema({
	name: String,
	departmentId: schema.Types.ObjectId,
	facultyId: schema.Types.ObjectId,
	hodId: schema.Types.ObjectId,
	instructorId: Array,
	academicId: Array,
	coordinatorId: schema.Types.ObjectId,
	schedule: [session]
});

module.exports = mongoose.model("course", courseSchema);
