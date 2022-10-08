const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary");
const { findOne } = require("../models/user");

// SignUp Route
exports.signup = bigPromise(async (req, res, next) => {
  // cloudinary photo
  // let result;
  if (!req.files) {
    return next(new customError("Photo is required for Signup", 400));
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new customError("Name, Email and Password are required", 400));
  }
  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "fit",
  });

  // register a user
  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });
  cookieToken(user, res);
});

// SignIn Route
exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check the email and password are in db ?
  if (!(email || password)) {
    return next(new customError("Please provide valid email or password", 400));
  }

  // get user from db
  const user = await User.findOne({ email }).select("+password");

  // if user is not register
  if (!user) {
    return next(
      new customError("Email or password doesn't match or exist", 400)
    );
  }

  // Match the password

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(new customError("Please enter a correct password", 400));
  }
  // If all good, send the token
  cookieToken(user, res);
});
