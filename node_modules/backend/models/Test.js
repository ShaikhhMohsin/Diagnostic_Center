const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Test name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Test code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    sampleRequired: {
      type: String,
      required: [true, "Sample required is required"],
      default: "Blood",
    },
    turnaroundTime: {
      type: String,
      default: "24 Hours",
    },
    preparation: {
      type: String,
      default: "No special preparation required",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", TestSchema);
