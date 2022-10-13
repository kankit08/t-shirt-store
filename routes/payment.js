const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");

//importig controller home
const {
  sendStripeKey,
  sendRazorpayKey,
  captureStripePayment,
  captureRazorpayPayment,
} = require("../controllers/paymentController");

// StripeKey routes
router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendRazorpayKey);

// Payments routes
router.route("/stripe/payment").post(isLoggedIn, captureStripePayment);
router.route("/razorpay/payment").post(isLoggedIn, captureRazorpayPayment);

// exporting route
module.exports = router;
