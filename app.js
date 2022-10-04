// importing .env file
require("dotenv").config();

// importing express
const express = require("express");

// creating app
const app = express();

// Swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//importing morgan
const morgan = require("morgan");

// importing cookies and file upload
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//morgan middleware
app.use(morgan("tiny"));

// cookie-parser and file upload middlewares
app.use(cookieParser());
app.use(fileUpload());

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importing routes
const home = require("./routes/home");

// router middleware
app.use("/api/v1", home);

//export app js
module.exports = app;
