# API Integration Guide

This document details all external API integrations, webhook contracts, and n8n workflow configurations.

## Overview

TirzepaLife integrates with multiple external services:
- **n8n**: Workflow automation and AI orchestration
- **Supabase/PostgreSQL**: Database and authentication
- **Evolution API**: WhatsApp messaging
- **Asaas**: Payment processing (PIX)
- **Claude AI**: Conversational agents (via n8n)

## n8n Webhooks

### Chat Webhook

**Endpoint**: `https://webh.procexai.tech/webhook/TizerpaLife`
**Location**: Hardcoded in `src/components/AIChatButton.tsx:64`
**Method**: POST

#### Request Payload

```typescript
interface ChatWebhookPayload {
  data: {
    key: {
      remoteJid: string;           // e.g., "web_abc123@s.whatsapp.net"
      fromMe: boolean;              // Always false for user messages
      id: string;                   // Unique message ID
    };
    pushName: string;               // Always "Visitante Web"
    message: {
      conversation: string;         // Actual message content
    };
    messageType: string;            // Always "conversation"
    messageTimestamp: number;       // Unix timestamp in milliseconds
    instanceId: string;             // Always "web-client-integration"
    source: string;                 // Always "web"
  };
  sender: string;                   // Same as data.key.remoteJid
}
```

#### Response Format

```typescript
interface ChatWebhookResponse {
  messages: Array<{
    text: string;                   // Message content (supports markdown)
    delay: number;                  // Delay before showing (ms)
  }>;
  ui?: {
    type: "form_card";              // Currently only form_card supported
    id: string;                     // Unique form identifier
    title: string;                  // Form title
    fields: Array<{
      name: string;                 // Field identifier
      label: string;                // Field label
      type: string;                 // "select", "text", etc.
      required?: boolean;           // Optional validation
      options?: Array<{             // For select fields
        value: string;
        label: string;
      }>;
    }>;
  };
}
```

#### Example Request

```json
{
  "data": {
    "key": {
      "remoteJid": "web_1234567890@s.whatsapp.net",
      "fromMe": false,
      "id": "msg_abc123xyz"
    },
    "pushName": "Visitante Web",
    "message": {
      "conversation": "Olá, gostaria de informações sobre o tratamento"
    },
    "messageType": "conversation",
    "messageTimestamp": 1702771200000,
    "instanceId": "web-client-integration",
    "source": "web"
  },
  "sender": "web_1234567890@s.whatsapp.net"
}
```

#### Example Response

```json
{
  "messages": [
    {
      "text": "Olá! Sou a Dra. Ana, assistente virtual da TirzepaLife. 😊",
      "delay": 500
    },
    {
      "text": "Vou te ajudar a entender se o tratamento com Tirzepatida é adequado para você.",
      "delay": 1000
    },
    {
      "text": "Para começar, preciso fazer algumas perguntas rápidas.",
      "delay": 1500
    }
  ],
  "ui": {
    "type": "form_card",
    "id": "triagem_inicial",
    "title": "Triagem Médica",
    "fields": [
      {
        "name": "gestante_lactante",
        "label": "Você está grávida ou amamentando?",
        "type": "select",
        "required": true,
        "options": [
          { "value": "sim", "label": "Sim" },
          { "value": "nao", "label": "Não" }
        ]
      },
      {
        "name": "historico_tireoide",
        "label": "Você tem histórico de problemas na tireoide?",
        "type": "select",
        "required": true,
        "options": [
          { "value": "sim", "label": "Sim" },
          { "value": "nao", "label": "Não" }
        ]
      }
    ]
  }
}
```

#### Special Messages

**Initial Greeting Trigger**:
```typescript
// Send this message to trigger bot greeting
const payload = {
  data: {
    // ... standard payload
    message: {
      conversation: "__start__"
    }
  }
};
```

**Form Submission**:
```typescript
// Include form data in payload
const payload = {
  data: {
    // ... standard payload
    form: {
      gestante_lactante: "nao",
      historico_tireoide: "nao"
    },
    form_id: "triagem_inicial"
  }
};
```

### Form Webhook

