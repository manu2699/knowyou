const express = require("express");
const router = express.Router();
const Validators = require("../middlewares/auth/validators");
const ValidateReq = require("../middlewares/auth/validate_req");
const AuthController = require("../controllers/auth");

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
	AuthController.signUp
);

module.exports = router;
