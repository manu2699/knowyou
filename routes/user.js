const express = require("express");
const router = express.Router();
const Verify = require("../middlewares/verify");

router.post(
	"/signin",
	Validators.signinValidator,
	ValidateReq,
	AuthController.signIn
);
router.post(
	"/signup",
	Validators.signupValidator,
	ValidateReq,
	verifyUser.signUp
);

module.exports = router;
