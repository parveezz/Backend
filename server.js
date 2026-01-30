const express = require("express");
const app = express();

// middleware to read JSON body
app.use(express.json());

// connect routes
app.use("/users", require("./src/routes/user.routes"));

// test root route (optional but useful)
app.get("/", (req, res) => {
      res.send("Backend is running 🚀");
});

app.listen(5000, () => {
      console.log("Server running on port 5000");
});
