const express = require("express");
const app = express();

app.use(express.json());

// routes
app.use("/api/users", require("./routes/user.routes"));

app.get("/", (req, res) => {
      res.send("Backend is running 🚀");
});

module.exports = app;
