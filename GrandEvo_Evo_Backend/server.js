require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");


/* =========================================================
   APP
========================================================= */

const app = express();

const PORT =
    process.env.PORT || 5000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: true,
        credentials: false
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =========================================================
   GEMINI
========================================================= */

if (!process.env.GEMINI_API_KEY) {

    console.error(
        "❌ GEMINI_API_KEY is missing from .env"
    );

} else {

    console.log(
        "✓ Gemini AI configured"
    );

}

const gemini =
    new GoogleGenAI({
        apiKey:
            process.env.GEMINI_API_KEY
    });

const GEMINI_MODEL =
    process.env.GEMINI_MODEL ||
    "gemini-3.8-flash";


/* =========================================================
   MONGODB
========================================================= */

mongoose
    .connect(
        process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/grandevo_evo"
    )
    .then(() => {

        console.log(
            "✓ Evo MongoDB connected"
        );

    })
    .catch(error => {

        console.error(
            "MongoDB connection error:",
            error.message
        );

    });


/* =========================================================
   EVO LEAD SCHEMA
========================================================= */

const evoLeadSchema =
    new mongoose.Schema(

        {

            visitorId: {
                type: String,
                required: true,
                unique: true,
                index: true
            },


            name: {
                type: String,
                default: ""
            },


            company: {
                type: String,
                default: ""
            },


            industry: {
                type: String,
                default: ""
            },


            email: {
                type: String,
                default: ""
            },


            whatsapp: {
                type: String,
                default: ""
            },


            intent: {
                type: String,
                default: ""
            },


            interest: {
                type: String,
                default: ""
            },


            requirement: {
                type: String,
                default: ""
            },


            preferredContact: {
                type: String,
                default: ""
            },


            appointmentRequested: {
                type: Boolean,
                default: false
            },


            leadScore: {
                type: Number,
                default: 0
            },


            leadStatus: {
                type: String,

                enum: [
                    "Exploring",
                    "Warm",
                    "Hot"
                ],

                default: "Exploring"
            },


            source: {
                type: String,
                default: "Evo AI Assistant"
            },


            page: {
                type: String,
                default: ""
            },


            conversation: [

                {

                    role: {
                        type: String
                    },

                    content: {
                        type: String
                    },

                    timestamp: {
                        type: Date,
                        default: Date.now
                    }

                }

            ],


            createdAt: {
                type: Date,
                default: Date.now
            },


            lastInteraction: {
                type: Date,
                default: Date.now
            }

        }

    );


const EvoLead =
    mongoose.model(
        "EvoLead",
        evoLeadSchema
    );


/* =========================================================
   GRANDEVO KNOWLEDGE
========================================================= */

const GRAND_EVO_KNOWLEDGE = `

GRANDEVO

GrandEvo Technologies creates intelligent digital systems
for modern businesses.

GrandEvo combines AI, automation, websites, customer
experience, CRM, voice technology and business workflows
to create connected business systems.

GrandEvo's core AI capabilities are:

1. AI Receptionist

An always-on AI assistant that can handle first-level
customer conversations, enquiries and basic support.

2. AI Voice Agent

AI-powered voice conversations for inbound and outbound
business calls and workflows.

3. AI Customer Support

AI systems that answer customer questions using approved
business information and can escalate conversations
when human assistance is required.

4. AI Sales Agent

AI that can help qualify prospects, answer questions,
identify buying intent and move opportunities toward
the next sales step.

5. AI Appointment Booking

AI-assisted scheduling, availability handling,
confirmations and follow-up workflows.

6. Business Automation

Automation of repetitive workflows, notifications,
approvals, operational tasks and business processes.

7. AI CRM / Lead Management

Capture, organize, qualify and manage leads and
customer information.

8. Website + AI Integration

Turn a website into an intelligent business interface
connected to AI, CRM and automation.

9. AI Documentation / Official Agent

Build an AI knowledge layer from approved business
documents, policies, FAQs and official information.

GrandEvo positioning:

"Your Business Never Sleeps."

GrandEvo solution philosophy:

"Build Business. Create Impact."

GrandEvo should not present every business with the same
solution. The correct system depends on the visitor's
business, problem, workflow and desired outcome.

IMPORTANT:

Never invent GrandEvo pricing, clients, employees,
certifications, addresses, partnerships, statistics,
guarantees or capabilities that are not contained in
this knowledge.

`;


