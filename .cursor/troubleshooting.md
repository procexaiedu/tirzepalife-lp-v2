# Troubleshooting Guide

This document covers common issues, debugging strategies, and solutions for TirzepaLife development.

## Common Issues

### 1. Phone Number Format Issues

#### Problem: Duplicate leads in database
**Symptoms**:
- Database unique constraint error
- Same customer appears multiple times
- WhatsApp messages not sent

**Cause**: Phone stored with different formats (`11999998888` vs `5511999998888`)

**Solution**:
```typescript
// ALWAYS use normalizeWhatsappBr before database operations
function normalizeWhatsappBr(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Remove 55 prefix if present and length > 11
  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(2);
  }

  return digits;
}

// Usage in forms
const normalizedPhone = normalizeWhatsappBr(formData.telefone);
// Store in database: normalizedPhone
```

**Prevention**:
- Always normalize before database insert/update
- Add validation: phone must be 10-11 digits after normalization
- Test with different input formats: `(11) 99999-9999`, `11999999999`, `5511999999999`

#### Problem: WhatsApp messages not delivered
**Symptoms**:
- Evolution API returns error
- Messages show as "not sent" in n8n

**Cause**: Phone format incorrect for Evolution API (missing `55` prefix)

**Solution**:
```typescript
// In n8n workflow, ADD 55 prefix when sending via Evolution API
const phoneForWhatsapp = `55${customer.telefone_whatsapp}`;

// Send message
await evolutionApi.sendMessage({
  number: phoneForWhatsapp,  // Must be: 5511999998888
  text: message,
});
```

**Debug checklist**:
- [ ] Database stores 10-11 digits only
- [ ] Frontend displays with mask: `(11) 99999-9999`
- [ ] API routes normalize before saving
- [ ] n8n workflows add `55` when sending to WhatsApp
- [ ] Evolution API receives full format: `5511999998888`

### 2. Chat Session Issues

#### Problem: Chat session lost on page refresh
**Symptoms**:
- User refreshes page and session ID changes
- Conversation history lost
- Bot greets user again

**Cause**: Session ID not persisted in localStorage

**Solution**:
```typescript
// In AIChatButton.tsx
useEffect(() => {
  // Check localStorage first
  const existingSession = localStorage.getItem("chat_session_id");

  if (existingSession) {
    setSessionId(existingSession);
  } else {
    // Generate new session
    const newSession = `web_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setSessionId(newSession);
    localStorage.setItem("chat_session_id", newSession);
  }
}, []);
```

**Prevention**:
- Always check localStorage before generating new session
- Store session_id immediately after generation
- Test: refresh page and verify session_id remains same

#### Problem: Triage form shows again after completion
**Symptoms**:
- User completes triage
- Refreshes page
- Triage form appears again

**Cause**: Triage completion not tracked in localStorage

**Solution**:
```typescript
// After triage submission
const handleTriageSubmit = (data: TriageFormValues) => {
  // Send to webhook
  sendMessage(data);

  // Mark as completed
  localStorage.setItem(`triage_completed_${sessionId}`, "true");
  setActiveFormCard(null);
};

