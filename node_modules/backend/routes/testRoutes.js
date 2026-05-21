const express = require("express");
const router = express.Router();
const { getTests, createTest, updateTest, deleteTest } = require("../controllers/testController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", getTests);
router.post("/", authMiddleware, adminMiddleware, createTest);
router.put("/:id", authMiddleware, adminMiddleware, updateTest);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTest);

module.exports = router;
