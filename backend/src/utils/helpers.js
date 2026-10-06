/**
 * Sanitize and limit length of user-provided string inputs.
 */
function cleanString(value, max = 4000) {
    if (typeof value !== "string") {
        return "";
    }
    return value.trim().slice(0, max);
}

/**
 * Extract email address and phone/WhatsApp number from user message.
 */
function extractContactData(profile, message) {
    const updated = {
        ...(profile || {})
    };

    const emailMatch = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
        updated.email = emailMatch[0];
    }

    const phoneMatch = message.match(/(?:\+?\d[\d\s\-()]{8,}\d)/);
    if (phoneMatch && !updated.whatsapp) {
        updated.whatsapp = phoneMatch[0].trim();
    }

    return updated;
}

module.exports = {
    cleanString,
    extractContactData
};
