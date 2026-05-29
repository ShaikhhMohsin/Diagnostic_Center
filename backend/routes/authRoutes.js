const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, getAllUsers } = require("../controllers/authController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
