# Coding Conventions

**Analysis Date:** 2026-04-05

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ServiceCard.tsx`, `ContactForm.tsx`, `Header.tsx`)
- Utilities/libraries: camelCase (e.g., `contactSchema.ts`, `sendContactEmail.ts`)
- Payload collections: PascalCase (e.g., `Users.ts`, `Programmes.ts`, `Resultats.ts`)
- Directories: kebab-case (e.g., `page-content`, `rich-text-lexical`)

**Functions:**
- React components: PascalCase, default export (e.g., `export default function ServiceCard()`)
- Server actions: camelCase, named export (e.g., `export async function sendContactEmail()`)
- Utility functions: camelCase (e.g., `extractPlainText`, `lexicalParagraph`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleSubmit`, `handleScroll`, `handleConsent`)

**Variables:**
- State: camelCase (e.g., `scrolled`, `menuOpen`, `submitted`, `serverError`)
- Constants: camelCase (e.g., `navLinks`, `iconMap`, `metaItems`)
- Object keys in Payload schemas: camelCase (e.g., `prenomClient`, `photosAvant`, `publicCible`)

**Types:**
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `ServiceCardProps`, `FloatingWhatsAppProps`)
- Type aliases: PascalCase (e.g., `ContactFormState`, `ContactFormValues`, `IconComponent`)
- Payload collection types: Auto-generated via `generate:types` script, use `z.infer<>` for schema-derived types

## Code Style

**Formatting:**
- No explicit formatter configured (Prettier dev dependency exists but no `.prettierrc` file)
- Code observed follows consistent style:
  - 2-space indentation (inferred from all source files)
  - Single quotes in TypeScript (`'use client'`, `'use server'`)
  - Semicolons at end of statements
  - Trailing commas in multiline objects/arrays

**Linting:**
- ESLint 9.x configured as dev dependency
- Uses `eslint-config-next` (Next.js recommended rules) and `eslint-config-prettier` (Prettier compatibility)
- No custom `.eslintrc.*` file; using Next.js default lint config
- Run via `npm run lint` (calls `next lint`)

**Imports:**
- Named imports when using multiple exports (e.g., `import { useState, useEffect } from 'react'`)
- Default imports for single-export modules (e.g., `import ServiceCard from '@/components/ui/ServiceCard'`)
- Type imports with `type` keyword (e.g., `import type { Metadata } from 'next'`, `import type { CollectionConfig } from 'payload'`)
- All imports grouped and organized (see Import Organization below)

## Import Organization

**Order:**
1. External packages and libraries (e.g., `react`, `next`, `payload`, third-party)
2. Types from external packages (e.g., `import type { ... } from 'next'`)
3. Relative app imports from `@/` alias (components, actions, lib)
4. Relative types from app (e.g., `import type { ... } from '@/lib/contactSchema'`)

**Path Aliases:**
- `@/*` → `./src/*` (configured in `tsconfig.json`)
- `@payload-config` → `./src/payload.config.ts` (configured in `tsconfig.json`)
- Use `@/` for all imports within the codebase (never use relative paths like `../..`)

**Example from `ContactForm.tsx`:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/contactSchema'
import { sendContactEmail } from '@/app/actions/sendContactEmail'
```

## Component Structure

**Client Components:**
- Use `'use client'` directive at top (e.g., `ContactForm.tsx`, `Header.tsx`, `CookieBanner.tsx`)
- Props interface immediately after imports (e.g., `interface ServiceCardProps`)
- Component function default export
- Inline styles use Tailwind classes; CSS variables for transitions (e.g., `style={{ transitionDuration: 'var(--transition-fast)' }}`)

**Server Components:**
- No `'use client'` directive (e.g., `page.tsx` files, layout components)
- Use `async/await` for data fetching
- Return JSX directly without React.ReactNode type annotation unless necessary

**Example from `ContactForm.tsx`:**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { contactSchema, type ContactFormValues } from '@/lib/contactSchema'
import { sendContactEmail } from '@/app/actions/sendContactEmail'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nom: '', email: '', message: '', website: '' },
  })

  const onSubmit = async (data: ContactFormValues) => {
    // handler logic
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

## Error Handling

**Server Actions:**
- Return discriminated union types (tagged unions) with `status` field for explicit error states
- Examples: `{ status: 'success' }`, `{ status: 'error'; message: string }`, `{ status: 'validation_error'; errors: Record<string, string[]> }`
- Use `Zod.safeParse()` for validation, extract errors via `parsed.error.flatten().fieldErrors`
- Catch all errors in try-catch blocks, log via `console.error()`, return user-friendly error messages

**Client Components:**
- State management for errors: `const [serverError, setServerError] = useState<string | null>(null)`
- Conditional rendering based on status (e.g., `if (result.status === 'success')`, `else if (result.status === 'error')`)
- Display user-friendly French error messages in UI

**Example from `sendContactEmail.ts`:**
```typescript
export async function sendContactEmail(formData: ContactFormValues): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      status: 'validation_error',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  
  try {
    const { error } = await resend.emails.send({...})
    if (error) {
      console.error('Resend error:', error)
      return { status: 'error', message: 'Une erreur est survenue.' }
    }
    return { status: 'success' }
  } catch (err) {
    console.error('Email send error:', err)
    return { status: 'error', message: 'Une erreur est survenue.' }
  }
}
```

## Logging

**Framework:** `console` (built-in Node.js/browser console)

**Patterns:**
- Log errors with `console.error()` when exceptions or service failures occur
- Include context (e.g., `console.error('Resend error:', error)`)
- No structured logging framework (pino, winston) in use
- Logs output to stdout/stderr during development and production

**Example:**
```typescript
if (error) {
  console.error('Resend error:', error)
  return { status: 'error', message: 'Une erreur est survenue.' }
}
```

## Comments

**When to Comment:**
- Explain non-obvious logic or design decisions (e.g., honeypot spam prevention)
- Reference design documents or constraints (e.g., `per D-11`, `per CLAUDE.md`)
- Document workarounds and temporary solutions (e.g., `TODO: In production, replace with...`)
- Explain why, not what (code structure is self-documenting)

**JSDoc/TSDoc:**
- Not systematically used in current codebase
- Recommend using JSDoc for exported functions and complex types
- Example pattern (not yet present): `/** Sends contact form email via Resend API. Returns result object with status and optional error message. */`

**Examples from codebase:**
```typescript
// Honeypot check — bots fill the hidden "website" field; humans leave it empty
// Return fake success to avoid tipping off the bot (per D-11)
if (parsed.data.website !== '') {
  return { status: 'success' }
}

