# GrandEvo Evo AI — System Architecture & Flowchart

This document provides a comprehensive overview of how **EVO AI** operates end-to-end, illustrating the dual-plane architecture:
1. **Public Visitor Conversation Plane** (Untouched `evo-ai.html`, Anti-Profanity Guardrail, Gemini LLM + Fallback, Lead Scorer)
2. **Secure Admin Management Plane** (JWT Authentication, Protected API, Real-time Dashboard, Conversation History)

---

## 1. End-to-End System Flowchart

```mermaid
flowchart TD
    %% Styling
    classDef userPlane fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef guardrail fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fef2f2;
    classDef aiEngine fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#f5f3ff;
    classDef dbPlane fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5;
    classDef adminPlane fill:#701a75,stroke:#ec4899,stroke-width:2px,color:#fdf2f8;

    subgraph USER_PLANE ["1. Public Visitor Journey (http://localhost:5000/)"]
        Visitor(["👤 Website Visitor"]):::userPlane
        UI["Untouched evo-ai.html (Frontend)"]:::userPlane
        ChatAPI["Express API: POST /api/evo/chat"]:::userPlane
        
        Visitor -->|"Opens website & types message"| UI
        UI -->|"Sends { message, visitorId, history }"| ChatAPI
    end

    subgraph GUARDRAIL_PLANE ["2. Multi-Lingual Moderation & Safety Guardrail"]
        ModCheck{"Is message abusive, cussing, or vulgar?"}:::guardrail
        EnforceBoundary["Firm, Dignified Boundary Notice\n(English or Hindi/Hinglish)"]:::guardrail
        
        ChatAPI --> ModCheck
        ModCheck -->|"YES (Abusive / Profane / Trolling)"| EnforceBoundary
        EnforceBoundary -->|"Immediate Response (Zero Token Waste)"| UI
    end

    subgraph AI_PLANE ["3. Conversational AI Engine"]
        ModCheck -->|"NO (Clean / Legitimate)"| CheckGemini{"Gemini API Key\nConfigured & Active?"}:::aiEngine
        GeminiCall["Google Gemini 2.5 Flash\n(Structured JSON Output)"]:::aiEngine
        FallbackCall["Intelligent Concierge Fallback Engine\n(Contextual & Resilient)"]:::aiEngine
        
        CheckGemini -->|"Valid Key"| GeminiCall
        CheckGemini -->|"Offline / Invalid / Rate Limit"| FallbackCall
        GeminiCall -.->|"On API Error"| FallbackCall
    end

    subgraph DATA_PLANE ["4. Lead Extraction & MongoDB Atlas Database"]
        Scorer["Lead Scorer & Profile Extractor\n- Name, Email, WhatsApp, Company\n- Intent & Requirements\n- Lead Score (0 - 100) & Status"]:::dbPlane
        Mongo[("MongoDB Atlas Database\n(Collection: evoleads)")]:::dbPlane
        
        GeminiCall --> Scorer
        FallbackCall --> Scorer
        Scorer -->|"Upserts Visitor Record &\nAppends Conversation Log"| Mongo
        Scorer -->|"Returns conversational reply"| UI
    end

    subgraph ADMIN_PLANE ["5. Secure Admin Operations (http://localhost:5000/admin)"]
        Admin(["🛡️ Business Administrator"]):::adminPlane
        AdminLogin["Admin Login Page\n(/admin/login)"]:::adminPlane
        JWTIssue["Auth Controller: Verify Email & Password\nIssue Signed JWT Token"]:::adminPlane
        Dashboard["React Admin Dashboard\n(/admin)"]:::adminPlane
        
        Admin -->|"Navigates to /admin/login"| AdminLogin
        AdminLogin -->|"POST /api/evo/admin/login"| JWTIssue
        JWTIssue -->|"Bearer Token stored in localStorage"| Dashboard
        
        Dashboard -->|"GET /api/evo/admin/stats (JWT)"| Mongo
        Dashboard -->|"GET /api/evo/admin/leads (JWT)"| Mongo
        Dashboard -->|"GET /api/evo/admin/export/csv (JWT)"| Mongo
    end
```

---

## 2. Key Architectural Modules

| Component | Location | Role & Responsibility |
| :--- | :--- | :--- |
| **Public Frontend** | [evo-ai.html](file:///c:/Users/Anmollll/Desktop/evo_testing/evo-ai.html) | Served at `/` exactly as authored. 100% untouched visual design and visitor experience. |
| **Moderation Guardrail** | [moderation.js](file:///c:/Users/Anmollll/Desktop/evo_testing/GrandEvo_Evo_Backend/src/utils/moderation.js) | Intercepts profanity, cuss words, sexual remarks, and slurs (English & Hindi/Hinglish). Rebuffs politely with executive dignity. |
| **Conversational AI** | [aiService.js](file:///c:/Users/Anmollll/Desktop/evo_testing/GrandEvo_Evo_Backend/src/services/aiService.js) | Calls Google Gemini 2.5 Flash using `@google/genai` with strict JSON schema. |
| **Concierge Fallback** | [fallbackEngine.js](file:///c:/Users/Anmollll/Desktop/evo_testing/GrandEvo_Evo_Backend/src/utils/fallbackEngine.js) | Guarantees zero downtime if Gemini credentials or networks fluctuate. |
| **Lead Intelligence** | [leadScorer.js](file:///c:/Users/Anmollll/Desktop/evo_testing/GrandEvo_Evo_Backend/src/utils/leadScorer.js) | Auto-scores visitors 0–100, assigns status (`Hot`, `Warm`, `Exploring`), and detects appointment requests. |
| **MongoDB Atlas** | [Lead.js](file:///c:/Users/Anmollll/Desktop/evo_testing/GrandEvo_Evo_Backend/src/models/Lead.js) | Stores complete contact profiles and full turn-by-turn chat transcripts per visitor. |
| **Admin Portal** | [frontend/src/](file:///c:/Users/Anmollll/Desktop/evo_testing/frontend/src/) | React + Vite + Tailwind CSS admin app with JWT auth, KPI metrics, lead filters, transcript inspector, and CSV export. |
