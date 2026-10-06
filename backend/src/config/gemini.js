const { GoogleGenAI } = require("@google/genai");
const env = require("./env");

let gemini = null;

if (!env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing from .env");
} else {
    console.log("✓ Gemini AI configured");
    try {
        gemini = new GoogleGenAI({
            apiKey: env.GEMINI_API_KEY
        });
    } catch (error) {
        console.error("⚠️ Failed to initialize GoogleGenAI client:", error.message);
    }
}

module.exports = {
    gemini,
    GEMINI_MODEL: env.GEMINI_MODEL,
    hasGeminiKey: Boolean(env.GEMINI_API_KEY)
};
