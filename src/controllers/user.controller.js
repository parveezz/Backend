const User = require("../models/user.model");

// GET
exports.getUsers = async (req, res) => {
      try {
            const users = await User.find();
            res.json(users);
      } catch (err) {
            res.status(500).json({ message: err.message });
      }
};

// POST
exports.createUser = async (req, res) => {
      try {
            const user = new User(req.body);
            const savedUser = await user.save();
            res.status(201).json(savedUser);
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

// PUT
exports.updateUser = async (req, res) => {
      try {
            const user = await User.findByIdAndUpdate(
                  req.params.id,
                  req.body,
                  { new: true, runValidators: true }
            );
            res.json(user);
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

// PATCH
exports.patchUser = async (req, res) => {
      try {
            const user = await User.findByIdAndUpdate(
                  req.params.id,
                  { $set: req.body },
                  { new: true }
            );
            res.json(user);
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

// DELETE
exports.deleteUser = async (req, res) => {
      try {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: "User deleted" });
      } catch (err) {
            res.status(400).json({ message: err.message });
      }
};

// OPTIONS
exports.optionsHandler = (req, res) => {
      res.set("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.sendStatus(204);
};
