# Styling Guide

This document covers the design system, Tailwind CSS conventions, component styling patterns, and UI best practices.

## Design System

### Color Palette

#### Brand Colors (CSS Variables)

```css
/* globals.css */
:root {
  --color-medical-navy: #1A365D;      /* Primary brand color */
  --color-medical-white: #FDFAF7;     /* Background/cards */
  --color-medical-sand: #E8DCD2;      /* Accents/borders */
  --color-medical-text: #2D3748;      /* Body text */
}
```

**Usage in Tailwind**:
```tsx
<div className="bg-[var(--color-medical-white)]">
  <h1 className="text-[var(--color-medical-navy)]">Title</h1>
</div>
```

#### Semantic Colors

```typescript
// Component-specific colors
const colors = {
  primary: "#1A365D",        // CTA buttons, links
  secondary: "#E8DCD2",      // Secondary buttons, backgrounds
  success: "#48BB78",        // Success messages
  error: "#F56565",          // Error messages, validation
  warning: "#ED8936",        // Warning messages
  info: "#4299E1",           // Info messages
};
```

### Typography

#### Font Families

```typescript
// app/layout.tsx
import { Playfair_Display, Manrope } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",  // CSS variable
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",   // CSS variable
  display: "swap",
});
```

#### Type Scale

```css
/* Headings - Playfair Display (serif) */
h1: 48px / 56px (lg:64px / 72px)
h2: 36px / 44px (lg:48px / 56px)
h3: 28px / 36px (lg:36px / 44px)
h4: 24px / 32px
h5: 20px / 28px
h6: 18px / 28px

/* Body - Manrope (sans-serif) */
body: 16px / 24px
small: 14px / 20px
xs: 12px / 16px
```

#### Tailwind Classes

```tsx
// Headings
<h1 className="font-playfair text-4xl lg:text-6xl font-bold">
<h2 className="font-playfair text-3xl lg:text-5xl font-semibold">
<h3 className="font-playfair text-2xl lg:text-4xl font-semibold">

// Body text
<p className="font-manrope text-base leading-relaxed">
<span className="text-sm text-gray-600">
```

### Spacing System

**Based on 4px grid**:

```
4px  = space-1
8px  = space-2
12px = space-3
16px = space-4
20px = space-5
24px = space-6
32px = space-8
48px = space-12
64px = space-16
96px = space-24
```

**Component spacing patterns**:
```tsx
// Section vertical padding
<section className="py-16 lg:py-24">

// Container horizontal padding
<div className="px-4 lg:px-8">

// Card padding
<div className="p-6 lg:p-8">

// Element margins
<div className="mb-4 lg:mb-6">
```

## Tailwind CSS Conventions

### Responsive Design (Mobile-First)

```tsx
// Base styles = mobile
// sm: tablet portrait (640px+)
// md: tablet landscape (768px+)
// lg: desktop (1024px+)
// xl: large desktop (1280px+)

<div className="
  w-full              {/* mobile: full width */}
  sm:w-auto          {/* tablet+: auto width */}
  lg:w-1/2           {/* desktop: half width */}
">
```

### Utility Class Order

**Recommended order for consistency**:

1. Display & positioning
2. Box model (width, padding, margin)
3. Typography
4. Visual (colors, borders, shadows)
5. Transitions & animations
6. Responsive modifiers

```tsx
<button className="
  /* Display & positioning */
  flex items-center justify-center

  /* Box model */
  w-full px-6 py-3

  /* Typography */
  font-manrope text-base font-semibold

  /* Visual */
  bg-[var(--color-medical-navy)] text-white rounded-lg shadow-lg

  /* Transitions */
  transition-all duration-300
  hover:shadow-xl hover:scale-105

  /* Responsive */
  sm:w-auto lg:px-8 lg:py-4
">
```

### Using `cn()` Utility

**Purpose**: Merge Tailwind classes conditionally

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```tsx
import { cn } from "@/lib/utils";

// Conditional classes
<div className={cn(
  "base-class another-class",
  isActive && "active-class",
  isDisabled && "opacity-50 cursor-not-allowed",
  className  // Allow prop override
)}>

// Variant-based styling
const variants = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-800",
};

<button className={cn(variants[variant], className)}>
```

## Component Patterns

### Container Pattern

**Consistent max-width and centering**:

```tsx
// Reusable container
<div className="
  container                    {/* max-w-7xl by default */}
  mx-auto                      {/* center horizontally */}
  px-4 sm:px-6 lg:px-8        {/* responsive padding */}
">
  {/* Content */}
</div>
```

### Card Pattern

**Consistent card styling**:

```tsx
// Base card
<div className="
  bg-white
  rounded-xl
  shadow-md
  p-6 lg:p-8
  hover:shadow-xl
  transition-shadow duration-300
">
  {/* Card content */}
</div>

// Medical-themed card
<div className="
  bg-[var(--color-medical-white)]
  border border-[var(--color-medical-sand)]
  rounded-2xl
  p-6 lg:p-8
">
  {/* Card content */}
</div>
```

### Button Patterns

**Primary button**:
```tsx
<button className="
  px-6 py-3 lg:px-8 lg:py-4
  bg-[var(--color-medical-navy)]
  text-white font-semibold
  rounded-lg
  shadow-lg hover:shadow-xl
  transform hover:scale-105
  transition-all duration-300
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-medical-navy)]
">
  Começar Agora
</button>
```