// On component mount
useEffect(() => {
  const triageCompleted = localStorage.getItem(`triage_completed_${sessionId}`);
  if (triageCompleted) {
    // Don't show triage form
  }
}, [sessionId]);
```

### 3. Webhook Integration Issues

#### Problem: Webhook returns 400 Bad Request
**Symptoms**:
- Chat messages not sent
- Error in browser console
- n8n workflow shows validation error

**Cause**: Payload structure doesn't match expected format

**Solution**:
```typescript
// Verify payload structure matches exactly
const payload = {
  data: {
    key: {
      remoteJid: `${sessionId}@s.whatsapp.net`,  // MUST include @s.whatsapp.net
      fromMe: false,                              // MUST be false
      id: `msg_${Date.now()}`,                    // MUST be unique
    },
    pushName: "Visitante Web",                    // MUST be string
    message: {
      conversation: messageText,                  // MUST be string, not empty
    },
    messageType: "conversation",                  // MUST be "conversation"
    messageTimestamp: Date.now(),                 // MUST be number (ms)
    instanceId: "web-client-integration",         // MUST match n8n config
    source: "web",                                // MUST be "web"
  },
  sender: `${sessionId}@s.whatsapp.net`,         // MUST match remoteJid
};
```

**Debug checklist**:
- [ ] All required fields present
- [ ] Field types correct (string vs number)
- [ ] Session format: `web_*@s.whatsapp.net`
- [ ] Message not empty string
- [ ] Timestamp in milliseconds, not seconds

#### Problem: Webhook returns 500 Internal Server Error
**Symptoms**:
- Intermittent failures
- Works sometimes, fails others
- n8n shows database error

**Common causes**:
1. Database connection timeout
2. AI agent timeout (Claude API)
3. Missing environment variables
4. Database constraint violation

**Debug steps**:
1. Check n8n workflow logs (Executions tab)
2. Look for error messages in workflow nodes
3. Verify database connection in n8n
4. Check Claude API rate limits
5. Verify customer doesn't exist (unique constraints)

**Solution**:
```typescript
// Add timeout and retry logic
const sendWithRetry = async (payload: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (response.ok) return await response.json();

      if (response.status >= 500 && i < retries - 1) {
        // Retry on 5xx errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
};
```

### 4. Database Issues

#### Problem: UNIQUE constraint violation
**Symptoms**:
- Error: `duplicate key value violates unique constraint "clientes_telefone_whatsapp_key"`
- Lead not saved to database

**Cause**: Trying to insert customer with existing phone number

**Solution**:
```sql
-- Use UPSERT pattern in n8n
INSERT INTO clientes (
  nome,
  telefone_whatsapp,
  session_id,
  origem
) VALUES (
  $1, $2, $3, $4
)
ON CONFLICT (telefone_whatsapp) DO UPDATE SET
  nome = EXCLUDED.nome,
  session_id = EXCLUDED.session_id,
  updated_at = NOW()
RETURNING id;
```

**Prevention**:
- Always use UPSERT (INSERT ... ON CONFLICT) for lead creation
- Query existing customer first before insert
- Use `criar-cliente.json` workflow (handles this)

#### Problem: Session ID conflict
**Symptoms**:
- Multiple chats with same session_id
- Conversations mixed up

**Cause**: Session format collision or not truly unique

**Solution**:
```typescript
// Generate truly unique session ID
const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = window.navigator.userAgent.slice(0, 10).replace(/\s/g, "");
  return `web_${timestamp}_${random}_${userAgent}`;
};
```

### 5. Styling Issues

#### Problem: Tailwind classes not applied
**Symptoms**:
- Component appears unstyled
- Classes in dev tools but no styles

**Cause**: Class name generated dynamically or not in purge path

**Solution**:
```tsx
// ✗ BAD - dynamic class names are purged
const color = isActive ? "blue" : "red";
<div className={`text-${color}-500`}>

// ✓ GOOD - use complete class names
<div className={isActive ? "text-blue-500" : "text-red-500"}>

// ✓ GOOD - use cn() utility
<div className={cn("base-class", isActive && "text-blue-500")}>
```

**Prevention**:
- Never concatenate Tailwind class names
- Use complete class strings
- Use conditional logic with full class names

#### Problem: Animation causing layout shift
**Symptoms**:
- Content jumps during animation
- Cumulative Layout Shift (CLS) issues

**Solution**:
```tsx
// Reserve space for animated content
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  style={{ minHeight: "200px" }}  // Reserve space
>
  {/* Content */}
</motion.div>

// Use transform instead of margin/padding
// ✗ BAD
<motion.div animate={{ marginTop: "20px" }}>

// ✓ GOOD
<motion.div animate={{ y: 20 }}>
```

### 6. TypeScript Issues

#### Problem: Type error with event handlers
**Symptoms**:
- `Type 'Event' is not assignable to type 'FormEvent'`

**Solution**:
```tsx
// ✗ BAD - generic event type
const handleSubmit = (e: Event) => {
  e.preventDefault();
};

// ✓ GOOD - specific event type
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// ✓ GOOD - infer type
<form onSubmit={(e) => {
  e.preventDefault();
}}>
```

#### Problem: Module not found for path alias
**Symptoms**:
- `Cannot find module '@/components/...'`
- Import error in editor

**Solution**:
```json
// Verify tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Fix**:
1. Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")
2. Verify tsconfig.json paths
3. Check file actually exists at path

### 7. Next.js Build Issues

#### Problem: Build fails with "Module not found"
**Symptoms**:
- `npm run build` fails
- Works in development

**Common causes**:
1. Case-sensitive imports (`Component.tsx` vs `component.tsx`)
2. Missing dependencies in package.json
3. Incorrect path alias

**Solution**:
```bash
# Check imports match file names exactly
# Mac/Windows is case-insensitive, Linux (build server) is case-sensitive

# ✗ BAD
import Hero from "./hero";  // File is Hero.tsx

# ✓ GOOD
import Hero from "./Hero";  // Matches file name
```

#### Problem: Client Component error
**Symptoms**:
- `Error: × You're importing a component that needs useState. It only works in a Client Component...`

**Solution**:
```tsx
// Add "use client" directive at top
"use client";

import { useState } from "react";

export function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

**When to use `"use client"`**:
- Component uses useState, useEffect, etc.
- Component uses browser APIs (window, localStorage)
- Component has event handlers (onClick, onChange)
- Component uses React Context

## Debugging Strategies

### 1. Browser DevTools

**Check Network tab**:
```
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: Fetch/XHR
4. Look for webhook requests
5. Check:
   - Request payload (Preview tab)
   - Response data (Response tab)
   - Status code (Headers tab)
