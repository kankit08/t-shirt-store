// importing .env file
require("dotenv").config();

// importing express
const express = require("express");

// creating app
const app = express();

//importing morgan
const morgan = require("morgan");

//morgan middleware
app.use(morgan("tiny"));

// regular middlewares
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

// importing routes
const home = require("./routes/home");

// router middleware
app.use("/api/v1", home);

//export app js
module.exports = app;
