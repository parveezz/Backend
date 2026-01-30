require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Atlas connection
mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
            console.log("✅ MongoDB Atlas connected");
      })
      .catch((error) => {
            console.error("❌ MongoDB connection error:", error.message);
      });

// Routes
app.use("/users", require("./src/routes/user.routes"));

// Root test route
app.get("/", (req, res) => {
      res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
});
