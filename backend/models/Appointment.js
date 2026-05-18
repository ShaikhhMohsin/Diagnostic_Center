const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    type: {
      type: String,
      enum: ["Home Collection", "Lab Visit"],
      default: "Home Collection",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    timeslot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Sample Collected", "Completed", "Cancelled"],
      default: "Pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
