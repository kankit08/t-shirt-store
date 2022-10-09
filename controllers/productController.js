const bigPromise = require("../middlewares/bigPromise");
const customError = require("../utils/customError");

exports.productTest = bigPromise(async (req, res, next) => {
  res.status(200).json({
    success: true,
    greetings: "This is a test",
  });
});
