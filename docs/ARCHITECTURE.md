# Arya — Technical Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE (Public)                             │
│  Plans: Sales | HR | Chatbot | SMM | Receptionist | Bundles              │
│  Stripe Checkout → Webhook → Create tenant + subscription                 │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD (Authenticated)                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ONBOARDING CHAT (Gemini)                                         │   │
│  │  • Gathers company/product info → Knowledge Base                  │   │
│  │  • Assigns tasks per Arya role                                    │   │
│  │  • Voice, upload, full chat features                              │   │
│  │  • Doubles as daily setup/training chat                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                      │
│  │ Sales Agent  │ │ HR Manager   │ │ (Future)     │                      │
│  │ (active)     │ │ (active)    │ │ Chatbot etc  │                      │
│  └──────────────┘ └──────────────┘ └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Knowledge    │  │ Twilio       │  │ Telegram     │
            │ Base (RAG)   │  │ Voice/WhatsApp│  │ Bot          │
            └──────────────┘  └──────────────┘  └──────────────┘
```

## Data Model (Core)

```
tenants
  id, stripe_customer_id, subscription_status, plan_ids[]

profiles (extends auth.users)
  id, tenant_id, email, full_name, role

knowledge_bases
  id, tenant_id, name, created_at

knowledge_chunks
  id, knowledge_base_id, content, embedding?, source, metadata

aryas (per-tenant config)
  id, tenant_id, role (sales|hr|chatbot|smm|receptionist), config JSONB

conversations
  id, tenant_id, user_id, arya_role?, messages JSONB

tasks (from onboarding)
  id, tenant_id, arya_role, description, status
```

## Security Layers

| Layer | Implementation |
|-------|----------------|
| **Auth** | Supabase Auth, RLS per tenant_id |
| **Input sanitization** | Zod schemas, length limits, blocklist |
| **Prompt injection** | System prompt guardrails, output validation |
| **Confidential data** | Never in client; server-only prompts |
| **API** | Rate limiting, auth on all routes |
| **Secrets** | Env vars, no hardcoding |

## API Surface

| Route | Purpose |
|-------|---------|
| `POST /api/chat` | Dashboard chat (onboarding + daily) |
| `POST /api/knowledge/ingest` | Add to knowledge base from chat |
| `POST /api/arya/sales` | Sales Agent actions |
| `POST /api/arya/hr` | HR Manager actions |
| `POST /api/twilio/voice` | Inbound voice webhook |
| `POST /api/twilio/whatsapp` | WhatsApp webhook |
| `POST /api/telegram` | Telegram webhook |
| `POST /api/stripe/webhook` | Subscription events |
| `GET /api/twilio/voice/outbound` | TwiML for AI sales calls |

## Geo / Territory Setup (Sales)

**Provider routing by region:**

| Region | Provider | Use case |
|--------|----------|----------|
| Eurasia, Middle East | **2GIS** | Geocoding, places search, business data |
| Rest of world | **Google Maps** | Geocoding, Places API |

**2GIS coverage:** Russia, Kazakhstan, UAE, Uzbekistan, Cyprus, others in Eurasia & MENA.

**Google Maps:** Americas, Europe (outside 2GIS), Asia-Pacific, Africa.

**Data model:**
```
target_geo_areas (per tenant)
  id, tenant_id, name, region_type (2gis | google)
  bounds (polygon/bbox), country_codes[], cities[]
  radius_km (optional), center_lat, center_lng
```

**Env vars:** `TWO_GIS_API_KEY`, `GOOGLE_MAPS_API_KEY`

## Next Build: Onboarding Chat

1. **Chat UI** in dashboard (replace or augment current layout)
2. **Gemini integration** with system prompt for onboarding
3. **Structured extraction** from conversation → knowledge_base
4. **Task creation** based on selected Arya roles
5. **Voice** (Web Speech API or Twilio client)
6. **File upload** → parse → add to knowledge base
