const mongoose = require("mongoose");

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  };

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Atlas connection failed: ${error.message}`);
    
    // Fallback to local MongoDB
    const localURI = "mongodb://127.0.0.1:27017/multidiagnostic";
    try {
      console.log(`Attempting fallback to local MongoDB: ${localURI}...`);
      const conn = await mongoose.connect(localURI, options);
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (localError) {
      console.error("====================================================");
      console.error("DATABASE CONNECTION FAILURE:");
      console.error(`Atlas Error: ${error.message}`);
      console.error(`Local Mongo Error: ${localError.message}`);
      console.error("Please ensure MongoDB is installed and running locally, or update MONGO_URI in backend/.env.");
      console.error("The server will remain active in sandbox mode to serve frontend static requests.");
      console.error("====================================================");
      return false;
    }
  }
};

module.exports = connectDB;
