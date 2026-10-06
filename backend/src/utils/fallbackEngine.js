/**
 * Intelligent Conversational Concierge Engine for GrandEvo Technologies.
 * Handles visitor intent classification, respectful boundaries, lead qualification,
 * and high-touch conversational responses across all business verticals.
 */

// Respectful boundary regex patterns (semantic detection of hostility, vulgarity, or abuse)
const HOSTILE_DISRESPECT_PATTERNS = [
    /\b(lawde|laude|lund|lodu|chutiya|chutiye|chutya|bhenchod|madarchod|bsdk|bhosdike|randi|gandu)\b/i,
    /\b(bhak|bhakk|sale|saale|kutta|kutte|harami|kamina|kamini|suar)\b/i,
    /\b(fuck|shit|bitch|bastard|asshole|cunt|dick|pussy|slut|whore|motherfucker)\b/i,
    /\b(stfu|shut up|idiot|moron|loser|dumb bot|stupid)\b/i
];

function isDisrespectfulOrAbusive(text) {
    if (!text) return false;
    for (const pattern of HOSTILE_DISRESPECT_PATTERNS) {
        if (pattern.test(text)) {
            return true;
        }
    }
    return false;
}

function generateConciergeFallback(message, profile = {}, history = []) {
    const text = (message || "").toLowerCase().trim();
    const updated = {
        reply: "",
        intent: profile.intent || "",
        interest: profile.interest || "",
        requirement: profile.requirement || "",
        company: profile.company || "",
        industry: profile.industry || "",
        name: profile.name || "",
        preferredContact: profile.preferredContact || "",
        appointmentRequested: Boolean(profile.appointmentRequested),
        shouldAskContact: false,
        leadSignal: profile.status || "Exploring"
    };

    // 1. Boundary & Conduct Check
    if (isDisrespectfulOrAbusive(text)) {
        const isHindi = /[\u0900-\u097F]|kya|ho|hai|sale|bhak|chutiya|bhai|yaar/i.test(text);
        updated.reply = isHindi
            ? "GrandEvo Technologies me hum aapse respectful aur professional communication expect karte hain. Inappropriate ya disrespectful language yahan bilkul acceptable nahi hai. Kripya shishtata aur maryada banaye rakhein. Agar aapke business se related koi genuine requirement ya query hai, toh kripya respectfully share karein — hum aapki zaroor madad karenge."
            : "I am committed to maintaining a professional and respectful dialogue. Inappropriate, offensive, or abusive language is not acceptable here. If you have legitimate business requirements or inquiries regarding GrandEvo's digital solutions, please communicate respectfully and I will be glad to assist you.";
        updated.intent = "Professional Conduct Notice";
        updated.leadSignal = "Exploring";
        updated.shouldAskContact = false;
        return updated;
    }

    // 2. Name & Company extraction
    const nameMatch = message.match(/(?:i am|my name is|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameMatch && !updated.name) {
        updated.name = nameMatch[1].trim();
    }

    const companyMatch = message.match(/(?:company is|work at|from)\s+([A-Za-z0-9\s&]+)/i);
    if (companyMatch && !updated.company) {
        updated.company = companyMatch[1].trim();
    }

    const hasContact = Boolean(profile.email || profile.whatsapp || updated.preferredContact);

    // 3. Domain Intent Matchers
    const isDigitalMarketing = /digital marketing|marketing|seo|social media|ads|ad campaign|google ads|meta ads|lead generation|grow business|traffic/i.test(text);
    const isWebsite = /website|web design|web development|landing page|web app|frontend|ui\/ux|portal/i.test(text);
    const isAppointment = /appointment|book|schedule|demo|call|consultation|meeting|speak with|talk to/i.test(text);
    const isPricing = /price|pricing|cost|quote|budget|how much|charges/i.test(text);
    const isAgentAI = /receptionist|voice agent|voice|calling|support agent|sales agent|chatbot|chat bot/i.test(text);
    const isAutomation = /automate|automation|workflow|process|repetitive|operations/i.test(text);
    const isCRM = /crm|lead|leads|pipeline|customer management/i.test(text);
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)[\s!.]*$/i.test(text);

    if (isDigitalMarketing) {
        updated.intent = "Digital Marketing & Growth";
        updated.interest = "Digital Marketing, SEO & Ads";
        updated.leadSignal = "Warm";
        updated.reply = "GrandEvo powers your digital growth by combining high-performance digital marketing with intelligent AI automation:\n\n• **AI-Optimized Lead Generation:** Convert ad traffic into qualified leads with interactive landing pages.\n• **Search Engine Optimization (SEO):** Long-term organic visibility to dominate your industry search results.\n• **Paid Campaign Strategy (Google & Meta Ads):** Targeted performance ads designed for maximum ROI.\n• **Automated Lead Follow-up:** Instantly connect incoming marketing leads to WhatsApp, email, or CRM.\n\nAre you looking to scale lead generation for an existing business, or launching a new marketing campaign?";
    } else if (isWebsite) {
        updated.intent = "Web Development & Design";
        updated.interest = "Smart Websites & Web Apps";
        updated.leadSignal = "Warm";
        updated.reply = "At GrandEvo Technologies, we turn standard websites into intelligent business engines. Our web development solutions include:\n\n• **Modern Responsive Websites:** Lightning-fast, mobile-optimized designs built with high aesthetic standards.\n• **AI Concierge Integration:** Embedded 24/7 AI assistants that answer questions and capture client briefs.\n• **Custom Web Applications & Portals:** Scalable full-stack systems tailored to your internal workflows.\n\nDo you need a brand-new website, or are you looking to redesign and add AI capabilities to your current site?";
    } else if (isAppointment) {
        updated.appointmentRequested = true;
        updated.intent = "Schedule consultation / demo";
        updated.leadSignal = "Hot";
        if (!hasContact) {
            updated.shouldAskContact = true;
            updated.reply = "I would be glad to arrange a strategic consultation with the GrandEvo advisory team for you. Could you share your email or WhatsApp number so we can confirm the meeting slot and send the calendar invite?";
        } else {
            updated.reply = `Thank you${updated.name ? ", " + updated.name : ""}! We have registered your consultation request. A GrandEvo solution specialist will reach out shortly to confirm the exact time. Which specific project or goal should we focus on?`;
        }
    } else if (isPricing) {
        updated.intent = "Pricing inquiry";
        updated.leadSignal = "Warm";
        updated.reply = "GrandEvo tailors investments based on project scope, complexity, and operational integration. Because every business has unique workflows — whether you need a dedicated 24/7 AI Receptionist, custom web platform, or full CRM automation — we provide custom transparent quotes with rapid ROI. What specific solution or workflow are you looking to implement?";
    } else if (isAgentAI) {
        updated.intent = "AI Agents & Receptionist";
        updated.interest = "24/7 AI Voice & Chat Receptionist";
        updated.leadSignal = "Warm";
        updated.reply = "Our AI Agents are engineered so that 'Your Business Never Sleeps':\n\n• **24/7 AI Receptionist:** Answers customer inquiries, handles bookings, and provides instant support.\n• **AI Voice Agents:** Conducts natural inbound & outbound phone calls with human-like latency.\n• **AI Sales Qualifier:** Engages prospective clients, answers product questions, and schedules meetings.\n\nWould you like to deploy an AI voice agent for calls, or an interactive assistant for your website?";
    } else if (isAutomation || isCRM) {
        updated.intent = isAutomation ? "Workflow Automation" : "CRM & Lead Systems";
        updated.interest = updated.intent;
        updated.leadSignal = "Warm";
        updated.reply = "GrandEvo eliminates repetitive bottlenecks through custom business automation:\n\n• **End-to-End Workflow Automation:** Automate notifications, task assignments, and multi-app data handoffs.\n• **AI CRM Integration:** Centralize and qualify leads automatically into your database in real time.\n• **Custom Dashboards:** Monitor team KPIs, client communications, and conversion metrics in one place.\n\nWhat manual tasks or systems take up the most time in your business right now?";
    } else if (hasContact) {
        updated.leadSignal = "Warm";
        updated.reply = `Thank you for sharing your contact details${updated.name ? ", " + updated.name : ""}! Our team has updated your profile. How else can GrandEvo assist your business goals today?`;
    } else if (isGreeting) {
        updated.reply = "Hello! I am EVO, the AI Business Concierge at GrandEvo Technologies. 'Your Business Never Sleeps' — from custom AI receptionists and voice agents to high-performance websites and digital marketing automation, I'm here to assist you. What can I help you explore today?";
    } else {
        updated.reply = "GrandEvo Technologies creates intelligent digital systems for modern businesses — including custom AI voice agents, high-performing websites, digital marketing automation, and smart CRM systems. Could you share what type of business you run, or what specific requirement you'd like to solve?";
    }

    return updated;
}

module.exports = {
    generateConciergeFallback
};
