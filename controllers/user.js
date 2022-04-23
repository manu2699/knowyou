const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
	try {
		let existingAccount = await UserModel.findOne({
			email: req.body.email
		});
		if (existingAccount) {
			//return res.status(200).json({ message: "Sign-up Completed" });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Some error occured :(" });
	}
};

module.exports = {
	getUser
};
