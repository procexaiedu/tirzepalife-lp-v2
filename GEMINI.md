# Project Context: TirzepaLife Landing Page

## Overview
This project is a **Next.js** application designed as a high-conversion landing page for "TirzepaLife," a medical weight loss service focusing on Tirzepatide therapy. The application is built using **TypeScript** and **Tailwind CSS v4**.

## Technical Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 (configured in `globals.css` with custom "medical" theme colors)
*   **Animation:** Framer Motion
*   **Icons:** Lucide React
*   **Forms:** React Hook Form
*   **Package Manager:** npm

## Directory Structure
The project is located in the `my-landing-page` directory.

```text
C:\TIRZEPALIFE\
├── my-landing-page/
│   ├── src/
│   │   ├── app/          # Next.js App Router pages and layouts
│   │   │   ├── globals.css  # Global styles and Tailwind theme configuration
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Main landing page content
│   │   └── components/   # Reusable UI components (Hero, Mechanism, etc.)
│   ├── public/           # Static assets (images, icons)
│   ├── package.json      # Project dependencies and scripts
│   └── next.config.ts    # Next.js configuration
```

## Building and Running

The project is managed via `npm` commands within the `my-landing-page` directory.

### Setup
```bash
cd my-landing-page
npm install
```

### Development
To start the local development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Production Build
To build the application for production:
```bash
npm run build
```
To start the production server:
```bash
npm run start
```

### Linting
To run the linter:
```bash
npm run lint
```

## Development Conventions

*   **Styling:** Use Tailwind CSS utility classes. Custom theme colors (e.g., `medical-sand`, `medical-navy`) are defined in `src/app/globals.css`.
*   **Components:** Functional components using TypeScript. Place reusable components in `src/components`.
*   **Client Components:** Use `"use client";` at the top of files that require browser-only features (hooks, event listeners).
*   **Theme:** The design aims for a "Quiet Luxury" aesthetic, utilizing a specific color palette and serif fonts for headings.
