const express = require("express");
const router = express.Router();
const Verify = require("../middlewares/verify");
const KnowController = require("../controllers/know");

/**
 * @openapi
 * "/api/know/":
 *    post:
 *      tags:
 *        - Know a user
 *      summary: Connect to a new user
 *      requestBody:
*         required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 * 						  knownBy:
 * 						    type: string
 * 						    default: "John Doe"
 *              user:
 *                type: string
 *                default: "Jane Doe"
 *                required: true
 *              atLocation:
 *                type: string
 *                default: "Chennai"
 *     responses:
 *      200:
 *        description: New Known added
 *      400:
 *        description: Already a known user
 *      404:
 *        description: Some error occured
 *      500:
 *        description: Server Error
 */


router.post("/", Verify.verifyUser, KnowController.newKnown);


router.get("/iknow/:userId", Verify.verifyUser, KnowController.userKnows);


router.get("/knowsme/:userId", Verify.verifyUser, KnowController.knowsUser);

module.exports = router;
