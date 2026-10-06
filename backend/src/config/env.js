const path = require("path");
const dotenv = require("dotenv");

// Load .env from backend directory or project root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const rawModel = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
const normalizedModel = (rawModel.includes("3.8") || rawModel.includes("3.5"))
    ? "gemini-2.5-flash"
    : rawModel;

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
