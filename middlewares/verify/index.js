const jwt = require("jsonwebtoken");

let verifyUser = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const decodedToken = jwt.verify(token, process.env.AUTH_KEY);
		req.userData = { _id: decodedToken._id, isVerified: true };
		return next();
	} catch (error) {
		if (req.userData.verifyAny) return;
		console.log(error.message);
		res.status(400).json({
			status: false,
			message: "Authentication failed"
		});
	}
};

module.exports = {
  verifyUser
};