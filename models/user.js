const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose({
  firstname: {
    type: String,
    required: [true, "Please enter you FirstName"],
    maxlength: [35, "FirstName should be under 35 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter you LastName"],
    maxlength: [35, "LastName should be under 35 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password should be of 8 character long"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordExpiry: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
