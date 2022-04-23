const UserModel = require("../models/user");

const getUser = async (req, res) => {
	try {
		let userId = req.params?.userId || req.userData._id;
		let user = await UserModel.findOne({
			_id: userId
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