**Endpoint**: `https://webh.procexai.tech/webhook/TizerpaLife-Formulario`
**Environment Variable**: `N8N_FORM_WEBHOOK_URL`
**Method**: POST

#### Request Payload

```typescript
interface FormWebhookPayload {
  nome: string;                     // Customer name
  telefone: string;                 // Phone (10-11 digits, NO 55 prefix)
  gestante_lactante: boolean;       // Medical exclusion
  historico_tireoide: boolean;      // Medical exclusion
  origem: string;                   // Always "formulario_site"
  session_id?: string;              // Optional chat session
}
```

#### Response Format

```typescript
interface FormWebhookResponse {
  success: boolean;
  message?: string;
  lead_id?: string;
}
```

#### Example Request

```json
{
  "nome": "Maria Silva",
  "telefone": "11999998888",
  "gestante_lactante": false,
  "historico_tireoide": false,
  "origem": "formulario_site"
}
```

## API Routes

### POST /api/leads

**Purpose**: Server-side proxy to n8n form webhook
**File**: `src/app/api/leads/route.ts`

#### Request Body

```typescript
interface LeadRequest {
  nome: string;
  telefone: string;
  gestante_lactante: boolean;
  historico_tireoide: boolean;
}
```

#### Response

```typescript
interface LeadResponse {
  success: boolean;
  message?: string;
}
```

#### Implementation

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nome || !body.telefone) {
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Normalize phone (CRITICAL)
    const normalizedPhone = normalizeWhatsappBr(body.telefone);

    // Forward to n8n
    const response = await fetch(process.env.N8N_FORM_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        telefone: normalizedPhone,
        origem: "formulario_site",
      }),
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
```

## n8n Workflows

### Site Workflow (site.json)

**Purpose**: Handle website chat interactions
**Agent**: Dra. Ana (SAC/Triage)
**File**: `docs/workflows/site.json`

**Flow**:
1. Receive webhook from chat interface
2. Extract session_id and message content
3. Query database for existing customer
4. Pass context to Claude AI agent
5. Agent responds with qualification questions
6. Optionally inject triage form UI
7. Return response to frontend
8. Store conversation in database

**Key Nodes**:
- Webhook trigger
- PostgreSQL query (customer lookup)
- AI Agent (Claude with prompt)
- Conditional logic (triage completed?)
- Database insert (store message)
- Response formatter

### WhatsApp Workflow (whatsapp.json)

**Purpose**: Handle WhatsApp sales conversations
**Agent**: Lúcia (Sales Closer)
**File**: `docs/workflows/whatsapp.json`

**Flow**:
1. Receive message from Evolution API
2. Identify customer by phone number
3. Check qualification status
4. Route to AI sales agent
5. Agent requests CPF if needed
6. Generate PIX payment link (Asaas)
7. Send payment link via WhatsApp
8. Update database with payment info

**Key Nodes**:
- Evolution API trigger
- Customer identification
- AI Agent (Claude with sales prompt)
- Asaas payment integration
- Database update
- WhatsApp message sender

### Post-Sale Workflow (pos-venda.json)

**Purpose**: Handle customer service after purchase
**File**: `docs/workflows/pos-venda.json`

**Flow**:
1. Receive customer inquiry via WhatsApp
2. Verify payment status in database
3. Route to support agent AI
4. Handle common questions (dosage, side effects, delivery)
5. Escalate to human if needed
6. Log interaction in database

### Create Customer Workflow (criar-cliente.json)

**Purpose**: Centralized customer creation logic
**File**: `docs/workflows/criar-cliente.json`

**Used By**: All workflows that create new leads

**Flow**:
1. Receive customer data
2. Validate required fields
3. Normalize phone number (remove 55)
4. Check for existing customer (UNIQUE constraint)
5. Insert into database if new
6. Update if existing
7. Return customer_id
8. Trigger WhatsApp welcome message

**Important**: This ensures consistent customer creation across all entry points.

## Evolution API Integration

### Configuration

**Base URL**: Configured in n8n credentials
**Instance**: `tirzepalife-instance`

### Send Message

```typescript
// In n8n workflow
{
  "number": "5511999998888",        // MUST include 55 prefix
  "text": "Olá! Bem-vindo à TirzepaLife",
  "delay": 1000
}
```

**CRITICAL**: Evolution API requires full international format (`55` + DDD + number).

### Receive Message

```typescript
interface EvolutionWebhook {
  key: {
    remoteJid: string;              // e.g., "5511999998888@s.whatsapp.net"
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation?: string;          // Text message
    extendedTextMessage?: {         // Quoted message
      text: string;
    };
  };
  messageTimestamp: number;
  pushName: string;
}
```

## Asaas Payment Integration

### Create PIX Payment

**Endpoint**: `https://api.asaas.com/v3/payments`
**Method**: POST

