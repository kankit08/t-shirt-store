const express = require("express");
const router = express.Router();
const { productTest } = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// Routes
router.route("/productTest").get(productTest);

module.exports = router;