**Secondary button**:
```tsx
<button className="
  px-6 py-3
  bg-transparent
  border-2 border-[var(--color-medical-navy)]
  text-[var(--color-medical-navy)] font-semibold
  rounded-lg
  hover:bg-[var(--color-medical-navy)]
  hover:text-white
  transition-all duration-300
">
  Saiba Mais
</button>
```

**Ghost button**:
```tsx
<button className="
  px-4 py-2
  text-[var(--color-medical-text)]
  hover:text-[var(--color-medical-navy)]
  hover:bg-gray-100
  rounded-md
  transition-colors duration-200
">
  Cancelar
</button>
```

### Form Input Pattern

```tsx
<input
  type="text"
  className={cn(
    "w-full px-4 py-3",
    "border border-gray-300 rounded-lg",
    "font-manrope text-base",
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-medical-navy)] focus:border-transparent",
    "placeholder:text-gray-400",
    "transition-all duration-200",
    error && "border-red-500 focus:ring-red-500"
  )}
  placeholder="Digite seu nome"
/>
```

### Form Label Pattern

```tsx
<label className="
  block
  font-manrope font-medium text-sm
  text-[var(--color-medical-text)]
  mb-2
">
  Nome Completo
</label>
```

## Framer Motion Patterns

### Fade-In Animation

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Slide-In Animation

```tsx
// From bottom
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, margin: "-100px" }}
>
  {/* Content */}
</motion.div>

// From left
<motion.div
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### Scale Animation

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Clique Aqui
</motion.button>
```

### Stagger Children

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

### Section Animation Pattern

**Standard pattern for sections**:

```tsx
<motion.section
  className="py-16 lg:py-24"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, margin: "-100px" }}
>
  <div className="container mx-auto px-4">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="font-playfair text-4xl lg:text-5xl font-bold text-center mb-12"
    >
      Section Title
    </motion.h2>

    {/* Content with stagger */}
  </div>
</motion.section>
```

## Radix UI Styling

### Avatar Component

```tsx
import * as Avatar from "@radix-ui/react-avatar";

<Avatar.Root className="inline-flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-gray-100">
  <Avatar.Image
    src={avatarUrl}
    alt="User"
    className="h-full w-full object-cover"
  />
  <Avatar.Fallback className="font-manrope font-semibold text-[var(--color-medical-navy)]">
    UA
  </Avatar.Fallback>
</Avatar.Root>
```

### Scroll Area Component

```tsx
import * as ScrollArea from "@radix-ui/react-scroll-area";

<ScrollArea.Root className="h-96 overflow-hidden rounded-lg">
  <ScrollArea.Viewport className="h-full w-full">
    {/* Scrollable content */}
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar
    className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-150 ease-out hover:bg-gray-200"
    orientation="vertical"
  >
    <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

## Accessibility Best Practices

### Focus States

**Always style focus states**:
```tsx
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-[var(--color-medical-navy)]
">
```

### ARIA Labels

```tsx
// Icon buttons
<button aria-label="Fechar chat">
  <XIcon />
</button>

// Form inputs
<input
  type="text"
  aria-label="Nome completo"
  aria-required="true"
  aria-invalid={error ? "true" : "false"}
/>

// Loading states
<div role="status" aria-live="polite">
  Carregando...
</div>
```

### Semantic HTML

```tsx
// Use semantic tags
<header>
  <nav>
    <ul>
      <li><a href="/privacidade">Privacidade</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <section>
      <h2>Título</h2>
      <p>Conteúdo</p>
    </section>
  </article>
</main>

<footer>
  {/* Footer content */}
</footer>
```

## Responsive Images

### next/image Pattern

```tsx
import Image from "next/image";

<Image
  src="/hero-image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  priority              {/* For above-fold images */}
  className="rounded-xl"
/>

// Responsive fill
<div className="relative w-full h-64 lg:h-96">
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    className="object-cover"
  />
</div>
```

## Dark Mode Support

**Currently not implemented, but here's the pattern**:

```tsx
// Add to tailwind.config.ts
module.exports = {
  darkMode: "class",
  // ...
};

// Usage
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
">
```

## Performance Considerations

### CSS-in-JS vs Tailwind

**Prefer Tailwind for**:
- Static styles
- Responsive design
- Hover/focus states

**Use CSS-in-JS (styled-components) for**:
- Dynamic styles based on props
- Complex calculations
- Component-scoped animations

### Avoiding Layout Shift

```tsx
// Reserve space for images
<div className="aspect-video bg-gray-100">
  <Image src="..." fill className="object-cover" />
</div>

// Reserve space for dynamic content
<div className="min-h-[200px]">
  {loading ? <Skeleton /> : <Content />}
</div>
```

### Optimizing Animations

```tsx
// Use transform and opacity (GPU-accelerated)
<motion.div
  animate={{
    opacity: 1,      // ✓ Good
    x: 100,          // ✓ Good (transform)
    scale: 1.5,      // ✓ Good (transform)
    // width: "100%", // ✗ Avoid (causes reflow)
    // height: "auto", // ✗ Avoid (causes reflow)
  }}
>
```

---

**Related Docs**:
- [Architecture](./architecture.md) - Component patterns
- [Troubleshooting](./troubleshooting.md) - Styling issues
- Tailwind docs: https://tailwindcss.com
- Framer Motion docs: https://www.framer.com/motion
