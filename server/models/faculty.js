const mongoose = require("mongoose");
const schema = mongoose.Schema;

const facultySchema = new schema({
	name: String,
});
module.exports = mongoose.model("faculty", facultySchema);
