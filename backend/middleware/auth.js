const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware to verify JWT
const authMiddleware = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ status: "fail", message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ status: "fail", message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Not authorized, no token provided" });
  }
};

// Admin middleware to restrict access to administrator role only
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ status: "fail", message: "Access denied, admin role required" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
