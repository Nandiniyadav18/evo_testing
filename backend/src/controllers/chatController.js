const { cleanString, extractContactData } = require("../utils/helpers");
const { generateAiResponse } = require("../services/aiService");
const { saveLead } = require("../services/leadService");

async function handleChat(req, res) {
    try {
        const body = req.body || {};

        const visitorId = cleanString(body.visitorId, 100);
        const cleanMessage = cleanString(body.message, 4000);
        const incomingProfile = body.profile || body.lead || {};
        const history = Array.isArray(body.history) ? body.history : [];
        const page = cleanString(body.page, 300);
        const source = cleanString(body.source, 300) || "Evo AI Assistant";

        if (!cleanMessage || !visitorId) {
            return res.status(400).json({
                success: false,
                message: "Visitor ID and message are required."
            });
        }

        // Extract contact info from message before calling AI
        const updatedProfile = extractContactData(incomingProfile, cleanMessage);

        // Process message through AI or Concierge engine
        const aiData = await generateAiResponse({
            message: cleanMessage,
            history,
            profile: updatedProfile,
            page,
            source
        });

        // Merge AI understanding into lead profile
        const finalProfile = {
            ...updatedProfile,
            name: aiData.name || updatedProfile.name || "",
            company: aiData.company || updatedProfile.company || "",
            industry: aiData.industry || updatedProfile.industry || "",
            intent: aiData.intent || updatedProfile.intent || "",
            interest: aiData.interest || updatedProfile.interest || "",
            requirement: aiData.requirement || updatedProfile.requirement || "",
            preferredContact: aiData.preferredContact || updatedProfile.preferredContact || "",
            appointmentRequested: Boolean(aiData.appointmentRequested || updatedProfile.appointmentRequested)
        };

        // Persist lead and message history in MongoDB
        const lead = await saveLead(
            visitorId,
            finalProfile,
            cleanMessage,
            aiData.reply,
            page,
            source
        );

        return res.json({
            success: true,
            reply: aiData.reply,
            answer: aiData.reply,
            profile: {
                visitorId,
                name: lead.name,
                company: lead.company,
                industry: lead.industry,
                email: lead.email,
                whatsapp: lead.whatsapp,
                intent: lead.intent,
                interest: lead.interest,
                requirement: lead.requirement,
                preferredContact: lead.preferredContact,
                appointmentRequested: lead.appointmentRequested
            },
            lead: {
                score: lead.leadScore,
                status: lead.leadStatus
            }
        });
    } catch (error) {
        console.error("========================================");
        console.error("EVO CHAT ERROR:", error);
        console.error("========================================");

        return res.status(500).json({
            success: false,
            message: "Evo is temporarily unavailable. Please try again."
        });
    }
}

module.exports = {
    handleChat
};
