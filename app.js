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

// temporary check for cloudinary
app.set("view engine", "ejs");

//importing morgan
const morgan = require("morgan");

// importing cookies and file upload
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//morgan middleware
app.use(morgan("tiny"));

// cookie-parser and file upload middlewares
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importing routes
const home = require("./routes/home");
const user = require("./routes/user");

// router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);

// temporary route
app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

//export app js
module.exports = app;
