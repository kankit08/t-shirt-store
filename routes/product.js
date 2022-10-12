const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  adminGetAllProucts,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productController");

const { isLoggedIn, customRole } = require("../middlewares/user");

// User Routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn, addReview);
router.route("/delete/review").delete(isLoggedIn, deleteReview);
router.route("/product/review").get(isLoggedIn, getOnlyReviewsForOneProduct);

// Admin Route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProucts);

router
  .route("/admin/product/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;
