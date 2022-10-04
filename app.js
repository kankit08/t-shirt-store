// importing .env file
require("dotenv").config();

// importing express
const express = require("express");

// creating app
const app = express();

// importing routes
const home = require("./routes/home");

// router middleware
app.use("/api/v1", home);

//export app js
module.exports = app;
