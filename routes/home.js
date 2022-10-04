const express = require("express");
const router = express.Router();

//importig controller home
const { home, dummyPage } = require("../controllers/homeController");

//routes
router.route("/").get(home);
router.route("/dummy").get(dummyPage);

// exporting route
module.exports = router;
