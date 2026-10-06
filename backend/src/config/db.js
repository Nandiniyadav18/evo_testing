const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("✓ Evo MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Evo MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("✓ Evo MongoDB reconnected");
});

module.exports = connectDB;
