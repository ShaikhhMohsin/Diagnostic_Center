const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("https");

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[36m%s\x1b[0m", "   MULTI DIAGNOSTIC CENTER - SECURE TUNNEL EXPOSE SYSTEM  ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================\n");

// Helper to fetch public IP (localtunnel security password)
function getPublicIP() {
  return new Promise((resolve) => {
    http.get("https://api.ipify.org", (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data.trim()));
    }).on("error", () => {
      resolve("Could not fetch IP automatically. (Check your local router settings)");
    });
  });
}

// Main execution function
async function startTunneling() {
  console.log("⚡ Fetching your public IP address (Required for localtunnel security bypass)...");
  const publicIP = await getPublicIP();
  console.log(`🔑 Tunnel Password / Public IP: \x1b[32m${publicIP}\x1b[0m\n`);

  console.log("🔌 Opening Backend Tunnel on Port 5000...");
  
  // Launch backend tunnel
  const backendTunnel = spawn("npx", ["localtunnel", "--port", "5000"], { shell: true });
  let backendUrl = "";

  backendTunnel.stdout.on("data", (data) => {
    const output = data.toString();
    const match = output.match(/url is: (https:\/\/[^\s]+)/);
    if (match && !backendUrl) {
      backendUrl = match[1];
      console.log(`🟢 Backend Tunnel Ready: \x1b[32m${backendUrl}\x1b[0m`);
      
      // Auto-configure the frontend's environment variable
      const envPath = path.join(__dirname, "frontend", ".env.local");
      const envContent = `NEXT_PUBLIC_API_URL=${backendUrl}/api\n`;
      fs.writeFileSync(envPath, envContent);
      console.log(`💾 Automatically wrote connection variable to frontend/.env.local`);

      console.log("\n🔌 Opening Frontend Tunnel on Port 3000...");
      startFrontendTunnel(publicIP, backendUrl);
    }
  });

  backendTunnel.stderr.on("data", (data) => {
    console.error(`\x1b[31m[Backend Tunnel Error]: ${data}\x1b[0m`);
  });

  backendTunnel.on("close", (code) => {
    console.log(`Backend tunnel process exited with code ${code}`);
  });
}

function startFrontendTunnel(publicIP, backendUrl) {
  // Launch frontend tunnel
  const frontendTunnel = spawn("npx", ["localtunnel", "--port", "3000"], { shell: true });
  let frontendUrl = "";

  frontendTunnel.stdout.on("data", (data) => {
    const output = data.toString();
    const match = output.match(/url is: (https:\/\/[^\s]+)/);
    if (match && !frontendUrl) {
      frontendUrl = match[1];
      
      // Print the Premium Sharing Dashboard
      console.log("\n\x1b[32m%s\x1b[0m", "==========================================================");
      console.log("\x1b[32m%s\x1b[0m", "       🚀 PLATFORM IS LIVE & ACCESSIBLE EVERYONE!        ");
      console.log("\x1b[32m%s\x1b[0m", "==========================================================");
      console.log(`\n  🖥️  \x1b[1mFrontend Portal URL:\x1b[0m \x1b[36m${frontendUrl}\x1b[0m`);
      console.log(`  ⚙️  \x1b[1mBackend API URL:    \x1b[0m \x1b[36m${backendUrl}/api\x1b[0m`);
      console.log(`  🔑 \x1b[1mBypass Password:    \x1b[0m \x1b[32m${publicIP}\x1b[0m  (Required on first visit)`);
      console.log("\n\x1b[33m%s\x1b[0m", "💡 Share the Frontend Portal URL with anyone, anywhere!");
      console.log("\x1b[35m%s\x1b[0m", "📌 Note: Keep this terminal window open to maintain the active tunnels.");
      console.log("\x1b[32m%s\x1b[0m", "==========================================================\n");
    }
  });

  frontendTunnel.stderr.on("data", (data) => {
    console.error(`\x1b[31m[Frontend Tunnel Error]: ${data}\x1b[0m`);
  });

  frontendTunnel.on("close", (code) => {
    console.log(`Frontend tunnel process exited with code ${code}`);
  });
}

startTunneling();
