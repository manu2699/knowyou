const express = require("express");
const router = express.Router();
const AuthRoutes = require("./auth");
const UserRoute = require("./user");
const KnowRoutes = require("./know");

router.use("/auth", AuthRoutes);
router.use("/user", UserRoute);
router.use("/knows", KnowRoutes);

module.exports = router;
