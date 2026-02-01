const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.patchUser);
router.delete("/:id", userController.deleteUser);
router.options("/", userController.optionsHandler);

module.exports = router;
