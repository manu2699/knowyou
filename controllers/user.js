const UserModel = require("../models/user");

const getUser = async (req, res) => {
	try {
		let user = await UserModel.findOne({
			_id: req.userData._id
		});
		res.status(200).send(user);
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Some error occured :(" });
	}
};

module.exports = {
	getUser
};
