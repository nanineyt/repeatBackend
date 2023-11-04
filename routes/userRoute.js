const express = require("express");
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAll", protect, userController.getAllUser);
router.get("/:userId", protect, userController.getUserById);
router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.post("/refreshToken", userController.RefreshToken);
router.post("/logout", protect, userController.logout);
router.patch("/update/:userId", userController.updateUser);
router.patch("/resetPassword/:userId", userController.resetPassword);

router.delete("/:userId", userController.deleteUser);

module.exports = router;
