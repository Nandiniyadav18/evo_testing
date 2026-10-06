const mongoose = require("mongoose");

const conversationItemSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const evoLeadSchema = new mongoose.Schema(
    {
        visitorId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            default: ""
        },
        company: {
            type: String,
            default: ""
        },
        industry: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        whatsapp: {
            type: String,
            default: ""
        },
        intent: {
            type: String,
            default: ""
        },
        interest: {
            type: String,
            default: ""
        },
        requirement: {
            type: String,
            default: ""
        },
        preferredContact: {
            type: String,
            default: ""
        },
        appointmentRequested: {
            type: Boolean,
            default: false
        },
        leadScore: {
            type: Number,
            default: 0
        },
        leadStatus: {
            type: String,
            enum: ["Exploring", "Warm", "Hot"],
            default: "Exploring"
        },
        source: {
            type: String,
            default: "Evo AI Assistant"
        },
        page: {
            type: String,
            default: ""
        },
        conversation: [conversationItemSchema],
        createdAt: {
            type: Date,
            default: Date.now
        },
        lastInteraction: {
            type: Date,
            default: Date.now
        }
    }
);

const EvoLead = mongoose.model("EvoLead", evoLeadSchema);

module.exports = EvoLead;
