# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TirzepaLife is a Next.js 16 landing page and lead generation system for Tirzepatida (Mounjaro) weight management treatment. The application features:

- **Modern landing page** with marketing sections (Hero, Problem, Mechanism, Benefits, FAQ, Contact)
- **AI-powered chat interface** for lead qualification and triage
- **Traditional contact form** with medical screening
- **WhatsApp integration** via n8n automation workflows
- **Lead management** with database-backed qualification system

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS 4 + Custom CSS variables
- **UI Components**: Radix UI primitives (Avatar, Scroll Area, Slot)
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Fonts**: Playfair Display (serif) + Manrope (sans-serif)
- **Backend Integration**: n8n webhooks for chat and lead processing

## Development Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### App Structure (Next.js App Router)

```
src/
├── app/
│   ├── layout.tsx           # Root layout with fonts, metadata, providers
│   ├── page.tsx             # Home page composition (main landing)
│   ├── globals.css          # Global styles + Tailwind directives
│   ├── privacidade/         # Privacy policy page
│   ├── termos-de-uso/       # Terms of service page
│   └── api/
│       └── leads/
│           └── route.ts     # Server-side API route for lead submission
├── components/
│   ├── ui/                  # Reusable UI components (Button, Card, Input, etc.)
│   ├── chat/
│   │   └── TriageFormCard.tsx  # Interactive triage form in chat
│   ├── AIChatButton.tsx     # Main chat interface with webhook integration
│   ├── ContactSection.tsx   # Dual CTA section (Chat + Form)
│   ├── Hero.tsx, Problem.tsx, etc.  # Landing page sections
│   ├── StickyBar.tsx        # Top sticky CTA bar
│   ├── Footer.tsx           # Footer with links
│   └── CookieBanner.tsx     # Cookie consent banner
├── context/
│   └── ChatContext.tsx      # Global chat state (open/close)
├── lib/
│   └── utils.ts             # Utility functions (cn for class merging)
└── types/
    └── chatUi.ts            # TypeScript types for chat UI/webhook responses
```

### Key Design Patterns

1. **Chat System Architecture**:
   - Single webhook URL (`https://webh.procexai.tech/webhook/TizerpaLife`)
   - Session-based conversation tracking (`web_${random}`)
   - Persistent session ID in localStorage
   - Supports dynamic UI injection (form cards) from webhook responses
   - Multi-message streaming with configurable delays
   - Special `__start__` message to trigger initial bot greeting

2. **Lead Capture Flow**:
   - **Chat Path**: User completes triage → submits form card → sends to n8n webhook → creates lead
   - **Form Path**: User fills form → validates → sends to `/api/leads` → proxies to n8n webhook
   - Both paths converge to n8n automation for WhatsApp outreach

3. **Phone Number Standardization** (CRITICAL):
   - **Database Format**: DDD + number (10-11 digits) WITHOUT country code
   - Example: `11999998888` (NOT `5511999998888`)
   - Frontend applies mask: `(11) 99999-9999`
   - n8n workflows add `55` prefix when sending via Evolution API or wa.me links
   - See `normalizeWhatsappBr()` in ContactSection.tsx:50-60

4. **Session Management**:
   - Chat sessions use format: `web_${random}@s.whatsapp.net`
   - Triage completion tracked via localStorage: `triage_completed_${sessionId}`
   - Prevents re-showing triage form on page refresh

## Critical Implementation Details

### Webhook Payload Structure

All chat messages to n8n use this structure:

```typescript
{
  data: {
    key: {
      remoteJid: `${sessionId}@s.whatsapp.net`,
      fromMe: false,
      id: string  // unique message ID
    },
    pushName: "Visitante Web",
    message: {
      conversation: string  // actual message content
    },
    messageType: "conversation",
    messageTimestamp: number,
    instanceId: "web-client-integration",
    source: "web",
    // Optional: form submissions include:
    // form: TriageFormValues,
    // form_id: string
  },
  sender: `${sessionId}@s.whatsapp.net`
}
```

### Chat UI Dynamic Components

The webhook can return UI components via the `ui` field:

```typescript
{
  messages: [{ text: string, delay: number }],
  ui: {
    type: "form_card",
    id: "triagem_inicial",
    title: string,
    fields: [{
      name: string,
      label: string,
      type: "select",
      options: [{ value: string, label: string }]
    }]
  }
}
```

Currently supports `form_card` type for triage questionnaires.

### Database Schema (clientes table)

Located in `docs/context/tabela.txt`. Key fields:

