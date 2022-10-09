const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

//importig controller home
const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails,
  admin,
  manager,
  adminGetOneUser,
  adminUpdateOneUserDetails,
} = require("../controllers/userController");

//routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

// ADMIN ROUTE
router.route("/admin/users").get(isLoggedIn, customRole("admin"), admin);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetOneUser)
  .put(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails);

// Manager Route
router.route("/manager/users").get(isLoggedIn, customRole("manager"), manager);

// exporting route
module.exports = router;
