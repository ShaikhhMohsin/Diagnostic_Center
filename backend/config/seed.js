const User = require("../models/User");
const Test = require("../models/Test");
const Package = require("../models/Package");

const seedDatabase = async () => {
  try {
    // 1. Seed Users if empty
    const userCount = await User.countDocuments();
    let adminUser, patientUser;

    if (userCount === 0) {
      console.log("Seeding default Indian users...");
      adminUser = await User.create({
        name: "Ahmed Pasha",
        email: "ahmedpasha@gmail.com",
        password: "admin123", // Will be hashed by pre-save middleware
        role: "admin",
        contactNumber: "+91 96205 89822",
        gender: "Male",
        age: 42,
        address: {
          street: "Near Ishwar Temple, Gurugunta",
          city: "Lingasugur",
          state: "Karnataka",
          zipCode: "584139",
        },
      });

      patientUser = await User.create({
        name: "Ramesh Kumar",
        email: "patient@example.com",
        password: "patient123", // Will be hashed by pre-save middleware
        role: "patient",
        contactNumber: "+91 98450 12345",
        gender: "Male",
        age: 32,
        address: {
          street: "Near Bus Stand, Gurugunta",
          city: "Lingasugur",
          state: "Karnataka",
          zipCode: "584139",
        },
      });
      console.log("Default Indian users seeded: ahmedpasha@gmail.com / patient@example.com");
    } else {
      adminUser = await User.findOne({ role: "admin" });
      patientUser = await User.findOne({ role: "patient" });
    }

    // 2. Seed Tests if empty
    const testCount = await Test.countDocuments();
    let cbc, lipid, lft, thyroid;

    if (testCount === 0) {
      console.log("Seeding default Indian Rupee diagnostic tests...");
      cbc = await Test.create({
        name: "Complete Blood Count (CBC)",
        code: "CBC",
        category: "Blood Test",
        description: "Evaluates your overall health and detects a wide range of disorders, including anemia, infection and leukemia.",
        price: 299,
        sampleRequired: "Blood",
        turnaroundTime: "12 Hours",
        preparation: "No special preparation required.",
      });

      lipid = await Test.create({
        name: "Lipid Profile (Cholesterol)",
        code: "LIPID",
        category: "Blood Test",
        description: "Measures cholesterol and triglycerides in your blood to evaluate your risk of cardiovascular disease.",
        price: 599,
        sampleRequired: "Blood",
        turnaroundTime: "24 Hours",
        preparation: "Fasting required for 10-12 hours before sample collection.",
      });

      lft = await Test.create({
        name: "Liver Function Test (LFT)",
        code: "LFT",
        category: "Blood Test",
        description: "Helps determine the health of your liver by measuring levels of proteins, liver enzymes, and bilirubin.",
        price: 699,
        sampleRequired: "Blood",
        turnaroundTime: "24 Hours",
        preparation: "Fasting recommended.",
      });

      thyroid = await Test.create({
        name: "Thyroid Profile (T3, T4, TSH)",
        code: "THYROID",
        category: "Hormone Test",
        description: "Evaluates thyroid gland function and helps diagnose thyroid disorders.",
        price: 799,
        sampleRequired: "Blood",
        turnaroundTime: "24 Hours",
        preparation: "No special preparation required.",
      });

      // Add a couple extra tests for variety
      await Test.create({
        name: "HbA1c (Glycated Haemoglobin)",
        code: "HBA1C",
        category: "Diabetes Test",
        description: "Provides an average of your blood sugar control over the past 2 to 3 months.",
        price: 399,
        sampleRequired: "Blood",
        turnaroundTime: "12 Hours",
        preparation: "No fasting required.",
      });

      await Test.create({
        name: "Vitamin D3 (25-Hydroxy)",
        code: "VITD3",
        category: "Vitamin Test",
        description: "Measures the level of Vitamin D in your blood, crucial for bone and immune health.",
        price: 999,
        sampleRequired: "Blood",
        turnaroundTime: "24 Hours",
        preparation: "No special preparation required.",
      });

      await Test.create({
        name: "Urine Routine & Microscopy",
        code: "URINE",
        category: "Urine Test",
        description: "A comprehensive urinalysis to check for signs of urinary tract infections, kidney issues, or diabetes.",
        price: 199,
        sampleRequired: "Urine",
        turnaroundTime: "12 Hours",
        preparation: "Collect mid-stream urine sample in a sterile container.",
      });

      console.log("Diagnostic tests seeded successfully.");
    } else {
      cbc = await Test.findOne({ code: "CBC" });
      lipid = await Test.findOne({ code: "LIPID" });
      lft = await Test.findOne({ code: "LFT" });
      thyroid = await Test.findOne({ code: "THYROID" });
    }

    // 3. Seed Packages if empty
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      console.log("Seeding default Indian wellness packages...");
      
      // Ensure we have IDs to map
      const testIds = [];
      if (cbc) testIds.push(cbc._id);
      if (lipid) testIds.push(lipid._id);
      if (lft) testIds.push(lft._id);

      await Package.create({
        name: "Premium Executive Health Checkup",
        code: "PEHC",
        description: "A comprehensive health assessment designed to evaluate vital body functions including blood counts, liver function, and cholesterol profiles.",
        price: 1999,
        discountPrice: 1299,
        tests: testIds,
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
      });

      const thyroidIds = [];
      if (thyroid) thyroidIds.push(thyroid._id);
      if (cbc) thyroidIds.push(cbc._id);

      await Package.create({
        name: "Women Wellness hormonal Package",
        code: "WWHP",
        description: "Specially curated hormonal and blood health markers to monitor women's physiological metabolic curves and health parameters.",
        price: 1799,
        discountPrice: 1199,
        tests: thyroidIds,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      });

      console.log("Diagnostic packages seeded successfully.");
    }
  } catch (error) {
    console.error("Seeding Error:", error);
  }
};

module.exports = seedDatabase;
