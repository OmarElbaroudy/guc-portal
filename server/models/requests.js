const mongoose = require("mongoose");
const schema = mongoose.Schema;

const replacement = new schema({
	courseId: schema.Types.ObjectId,
	slotDate: Date,
	slot: {
		type: Number,
		min: 1,
		max: 5,
	},
	locationId: schema.Types.ObjectId,
	academicResponse: {
		type: String,
		enum: ["accepted", "rejected", "pending"],
	},
});

const slotLinking = new schema({
	courseId: schema.Types.ObjectId,
	slot: {
		type: Number,
		min: 1,
		max: 5,
	},
	weekDay: {
		type: Number,
		min: 0, //sunday
		max: 6, //saturday
	},
	locationId: schema.Types.ObjectId
});

const requestSchema = new schema({
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
	},
	type: {
		type: String,
		enum: [
			"replacement",
			"slotLinking",
			"compensation",
			"maternity",
			"sick",
			"accidental",
			"annual",
			"changeDayOff"
		],
	},
	senderComment: String,
	receiverComment: String,
	departmentId: schema.Types.ObjectId,
	senderId: schema.Types.ObjectId,
	receiverId: schema.Types.ObjectId,
	issueDate: Date,
	replacement: replacement,
	slotLinking: slotLinking,
	targetDate: Date, //for sick, accidental, maternity compensation leaves
	newDayOff: Number,
	compensated: {
		//for compensation leaves
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("request", requestSchema);
