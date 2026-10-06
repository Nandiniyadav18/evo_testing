const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const evoRoutes = require("./routes/evoRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: true,
        credentials: false
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/evo/admin", adminRoutes);
app.use("/api/evo", evoRoutes);

/* =========================================================
   PATHS & ASSETS
========================================================= */

const rootDir = path.resolve(__dirname, "../..");
const reactDistDir = path.resolve(rootDir, "frontend/dist");

// Serve assets for both evo-ai.html (evo-professional.png) and React Admin (js/css)
app.use("/assets", express.static(path.join(rootDir, "assets")));
if (fs.existsSync(path.join(reactDistDir, "assets"))) {
    app.use("/assets", express.static(path.join(reactDistDir, "assets")));
}

/* =========================================================
   USER FRONTEND: EXACTLY evo-ai.html (NOT A SINGLE CHANGE)
========================================================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(rootDir, "evo-ai.html"));
});

app.get("/evo-ai.html", (req, res) => {
    res.sendFile(path.join(rootDir, "evo-ai.html"));
});

/* =========================================================
   ADMIN PANEL: ACCESSIBLE AT /admin
========================================================= */

app.use("/admin", express.static(reactDistDir));

app.use((req, res, next) => {
    if (req.method === "GET" && (req.path === "/admin" || req.path.startsWith("/admin/"))) {
        const adminIndex = path.join(reactDistDir, "index.html");
        if (fs.existsSync(adminIndex)) {
            return res.sendFile(adminIndex);
        }
    }
    next();
});

module.exports = app;
