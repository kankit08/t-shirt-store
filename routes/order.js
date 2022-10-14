const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");

const { createOrder, getOneOrder } = require("../controllers/orderController");

// routes
router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

module.exports = router;
