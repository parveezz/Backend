const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER USER
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
      try {
            const { name, email, password } = req.body;

            // Basic validation
            if (!name || !email || !password) {
                  return res.status(400).json({
                        message: "Name, email and password are required",
                  });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                  return res.status(400).json({
                        message: "User already exists with this email",
                  });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                  name,
                  email,
                  password: hashedPassword,
            });

            res.status(201).json({
                  success: true,
                  message: "User registered successfully",
                  data: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                  },
            });
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

/**
 * LOGIN USER
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
      try {
            const { email, password } = req.body;

            // Check fields
            if (!email || !password) {
                  return res.status(400).json({
                        message: "Email and password are required",
                  });
            }

            // Find user and include password
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                  return res.status(401).json({
                        message: "Invalid email or password",
                  });
            }

            // Compare password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                  return res.status(401).json({
                        message: "Invalid email or password",
                  });
            }

            // Generate JWT
            const token = jwt.sign(
                  { id: user._id, role: user.role },
                  process.env.JWT_SECRET,
                  { expiresIn: "1d" }
            );

            res.status(200).json({
                  success: true,
                  message: "Login successful",
                  token,
                  user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                  },
            });
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

/**
 * GET LOGGED-IN USER
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
      res.status(200).json({
            success: true,
            data: req.user,
      });
};
