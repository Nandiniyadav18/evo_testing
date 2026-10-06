const express = require("express");
const {
    login,
    verifyAuth,
    getLeads,
    getLeadById,
    getStats,
    deleteLead,
    exportLeadsCsv
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Admin authentication
router.post("/login", login);

// Protected routes: Require valid JWT token
router.get("/verify", authMiddleware, verifyAuth);
router.get("/stats", authMiddleware, getStats);
router.get("/leads", authMiddleware, getLeads);
router.get("/leads/:id", authMiddleware, getLeadById);
router.delete("/leads/:id", authMiddleware, deleteLead);
router.get("/export/csv", authMiddleware, exportLeadsCsv);

module.exports = router;
