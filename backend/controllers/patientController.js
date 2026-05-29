const Patient = require("../models/Patient");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// @desc    Add a new patient
// @route   POST /api/patients
// @access  Private/Admin
exports.addPatient = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      testType,
      doctorName,
      dateOfRegistration,
    } = req.body;

    // Validation
    if (!fullName || !age || !gender || !phone || !address || !bloodGroup || !testType || !doctorName) {
      return res.status(400).json({ status: "fail", message: "Please fill all required fields" });
    }

    // Auto-generate Patient ID
    const count = await Patient.countDocuments();
    let nextId = 1000 + count + 1;
    let patientId = `PT-${nextId}`;
    while (await Patient.findOne({ patientId })) {
      nextId++;
      patientId = `PT-${nextId}`;
    }

    const patient = await Patient.create({
      patientId,
      fullName,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      testType,
      doctorName,
      dateOfRegistration: dateOfRegistration || new Date(),
    });

    res.status(201).json({ status: "success", data: patient });
  } catch (error) {
    console.error("Add Patient Error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Get all patients with search & filtering
// @route   GET /api/patients
// @access  Private/Admin
exports.getPatients = async (req, res) => {
  try {
    const { search, paymentStatus, reportStatus, testType } = req.query;
    const query = {};

    // Apply Search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } },
      ];
    }

    // Apply Filters
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    if (reportStatus) {
      query.reportStatus = reportStatus;
    }
    if (testType) {
      query.testType = testType;
    }

    const patients = await Patient.find(query).sort("-createdAt");
    res.status(200).json({ status: "success", count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Update patient details
// @route   PUT /api/patients/:id
// @access  Private/Admin
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ status: "fail", message: "Patient not found" });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", data: updatedPatient });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ status: "fail", message: "Patient not found" });
    }

    // Delete associated report PDF if exists
    if (patient.reportPath) {
      const fullPath = path.join(__dirname, "..", patient.reportPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Patient.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Patient record deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Generate PDF report for a patient
// @route   POST /api/patients/:id/generate-report
// @access  Private/Admin
exports.generateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ status: "fail", message: "Patient not found" });
    }

    // File setup
    const nameSlug = patient.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `${nameSlug}_report_${dateStr}.pdf`;
    const reportsDir = path.join(__dirname, "../reports");

    // Ensure reports folder exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = path.join(reportsDir, fileName);
    const relativePath = `/reports/${fileName}`;

    // PDFKit Creation
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const writeStream = fs.createWriteStream(filePath);

    writeStream.on("finish", async () => {
      // Update patient status in DB
      patient.reportStatus = "Ready";
      patient.reportPath = relativePath;
      await patient.save();
      
      res.status(200).json({ status: "success", data: patient, reportUrl: relativePath });
    });

    writeStream.on("error", (err) => {
      console.error("PDF generation stream write error:", err);
      res.status(500).json({ status: "fail", message: "Failed to write PDF file to local reports directory." });
    });

    doc.pipe(writeStream);

    // Color Palette
    const primaryColor = "#0f172a"; // Slate 900
    const secondaryColor = "#2563eb"; // Blue 600
    const neutralDark = "#334155"; // Slate 700
    const neutralLight = "#f8fafc"; // Slate 50

    // Header Background Accent
    doc.rect(0, 0, 595, 15).fill(secondaryColor);

    // Header Details
    doc.fillColor(secondaryColor).fontSize(20).text("MULTI DIAGNOSTIC CENTER", 50, 40, { align: "left" });
    doc.fillColor(neutralDark).fontSize(8).text("Accreditation: NABL / CAP ISO 15189 Certified Lab", 50, 65);
    doc.text("Sector 4, Main Road, Raichur, Karnataka - 584101 | Contact: +91 98765 43210", 50, 77);

    // Header divider line
    doc.moveTo(50, 95).lineTo(545, 95).strokeColor("#cbd5e1").lineWidth(1).stroke();

    // Patient Info Heading
    doc.fillColor(primaryColor).fontSize(11).text("CLINICAL LABORATORY REPORT", 50, 110, { font: "Helvetica-Bold" });

    // Patient Info Grid
    doc.rect(50, 130, 495, 90).fill(neutralLight);
    
    // Grid Details
    doc.fillColor(primaryColor).fontSize(9);
    doc.text("Patient ID:", 65, 142);
    doc.text(patient.patientId, 150, 142, { font: "Helvetica-Bold" });
    
    doc.text("Patient Name:", 65, 158);
    doc.text(patient.fullName, 150, 158, { font: "Helvetica-Bold" });

    doc.text("Age / Gender:", 65, 174);
    doc.text(`${patient.age} Yrs / ${patient.gender}`, 150, 174);

    doc.text("Blood Group:", 65, 190);
    doc.text(patient.bloodGroup, 150, 190);

    // Right Column in Grid
    doc.text("Ref. Doctor:", 320, 142);
    doc.text(`Dr. ${patient.doctorName}`, 410, 142, { font: "Helvetica-Bold" });

    doc.text("Reg. Date:", 320, 158);
    doc.text(new Date(patient.dateOfRegistration).toLocaleDateString(), 410, 158);

    doc.text("Report Date:", 320, 174);
    doc.text(new Date().toLocaleDateString(), 410, 174);

    doc.text("Status:", 320, 190);
    doc.text("CERTIFIED", 410, 190, { font: "Helvetica-Bold" });

    // Grid border
    doc.rect(50, 130, 495, 90).strokeColor("#e2e8f0").lineWidth(1).stroke();

    // Diagnostic Assay Heading
    doc.fillColor(primaryColor).fontSize(11).text(`Assay Parameter: ${patient.testType}`, 50, 245, { font: "Helvetica-Bold" });

    // Table Header
    const tableTop = 270;
    doc.rect(50, tableTop, 495, 20).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(8);
    doc.text("TEST PARAMETER", 65, tableTop + 6);
    doc.text("VALUE", 230, tableTop + 6);
    doc.text("UNIT", 320, tableTop + 6);
    doc.text("REFERENCE RANGE", 400, tableTop + 6);
    doc.text("STATUS", 480, tableTop + 6);

    // Mock clinical results based on testType
    let metrics = [];
    const lowerTest = patient.testType.toLowerCase();

    if (lowerTest.includes("blood") && lowerTest.includes("count") || lowerTest.includes("cbc")) {
      metrics = [
        { name: "Hemoglobin (Hb)", value: "14.2", unit: "g/dL", ref: "13.0 - 17.0", status: "Normal" },
        { name: "Red Blood Cells (RBC)", value: "4.8", unit: "million/cumm", ref: "4.5 - 5.5", status: "Normal" },
        { name: "White Blood Cells (WBC)", value: "7,500", unit: "/cumm", ref: "4,000 - 11,000", status: "Normal" },
        { name: "Platelet Count", value: "2,40,000", unit: "/cumm", ref: "1,50,000 - 4,50,000", status: "Normal" },
        { name: "Packed Cell Volume (PCV)", value: "42.5", unit: "%", ref: "40.0 - 50.0", status: "Normal" }
      ];
    } else if (lowerTest.includes("sugar") || lowerTest.includes("glucose") || lowerTest.includes("diabetes")) {
      metrics = [
        { name: "Fasting Blood Glucose", value: "98.0", unit: "mg/dL", ref: "70.0 - 100.0", status: "Normal" },
        { name: "Post Prandial Glucose (PP)", value: "135.0", unit: "mg/dL", ref: "100.0 - 140.0", status: "Normal" },
        { name: "HbA1c (Glycated Hb)", value: "5.6", unit: "%", ref: "4.0 - 5.7 (Normal)", status: "Normal" }
      ];
    } else if (lowerTest.includes("lipid") || lowerTest.includes("cholesterol")) {
      metrics = [
        { name: "Total Cholesterol", value: "185.0", unit: "mg/dL", ref: "150.0 - 200.0", status: "Normal" },
        { name: "Triglycerides", value: "142.0", unit: "mg/dL", ref: "50.0 - 150.0", status: "Normal" },
        { name: "HDL Cholesterol", value: "48.0", unit: "mg/dL", ref: "> 40.0", status: "Normal" },
        { name: "LDL Cholesterol", value: "108.6", unit: "mg/dL", ref: "< 130.0", status: "Normal" }
      ];
    } else if (lowerTest.includes("thyroid") || lowerTest.includes("t3") || lowerTest.includes("tsh")) {
      metrics = [
        { name: "Total Triiodothyronine (T3)", value: "1.2", unit: "ng/mL", ref: "0.8 - 2.0", status: "Normal" },
        { name: "Total Thyroxine (T4)", value: "7.8", unit: "ug/dL", ref: "5.1 - 14.1", status: "Normal" },
        { name: "Thyroid Stimulating Hormone (TSH)", value: "2.45", unit: "uIU/mL", ref: "0.4 - 4.5", status: "Normal" }
      ];
    } else {
      // Default general test parameters
      metrics = [
        { name: "Random Blood Sugar", value: "105.0", unit: "mg/dL", ref: "70.0 - 140.0", status: "Normal" },
        { name: "Serum Creatinine", value: "0.95", unit: "mg/dL", ref: "0.60 - 1.20", status: "Normal" },
        { name: "Blood Urea Nitrogen (BUN)", value: "14.0", unit: "mg/dL", ref: "7.0 - 20.0", status: "Normal" }
      ];
    }

    // Render Table Rows
    let currentY = tableTop + 20;
    metrics.forEach((row, i) => {
      // Row background zebra striping
      if (i % 2 === 0) {
        doc.rect(50, currentY, 495, 20).fill("#f1f5f9");
      }
      doc.fillColor(primaryColor).fontSize(8);
      doc.text(row.name, 65, currentY + 6, { font: "Helvetica-Bold" });
      doc.text(row.value, 230, currentY + 6);
      doc.text(row.unit, 320, currentY + 6);
      doc.text(row.ref, 400, currentY + 6);
      doc.text(row.status, 480, currentY + 6, { font: "Helvetica-Bold" });

      currentY += 20;
    });

    // Outer Table border
    doc.rect(50, tableTop, 495, currentY - tableTop).strokeColor("#cbd5e1").lineWidth(1).stroke();

    // Clinical interpretation
    doc.fillColor(primaryColor).fontSize(10).text("Hematology Observations / Pathologist Interpretation:", 50, currentY + 25, { font: "Helvetica-Bold" });
    doc.fillColor(neutralDark).fontSize(8).text(
      "All observed parameters lie within safe biological reference intervals. Test result indicates physiological homeostasis. Regular clinical correlation is advised.",
      50,
      currentY + 40,
      { width: 495, align: "justify" }
    );

    // Signatures
    doc.moveTo(50, currentY + 110).lineTo(180, currentY + 110).strokeColor("#94a3b8").stroke();
    doc.fillColor(primaryColor).fontSize(8).text("Lab Technician Signature", 50, currentY + 115);
    doc.text("Multi Diagnostic Center", 50, currentY + 127);

    doc.moveTo(415, currentY + 110).lineTo(545, currentY + 110).strokeColor("#94a3b8").stroke();
    doc.fillColor(primaryColor).fontSize(8).text("Dr. Sandeep Raichur (MD)", 415, currentY + 115, { font: "Helvetica-Bold" });
    doc.text("Consultant Pathologist", 415, currentY + 127);

    // Footer
    doc.rect(0, 810, 595, 32).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(7).text("This report is digitally certified. Offline storage folder reference: /reports.", 50, 822, { align: "center" });

    doc.end();

  } catch (error) {
    console.error("Generate PDF Report error:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Download patient PDF report
// @route   GET /api/patients/:id/download-report
// @access  Private/Admin
exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient || !patient.reportPath) {
      return res.status(404).json({ status: "fail", message: "Report not found or not generated yet" });
    }

    const filePath = path.join(__dirname, "..", patient.reportPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ status: "fail", message: "PDF file does not exist locally" });
    }

    res.download(filePath, path.basename(filePath));
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Record/Save patient payment details
// @route   POST /api/patients/:id/payment
// @access  Private/Admin
exports.savePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ status: "fail", message: "Patient not found" });
    }

    patient.paymentStatus = "Paid";
    patient.transactionId = transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    await patient.save();

    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Fetch payment history (paid patients)
// @route   GET /api/payments/history
// @access  Private/Admin
exports.getPaymentHistory = async (req, res) => {
  try {
    const paidPatients = await Patient.find({ paymentStatus: "Paid" }).sort("-updatedAt");
    res.status(200).json({ status: "success", count: paidPatients.length, data: paidPatients });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Upload/Update global PhonePe QR Code image
// @route   POST /api/payments/upload-qr
// @access  Private/Admin
exports.uploadQRCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "No image file uploaded" });
    }

    // Static URL location
    const relativePath = `/payments/phonepe_qr.png`;
    res.status(200).json({ status: "success", qrCodePath: relativePath });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
