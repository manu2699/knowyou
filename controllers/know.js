const KnowListModel = require("../models/know");

const newKnown = async (req, res) => {
	try {
		let alreadyKnown = await KnowListModel.findOne({
			knownBy: req.body.knownBy,
			user: req.body.user
		})
		if(alreadyKnown){
			return res.status(400).json({
				message: "Already a known user"
			});
		}
		let newKnown = new KnowListModel({
			knownBy: req.body.knownBy,
			user: req.body.user,
			atLocation: req.body.atLocation
		});
		newKnown = await newKnown.save();
		res.status(200).json({
			message: "New Known added",
			data: newKnown
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Some error occured :(" });
	}
};

const userKnows = async (req, res) => {
	try {
		let userId = req.params?.userId || req.userData._id;
		let knownByMe = await KnowListModel.find({
			knownBy: userId
		})
			.populate("user", { name: 1, email: 1 })
			.populate("knownBy", { name: 1, email: 1 });

		res.status(200).send(knownByMe);
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Some error occured :(" });
	}
};

const knowsUser = async (req, res) => {
	try {
		let userId = req.params?.userId || req.userData._id;
		let usersWhoKnowMe = await KnowListModel.find({
			user: userId
		})
			.populate("user", { name: 1, email: 1 })
			.populate("knownBy", { name: 1, email: 1 });

		res.status(200).send(usersWhoKnowMe);
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Some error occured :(" });
	}
};

module.exports = {
	newKnown,
	userKnows,
	knowsUser
};
