const Package = require("../models/Package");

// @desc    Get all active packages with referenced tests
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).populate("tests");
    res.status(200).json({ status: "success", count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
  const { name, code, description, price, discountPrice, tests, image } = req.body;

  try {
    const packageExists = await Package.findOne({ code: code.toUpperCase() });
    if (packageExists) {
      return res.status(400).json({ status: "fail", message: "Package with this code already exists" });
    }

    const newPackage = await Package.create({
      name,
      code: code.toUpperCase(),
      description,
      price,
      discountPrice,
      tests,
      image,
    });

    const populatedPackage = await Package.findById(newPackage._id).populate("tests");

    res.status(201).json({ status: "success", data: populatedPackage });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ status: "fail", message: "Package not found" });
    }

    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("tests");

    res.status(200).json({ status: "success", data: updatedPackage });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ status: "fail", message: "Package not found" });
    }

    pkg.isActive = false;
    await pkg.save();

    res.status(200).json({ status: "success", message: "Package removed successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
