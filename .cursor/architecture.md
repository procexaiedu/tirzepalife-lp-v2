# Architecture Guide

This document explains the system architecture, design patterns, and data flows in TirzepaLife.

## System Overview

TirzepaLife is a hybrid lead generation system that combines:
- Static landing page (SEO-optimized)
- Interactive chat interface (AI-powered triage)
- Traditional web forms (fallback/preference)
- Automation workflows (n8n orchestration)
- Database persistence (lead management)

## Architecture Patterns

### 1. Next.js App Router Pattern

```
app/
├── layout.tsx          # Root layout (fonts, providers, metadata)
├── page.tsx            # Home page (server component composition)
├── globals.css         # Global styles + Tailwind
├── privacidade/        # Static route (privacy policy)
├── termos-de-uso/      # Static route (terms of service)
└── api/
    └── leads/
        └── route.ts    # API route handler (POST)
```

**Key Principles**:
- Server Components by default (better performance)
- Client Components only when needed (`"use client"`)
- API routes for server-side operations
- File-based routing

### 2. Component Composition

```typescript
// Page composition (server component)
export default function Home() {
  return (
    <>
      <StickyBar />           {/* Sticky CTA */}
      <Hero />                {/* Above fold */}
      <Problem />             {/* Pain points */}
      <Mechanism />           {/* How it works */}
      <Benefits />            {/* Value props */}
      <FAQ />                 {/* Objections */}
      <ContactSection />      {/* Dual CTA */}
      <Footer />              {/* Navigation */}
      <AIChatButton />        {/* Floating chat */}
      <WhatsAppButton />      {/* Floating WhatsApp */}
      <CookieBanner />        {/* Consent */}
    </>
  );
}
```

**Advantages**:
- Each section is independent
- Easy to reorder/remove sections
- Clear separation of concerns
- Testable in isolation

### 3. State Management Strategy

#### Global State (React Context)

```typescript
// ChatContext - controls chat open/close
export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // ... context implementation
};
```

**Use for**: Cross-component state that doesn't change often

#### Local State (useState/useReducer)

```typescript
// Component-level state
export function AIChatButton() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  // ... component logic
}
```

**Use for**: Component-specific state, forms, UI toggles

#### Persistent State (localStorage)

```typescript
// Browser storage for session continuity
localStorage.setItem("chat_session_id", sessionId);
localStorage.setItem(`triage_completed_${sessionId}`, "true");
```

**Use for**: Session tracking, user preferences, triage status

## Data Flow Architecture

### Lead Capture Flow (Dual Path)

```
┌─────────────────────────────────────────────────────────┐
│                     Landing Page                         │
│  (Hero, Problem, Mechanism, Benefits, FAQ, Contact)     │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
        ┌───────▼────────┐    ┌───────▼────────┐
        │  Chat Button   │    │  Contact Form  │
        │  (AI-powered)  │    │  (Traditional) │
        └───────┬────────┘    └───────┬────────┘
                │                     │
        ┌───────▼────────┐    ┌───────▼────────┐
        │ Triage Dialog  │    │  Form Submit   │
        │ (Dynamic Form) │    │  (Validation)  │
        └───────┬────────┘    └───────┬────────┘
                │                     │
        ┌───────▼────────┐    ┌───────▼────────┐
        │ Chat Webhook   │    │  /api/leads    │
        │   (Direct)     │    │  (API Route)   │
        └───────┬────────┘    └───────┬────────┘
                │                     │
                └──────────┬──────────┘
                           │
                   ┌───────▼────────┐
                   │  n8n Webhook   │
                   │  (Processing)  │
                   └───────┬────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        ┌───────▼────────┐    ┌───────▼────────┐
        │    Database    │    │    WhatsApp    │
        │   (Supabase)   │    │ (Evolution API)│
        └────────────────┘    └────────────────┘
```

### Chat System Architecture

```
┌─────────────────────────────────────────────────────┐
│              AIChatButton Component                 │
│  - Session management (web_${random})               │
│  - Message state array                              │
│  - Webhook communication                            │
│  - Dynamic UI injection                             │
└─────────────┬───────────────────────────────────────┘
              │
              │ 1. User sends message
              │
      ┌───────▼────────────────────────────┐
      │         Webhook Payload             │
      │  {                                  │
      │    data: {                          │
      │      key: { remoteJid, id },        │
      │      message: { conversation },     │
      │      source: "web"                  │
      │    },                               │
      │    sender: sessionId                │
      │  }                                  │
      └───────┬────────────────────────────┘
              │
              │ 2. n8n processes
              │
      ┌───────▼────────────────────────────┐
      │         n8n Workflow                │
      │  - Route to AI agent (Dra. Ana)    │
      │  - Context from database            │
      │  - Generate response                │
      │  - Optional: inject UI (form_card)  │
      └───────┬────────────────────────────┘
              │
              │ 3. Webhook response
              │
      ┌───────▼────────────────────────────┐
      │      Webhook Response               │
      │  {                                  │
      │    messages: [                      │
      │      { text, delay }                │
      │    ],                               │
      │    ui?: {                           │
      │      type: "form_card",             │
      │      fields: [...]                  │
      │    }                                │
      │  }                                  │
      └───────┬────────────────────────────┘
              │
              │ 4. Render in UI
              │
      ┌───────▼────────────────────────────┐
      │       Chat Interface                │
      │  - Display messages sequentially    │
      │  - Show form card if provided       │
      │  - Collect triage data              │
      │  - Mark triage as completed         │
      └─────────────────────────────────────┘
```