/* =========================================================
   EVO SYSTEM INSTRUCTIONS
========================================================= */

const EVO_INSTRUCTIONS = `

You are EVO, the AI business assistant of GrandEvo Technologies.

You are NOT a simple FAQ chatbot.

Your job is to act as an intelligent business concierge.

Your priorities are:

1. Understand what the visitor actually means.
2. Answer their question first.
3. Remember useful information from the conversation.
4. Naturally identify their intent.
5. Understand their business problem.
6. Recommend relevant GrandEvo capabilities.
7. Qualify genuine business opportunities.
8. Ask for contact information only when it makes sense.
9. Never behave like a repetitive lead form.
10. Never ask the same question twice if the answer is already known.
11. Keep the conversation natural.
12. Use previous conversation context.
13. Be concise but useful.
14. If the visitor asks something unrelated, answer if it is safe and useful.
15. If something is specifically about GrandEvo and you do not know it, say so rather than inventing it.

IMPORTANT CONVERSATION RULE:

ANSWER → UNDERSTAND → GUIDE → QUALIFY → ACT

Do NOT behave like:

QUALIFY → QUALIFY → QUALIFY.

A visitor who asks:

"What does GrandEvo do?"

must receive a useful explanation before being asked for contact information.

A visitor who says:

"I just want to look around"

should NOT immediately be forced to provide email or phone.

A visitor who clearly has a business requirement can be qualified more actively.

CONTACT COLLECTION:

Ask for name naturally when appropriate.

Ask for company/business when a business requirement becomes clear.

Ask for email or WhatsApp when:

- the visitor wants follow-up,
- requests a demo,
- requests an appointment,
- wants information sent to them,
- has a clear business requirement,
- or otherwise indicates meaningful intent.

Never demand contact information.

LEAD SIGNALS:

Exploring:
Curious visitor with low commitment.

Warm:
Visitor has identified a service, problem or business interest.

Hot:
Visitor has a concrete business requirement, requests pricing,
demo, appointment, implementation discussion or direct follow-up.

If someone gives contact information voluntarily, treat it as useful lead data.

NATURAL LANGUAGE:

Understand variations such as:

"What does GrandEvo do?"
"What is Grandevo?"
"tell me about Grandevo"
"what services do you provide?"
"what can you guys build?"
"can you automate my business?"
"I need a chatbot"
"we are losing leads"
"customers keep asking the same questions"

These are examples only.

Do not require exact phrases.

RECOMMENDATION:

Do not blindly list all nine services.

Recommend the capabilities that match the visitor's actual problem.

Example:

Visitor:

"Customers keep asking us the same questions."

Possible response:

"That sounds like a strong use case for AI Customer Support.

GrandEvo could create a system that answers common questions
automatically while passing more complex conversations to your team.

What kind of business are you running?"

Remember:

You are an AI assistant.

Do not falsely claim to be human.

Never claim that you completed an appointment, sent a WhatsApp
message, sent an email or contacted a human unless the backend
actually confirms that action.

Never request passwords, OTPs, card details, CVV, API keys or
other secrets.

GRANDEVO KNOWLEDGE:

${GRAND_EVO_KNOWLEDGE}

`;


/* =========================================================
   HELPERS
========================================================= */

function cleanString(
    value,
    max = 4000
) {

    if (
        typeof value !== "string"
    ) {

        return "";

    }

    return value
        .trim()
        .slice(0, max);

}


/* =========================================================
   LEAD STATUS
========================================================= */

function calculateLeadStatus(
    score
) {

    if (
        score >= 70
    ) {

        return "Hot";

    }

    if (
        score >= 40
    ) {

        return "Warm";

    }

    return "Exploring";

}


/* =========================================================
   LEAD SCORING
========================================================= */

