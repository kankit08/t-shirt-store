const app = require("./app");
const connectWithDB = require("./config/database");

const { PORT } = process.env;

// connect with database
connectWithDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
