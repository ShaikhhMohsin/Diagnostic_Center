const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, contactNumber, gender, age, address } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: "fail", message: "User already exists with this email" });
    }

    // Set first user registered ever as Admin, or just default to patient
    // (For college project demonstration, we can let user check both role toggles in Register or make it intelligent)
    // Let's check if role is specified in body (convenient for testing and evaluation)
    const role = req.body.role || "patient";

    const user = await User.create({
      name,
      email,
      password,
      role,
      contactNumber,
      gender,
      age,
      address,
    });

    if (user) {
      res.status(201).json({
        status: "success",
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          contactNumber: user.contactNumber,
          gender: user.gender,
          age: user.age,
          address: user.address,
        },
      });
    } else {
      res.status(400).json({ status: "fail", message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        status: "success",
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          contactNumber: user.contactNumber,
          gender: user.gender,
          age: user.age,
          address: user.address,
        },
      });
    } else {
      res.status(401).json({ status: "fail", message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.status(200).json({ status: "success", data: user });
    } else {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.status(200).json({ status: "success", count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.contactNumber = req.body.contactNumber || user.contactNumber;
      user.gender = req.body.gender || user.gender;
      user.age = req.body.age || user.age;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        status: "success",
        token: generateToken(updatedUser._id),
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          contactNumber: updatedUser.contactNumber,
          gender: updatedUser.gender,
          age: updatedUser.age,
          address: updatedUser.address,
        },
      });
    } else {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};
