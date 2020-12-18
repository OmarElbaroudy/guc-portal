const mongoose = require("mongoose");
const schema = mongoose.Schema;

const departmentSchema = new schema({
	name: String,
	facultyId: schema.Types.ObjectId,
	hodId: schema.Types.ObjectId,
	staffMemberId: Array,
	coordinatorId: schema.Types.ObjectId,
});

module.exports = mongoose.model("department", departmentSchema);
