require("dotenv").config();

const app = require("./src/app");

// Correct path
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
});
