const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// @desc    Get payment details by appointment ID
// @route   GET /api/payments/:appointmentId
// @access  Private
exports.getPaymentByAppointment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ appointment: req.params.appointmentId })
      .populate({
        path: "appointment",
        populate: {
          path: "patient",
          select: "name email contactNumber"
        }
      });

    if (!payment) {
      return res.status(404).json({ status: "fail", message: "Payment details not found" });
    }

    res.status(200).json({ status: "success", data: payment });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Submit Transaction ID (User Flow)
// @route   POST /api/payments/:appointmentId/submit
// @access  Private
exports.submitPayment = async (req, res) => {
  const { transactionId } = req.body;

  try {
    if (!transactionId) {
      return res.status(400).json({ status: "fail", message: "Transaction ID / UPI Reference Number is required" });
    }

    const payment = await Payment.findOne({ appointment: req.params.appointmentId });

    if (!payment) {
      return res.status(404).json({ status: "fail", message: "Payment record not found for this appointment" });
    }

    payment.transactionId = transactionId;
    payment.status = "Paid"; // Mark as Paid on submission for immediate local testing
    payment.verifiedAt = new Date();
    await payment.save();

    // Confirm the linked appointment
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (appointment) {
      appointment.paymentStatus = "Paid";
      appointment.status = "Confirmed";
      await appointment.save();

      // Create Notification for patient
      await Notification.create({
        user: appointment.patient,
        title: "Appointment Confirmed",
        message: `Your payment has been recorded and booking for ${appointment.type} on ${new Date(appointment.date).toLocaleDateString()} is confirmed!`,
        type: "Appointment",
      });
    }

    res.status(200).json({ status: "success", message: "Payment submitted and verified successfully!", data: payment });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get all payments history (Admin)
// @route   GET /api/payments/history/all
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "appointment",
        populate: [
          { path: "patient", select: "name email contactNumber" },
          { path: "tests", select: "name price" },
          { path: "packages", select: "name price discountPrice" }
        ]
      })
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Verify Payment (Admin manual verification)
// @route   PUT /api/payments/:id/verify
// @access  Private/Admin
exports.verifyPayment = async (req, res) => {
  const { status } = req.body; // 'Paid', 'Failed', 'Pending'

  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ status: "fail", message: "Payment record not found" });
    }

    payment.status = status;
    if (status === "Paid") {
      payment.verifiedAt = new Date();
    } else {
      payment.verifiedAt = undefined;
    }
    await payment.save();

    // Update appointment status based on payment status
    const appointment = await Appointment.findById(payment.appointment);
    if (appointment) {
      appointment.paymentStatus = status === "Paid" ? "Paid" : "Pending";
      appointment.status = status === "Paid" ? "Confirmed" : (status === "Failed" ? "Cancelled" : "Pending");
      await appointment.save();

      // Create Notification for patient
      await Notification.create({
        user: appointment.patient,
        title: `Payment ${status}`,
        message: status === "Paid"
          ? `Your payment of ₹${payment.amount} has been verified by admin. Appointment is Confirmed.`
          : `Your payment verification failed or is pending.`,
        type: "Appointment",
      });
    }

    res.status(200).json({ status: "success", message: `Payment status updated to ${status}`, data: payment });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
