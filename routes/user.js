const express = require("express");
const router = express.Router();

//importig controller home
const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
} = require("../controllers/userController");

//routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);

// exporting route
module.exports = router;
