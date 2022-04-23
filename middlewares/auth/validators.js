const { body } = require('express-validator');

// signup validator
const signupValidator = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid e-Mail is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password with minumum of 6 characters is required"),
]

// sigin validator
const signinValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Valid password is required"),
]

module.exports = {
  signinValidator, signupValidator
};