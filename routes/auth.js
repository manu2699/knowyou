const express = require("express");
const router = express.Router();
const Validators = require("../middlewares/auth/validators");
const ValidateReq = require("../middlewares/auth/validate_req");
const AuthController = require("../controllers/auth");

/** POST Methods */
/**
 * @openapi
 * /api/user/signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: johndoe@mail.com
 *               password:
 *                 type: string
 *                 default: johnDoe20!@
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid Credentials
 *       404:
 *         description: Some error occured
 *       500:
 *         description: Internal Server Error
 */

router.post(
	"/signin",
	Validators.signinValidator,
	ValidateReq,
	AuthController.signIn
);

/** POST Methods */
/**
 * @openapi
 * /api/user/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: johndoe@mail.com
 *               password:
 *                 type: string
 *                 default: johnDoe20!@
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 */


router.post(
	"/signup",
	Validators.signupValidator,
	ValidateReq,
	AuthController.signUp
);

module.exports = router;
