const HIGH_INTENT_WORDS = [
    "demo",
    "price",
    "pricing",
    "buy",
    "implement",
    "implementation",
    "project",
    "build",
    "need",
    "hire",
    "appointment",
    "meeting",
    "call",
    "business requirement"
];

function calculateLeadStatus(score) {
    if (score >= 70) {
        return "Hot";
    }
    if (score >= 40) {
        return "Warm";
    }
    return "Exploring";
}

function calculateScore(profile, message) {
    let score = 0;
    const text = String(message || "").toLowerCase();

    if (profile.name) score += 10;
    if (profile.company) score += 10;
    if (profile.industry) score += 5;
    if (profile.email) score += 15;
    if (profile.whatsapp) score += 15;
    if (profile.requirement) score += 25;
    if (profile.interest) score += 10;
    if (profile.appointmentRequested) score += 30;

    HIGH_INTENT_WORDS.forEach(word => {
        if (text.includes(word)) {
            score += 5;
        }
    });

    return Math.min(score, 100);
}

module.exports = {
    calculateLeadStatus,
    calculateScore
};
