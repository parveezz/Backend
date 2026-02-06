const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
      try {
            // Get authorization header
            const authHeader = req.headers.authorization;

            // Check if token exists
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                  return res.status(401).json({
                        message: "Authorization token missing",
                  });
            }

            // Extract token
            const token = authHeader.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user from token data
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                  return res.status(401).json({
                        message: "User not found",
                  });
            }

            // Attach user to request
            req.user = user;

            // Continue to next middleware / controller
            next();
      } catch (error) {
            return res.status(401).json({
                  message: "Invalid or expired token",
            });
      }
};

module.exports = authMiddleware;
