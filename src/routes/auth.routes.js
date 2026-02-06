const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Get logged-in user
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