function calculateScore(
    profile,
    message
) {

    let score = 0;

    const text =
        String(message || "")
            .toLowerCase();


    if (
        profile.name
    ) {

        score += 10;

    }


    if (
        profile.company
    ) {

        score += 10;

    }


    if (
        profile.industry
    ) {

        score += 5;

    }


    if (
        profile.email
    ) {

        score += 15;

    }


    if (
        profile.whatsapp
    ) {

        score += 15;

    }


    if (
        profile.requirement
    ) {

        score += 25;

    }


    if (
        profile.interest
    ) {

        score += 10;

    }


    if (
        profile.appointmentRequested
    ) {

        score += 30;

    }


    const highIntentWords = [

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


    highIntentWords.forEach(
        word => {

            if (
                text.includes(word)
            ) {

                score += 5;

            }

        }
    );


    return Math.min(
        score,
        100
    );

}


/* =========================================================
   EXTRACT BASIC CONTACT DATA
========================================================= */

function extractContactData(
    profile,
    message
) {

    const updated = {
        ...(profile || {})
    };


    const emailMatch =
        message.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    if (
        emailMatch
    ) {

        updated.email =
            emailMatch[0];

    }


    const phoneMatch =
        message.match(
            /(?:\+?\d[\d\s\-()]{8,}\d)/
        );


    if (
        phoneMatch &&
        !updated.whatsapp
    ) {

        updated.whatsapp =
            phoneMatch[0].trim();

    }


    return updated;

}


/* =========================================================
   SAVE / UPDATE LEAD
========================================================= */

async function saveLead(
    visitorId,
    profile,
    message,
    reply,
    page,
    source
) {

    let lead =
        await EvoLead.findOne({
            visitorId
        });


    if (
        !lead
    ) {

        lead =
            new EvoLead({

                visitorId,

                source:
                    source ||
                    "Evo AI Assistant",

                page:
                    page ||
                    profile.page ||
                    "",

                conversation: []

            });

    }


    const safeProfile =
        profile || {};


    if (
        safeProfile.name
    ) {

        lead.name =
            safeProfile.name;

    }


    if (
        safeProfile.company
    ) {

        lead.company =
            safeProfile.company;

    }


    if (
        safeProfile.industry
    ) {

        lead.industry =
            safeProfile.industry;

    }


    if (
        safeProfile.email
    ) {

        lead.email =
            safeProfile.email;

    }


    if (
        safeProfile.whatsapp
    ) {

        lead.whatsapp =
            safeProfile.whatsapp;

    }


    if (
        safeProfile.intent
    ) {

        lead.intent =
            safeProfile.intent;

    }


    if (
        safeProfile.interest
    ) {

        lead.interest =
            safeProfile.interest;

    }


    if (
        safeProfile.requirement
    ) {

        lead.requirement =
            safeProfile.requirement;

    }


    if (
        safeProfile.preferredContact
    ) {

        lead.preferredContact =
            safeProfile.preferredContact;

    }


    if (
        safeProfile.appointmentRequested !==
        undefined
    ) {

        lead.appointmentRequested =
            Boolean(
                safeProfile.appointmentRequested
            );

    }


    if (
        page
    ) {

        lead.page =
            page;

    }


    if (
        source
    ) {

        lead.source =
            source;

    }


    const score =
        calculateScore(

            {
                name:
                    lead.name,

                company:
                    lead.company,

                industry:
                    lead.industry,

                email:
                    lead.email,

                whatsapp:
                    lead.whatsapp,

                requirement:
                    lead.requirement,

                interest:
                    lead.interest,

                appointmentRequested:
                    lead.appointmentRequested
            },

            message
        );


    lead.leadScore =
        score;


    lead.leadStatus =
        calculateLeadStatus(
            score
        );


    lead.conversation.push(

        {
            role: "user",

            content:
                message,

            timestamp:
                new Date()
        },

        {
            role: "assistant",

            content:
                reply,

            timestamp:
                new Date()
        }

    );


    if (
        lead.conversation.length >
        80
    ) {

        lead.conversation =
            lead.conversation.slice(
                -80
            );

    }


    lead.lastInteraction =
        new Date();


    await lead.save();


    return lead;

}


/* =========================================================
   HEALTH
========================================================= */

app.get(
    "/api/evo/health",
    async (req, res) => {

        res.json({

            success: true,

            service:
                "GrandEvo Evo AI",

            status:
                "online",

            mongodb:
                mongoose.connection.readyState === 1
                    ? "connected"
                    : "disconnected",

            gemini:
                process.env.GEMINI_API_KEY
                    ? "configured"
                    : "missing",

            model:
                GEMINI_MODEL,

            time:
                new Date().toISOString()

        });

    }
);


/* =========================================================
   EVO CHAT
========================================================= */

app.post(
    "/api/evo/chat",
    async (req, res) => {

        try {

            const body =
                req.body || {};


            /*
             * Accept both names so the existing
             * Evo frontend remains compatible.
             */

            const visitorId =
                cleanString(
                    body.visitorId,
                    100
                );


            const cleanMessage =
                cleanString(
                    body.message,
                    4000
                );


            const incomingProfile =
                body.profile ||
                body.lead ||
                {};


            const history =
                Array.isArray(
                    body.history
                )
                    ? body.history
                    : [];


            const page =
                cleanString(
                    body.page,
                    300
                );


            const source =
                cleanString(
                    body.source,
                    300
                ) ||
                "Evo AI Assistant";


            if (
                !cleanMessage ||
                !visitorId
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Visitor ID and message are required."

                    });

            }


            /*
             * Limit conversation history.
             */

            const safeHistory =
                history

                    .slice(-16)

                    .map(
                        item => {

                            if (
                                !item ||
                                typeof item !==
                                "object"
                            ) {

                                return null;

                            }


                            const role =
                                item.role ===
                                "assistant"
                                    ? "model"
                                    : "user";


                            const content =
                                cleanString(
                                    item.content,
                                    3000
                                );


                            if (
                                !content
                            ) {

                                return null;

                            }


                            return {

                                role,

                                parts: [
                                    {
                                        text:
                                            content
                                    }
                                ]

                            };

                        }
                    )

                    .filter(
                        item =>
                            item !== null
                    );


            /*
             * Extract email / phone before
             * sending the message to Gemini.
             */

            const updatedProfile =
                extractContactData(
                    incomingProfile,
                    cleanMessage
                );


            /*
             * Current visitor context.
             */

            const profileContext = `

CURRENT VISITOR PROFILE:

Name:
${updatedProfile.name || "Unknown"}

Company:
${updatedProfile.company || "Unknown"}

Industry:
${updatedProfile.industry || "Unknown"}

Email:
${updatedProfile.email || "Unknown"}

WhatsApp:
${updatedProfile.whatsapp || "Unknown"}

Intent:
${updatedProfile.intent || "Unknown"}

Interest:
${updatedProfile.interest || "Unknown"}

Requirement:
${updatedProfile.requirement || "Unknown"}

Preferred contact:
${updatedProfile.preferredContact || "Unknown"}

Appointment requested:
${updatedProfile.appointmentRequested ? "Yes" : "No"}

Current page:
${page || "Unknown"}

Source:
${source || "Evo AI Assistant"}

Lead status:
${updatedProfile.status || "Exploring"}

`;


            /*
             * Build the complete Gemini instruction.
             */

            const finalInstructions =
                EVO_INSTRUCTIONS +
                "\n" +
                profileContext +
                `

IMPORTANT OUTPUT RULE:

Return ONLY valid JSON matching the schema provided.

The "reply" field must contain the natural conversational
answer that Evo should display to the visitor.

The other fields should contain your understanding of the
visitor.

Do not put JSON inside the reply field.

If information is unknown, use an empty string.

shouldAskContact should be true only when asking for contact
information naturally makes sense based on the conversation.

leadSignal must be exactly one of:
Exploring
Warm
Hot
`;


            /*
             * Build Gemini contents.
             */

            const contents = [

                ...safeHistory,

                {

                    role: "user",

                    parts: [
                        {
                            text:
                                cleanMessage
                        }
                    ]

                }

            ];


            /*
             * Gemini structured response schema.
             */

            const responseSchema = {

                type: "object",

                additionalProperties: false,

                properties: {

                    reply: {
                        type: "string"
                    },

                    intent: {
                        type: "string"
                    },

                    interest: {
                        type: "string"
                    },

                    requirement: {
                        type: "string"
                    },

                    company: {
                        type: "string"
                    },

                    industry: {
                        type: "string"
                    },

                    name: {
                        type: "string"
                    },

                    preferredContact: {
                        type: "string"
                    },

                    appointmentRequested: {
                        type: "boolean"
                    },

                    shouldAskContact: {
                        type: "boolean"
                    },

                    leadSignal: {

                        type: "string",

                        enum: [
                            "Exploring",
                            "Warm",
                            "Hot"
                        ]

                    }

                },

                required: [

                    "reply",
                    "intent",
                    "interest",
                    "requirement",
                    "company",
                    "industry",
                    "name",
                    "preferredContact",
                    "appointmentRequested",
                    "shouldAskContact",
                    "leadSignal"

                ]

            };


            /*
             * SEND TO GEMINI
             */

            console.log(
                `→ Evo message received: ${cleanMessage}`
            );


            const response =
                await gemini.models.generateContent({

                    model:
                        GEMINI_MODEL,

                    contents:

                        contents,

                    config: {

                        systemInstruction:
                            finalInstructions,

                        temperature:
                            0.7,

                        maxOutputTokens:
                            700,

                        responseMimeType:
                            "application/json",

                        responseSchema:
                            responseSchema

                    }

                });


            /*
             * Read Gemini response.
             */

            const rawText =
                response.text ||
                "";


            if (
                !rawText
            ) {

                throw new Error(
                    "Gemini returned an empty response."
                );

            }


            console.log(
                "✓ Gemini response received"
            );


            /*
             * Parse structured JSON.
             */

            let aiData;


            try {

                aiData =
                    JSON.parse(
                        rawText
                    );

            }

            catch (error) {

                console.error(
                    "Evo Gemini JSON parse error:",
                    error.message
                );


                /*
                 * Safe fallback if Gemini
                 * somehow returns plain text.
                 */

                aiData = {

                    reply:
                        rawText,

                    intent:
                        "",

                    interest:
                        "",

                    requirement:
                        "",

                    company:
                        "",

                    industry:
                        "",

                    name:
                        "",

                    preferredContact:
                        "",

                    appointmentRequested:
                        false,

                    shouldAskContact:
                        false,

                    leadSignal:
                        "Exploring"

                };

            }


            /*
             * Merge AI understanding
             * into visitor profile.
             */

            const finalProfile = {

                ...updatedProfile,


                name:
                    aiData.name ||
                    updatedProfile.name ||
                    "",


                company:
                    aiData.company ||
                    updatedProfile.company ||
                    "",


                industry:
                    aiData.industry ||
                    updatedProfile.industry ||
                    "",


                intent:
                    aiData.intent ||
                    updatedProfile.intent ||
                    "",


                interest:
                    aiData.interest ||
                    updatedProfile.interest ||
                    "",


                requirement:
                    aiData.requirement ||
                    updatedProfile.requirement ||
                    "",


                preferredContact:
                    aiData.preferredContact ||
                    updatedProfile.preferredContact ||
                    "",


                appointmentRequested:
                    aiData.appointmentRequested ||
                    updatedProfile.appointmentRequested ||
                    false

            };


            /*
             * Save lead + conversation
             * in MongoDB.
             */

            const lead =
                await saveLead(

                    visitorId,

                    finalProfile,

                    cleanMessage,

                    aiData.reply,

                    page,

                    source

                );


            /*
             * Return response to browser.
             */

            return res.json({

                success: true,


                /*
                 * Existing frontend compatibility.
                 */

                reply:
                    aiData.reply,


                /*
                 * New frontend compatibility.
                 */

                answer:
                    aiData.reply,


                profile: {

                    visitorId:
                        visitorId,

                    name:
                        lead.name,

                    company:
                        lead.company,

                    industry:
                        lead.industry,

                    email:
                        lead.email,

                    whatsapp:
                        lead.whatsapp,

                    intent:
                        lead.intent,

                    interest:
                        lead.interest,

                    requirement:
                        lead.requirement,

                    preferredContact:
                        lead.preferredContact,

                    appointmentRequested:
                        lead.appointmentRequested

                },


                lead: {

                    score:
                        lead.leadScore,

                    status:
                        lead.leadStatus

                }

            });


        }

        catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "EVO CHAT ERROR:"
            );

            console.error(
                error
            );

            console.error(
                "========================================"
            );


            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Evo is temporarily unavailable. Please try again."

                });

        }

    }

);


/* =========================================================
   START
========================================================= */

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "========================================"
        );

        console.log(
            "       GRANDEVO EVO AI BACKEND"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Evo API: http://localhost:${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/api/evo/health`
        );

        console.log(
            `Gemini Model: ${GEMINI_MODEL}`
        );

        console.log(
            "========================================"
        );

        console.log("");

    }
);