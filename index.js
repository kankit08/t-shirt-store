const app = require("./app");
const connectWithDB = require("./config/database");
const cloudinary = require("cloudinary");

const { PORT } = process.env;

// connect with database
connectWithDB();

// cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
