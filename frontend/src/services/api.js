const API_BASE = "/api/evo";

const VISITOR_KEY = "grandevo_evo_visitor_id";
const CHAT_HISTORY_KEY = "grandevo_evo_chat_history";

/**
 * Get or create a unique persistent visitor ID
 */
export function getVisitorId() {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = "evo_visitor_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
}

/**
 * Load cached chat history from localStorage
 */
export function loadCachedHistory() {
    try {
        const stored = localStorage.getItem(CHAT_HISTORY_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

/**
 * Save chat history to localStorage
 */
export function saveCachedHistory(messages) {
    try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (e) {
        console.warn("Failed to cache history:", e);
    }
}

/**
 * Reset local session and visitor ID
 */
export function resetSession() {
    localStorage.removeItem(VISITOR_KEY);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    return getVisitorId();
}

/**
 * Send chat message to backend
 */
export async function sendChatMessage({ visitorId, message, history, profile, page, source }) {
    const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            visitorId,
            message,
            history,
            profile,
            page: page || window.location.href,
            source: source || "GrandEvo Web Interface"
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Failed to receive response from Evo");
    }

    return data;
}

/**
 * Fetch backend health status
 */
export async function fetchHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (!response.ok) return { success: false, status: "offline" };
        return await response.json();
    } catch {
        return { success: false, status: "offline" };
    }
}
