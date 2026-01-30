const express = require("express");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/users", require("./routes/user.routes"));

app.get("/", (req, res) => {
      res.send("Backend is running 🚀");
});

module.exports = app;
