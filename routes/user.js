const express = require("express");
const router = express.Router();

//importig controller home
const { signup, login, logout } = require("../controllers/userController");

//routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

// exporting route
module.exports = router;
