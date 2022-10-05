const express = require("express");
const router = express.Router();

//importig controller home
const { signup } = require("../controllers/userController");

//routes
router.route("/signup").post(signup);

// exporting route
module.exports = router;
