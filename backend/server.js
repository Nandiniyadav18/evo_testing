const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const { gemini, hasGeminiKey } = require("./src/config/gemini");
const app = require("./src/app");

async function verifyGemini() {
    if (!hasGeminiKey || !gemini) {
        return "❌ Missing Key in .env";
    }
    try {
        await gemini.models.generateContent({
            model: env.GEMINI_MODEL,
            contents: "ping"
        });
        return "✓ Working & Active";
    } catch (err) {
        return `⚠️ Connection Issue (${err.message ? err.message.substring(0, 40) : "Invalid"})`;
    }
}

async function startServer() {
    // Connect to database
    await connectDB();

    // Verify Gemini API Key
    const geminiStatus = await verifyGemini();

    // Start HTTP server
    app.listen(env.PORT, () => {
        console.log("");
        console.log("========================================");
        console.log("       GRANDEVO EVO AI BACKEND");
        console.log("========================================");
        console.log(`Evo API: http://localhost:${env.PORT}`);
        console.log(`Health: http://localhost:${env.PORT}/api/evo/health`);
        console.log(`Gemini Model: ${env.GEMINI_MODEL}`);
        console.log(`Gemini API Key: ${geminiStatus}`);
        console.log("========================================");
        console.log("");
    });
}

startServer();