// TODO: In production, replace 'onboarding@resend.dev' with verified 'noreply@antoineprofit.com'
const { error } = await resend.emails.send({
  from: 'Site Antoine Profit <onboarding@resend.dev>',
  ...
})
```

## Function Design

**Size:**
- Functions are kept concise and focused
- Payload collection configs are single-responsibility (one collection per file)
- React components are typically 50–150 lines (component definition + JSX)
- Utility functions extracted for reusability (e.g., `lexicalParagraph()`, `extractPlainText()`)

**Parameters:**
- Use destructuring for object props in React components (e.g., `function ServiceCard({ titre, description, icone })`)
- Use object parameters for multiple related values (not varargs)
- Type all parameters with TypeScript

**Return Values:**
- Components return JSX
- Utility functions return typed values (never `any`)
- Server actions return discriminated union types for explicit error handling

**Example from `ServiceCard.tsx`:**
```typescript
interface ServiceCardProps {
  titre: string
  description: string
  icone: string
}

export default function ServiceCard({ titre, description, icone }: ServiceCardProps) {
  const IconComponent: IconComponent = iconMap[icone.toLowerCase()] ?? Star
  return <div>...</div>
}
```

## Module Design

**Exports:**
- Default export for React components (one component per file)
- Named exports for utilities, schemas, and server actions
- Type exports using `export type` keyword
- Avoid exporting multiple components from one file

**Barrel Files:**
- Not used in current structure
- Each component imports directly from its file (e.g., `import ServiceCard from '@/components/ui/ServiceCard'`)

**File Organization:**
- Components grouped by purpose: `layout/` (Header, Footer), `ui/` (reusable), `sections/` (page sections), `admin/` (admin-specific)
- Collections grouped in `collections/` directory (one per file)
- Globals (shared config) in `globals/` directory
- Utility functions and schemas in `lib/` directory
- Server actions in `app/actions/` directory

## TypeScript Patterns

**Type Inference:**
- Prefer inferred types where context is clear (e.g., `const navLinks = [...]` infers array type)
- Explicit types for state and component props
- Use `z.infer<typeof schema>` to derive types from Zod schemas instead of manual type definitions

**Example from `contactSchema.ts`:**
```typescript
export const contactSchema = z.object({
  nom: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

**Never:**
- Don't use `any` type (TypeScript strict mode prevents this)
- Don't use string literal union types for repeated values (use constants or enums)
- Don't manually type what Zod/Payload already generates

## Styling Conventions

**Framework:** Tailwind CSS 4.x utility classes

**Patterns:**
- All inline styles via className (Tailwind utilities)
- CSS variables for design tokens (e.g., `--transition-base`, `--transition-fast`, `--transition-slow`)
- Color tokens as custom classes (e.g., `text-bleu-nuit`, `bg-bleu-electrique`, `text-gris-ardoise`)
- Responsive design via Tailwind breakpoints (`sm:`, `lg:`, etc.)
- Use `style={{}}` only for CSS custom properties and dynamic values (e.g., `style={{ transitionDuration: 'var(--transition-fast)' }}`)

**Example:**
```typescript
<button
  className="w-full bg-bleu-electrique text-blanc-pur rounded-full px-8 py-4 font-heading text-sm hover:brightness-110 transition-all disabled:opacity-50"
  style={{ transitionDuration: 'var(--transition-fast)' }}
>
  Envoyer
</button>
```

## Data Validation

**Framework:** Zod 3.x

**Pattern:**
- Define schema in `lib/` directory (e.g., `contactSchema.ts`)
- Use `schema.safeParse(data)` for safe validation with error handling
- Derive TypeScript types from schemas via `z.infer<typeof schema>`
- Validate on both client (react-hook-form with zodResolver) and server (server action)
- Never trust client validation alone; always re-validate on server

**Example:**
```typescript
export const contactSchema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10).max(2000),
  website: z.string().max(0), // Honeypot field
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

---

*Convention analysis: 2026-04-05*
