# TirzepaLife - Cursor Documentation

Welcome to the TirzepaLife project documentation for Cursor IDE. This folder contains detailed guides to help you understand and work with the codebase effectively.

## Quick Links

- **[Architecture Guide](./architecture.md)** - System design, patterns, and data flows
- **[API Integration Guide](./api-integration.md)** - Webhooks, n8n workflows, and external services
- **[Styling Guide](./styling-guide.md)** - Design system, Tailwind conventions, and UI patterns
- **[Troubleshooting](./troubleshooting.md)** - Common issues, debugging tips, and solutions
- **[Prompts Guide](./prompts.md)** - AI agent configuration and prompt engineering

## Project Overview

TirzepaLife is a Next.js 16 landing page and lead generation system for Tirzepatida (Mounjaro) weight management treatment. The system includes:

- Modern landing page with marketing sections
- AI-powered chat interface for lead qualification
- Traditional contact form with medical screening
- WhatsApp integration via n8n automation
- Database-backed lead management system

## Tech Stack Summary

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + Custom CSS variables |
| UI Components | Radix UI primitives |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Backend | n8n webhooks + Supabase/PostgreSQL |
| WhatsApp | Evolution API |
| Payments | Asaas PIX integration |

## Project Structure

```
TIRZEPALIFE/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home/landing page
│   │   ├── globals.css      # Global styles
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── chat/            # Chat-specific components
│   ├── context/             # React contexts
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── docs/
│   ├── context/             # Database schemas
│   ├── prompts/             # AI agent prompts
│   └── workflows/           # n8n workflow exports
├── .cursor/                 # Cursor documentation (you are here)
├── .cursorrules             # Main Cursor configuration
└── CLAUDE.md                # Claude Code documentation
```

## Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Environment Variables

Required for production:
```bash
N8N_FORM_WEBHOOK_URL=https://webh.procexai.tech/webhook/TizerpaLife-Formulario
```

Hardcoded in client code:
- Chat webhook: `AIChatButton.tsx:64`

## Critical Concepts

### Phone Number Format
**CRITICAL**: Always use DDD + number format (10-11 digits) WITHOUT `55` country code in database.
- Database: `11999998888` ✓
- Frontend display: `(11) 99999-9999`
- n8n adds `55` prefix when needed
- Use `normalizeWhatsappBr()` for conversion

### Chat Sessions
- Format: `web_${random}@s.whatsapp.net`
- Stored in localStorage
- Persistent across page reloads
- Triage completion tracked per session

### Lead Flow
Two paths converge to n8n automation:
1. **Chat**: Triage → Form card → Webhook → Database → WhatsApp
2. **Form**: Form → API → Webhook → Database → WhatsApp

## Documentation Organization

Each guide in this folder focuses on a specific aspect:

1. **Architecture** - How the system is built and why
2. **API Integration** - External services and webhook contracts
3. **Styling** - Design system and component patterns
4. **Troubleshooting** - Debugging and problem-solving
5. **Prompts** - AI agent configuration and best practices

## Best Practices

### When Modifying Code
1. Check existing patterns in the codebase first
2. Maintain TypeScript type safety
3. Test phone number handling carefully
4. Verify webhook integration after changes
5. Follow mobile-first responsive design
6. Keep components small and focused

### Code Review Checklist
- [ ] TypeScript types are explicit
- [ ] Phone numbers use correct format
- [ ] Responsive design tested
- [ ] Accessibility standards met
- [ ] Webhook payloads match n8n expectations
- [ ] No hardcoded sensitive data
- [ ] Error handling implemented
- [ ] Loading states considered

## Need Help?

1. Check the specific guide for your area of work
2. Review existing code patterns in similar components
3. Test changes in development environment first
4. Verify webhook integration with n8n logs
5. Check browser console for client-side errors

## Contributing

When adding new features:
1. Follow existing patterns and conventions
2. Update relevant documentation
3. Test thoroughly before committing
4. Consider impact on n8n workflows
5. Verify database schema compatibility

---

**Last Updated**: 2025-12-16
**Maintained For**: Cursor IDE AI assistance
