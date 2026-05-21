const express = require("express");
const router = express.Router();
const { createReport, getMyReports, getAllReports, updateReport } = require("../controllers/reportController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, adminMiddleware, createReport);
router.get("/my", authMiddleware, getMyReports);
router.get("/all", authMiddleware, adminMiddleware, getAllReports);
router.put("/:id", authMiddleware, adminMiddleware, updateReport);

module.exports = router;
