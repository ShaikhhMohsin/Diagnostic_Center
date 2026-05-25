const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addPatient,
  getPatients,
  updatePatient,
  deletePatient,
  generateReport,
  downloadReport,
  savePayment,
  getPaymentHistory,
  uploadQRCode,
} = require("../controllers/patientController");

const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Configure multer storage for PhonePe QR Code image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../payments"));
  },
  filename: (req, file, cb) => {
    // Force naming to phonepe_qr.png to overwrite previous image
    cb(null, "phonepe_qr.png");
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpg, jpeg, png, webp) are allowed"));
    }
  },
});

// Patient CRUD
router.post("/", authMiddleware, adminMiddleware, addPatient);
router.get("/", authMiddleware, adminMiddleware, getPatients);
router.put("/:id", authMiddleware, adminMiddleware, updatePatient);
router.delete("/:id", authMiddleware, adminMiddleware, deletePatient);

// Reports & Payments per Patient
router.post("/:id/generate-report", authMiddleware, adminMiddleware, generateReport);
router.get("/:id/download-report", authMiddleware, adminMiddleware, downloadReport);
router.post("/:id/payment", authMiddleware, adminMiddleware, savePayment);

// Global Payments APIs
router.get("/payments/history", authMiddleware, adminMiddleware, getPaymentHistory);
router.post("/payments/upload-qr", authMiddleware, adminMiddleware, upload.single("qrImage"), uploadQRCode);

module.exports = router;
