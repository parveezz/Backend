const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Backend Status</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            font-family: Arial, Helvetica, sans-serif;
          }
          .card {
            background: #ffffff;
            padding: 40px 60px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
          }
          .card h1 {
            margin: 0;
            color: #2c5364;
            font-size: 28px;
          }
          .card p {
            margin-top: 10px;
            color: #555;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Backend is running 🚀</h1>
          <p>Server is live and ready to accept requests</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = app;
