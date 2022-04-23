const express = require("express");
const router = express.Router();
const AuthRoutes = require("./auth");
const UserRoute = require("./user");

router.use("/auth", AuthRoutes);
router.use("/user", UserRoute);

module.exports = router;
