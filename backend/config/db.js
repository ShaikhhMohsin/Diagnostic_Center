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
      } else {
        // Clean up stale lock files if they exist to prevent startup failures after improper shutdown
        const lockFiles = [
          path.join(dbPath, "mongod.lock"),
          path.join(dbPath, "WiredTiger.lock")
        ];
        lockFiles.forEach(file => {
          if (fs.existsSync(file)) {
            try {
              fs.unlinkSync(file);
              console.log(`Removed stale lock file: ${file}`);
            } catch (err) {
              console.warn(`Could not remove lock file ${file}: ${err.message}`);
            }
          }
        });
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

// Graceful shutdown helper
const gracefulShutdown = async () => {
  console.log("Shutting down database connection...");
  try {
    await mongoose.disconnect();
    console.log("Mongoose disconnected.");
  } catch (err) {
    console.error("Error during Mongoose disconnect:", err);
  }
  if (mongoServer) {
    try {
      await mongoServer.stop();
      console.log("Self-managed MongoDB stopped.");
    } catch (err) {
      console.error("Error stopping MongoMemoryServer:", err);
    }
  }
};

// Register process termination hooks for clean shutdown
process.on("SIGINT", async () => {
  await gracefulShutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await gracefulShutdown();
  process.exit(0);
});

process.once("SIGUSR2", async () => {
  await gracefulShutdown();
  process.kill(process.pid, "SIGUSR2");
});

module.exports = connectDB;
