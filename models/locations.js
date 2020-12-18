const mongoose = require("mongoose");
const schema = mongoose.Schema;

const session = new schema({
	courseId: schema.Types.ObjectId,
	instructorId: schema.Types.ObjectId, //redundant??
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

const locationSchema = new schema({
	name: String,
	schedule: [session],
	maxCapacity: Number,
	type: {
		type: String,
		enum: ["hall", "lab", "room"],
	},
	currCapacity: { type: Number, default: 0 },
});

module.exports = mongoose.model("location", locationSchema);
