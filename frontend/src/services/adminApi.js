const ADMIN_API = "/api/evo/admin";
const TOKEN_KEY = "grandevo_admin_token";

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function removeAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * Admin Login via JWT
 */
export async function loginAdmin(email, password) {
    const res = await fetch(`${ADMIN_API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.message || "Invalid login credentials");
    }

    if (data.token) {
        setAuthToken(data.token);
    }

    return data;
}

/**
 * Verify currently stored token
 */
export async function verifyAuthToken() {
    const token = getAuthToken();
    if (!token) return { success: false };

    try {
        const res = await fetch(`${ADMIN_API}/verify`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            removeAuthToken();
            return { success: false };
        }
        return await res.json();
    } catch {
        removeAuthToken();
        return { success: false };
    }
}

/**
 * Fetch Stats
 */
export async function fetchStats() {
    const res = await fetch(`${ADMIN_API}/stats`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to load admin stats");
    }
    return await res.json();
}

/**
 * Fetch Leads with filters
 */
export async function fetchLeads({ search = "", status = "All", appointment = "false", sortBy = "newest" } = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status && status !== "All") params.append("status", status);
    if (appointment === "true") params.append("appointment", "true");
    if (sortBy) params.append("sortBy", sortBy);

    const res = await fetch(`${ADMIN_API}/leads?${params.toString()}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to load leads");
    }
    return await res.json();
}

/**
 * Fetch Single Lead with conversation history
 */
export async function fetchLeadById(id) {
    const res = await fetch(`${ADMIN_API}/leads/${id}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load lead details");
    return await res.json();
}

/**
 * Delete Lead
 */
export async function deleteLead(id) {
    const res = await fetch(`${ADMIN_API}/leads/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete lead");
    return await res.json();
}

/**
 * Get CSV export URL with token query param
 */
export function getExportUrl() {
    const token = getAuthToken();
    return `${ADMIN_API}/export/csv${token ? `?token=${encodeURIComponent(token)}` : ''}`;
}
