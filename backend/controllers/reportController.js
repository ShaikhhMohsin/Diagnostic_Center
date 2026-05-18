const Report = require("../models/Report");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// @desc    Upload/Create a diagnostic report
// @route   POST /api/reports
// @access  Private/Admin
exports.createReport = async (req, res) => {
  const { appointmentId, testResults, remarks, fileUrl } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ status: "fail", message: "Appointment not found" });
    }

    // Create Report
    const report = await Report.create({
      patient: appointment.patient,
      appointment: appointmentId,
      status: "Ready",
      testResults,
      remarks,
      fileUrl: fileUrl || `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`, // Standard preview PDF
      uploadedBy: req.user._id,
    });

    // Update appointment status to Completed and link the report
    appointment.status = "Completed";
    appointment.report = report._id;
    await appointment.save();

    // Create Notification for the Patient
    await Notification.create({
      user: appointment.patient,
      title: "Diagnostic Report Ready",
      message: `Your diagnostic laboratory report for booking on ${new Date(appointment.date).toLocaleDateString()} is ready for download.`,
      type: "Report",
    });

    res.status(201).json({ status: "success", data: report });
  } catch (error) {
    console.error("Report Upload Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get patient's own reports
// @route   GET /api/reports/my
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user._id })
      .populate({
        path: "appointment",
        populate: [{ path: "tests" }, { path: "packages" }],
      })
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports/all
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "name email contactNumber")
      .populate({
        path: "appointment",
        populate: [{ path: "tests" }, { path: "packages" }],
      })
      .sort("-createdAt");

    res.status(200).json({ status: "success", count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update a report (Admin)
// @route   PUT /api/reports/:id
// @access  Private/Admin
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ status: "fail", message: "Report not found" });
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", data: updatedReport });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
