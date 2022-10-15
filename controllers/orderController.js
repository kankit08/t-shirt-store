const Order = require("../models/order");
const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");

exports.createOrder = bigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOneOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new customError("Please check order id", 401));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getLoggedInOrder = bigPromise(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new customError("Please check order id", 401));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminGetAllOrders = bigPromise(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpdateOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new customError("Order is alreday marked as Delivered", 401));
  }

  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

const updateProductStock = async (productId, quatity) => {
  const product = await product.findById(productId);
  product.stock = product.stock - quatity;
  await product.save({ validateBeforeSave: false });
};
