const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// GET - fetch users
router.get("/", userController.getUsers);

// POST - create user
router.post("/", userController.createUser);

// PUT - full update
router.put("/:id", userController.updateUser);

// PATCH - partial update
router.patch("/:id", userController.patchUser);

// DELETE - remove user
router.delete("/:id", userController.deleteUser);

// OPTIONS - allowed methods
router.options("/", userController.optionsHandler);

module.exports = router;
