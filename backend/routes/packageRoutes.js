const express = require("express");
const router = express.Router();
const { getPackages, createPackage, updatePackage, deletePackage } = require("../controllers/packageController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", getPackages);
router.post("/", authMiddleware, adminMiddleware, createPackage);
router.put("/:id", authMiddleware, adminMiddleware, updatePackage);
router.delete("/:id", authMiddleware, adminMiddleware, deletePackage);

module.exports = router;
