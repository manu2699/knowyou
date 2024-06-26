const express = require("express");
const router = express.Router();
const Verify = require("../middlewares/verify");
const KnowController = require("../controllers/know");

/**
 * @openapi
 * /api/know/:
 *   post:
 *     tags:
 *       - Know a user
 *     summary: Connect to a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               knownBy:
 *                 type: string
 *                 default: "John Doe"
 *               user:
 *                 type: string
 *                 default: "Jane Doe"
 *               atLocation:
 *                 type: string
 *                 default: "Chennai"
 *     responses:
 *       200:
 *         description: New Known added
 *       400:
 *         description: Already a known user
 *       404:
 *         description: Some error occurred
 *       500:
 *         description: Server Error
 */

router.post("/", Verify.verifyUser, KnowController.newKnown);

/**
 * @openapi
 * /api/know/iknow/{userId}:
 *   get:
 *     tags:
 *       - Knows a user
 *     summary: Get all other users known by a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The id of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all Known users
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

router.get("/iknow/:userId", Verify.verifyUser, KnowController.userKnows);
router.get("/iknow/:userId", Verify.verifyUser, KnowController.userKnows);

/**
 * @openapi
 * /api/know/knowsme/{userId}:
 *   get:
 *     tags:
 *       - Knows a user
 *     summary: Get all users who know a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The id of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all users who know the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

router.get("/knowsme/:userId", Verify.verifyUser, KnowController.knowsUser);

module.exports = router;
