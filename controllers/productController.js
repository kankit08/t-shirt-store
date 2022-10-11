const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = bigPromise(async (req, res, next) => {
  // images

  let imageArray = [];
  if (!req.files) {
    return next(new customError("Images are required", 401));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = bigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalCountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filteredProductNumber = products.length;

  // products.limit().skip();

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    totalCountProduct,
    filteredProductNumber,
  });
});

exports.adminGetAllProucts = bigPromise(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new customError("No product found with this id", 401));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
