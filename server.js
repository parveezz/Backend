require("dotenv").config();

const app = require("./src/app");

// IMPORTANT: match your exact folder structure
const connectDB = require("./src/config/config/db.js");

// connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});
