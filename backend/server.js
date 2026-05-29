const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const seedDatabase = require("./config/seed");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const packageRoutes = require("./routes/packageRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const patientRoutes = require("./routes/patientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Seed Database
  seedDatabase();
});

const app = express();

// Ensure local folders exist
const path = require("path");
const fs = require("fs");
const localFolders = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "reports"),
  path.join(__dirname, "payments")
];
localFolders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading external medical images securely
}));

// Serve local folders statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/reports", express.static(path.join(__dirname, "reports")));
app.use("/payments", express.static(path.join(__dirname, "payments")));

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/payments", paymentRoutes);

// Basic Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Multi Diagnostic Center REST API is running..." });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "An internal server error occurred",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
