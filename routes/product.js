const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
} = require("../controllers/productController");

const { isLoggedIn, customRole } = require("../middlewares/user");

// User Routes
router.route("/products").get(getAllProducts);

// Admin Route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
