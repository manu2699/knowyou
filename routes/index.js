const express = require("express");
const router = express.Router();
const AuthRoutes = require("./auth");
const UserRoute = require("./user");
const KnowRoutes = require("./know");s

router.use("/auth", AuthRoutes);
router.use("/user", UserRoute);
router.use("/know", KnowRoutes);

module.exports = router;
