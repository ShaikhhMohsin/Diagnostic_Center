const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, getAnalytics);

module.exports = router;
