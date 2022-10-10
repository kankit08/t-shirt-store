const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");
const cloudinary = require("cloudinary");

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

  const products = new WhereClause(Product.find(), req.query).search().filter();

  const filteredProductNumber = products.length;

  // products.limit().skip();

  products.pager(resultPerPage);
  products = await products.base;

  res.status(200).json({
    success: true,
    products,
    totalCountProduct,
    filteredProductNumber,
  });
});