```

**Check Console tab**:
```javascript
// Add debug logging
console.log("Session ID:", sessionId);
console.log("Sending payload:", payload);
console.log("Response:", response);
```

**Check Application tab**:
```
1. Go to Application tab
2. Expand Local Storage
3. Check values:
   - chat_session_id
   - triage_completed_${sessionId}
```

### 2. n8n Workflow Debugging

**View execution logs**:
```
1. Open n8n interface
2. Go to Executions tab
3. Click on failed execution
4. Inspect each node:
   - Input data
   - Output data
   - Error messages
```

**Test webhook directly**:
```bash
# Use n8n's test webhook feature
1. Open workflow in n8n
2. Click on webhook node
3. Click "Test Workflow"
4. Send test payload via Postman/curl
5. View results in real-time
```

**Common n8n errors**:
- `Cannot read property 'X' of undefined` → Missing field in payload
- `Connection timeout` → Database or API unreachable
- `Invalid credentials` → Check n8n credential configuration
- `Rate limit exceeded` → Too many AI requests

### 3. Database Debugging

**Query Supabase directly**:
```sql
-- Check recent leads
SELECT * FROM clientes
ORDER BY created_at DESC
LIMIT 10;

-- Check for duplicates
SELECT telefone_whatsapp, COUNT(*)
FROM clientes
GROUP BY telefone_whatsapp
HAVING COUNT(*) > 1;

-- Check session mapping
SELECT nome, telefone_whatsapp, session_id
FROM clientes
WHERE session_id LIKE 'web_%';
```

**Check database logs**:
```
1. Open Supabase dashboard
2. Go to Database → Logs
3. Filter by error level
4. Look for constraint violations
```

### 4. Frontend Debugging

**React DevTools**:
```
1. Install React DevTools extension
2. Inspect component state
3. Check context values
4. Trace prop changes
```

**Debug localStorage**:
```typescript
// Add helper to view all chat-related storage
const debugChatStorage = () => {
  console.log("Chat Session ID:", localStorage.getItem("chat_session_id"));

  // Find all triage_completed keys
  Object.keys(localStorage)
    .filter(key => key.startsWith("triage_completed_"))
    .forEach(key => {
      console.log(key, localStorage.getItem(key));
    });
};

// Call in console: debugChatStorage()
```

## Performance Issues

### Problem: Slow page load
**Symptoms**:
- First contentful paint > 2s
- Large bundle size

**Solutions**:
1. Optimize images with next/image
2. Lazy load non-critical components
3. Code-split heavy dependencies
4. Enable React Compiler (already enabled)

```tsx
// Lazy load heavy components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // Skip SSR if not needed
});
```

### Problem: Slow webhook responses
**Symptoms**:
- Chat messages take >5s to respond
- Timeout errors

**Solutions**:
1. Check AI agent response time in n8n
2. Optimize database queries (add indexes)
3. Increase timeout limits
4. Cache common responses

## Testing Checklist

### Before Committing

- [ ] Phone normalization tested with various formats
- [ ] Chat session persists across page refresh
- [ ] Triage form doesn't re-appear after completion
- [ ] Webhook requests succeed (200 status)
- [ ] Database updates correctly
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors in browser
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: no layout shift during animations

### Before Deploying

- [ ] Environment variables set in Vercel
- [ ] n8n webhooks are production URLs
- [ ] Database connection string is production
- [ ] Asaas is production mode (not sandbox)
- [ ] Evolution API instance is active
- [ ] Test end-to-end flow (landing → chat → WhatsApp → payment)

## Getting Help

### When Stuck

1. Check this troubleshooting guide
2. Review related documentation:
   - [Architecture](./architecture.md)
   - [API Integration](./api-integration.md)
   - [Styling Guide](./styling-guide.md)
3. Check n8n workflow logs
4. Test in isolation (create minimal reproduction)
5. Search GitHub issues for similar problems

### Creating Bug Reports

**Include**:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Browser console logs
- n8n execution logs
- Database query results
- Environment (dev/production)

**Example**:
```
Bug: Chat messages not sending

Steps:
1. Open chat interface
2. Type message "Olá"
3. Click send

Expected: Message appears, bot responds
Actual: Loading spinner forever

Console error:
"Failed to fetch: TypeError: NetworkError when attempting to fetch resource"

Network tab:
POST https://webh.procexai.tech/webhook/TizerpaLife
Status: Failed (CORS error)
```

---

**Related Docs**:
- [Architecture](./architecture.md) - System design patterns
- [API Integration](./api-integration.md) - Webhook debugging
- [Styling Guide](./styling-guide.md) - CSS troubleshooting
