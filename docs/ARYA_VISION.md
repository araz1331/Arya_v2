# Arya — AI Employee Platform for SMEs

## Vision

**Arya** is a multilingual AI employee platform. SMEs subscribe to one or more Arya roles. Each Arya is trainable, connected where logical, and operates with enterprise-grade security.

---

## 5 Arya Roles (All Multilingual)

| Role | Inbound | Outbound | Channels |
|------|---------|----------|----------|
| **Receptionist** | ✓ Phone calls | — | Twilio (voice), call-back flows |
| **Chatbot** | ✓ Chat | — | Site widget, social links, WhatsApp, Telegram |
| **Sales Agent** | ✓ (intent) | ✓ Hunt & close | Chat, voice, email, LinkedIn |
| **SMM Manager** | — | ✓ | Social platforms |
| **HR Manager** | ✓ Queries | ✓ Tasks | Chat, voice, integrations |

**MVP:** Sales Agent + HR Manager

---

## Core Concepts

### 1. Knowledge Base (Shared)

- **Per-tenant** (per subscriber)
- Populated via onboarding chat
- Shared by: Voice, Chat, Sales (where logically required)
- Content: company info, products, FAQs, tone, scripts
- Stored securely, encrypted at rest

### 2. Onboarding Chat

- **Gemini-powered** conversational onboarding
- Goals:
  - Collect maximum info for knowledge base
  - Assign tasks based on selected Arya roles
  - Quick and intuitive
- Also serves as **main dashboard chat** with:
  - Voice input/output
  - File upload
  - Full AI chat features
- Single entry point: setup + daily use

### 3. Connected Aryas (Bundled)

- Shared knowledge base
- Context handoffs (e.g. Chat → Sales when buying intent)
- Inbound (chat, voice) ↔ Outbound (sales, SMM)
- Connections only where logically required

### 4. Self-Sale

- Arya sells Arya subscriptions
- Via chat (always)
- Via voice when intent detected
- Sales Arya hunts and closes deals (including Arya plans)

---

## Channels & Integrations

| Channel | Status | Notes |
|---------|--------|-------|
| **Twilio** | ✓ | Voice, SMS, WhatsApp Business API |
| **Telegram** | ✓ | Bot API |
| **Site widget** | Planned | Embeddable chat |
| **Social links** | Planned | Smart links |
| **SIP/PBX** | Future | Scale path |

## Reporting

- **arya_events** table: All Arya activities (sales, HR, chatbot, receptionist, SMM)
- Event types: sales_email_sent, sales_call_made, hr_task_created, chat_message, etc.
- Dashboard: `/reports` — summary cards, event list, filters by role and date

## Geo / Territory (Sales)

| Region | Provider | Use |
|--------|----------|-----|
| **Eurasia, Middle East** | 2GIS | Geocoding, places search |
| **Rest of world** | Google Maps | Geocoding, Places API |

Target geo areas configurable per tenant. Used for sales territory setup, prospect filtering.

---

## Security (Core)

- **Confidentiality:** Product info, prompts, knowledge base protected
- **Prompt injection:** Input sanitization, output validation, guardrails
- **Command injection:** Server-side validation, no raw execution
- **Data isolation:** Per-tenant, no cross-tenant leakage
- **Encryption:** At rest, in transit
- **Compliance:** Audit trails, access control
- **Server-side:** All AI logic server-side; no client-side prompt exposure

---

## Tech Stack (Proposed)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | Next.js 15 | App router, RSC, API routes |
| **Auth & DB** | Supabase | Auth, Postgres, RLS, Storage |
| **Payments** | Stripe | Subscriptions, plans, webhooks |
| **AI** | Gemini | Multimodal (voice, upload), thinking, embeddings |
| **Voice/SMS** | Twilio | Calls, WhatsApp, SMS |
| **Telegram** | Telegram Bot API | Direct integration |
| **Knowledge Base** | Supabase + Gemini embeddings | RAG, vector search (when needed) |
| **Real-time** | Supabase Realtime / WebSockets | Chat, live updates |

**Alternatives considered:**
- **Vapi/Bland** for voice: Could simplify Twilio voice AI; evaluate if Twilio + Gemini is sufficient
- **Pinecone/Weaviate** for vectors: Use when knowledge base scales; Supabase pgvector possible

---

## Product Flow

```
Landing Page (subscription plans)
    ↓
Checkout (Stripe)
    ↓
Dashboard (onboarding chat)
    ↓
Knowledge base populated + tasks assigned
    ↓
Arya(s) configured and active
    ↓
Ongoing: chat for setup, training, support
```

---

## Phased Implementation

### Phase 1: Foundation (Current → Next)
- [x] Landing structure, Stripe subscription
- [x] Dashboard shell
- [x] Sales Agent (universal)
- [ ] Onboarding chat (Gemini) — primary focus
- [ ] Knowledge base schema + ingestion from chat

### Phase 2: HR + Knowledge
- [ ] HR Manager role (basic)
- [ ] Knowledge base RAG for Sales + HR
- [ ] Task assignment from onboarding

### Phase 3: Channels
- [ ] Site widget
- [ ] Twilio voice (call-back flows)
- [ ] WhatsApp (Twilio)
- [ ] Telegram bot

### Phase 4: Connected + Self-Sale
- [ ] Shared context across bundled Aryas
- [ ] Intent detection → Sales handoff
- [ ] Self-sale flows (chat + voice)
- [ ] Sales hunt for Arya subscriptions

### Phase 5: SMM + Scale
- [ ] SMM Manager role
- [ ] Receptionist (full voice)
- [ ] SIP/PBX path
- [ ] Advanced security hardening

---

## Open Questions

1. **Voice in onboarding chat:** Web Speech API or Twilio client?
2. **Knowledge base structure:** Free-form Q&A vs structured schema?
3. **Task assignment:** Automated from chat or human-in-loop?
4. **Bundled pricing:** Fixed bundles or à la carte + bundle discount?

---

*Last updated: Feb 2025*
