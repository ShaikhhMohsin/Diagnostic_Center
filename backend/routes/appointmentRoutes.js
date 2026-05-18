const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  updatePaymentStatus,
} = require("../controllers/appointmentController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, bookAppointment);
router.get("/my", authMiddleware, getMyAppointments);
router.get("/all", authMiddleware, adminMiddleware, getAllAppointments);
router.put("/:id/status", authMiddleware, adminMiddleware, updateAppointmentStatus);
router.put("/:id/payment", authMiddleware, adminMiddleware, updatePaymentStatus);

module.exports = router;
