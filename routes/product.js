const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  adminGetAllProucts,
  getOneProduct,
} = require("../controllers/productController");

const { isLoggedIn, customRole } = require("../middlewares/user");

// User Routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);

// Admin Route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProucts);

module.exports = router;
