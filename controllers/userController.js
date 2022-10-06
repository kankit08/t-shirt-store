const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary");

exports.signup = bigPromise(async (req, res, next) => {
  // cloudinary photo
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "fit",
    });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new customError("Name, Email and Password are required", 400));
  }

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
