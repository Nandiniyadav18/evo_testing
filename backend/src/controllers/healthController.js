const mongoose = require("mongoose");
const env = require("../config/env");

function getHealth(req, res) {
    return res.json({
        success: true,
        service: "GrandEvo Evo AI",
        status: "online",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        gemini: env.GEMINI_API_KEY ? "working & active" : "missing",
        model: env.GEMINI_MODEL,
        time: new Date().toISOString()
    });
}

module.exports = {
    getHealth
};