```typescript
interface AsaasPaymentRequest {
  customer: string;                 // Asaas customer ID
  billingType: "PIX";
  value: number;                    // Amount in BRL
  dueDate: string;                  // ISO date format
  description: string;
}
```

**Response**:
```typescript
interface AsaasPaymentResponse {
  id: string;                       // Payment ID
  invoiceUrl: string;               // Payment page URL
  bankSlipUrl: string;
  status: "PENDING" | "RECEIVED" | "CONFIRMED";
}
```

### Webhook Events

**Asaas sends webhook on payment status change**:
- `PAYMENT_CREATED`
- `PAYMENT_UPDATED`
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`

**Handler in n8n**:
1. Receive webhook
2. Extract payment_id and status
3. Query database for customer
4. Update asaas_status field
5. Send WhatsApp notification
6. Trigger post-sale workflow

## Database Operations

### Supabase Client (n8n)

**Connection**: PostgreSQL node with credentials

**Common Queries**:

```sql
-- Find customer by phone
SELECT * FROM clientes
WHERE telefone_whatsapp = '11999998888';

-- Find customer by session
SELECT * FROM clientes
WHERE session_id = 'web_abc123@s.whatsapp.net';

-- Update qualification status
UPDATE clientes
SET status_qualificacao = 'qualificado',
    updated_at = NOW()
WHERE id = 'uuid-here';

-- Insert new lead
INSERT INTO clientes (
  nome,
  telefone_whatsapp,
  session_id,
  origem,
  gestante_lactante,
  historico_tireoide
) VALUES (
  'Maria Silva',
  '11999998888',
  'web_abc123@s.whatsapp.net',
  'chat_site',
  false,
  false
);
```

## Error Handling

### Webhook Errors

**Common issues**:
1. Malformed payload → 400 Bad Request
2. Missing required fields → 400 Bad Request
3. Database connection error → 500 Internal Server Error
4. AI agent timeout → 504 Gateway Timeout

**Best practices**:
- Always validate payload structure
- Log errors to n8n console
- Return user-friendly error messages
- Retry transient failures (network, timeout)

### Frontend Error Handling

```typescript
try {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  // Process response
} catch (error) {
  console.error("Webhook error:", error);
  // Show user-friendly message
  setMessages((prev) => [
    ...prev,
    {
      text: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
      sender: "bot",
    },
  ]);
}
```

## Testing Webhooks

### Local Testing

**Use ngrok to expose local n8n**:
```bash
ngrok http 5678
```

Update webhook URLs in code to ngrok URL.

### Test Payloads

**Chat message**:
```bash
curl -X POST https://webh.procexai.tech/webhook/TizerpaLife \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "key": {
        "remoteJid": "test_user@s.whatsapp.net",
        "fromMe": false,
        "id": "test123"
      },
      "pushName": "Test User",
      "message": { "conversation": "Olá" },
      "messageType": "conversation",
      "messageTimestamp": 1702771200000,
      "instanceId": "web-client-integration",
      "source": "web"
    },
    "sender": "test_user@s.whatsapp.net"
  }'
```

**Form submission**:
```bash
curl -X POST https://webh.procexai.tech/webhook/TizerpaLife-Formulario \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "telefone": "11999998888",
    "gestante_lactante": false,
    "historico_tireoide": false,
    "origem": "formulario_site"
  }'
```

---

**Related Docs**:
- [Architecture](./architecture.md) - System design and patterns
- [Prompts Guide](./prompts.md) - AI agent configuration
- [Troubleshooting](./troubleshooting.md) - Common integration issues
