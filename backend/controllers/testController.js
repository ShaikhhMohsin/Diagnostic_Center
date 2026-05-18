const Test = require("../models/Test");

// @desc    Get all active tests
// @route   GET /api/tests
// @access  Public
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true });
    res.status(200).json({ status: "success", count: tests.length, data: tests });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private/Admin
exports.createTest = async (req, res) => {
  const { name, code, category, description, price, sampleRequired, turnaroundTime, preparation } = req.body;

  try {
    const testExists = await Test.findOne({ code: code.toUpperCase() });
    if (testExists) {
      return res.status(400).json({ status: "fail", message: "Test with this code already exists" });
    }

    const test = await Test.create({
      name,
      code: code.toUpperCase(),
      category,
      description,
      price,
      sampleRequired,
      turnaroundTime,
      preparation,
    });

    res.status(201).json({ status: "success", data: test });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update a test
// @route   PUT /api/tests/:id
// @access  Private/Admin
exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ status: "fail", message: "Test not found" });
    }

    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", data: updatedTest });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Delete (soft delete / toggle status) a test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ status: "fail", message: "Test not found" });
    }

    // We do soft delete by marking active as false
    test.isActive = false;
    await test.save();

    res.status(200).json({ status: "success", message: "Test removed successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
