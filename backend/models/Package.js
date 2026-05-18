const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Package code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
