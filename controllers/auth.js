const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    let existingAccount = await UserModel.findOne({
      email: req.body.email,
    });
    if (existingAccount) {
      return res.status(400).json({
        message: "Account with same email already exists",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    let newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    newUser = await newUser.save();
    console.log(newUser._id);
    return res.status(200).json({ message: "Sign-up Completed" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Some error occured :(" });
  }
}

const signIn = async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "No such account found..." });
    }

    const verify = bcrypt.compareSync(req.body.password, user.password);
    if (!verify) {
      return res.status(400).json({ message: "Invalid Credentials.." });
    }

    let token = "";
    token = jwt.sign({ _id: user._id }, process.env.AUTH_KEY);

    return res.status(200).json({
      message: "Login Succesfull", data: { user, token }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Some error occured :(" });
  }
}

module.exports = {
  signIn, signUp,
};
