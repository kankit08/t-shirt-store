const express = require("express");
const router = express.Router();

//importig controller home
const { signup, login } = require("../controllers/userController");

//routes
router.route("/signup").post(signup);
router.route("/login").post(login);

// exporting route
module.exports = router;
