const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const Test = require("../models/Test");
const Package = require("../models/Package");
const Payment = require("../models/Payment");

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
  const { type, address, date, timeslot, tests, packages } = req.body;

  try {
    if (!tests && !packages) {
      return res.status(400).json({ status: "fail", message: "Please select at least one test or package" });
    }

    // Calculate total amount
    let totalAmount = 0;

    if (tests && tests.length > 0) {
      const dbTests = await Test.find({ _id: { $in: tests } });
      dbTests.forEach((t) => {
        totalAmount += t.price;
      });
    }

    if (packages && packages.length > 0) {
      const dbPackages = await Package.find({ _id: { $in: packages } });
      dbPackages.forEach((p) => {
        totalAmount += p.discountPrice || p.price;
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      type,
      address: type === "Home Collection" ? address : undefined,
      date,
      timeslot,
      tests: tests || [],
      packages: packages || [],
      totalAmount,
      status: "Pending",
      paymentStatus: "Pending"
    });

    // Create Payment Record
    const payment = await Payment.create({
      appointment: appointment._id,
      amount: totalAmount,
      status: "Pending",
      qrImagePath: "/payments/phonepe_qr.png"
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: "Appointment Booked",
      message: `Your booking for ${type} on ${new Date(date).toLocaleDateString()} at ${timeslot} is pending confirmation.`,
      type: "Appointment",
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("tests")
      .populate("packages")
      .populate("patient", "name email contactNumber");

    res.status(201).json({ status: "success", data: populatedAppointment, paymentId: payment._id });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get patient's own appointments
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("tests")
      .populate("packages")
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments/all
// @access  Private/Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email contactNumber")
      .populate("tests")
      .populate("packages")
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ status: "fail", message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    // Create Notification
    await Notification.create({
      user: appointment.patient,
      title: `Appointment Status: ${status}`,
      message: `Your booking status has been updated to ${status}.`,
      type: "Appointment",
    });

    res.status(200).json({ status: "success", data: appointment });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/appointments/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ status: "fail", message: "Appointment not found" });
    }

    appointment.paymentStatus = paymentStatus;
    await appointment.save();

    res.status(200).json({ status: "success", data: appointment });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
