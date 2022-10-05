// For Database connection

//importing mongoose
const mongoose = require("mongoose");

//importing database url
const { MONGODB_URL } = process.env;

//connection of database:
const connectWithDB = () => {
  mongoose
    .connect(MONGODB_URL, {
      useUnifiedTopology: true,
    })
    .then(console.log(`Database connected Successfully`))
    .catch((error) => {
      console.log("Database Connection failed");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectWithDB;
