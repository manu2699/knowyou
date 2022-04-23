const express = require("express");
const router = express.Router();
const Verify = require("../middlewares/verify");
const KnowController = require("../controllers/know");

router.post("/", Verify.verifyUser, KnowController.newKnown);
router.get("/iknow/:userId", Verify.verifyUser, KnowController.userKnows);
router.get("/knowsme/:userId", Verify.verifyUser, KnowController.knowsUser);

module.exports = router;
