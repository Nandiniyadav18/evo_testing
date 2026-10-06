const { gemini, GEMINI_MODEL, hasGeminiKey } = require("../config/gemini");
const { buildSystemInstruction, responseSchema } = require("../constants/prompts");
const { cleanString } = require("../utils/helpers");
const { generateConciergeFallback } = require("../utils/fallbackEngine");

/**
 * Format raw conversation history into Gemini contents structure.
 */
function formatHistory(history) {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .slice(-16)
        .map(item => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const role = item.role === "assistant" ? "model" : "user";
            const content = cleanString(item.content, 3000);

            if (!content) {
                return null;
            }

            return {
                role,
                parts: [{ text: content }]
            };
        })
        .filter(Boolean);
}

/**
 * Generate AI response using Gemini with structured schema,
 * seamlessly falling back to the intelligent concierge engine on any error.
 */
async function generateAiResponse({ message, history, profile, page, source }) {
    const safeHistory = formatHistory(history);
    const contents = [
        ...safeHistory,
        {
            role: "user",
            parts: [{ text: message }]
        }
    ];

    const finalInstructions = buildSystemInstruction(profile, page, source);
    let aiData = null;

    if (gemini && hasGeminiKey) {
        try {
            console.log(`→ Evo message received: ${message}`);
            const response = await gemini.models.generateContent({
                model: GEMINI_MODEL,
                contents,
                config: {
                    systemInstruction: finalInstructions,
                    temperature: 0.7,
                    maxOutputTokens: 700,
                    responseMimeType: "application/json",
                    responseSchema
                }
            });

            const rawText = response.text || "";
            if (rawText) {
                try {
                    aiData = JSON.parse(rawText);
                    console.log("✓ Gemini response received");
                } catch (parseErr) {
                    console.warn("Evo Gemini JSON parse notice:", parseErr.message);
                    aiData = {
                        reply: rawText,
                        intent: "",
                        interest: "",
                        requirement: "",
                        company: "",
                        industry: "",
                        name: "",
                        preferredContact: "",
                        appointmentRequested: false,
                        shouldAskContact: false,
                        leadSignal: "Exploring"
                    };
                }
            }
        } catch (geminiError) {
            console.warn("⚠️ Gemini AI service notice:", geminiError.message || geminiError);
            console.log("→ Activated Evo conversational concierge fallback.");
        }
    }

    // Fallback if Gemini not available, key invalid, or returned empty response
    if (!aiData || !aiData.reply) {
        aiData = generateConciergeFallback(message, profile, history);
    }

    return aiData;
}

module.exports = {
    generateAiResponse,
    formatHistory
};