- `nome`: Customer name
- `telefone_whatsapp`: Phone (DDD + number, 10-11 digits, NO `55` prefix)
- `session_id`: Unique session identifier (for chat web)
- `status_qualificacao`: Lead status (`qualificado`, `aguardando_pagamento`, `pago`, etc.)
- `origem`: Lead source (`formulario_site`, `chat_site`, `whatsapp`, etc.)
- `gestante_lactante`, `historico_tireoide`: Medical exclusion criteria
- `asaas_payment_id`, `asaas_status`, `asaas_link_pagamento`: Payment integration fields
- `cpf`: Customer tax ID for payment processing

**UNIQUE constraints**: `telefone_whatsapp`, recommended `session_id`

## AI Agent Prompts

Located in `docs/prompts/`:

1. **agente-sac-site.md**: "Dra. Ana" - Initial chat agent for website visitors
   - Handles qualification, triage, basic Q&A
   - Collects name + WhatsApp for handoff to sales
   - Uses `toolAtualizarDadosCliente` when collecting lead data
   - Implements M3M formatting (3-block responses with line breaks)

2. **agente-vendas-whatsapp.md**: "Lúcia" - Sales closer via WhatsApp
   - Receives qualified leads from Dra. Ana
   - Focuses on CPF collection and payment link generation
   - Uses sub-workflow to generate PIX payment
   - Handles objections with short, direct responses

Both agents use Brazilian Portuguese and follow strict formatting rules for WhatsApp/chat UX.

## n8n Workflows

Located in `docs/workflows/` (JSON exports):

- `site.json`: Website chat flow (Dra. Ana)
- `whatsapp.json`: WhatsApp sales flow (Lúcia)
- `pos-venda.json`: Post-sale customer service
- `criar-cliente.json`: Lead creation and database operations

These workflows integrate with:
- Supabase/PostgreSQL for lead storage
- Evolution API for WhatsApp messaging
- Asaas for payment processing

## Styling System

### CSS Variables (globals.css)

```css
--font-playfair: Playfair Display (serif)
--font-manrope: Manrope (sans-serif)
--color-medical-navy: #1A365D
--color-medical-white: #FDFAF7
--color-medical-sand: #E8DCD2
--color-medical-text: #2D3748
```

### Component Styling Conventions

- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Framer Motion for animations (fade-in, slide-in, scale effects)
- Radix UI components are unstyled - apply Tailwind classes directly
- Responsive design: mobile-first, breakpoints at `sm:`, `md:`, `lg:`

## Environment Variables

Required (set in production):

```bash
N8N_FORM_WEBHOOK_URL=https://webh.procexai.tech/webhook/TizerpaLife-Formulario
```

Hardcoded in client:
- Chat webhook URL in `AIChatButton.tsx:64`

## Testing & Debugging

- Check browser console for webhook errors
- Test phone normalization: `normalizeWhatsappBr()` should return 10-11 digits
- Verify chat sessions in localStorage: `chat_session_id`, `triage_completed_${sessionId}`
- n8n workflow logs available at webhook URL (check n8n console)

## Common Tasks

### Adding New Landing Page Sections

1. Create component in `src/components/`
2. Import in `src/app/page.tsx`
3. Place between existing sections in desired order
4. Use `Container` wrapper for consistent max-width
5. Follow animation pattern with Framer Motion `whileInView`

### Modifying Chat Flow

1. Update agent prompt in `docs/prompts/agente-sac-site.md`
2. Modify corresponding n8n workflow (`docs/workflows/site.json`)
3. Test via chat interface - check webhook responses in Network tab
4. Verify localStorage state changes

### Adding Form Fields

1. Update state in `ContactSection.tsx` or `TriageFormCard.tsx`
2. Add validation rules (required, format, etc.)
3. Update payload structure sent to `/api/leads` or webhook
4. Ensure n8n workflow expects new fields
5. Update database schema if persisting new data

### Changing Phone Format

**DO NOT CHANGE** the phone format without updating:
1. `normalizeWhatsappBr()` in ContactSection.tsx
2. n8n workflows that send WhatsApp messages (add/remove `55` prefix)
3. Database constraints on `telefone_whatsapp` field
4. Evolution API configuration for international format

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `src/*`
- React JSX pragma: `react-jsx` (automatic runtime)
- Target: ES2017
- Next.js plugin for type generation

## React Compiler

Enabled via `next.config.ts`:
```typescript
reactCompiler: true
```

Uses babel plugin for automatic optimization.

## Deployment

- Optimized for Vercel deployment (Next.js native platform)
- Ensure environment variables are set in Vercel dashboard
- Build command: `npm run build`
- Output: `.next` directory (server + static assets)
- No custom server required (serverless functions)
