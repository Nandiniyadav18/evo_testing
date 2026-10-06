/**
 * Professional Conduct & Policy Module
 * Enforces GrandEvo's executive communication standards and professional boundaries.
 * 
 * NOTE: Language appropriateness, toxicity, and respect are evaluated automatically
 * by the AI (LLM) semantic reasoning layer without maintaining hardcoded profanities.
 */

/**
 * Standard firm, dignified, and professional boundary response
 * used when a communication boundary violation is identified.
 */
function createProfessionalBoundaryResponse(isHindi = false, profile = {}) {
    const reply = isHindi
        ? "GrandEvo Technologies me hum aapse respectful aur professional communication expect karte hain. Inappropriate ya disrespectful communication yahan acceptable nahi hai. Kripya shishtata aur maryada banaye rakhein. Agar aapke business se related koi genuine requirement ya query hai, toh kripya respectfully communicate karein — hum aapki zaroor madad karenge."
        : "I am committed to maintaining a professional and respectful dialogue. Inappropriate, offensive, or disrespectful communication is not acceptable here. If you have legitimate business requirements or inquiries regarding GrandEvo's digital solutions, please communicate respectfully and I will be glad to assist you.";

    return {
        reply,
        intent: "Professional Conduct Policy Notice",
        interest: profile?.interest || "",
        requirement: profile?.requirement || "",
        company: profile?.company || "",
        industry: profile?.industry || "",
        name: profile?.name || "",
        preferredContact: profile?.preferredContact || "",
        appointmentRequested: false,
        shouldAskContact: false,
        leadSignal: "Exploring"
    };
}

module.exports = {
    createProfessionalBoundaryResponse
};
