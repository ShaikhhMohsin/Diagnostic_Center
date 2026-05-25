const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
    },
    testType: {
      type: String,
      required: [true, "Selected test is required"],
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
    },
    dateOfRegistration: {
      type: Date,
      required: [true, "Date of registration is required"],
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
    reportStatus: {
      type: String,
      enum: ["Pending", "Ready"],
      default: "Pending",
    },
    reportPath: {
      type: String,
      default: "",
    },
    qrCodePath: {
      type: String,
      default: "/payments/phonepe_qr.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
