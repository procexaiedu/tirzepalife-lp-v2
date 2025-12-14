# TirzepaLife Project Context

## Project Overview
**TirzepaLife** is a medical landing page built with **Next.js 16** (App Router) and **React 19**, focused on promoting a weight loss therapy (likely Tirzepatide). The application features a modern, responsive design with smooth animations and integrated chat functionality to connect potential patients with specialists.

Crucially, the frontend is the entry point for a sophisticated backend automation system powered by **n8n**, which handles lead qualification, AI-driven conversations (WhatsApp & Web), and payment processing (Asaas).

## Tech Stack
*   **Frontend Framework:** Next.js 16.0.4 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4, `tailwind-merge`, `clsx`, `class-variance-authority`
*   **UI Libraries:** Radix UI (Primitives), Lucide React (Icons)
*   **Animation:** Framer Motion (`framer-motion`), `tw-animate-css`
*   **State Management:** React Context (`ChatContext`)
*   **Backend Automation:** n8n (Workflows in `docs/workflows`)
*   **Database:** PostgreSQL (Client data & Chat History)
*   **AI Models:** DeepSeek V3 (Chat), GPT-4o-mini (Image Analysis), Whisper (Audio Transcriptions via Groq)
*   **Integrations:** Evolution API (WhatsApp), Asaas (Payments)

## Project Structure

### `src/app`
*   **`layout.tsx`**: Root layout definition.
*   **`page.tsx`**: Main landing page, composing sections like Hero, Problem, Mechanism, Benefits, etc.
*   **`globals.css`**: Global Tailwind CSS imports and custom styles.
*   **`legal/`**:
    *   `politica-privacidade/`: Privacy Policy page.
    *   `termos-uso/`: Terms of Use page.

### `src/components`
*   **`ui/`**: Reusable base components (Button, Container, Card, Input) styled with Tailwind and CVA.
*   **`chat/`**:
    *   `ContactOptions.tsx`: Component offering "WhatsApp" or "Callback" options to the user.
*   **Sections**: Landing page sections (`Hero.tsx`, `Problem.tsx`, `Mechanism.tsx`, `Benefits.tsx`, `ContactSection.tsx`, `FAQ.tsx`, `Footer.tsx`).
*   **Features**:
    *   `AIChatButton.tsx`: Floating chat button.
    *   `TwincretinTooltip.tsx`, `WeightLossTooltip.tsx`: Interactive tooltips.
    *   `AnvisaBadge.tsx`: Trust badge.

### `docs/workflows` (n8n Automation)
This directory contains the JSON definitions for the backend business logic:
*   **`site.json`**: Handles the web chat interface.
    *   **Trigger:** Webhook from the frontend.
    *   **Logic:** Buffers messages with Redis, handles text/audio/images, uses **DeepSeek V3** for response generation, and updates the `clientes` table.
*   **`whatsapp.json`**: Handles WhatsApp interactions.
    *   **Trigger:** Postgres changes (likely new leads or status updates).
    *   **Logic:** Uses an AI Agent to generate responses and sends them via **Evolution API**.
*   **`criar-cliente.json`**: Handles sales and payments.
    *   **Logic:** Creates a customer in **Asaas**, generates a Pix charge, and updates the database with the payment link.

### `.claude`
*   **`agents/ui-ux-designer.md`**: Defines the project's design persona, emphasizing user-centered design, accessibility, and high-fidelity UI/UX standards.

## Database Schema (Inferred)
The `clientes` table in PostgreSQL tracks lead progress:
*   `nome` (Text)
*   `telefone_whatsapp` (Text, Unique)
*   `condicao_medica` (Text)
*   `gestante_lactante` (Boolean/Text)
*   `historico_tireoide` (Text)
*   `uso_anterior_glp1` (Boolean/Text)
*   `status_qualificacao` (Text: 'qualificado', 'aguardando_pagamento', etc.)
*   `dosagem_interesse` (Text)
*   `origem` (Text)
*   `atendido` (Boolean)
*   `session_id` (Text)

## Development Guidelines

### Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server on `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint for code quality checks. |

### Coding Standards
*   **Styling:** Use Tailwind CSS utility classes. For complex conditionals, use `cn()` from `src/lib/utils.ts`.
*   **Animations:** Prioritize `framer-motion` for complex interactions.
*   **Client Components:** Mark components using hooks with `"use client";`.
*   **Language:** All user-facing text must be in **Portuguese (pt-BR)**.
*   **Data Flow:** The frontend is primarily a data collection interface. Complex logic resides in the n8n workflows. Ensure webhooks and form submissions match the expected backend payloads.