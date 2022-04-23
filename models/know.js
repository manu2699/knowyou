const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const knownSchema = mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: "knw_user" },
	atLocation: { type: Object },
	atTime: { type: Date, default: Date.now },
	knownBy: { type: Schema.Types.ObjectId, ref: "knw_user" }
});

module.exports = mongoose.model("know_list", knownSchema);
