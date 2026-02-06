const User = require("../models/user.model");

/**
 * GET USERS
 * Supports pagination
 * GET /api/users?page=1&limit=10
 */
exports.getUsers = async (req, res) => {
      try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const users = await User.find()
                  .select("-password") // never send password
                  .skip(skip)
                  .limit(limit);

            const totalUsers = await User.countDocuments();

            res.status(200).json({
                  success: true,
                  message: "Users fetched successfully",
                  data: users,
                  pagination: {
                        total: totalUsers,
                        page,
                        limit,
                  },
            });
      } catch (err) {
            res.status(500).json({ message: err.message });
      }
};

/**
 * CREATE USER
 * Admin usage
 */
exports.createUser = async (req, res) => {
      try {
            const user = new User(req.body);
            const savedUser = await user.save();

            res.status(201).json({
                  success: true,
                  message: "User created successfully",
                  data: savedUser,
            });
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

/**
 * UPDATE USER (FULL UPDATE)
 */
exports.updateUser = async (req, res) => {
      try {
            const user = await User.findByIdAndUpdate(
                  req.params.id,
                  req.body,
                  { new: true, runValidators: true }
            ).select("-password");

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                  success: true,
                  message: "User updated successfully",
                  data: user,
            });
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

/**
 * PATCH USER (PARTIAL UPDATE)
 */
exports.patchUser = async (req, res) => {
      try {
            const user = await User.findByIdAndUpdate(
                  req.params.id,
                  { $set: req.body },
                  { new: true }
            ).select("-password");

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                  success: true,
                  message: "User updated successfully",
                  data: user,
            });
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
      try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                  success: true,
                  message: "User deleted successfully",
            });
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

/**
 * OPTIONS HANDLER
 */
exports.optionsHandler = (req, res) => {
      res.set("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.sendStatus(204);
};
