const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All user routes are PROTECTED now

router.get("/", authMiddleware, userController.getUsers);

router.post("/", authMiddleware, userController.createUser);

router.put("/:id", authMiddleware, userController.updateUser);

router.patch("/:id", authMiddleware, userController.patchUser);

router.delete("/:id", authMiddleware, userController.deleteUser);

router.options("/", userController.optionsHandler);

module.exports = router;