### Session Management Flow

```
User visits page
     │
     ▼
Check localStorage for "chat_session_id"
     │
     ├─ Found? ──────────► Use existing session
     │                     Check triage_completed
     │
     └─ Not found? ─────► Generate new session
                          Format: web_${random}
                          Store in localStorage
                          Send __start__ message
                               │
                               ▼
                          Bot sends greeting
                          May inject triage form
                               │
                               ▼
                          User completes triage
                          Store triage_completed
                               │
                               ▼
                          Continue conversation
                          (triage won't show again)
```

## Design Patterns

### 1. Webhook Integration Pattern

**Centralized webhook communication**:

```typescript
// AIChatButton.tsx
const sendMessage = async (content: string) => {
  const payload = {
    data: {
      key: {
        remoteJid: `${sessionId}@s.whatsapp.net`,
        fromMe: false,
        id: generateId(),
      },
      pushName: "Visitante Web",
      message: { conversation: content },
      messageType: "conversation",
      messageTimestamp: Date.now(),
      instanceId: "web-client-integration",
      source: "web",
    },
    sender: `${sessionId}@s.whatsapp.net`,
  };

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response.json();
};
```

**Benefits**:
- Single source of truth for webhook structure
- Easy to mock for testing
- Clear error handling
- Type-safe with TypeScript

### 2. Phone Number Normalization Pattern

**Critical implementation**:

```typescript
// ContactSection.tsx:50-60
function normalizeWhatsappBr(phone: string): string {
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, "");

  // Remove country code (55) if present
  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(2);
  }

  return digits;
}
```

**Why this matters**:
- Database expects 10-11 digits only
- Prevents duplicate leads (UNIQUE constraint)
- n8n workflows add `55` when needed
- Evolution API requires full international format

### 3. Dynamic UI Injection Pattern

**Webhook can inject UI components**:

```typescript
interface WebhookResponse {
  messages: Array<{ text: string; delay: number }>;
  ui?: {
    type: "form_card";
    id: string;
    title: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      options?: Array<{ value: string; label: string }>;
    }>;
  };
}

// In component:
if (response.ui && response.ui.type === "form_card") {
  setActiveFormCard(response.ui);
}
```

**Advantages**:
- Backend controls UI flow
- Easy to A/B test triage questions
- No frontend deployment for question changes
- Supports multiple form types

### 4. Framer Motion Animation Pattern

**Consistent scroll-triggered animations**:

```typescript
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, margin: "-100px" }}
>
  {/* Content */}
</motion.section>
```

**Best practices**:
- Use `viewport.once: true` to prevent re-triggering
- Add negative margin for early trigger
- Keep duration under 0.8s for snappiness
- Use subtle y-offset (20-40px)

## Database Schema Design

### Lead Storage (clientes table)

```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  nome TEXT NOT NULL,
  telefone_whatsapp TEXT UNIQUE NOT NULL,
  cpf TEXT,
  email TEXT,

  -- Session tracking
  session_id TEXT UNIQUE,
  origem TEXT NOT NULL,

  -- Qualification
  status_qualificacao TEXT DEFAULT 'novo',
  gestante_lactante BOOLEAN DEFAULT false,
  historico_tireoide BOOLEAN DEFAULT false,

  -- Payment
  asaas_payment_id TEXT,
  asaas_status TEXT,
  asaas_link_pagamento TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key constraints**:
- `telefone_whatsapp` must be UNIQUE (prevents duplicates)
- `session_id` should be UNIQUE (chat tracking)
- `origem` tracks source (`formulario_site`, `chat_site`, `whatsapp`)

## Security Considerations

### Input Validation
- Sanitize all form inputs
- Validate phone format before database insertion
- Check for medical exclusions (gestante_lactante, historico_tireoide)

### API Security
- Use environment variables for sensitive URLs
- Never expose API keys in client code
- Validate webhook payloads on backend

### Data Privacy
- Store minimal PII (name, phone, CPF only when needed)
- Implement cookie consent (CookieBanner)
- Provide privacy policy and terms of service

## Performance Optimizations

### Next.js Features
- Server Components for static content
- Image optimization with next/image
- Font optimization with next/font
- API routes run on edge/serverless

### React Optimizations
- React Compiler enabled (automatic memoization)
- Lazy load heavy components
- Use React.memo for expensive renders
- Debounce form inputs

### Tailwind Optimizations
- PurgeCSS removes unused styles
- JIT compiler for instant builds
- Custom utilities in globals.css
- CSS variables for theming

---

**Related Docs**:
- [API Integration](./api-integration.md) - Webhook contracts and n8n workflows
- [Styling Guide](./styling-guide.md) - Component patterns and design system
- [Troubleshooting](./troubleshooting.md) - Common architectural issues
