const path = require("path");
const dotenv = require("dotenv");

// Load .env from backend directory or project root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const rawModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash").trim();
// Automatically migrate discontinued models (2.5, 1.5, 2.0) to gemini-3.5-flash
const normalizedModel = (rawModel.includes("2.5") || rawModel.includes("1.5") || rawModel.includes("2.0"))
    ? "gemini-3.5-flash"
    : (rawModel || "gemini-3.5-flash");

const env = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/grandevo_evo",
    GEMINI_API_KEY: (process.env.GEMINI_API_KEY || "").trim(),
    GEMINI_MODEL: normalizedModel,
    STATIC_DIR: path.resolve(__dirname, "../../../"),
    JWT_SECRET: process.env.JWT_SECRET || "grandevo_default_jwt_secret_key_2026",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@grandevo.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123"
};

module.exports = env;
