const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const EvoLead = require("../models/Lead");
const env = require("../config/env");

/**
 * Admin Login via JWT.
 */
async function login(req, res) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const configuredEmail = env.ADMIN_EMAIL.trim().toLowerCase();

        if (normalizedEmail !== configuredEmail || password !== env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid administrator credentials."
            });
        }

        // Generate JWT token valid for 7 days
        const token = jwt.sign(
            {
                email: env.ADMIN_EMAIL,
                role: "admin"
            },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            token,
            admin: {
                email: env.ADMIN_EMAIL,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication."
        });
    }
}

/**
 * Verify existing JWT token.
 */
async function verifyAuth(req, res) {
    return res.json({
        success: true,
        admin: req.admin
    });
}

/**
 * Fetch all leads with optional filtering, search, and sorting.
 */
async function getLeads(req, res) {
    try {
        const { search, status, appointment, sortBy } = req.query;
        const query = {};

        // Status filter
        if (status && status !== "All") {
            query.leadStatus = status;
        }

        // Appointment filter
        if (appointment === "true") {
            query.appointmentRequested = true;
        }

        // Search across multiple fields
        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { visitorId: regex },
                { name: regex },
                { company: regex },
                { email: regex },
                { whatsapp: regex },
                { intent: regex },
                { requirement: regex }
            ];
        }

        // Sort configuration
        let sortOption = { lastInteraction: -1 };
        if (sortBy === "score_desc") sortOption = { leadScore: -1, lastInteraction: -1 };
        if (sortBy === "score_asc") sortOption = { leadScore: 1, lastInteraction: -1 };
        if (sortBy === "oldest") sortOption = { createdAt: 1 };

        const leads = await EvoLead.find(query).sort(sortOption).lean();

        return res.json({
            success: true,
            count: leads.length,
            leads
        });
    } catch (error) {
        console.error("Admin getLeads error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });
    }
}

/**
 * Get single lead details with full conversation history.
 */
async function getLeadById(req, res) {
    try {
        const { id } = req.params;
        let lead;

        if (mongoose.Types.ObjectId.isValid(id)) {
            lead = await EvoLead.findById(id).lean();
        }
        if (!lead) {
            lead = await EvoLead.findOne({ visitorId: id }).lean();
        }

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.json({
            success: true,
            lead
        });
    } catch (error) {
        console.error("Admin getLeadById error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch lead details"
        });
    }
}

/**
 * Overview statistics and KPIs for admin dashboard.
 */
async function getStats(req, res) {
    try {
        const totalLeads = await EvoLead.countDocuments();
        const hotLeads = await EvoLead.countDocuments({ leadStatus: "Hot" });
        const warmLeads = await EvoLead.countDocuments({ leadStatus: "Warm" });
        const exploringLeads = await EvoLead.countDocuments({ leadStatus: "Exploring" });
        const appointments = await EvoLead.countDocuments({ appointmentRequested: true });

        // Calculate average score
        const scoreAgg = await EvoLead.aggregate([
            { $group: { _id: null, avgScore: { $avg: "$leadScore" } } }
        ]);
        const avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;

        // Recent leads
        const recentLeads = await EvoLead.find()
            .sort({ lastInteraction: -1 })
            .limit(5)
            .select("visitorId name company email leadScore leadStatus appointmentRequested lastInteraction")
            .lean();

        return res.json({
            success: true,
            stats: {
                totalLeads,
                hotLeads,
                warmLeads,
                exploringLeads,
                appointments,
                avgScore,
                mongodbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
                geminiConfigured: Boolean(env.GEMINI_API_KEY),
                geminiModel: env.GEMINI_MODEL
            },
            recentLeads
        });
    } catch (error) {
        console.error("Admin getStats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
}

/**
 * Delete a lead record.
 */
async function deleteLead(req, res) {
    try {
        const { id } = req.params;
        let result;

        if (mongoose.Types.ObjectId.isValid(id)) {
            result = await EvoLead.findByIdAndDelete(id);
        }
        if (!result) {
            result = await EvoLead.findOneAndDelete({ visitorId: id });
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.json({
            success: true,
            message: "Lead deleted successfully"
        });
    } catch (error) {
        console.error("Admin deleteLead error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lead"
        });
    }
}

/**
 * Export all leads in CSV format.
 */
async function exportLeadsCsv(req, res) {
    try {
        const leads = await EvoLead.find().sort({ lastInteraction: -1 }).lean();

        const headers = [
            "Visitor ID",
            "Name",
            "Company",
            "Industry",
            "Email",
            "WhatsApp",
            "Intent",
            "Requirement",
            "Score",
            "Status",
            "Appointment Requested",
            "Total Messages",
            "Last Interaction"
        ];

        const rows = leads.map(l => [
            `"${l.visitorId || ""}"`,
            `"${(l.name || "").replace(/"/g, '""')}"`,
            `"${(l.company || "").replace(/"/g, '""')}"`,
            `"${(l.industry || "").replace(/"/g, '""')}"`,
            `"${(l.email || "").replace(/"/g, '""')}"`,
            `"${(l.whatsapp || "").replace(/"/g, '""')}"`,
            `"${(l.intent || "").replace(/"/g, '""')}"`,
            `"${(l.requirement || "").replace(/"/g, '""')}"`,
            l.leadScore || 0,
            `"${l.leadStatus || "Exploring"}"`,
            l.appointmentRequested ? "YES" : "NO",
            l.conversation ? l.conversation.length : 0,
            `"${l.lastInteraction ? new Date(l.lastInteraction).toISOString() : ""}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=grandevo_leads.csv");
        return res.send(csvContent);
    } catch (error) {
        console.error("Admin exportLeadsCsv error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to export leads"
        });
    }
}

module.exports = {
    login,
    verifyAuth,
    getLeads,
    getLeadById,
    getStats,
    deleteLead,
    exportLeadsCsv
};
