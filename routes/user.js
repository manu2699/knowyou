const express = require("express");
const router = express.Router();
const Verify = require("../middlewares/verify");
const userController = require("../controllers/user");

// router.post(
// 	"/",
//   Verify.verifyUser
// );

router.get("/", Verify.verifyUser, userController.getUser);

module.exports = router;
