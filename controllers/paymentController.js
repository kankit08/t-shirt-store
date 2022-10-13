const bigPromise = require("../middlewares/bigPromise");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.sendStripeKey = bigPromise(async (req, res, next) => {
  res.status(200).json({
    stripekey: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = bigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    // optional
    metadata: { itegration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendRazorpayKey = bigPromise(async (req, res, next) => {
  res.status(200).json({
    key_id: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorpayPayment = bigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
  var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: uuidv4(),
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
});
