const mongoose = require("mongoose");

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  };

  try {
    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/multidiagnostic";
    console.log(`Attempting to connect to Local MongoDB: ${dbUri}...`);
    const conn = await mongoose.connect(dbUri, options);
    console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("====================================================");
    console.error("DATABASE CONNECTION FAILURE:");
    console.error(`Local Mongo Error: ${error.message}`);
    console.error("Please ensure MongoDB is installed and running locally on port 27017.");
    console.error("====================================================");
    return false;
  }
};

module.exports = connectDB;
