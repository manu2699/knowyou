const mongoose = require("mongoose");

const knownSchema = mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: "user" },
	atLocation: { type: String },
	atTime: { type: Date, default: Date.now },
	knownBy: { type: Schema.Types.ObjectId, ref: "user" }
});

module.exports = mongoose.model("knw_user", knownSchema);
