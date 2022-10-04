// importing .env file
require("dotenv").config();

// importing express
const express = require("express");

// creating app
const app = express();

//routes
app.get("/", (req, res) => {
  res.status(200).send(`This is the HOME PAGE`);
});

//export app js
module.exports = app;
