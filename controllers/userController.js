const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

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
    return next(new customError("Email doesn't match or exist", 400));
  }

  // Match the password

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(new customError("Please enter a correct password", 400));
  }
  // If all good, send the token
  cookieToken(user, res);
});

// Logout Route
exports.logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

// Forgot Password Route
exports.forgotPassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new customError("Email not found as registerd", 400));
  }
  const forgotToken = user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = ` T-Shirt Store: Password Reset Mail \n\n Copy and paste this url in your browser to reset password \n\n ${myUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: user.email,
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new customError(error.message, 500));
  }
});

// Password reset Route
exports.passwordReset = bigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new customError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new customError("Password & Confirm Pasword do not match", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  // Send a JSON response or send token
  cookieToken(user, res);
});

// User dashboard
exports.getLoggedInUserDetails = bigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// change password
exports.changePassword = bigPromise(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");
  const isCorrectOldPassword = await user.isValidatedPassword(
    req.body.oldPassword
  );
  if (!isCorrectOldPassword) {
    return next(new customError("Old Password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();
  cookieToken(user, res);
});

// Update User Details
exports.updateUserDetails = bigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  // for updating photos
  if (req.files) {
    const user = await User.findById(req.user.id);
    const imageId = user.photo.id;

    // deleting photo
    const resp = await cloudinary.v2.uploader.destroy(imageId);

    // uploading new photo
    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "fit",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

// Admin route -- to access all users
exports.admin = bigPromise(async (req, res, next) => {
  // to access all uers

  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
