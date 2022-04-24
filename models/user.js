const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	mobile: { type: String },
	age: { type: Number },
});

module.exports = mongoose.model("knw_user", userSchema);
