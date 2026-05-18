const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment reference is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Ready"],
      default: "Pending",
    },
    testResults: [
      {
        testName: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String, required: true },
        normalRange: { type: String, required: true },
        status: {
          type: String,
          enum: ["Normal", "High", "Low"],
          default: "Normal",
        },
      },
    ],
    fileUrl: {
      type: String,
    },
    remarks: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
