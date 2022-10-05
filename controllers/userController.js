const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");

exports.signup = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new customError("Name, Email and Password are required", 400));
  }

  // register a user
  const user = await User.create({
    name,
    email,
    password,
  });
  cookieToken(user, res);
});
