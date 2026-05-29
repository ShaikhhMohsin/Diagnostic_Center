const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

let mongoServer;

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds
  };

  try {
    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/multidiagnostic";
    console.log(`Attempting to connect to Local MongoDB: ${dbUri}...`);
    const conn = await mongoose.connect(dbUri, options);
    console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn("====================================================");
    console.warn("DEFAULT LOCAL MONGODB SERVICE NOT DETECTED.");
    console.warn("Initializing self-managed local persistent MongoDB server...");
    console.warn("====================================================");

    try {
      const dbPath = path.join(__dirname, "../data");
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: "wiredTiger", // WiredTiger enables disk persistence
        },
      });

      const fallbackUri = mongoServer.getUri();
      console.log(`Self-managed local MongoDB running at: ${fallbackUri}`);
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`Self-managed local MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (fallbackError) {
      console.error("CRITICAL: Failed to launch self-managed MongoDB fallback:");
      console.error(fallbackError.message);
      return false;
    }
  }
};

module.exports = connectDB;
