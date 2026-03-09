import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connectDB from "./src/config/db/dbConnection.js";

// validate critical environment variables upfront
const requiredEnvs = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
];
for (const name of requiredEnvs) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
