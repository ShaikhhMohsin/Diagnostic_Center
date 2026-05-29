const express = require("express");
const router = express.Router();
const {
  getPaymentByAppointment,
  submitPayment,
  getAllPayments,
  verifyPayment
} = require("../controllers/paymentController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Patient / Common payment retrieval & user submit
router.get("/:appointmentId", authMiddleware, getPaymentByAppointment);
router.post("/:appointmentId/submit", authMiddleware, submitPayment);

// Admin-only operations
router.get("/history/all", authMiddleware, adminMiddleware, getAllPayments);
router.put("/:id/verify", authMiddleware, adminMiddleware, verifyPayment);

module.exports = router;
