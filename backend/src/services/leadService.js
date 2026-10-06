const EvoLead = require("../models/Lead");
const { calculateScore, calculateLeadStatus } = require("../utils/leadScorer");

/**
 * Persist and update lead profile and conversation history in MongoDB.
 */
async function saveLead(visitorId, profile, message, reply, page, source) {
    let lead = await EvoLead.findOne({ visitorId });

    if (!lead) {
        lead = new EvoLead({
            visitorId,
            source: source || "Evo AI Assistant",
            page: page || profile?.page || "",
            conversation: []
        });
    }

    const safeProfile = profile || {};

    if (safeProfile.name) lead.name = safeProfile.name;
    if (safeProfile.company) lead.company = safeProfile.company;
    if (safeProfile.industry) lead.industry = safeProfile.industry;
    if (safeProfile.email) lead.email = safeProfile.email;
    if (safeProfile.whatsapp) lead.whatsapp = safeProfile.whatsapp;
    if (safeProfile.intent) lead.intent = safeProfile.intent;
    if (safeProfile.interest) lead.interest = safeProfile.interest;
    if (safeProfile.requirement) lead.requirement = safeProfile.requirement;
    if (safeProfile.preferredContact) lead.preferredContact = safeProfile.preferredContact;

    if (safeProfile.appointmentRequested !== undefined) {
        lead.appointmentRequested = Boolean(safeProfile.appointmentRequested);
    }

    if (page) lead.page = page;
    if (source) lead.source = source;

    const score = calculateScore(
        {
            name: lead.name,
            company: lead.company,
            industry: lead.industry,
            email: lead.email,
            whatsapp: lead.whatsapp,
            requirement: lead.requirement,
            interest: lead.interest,
            appointmentRequested: lead.appointmentRequested
        },
        message
    );

    lead.leadScore = score;
    lead.leadStatus = calculateLeadStatus(score);

    lead.conversation.push(
        {
            role: "user",
            content: message,
            timestamp: new Date()
        },
        {
            role: "assistant",
            content: reply,
            timestamp: new Date()
        }
    );

    // Keep conversation length bounded to the latest 80 exchanges
    if (lead.conversation.length > 80) {
        lead.conversation = lead.conversation.slice(-80);
    }

    lead.lastInteraction = new Date();

    await lead.save();

    return lead;
}

module.exports = {
    saveLead
};
