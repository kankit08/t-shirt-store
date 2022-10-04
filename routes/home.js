const express = require("express");
const router = express.Router();

//importig controller home
const { home } = require("../controllers/homeController");

//routes
router.route("/").get(home);

// exporting route
module.exports = router;
