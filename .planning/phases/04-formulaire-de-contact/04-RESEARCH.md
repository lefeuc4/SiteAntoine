# Phase 4: Formulaire de Contact - Research

**Researched:** 2026-04-03
**Domain:** Next.js Server Actions, Resend email API, Payload CMS Globals, react-hook-form, Zod, WhatsApp deep links, honeypot anti-spam
**Confidence:** HIGH

## Summary

Phase 4 adds a functional contact form, a floating WhatsApp button, and a Payload Global to configure contact settings (WhatsApp number, pre-filled message, social links). All user decisions are locked in CONTEXT.md — no architectural exploration needed.

The critical new infrastructure is: (1) a `ContactSettings` Payload Global (new concept, not yet in the codebase), (2) three new packages to install (`resend`, `react-hook-form`, `@hookform/resolvers`+`zod`), and (3) a Server Action file for form submission. Zod is listed in CLAUDE.md but is not yet installed.

The floating WhatsApp button is a Client Component that must be imported into `src/app/(frontend)/layout.tsx` — the layout currently wraps all public pages and has no client components. The button needs `ContactSettings` data passed from the (currently Server Component) layout, which means either the layout fetches Globals server-side and passes props, or the button fetches its own data via a separate API call.

**Primary recommendation:** Use `payload.findGlobal({ slug: 'contact-settings' })` in the frontend layout (Server Component) to fetch WhatsApp config once, then pass `whatsappNumber` and `whatsappMessage` as props to the floating button Client Component. This avoids any client-side API calls for public-facing data.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Page layout
- **D-01:** Page /contact avec formulaire centre (max-width), lien WhatsApp en dessous, puis icones reseaux sociaux (Instagram + Facebook)
- **D-02:** Pas de hero ni d'infos supplementaires (horaires, adresse) — page epuree et focalisee
- **D-03:** Reseaux sociaux : Instagram + Facebook affiches en icones simples sous le bloc WhatsApp
- **D-04:** Liens reseaux sociaux configurables par Antoine depuis l'admin (Global Payload avec les URLs Instagram/Facebook)

#### WhatsApp integration
- **D-05:** Lien WhatsApp present sur la page /contact (bloc sous le formulaire) ET bouton flottant visible sur toutes les pages du site
- **D-06:** Numero WhatsApp et message pre-rempli configurables depuis un Global Payload (ex: "Bonjour Antoine, je suis interesse par vos services...")
- **D-07:** Le bouton flottant ouvre wa.me avec le meme numero et message pre-rempli que la page contact

#### Confirmation UX
- **D-08:** Apres envoi du formulaire, message de succes inline remplacant le formulaire ("Merci, je vous reponds sous 24h" + icone check)
- **D-09:** Pas de page de confirmation separee, pas de redirect
- **D-10:** Pas d'email de confirmation automatique au visiteur — seul Antoine recoit l'email

#### Anti-spam
- **D-11:** Honeypot seul — champ invisible rempli par les bots, ignore par les humains. Zero friction visiteur.
- **D-12:** Pas de reCAPTCHA ni de rate limiting — honeypot suffisant pour un site a faible trafic

### Claude's Discretion
- Design exact du bouton WhatsApp flottant (taille, position, animation)
- Style des icones reseaux sociaux (taille, espacement, hover effects)
- Textes placeholder du formulaire et message de succes exact
- Implementation technique du Global Payload (SiteSettings ou ContactSettings)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CTCT-01 | Formulaire de contact fonctionnel (nom, email, message) avec envoi par email | Server Action + Resend + react-hook-form + Zod; honeypot implemented as hidden field validated server-side |
| CTCT-02 | Lien WhatsApp accessible depuis le site | wa.me URL with encoded pre-filled message; ContactSettings Global provides number and message; floating button in layout.tsx |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- **Stack**: Next.js 16 + Payload CMS 3 + Neon PostgreSQL + Tailwind CSS 4 — no alternatives
- **Email**: Resend (npm package) via Server Actions — no SMTP, no Nodemailer
- **Form validation**: react-hook-form 7.x + Zod 3.x — no alternatives
- **Routing**: App Router only — no Pages Router
- **Language**: French — all copy, labels, errors, admin in French
- **Styling**: Tailwind CSS v4 utility classes with @theme tokens from globals.css — no new colors or font sizes this phase
- **Admin**: Payload built-in — no custom auth system
- **Icons**: lucide-react (already installed) — no new icon library
- **Components**: Hand-rolled following existing patterns — shadcn not initialized (confirmed in UI-SPEC)
- **GSD Workflow**: All file changes must go through GSD entry points

---

## Standard Stack

### Core (new packages to install this phase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| resend | 4.3.0 | Email delivery API | Listed in CLAUDE.md as the project standard; designed for Next.js; free tier 3,000 emails/month |
| react-hook-form | 7.72.1 | Form state management + submission | Listed in CLAUDE.md; zero re-render on keystroke; works with Server Actions |
| zod | 4.3.6 | Schema validation | Listed in CLAUDE.md; single schema for client + server validation |
| @hookform/resolvers | 5.2.2 | Bridge react-hook-form to Zod | Required companion for zodResolver |

### Already installed (no new installs needed)

| Library | Version | Purpose |
|---------|---------|---------|
| lucide-react | ^1.7.0 | Icons (CheckCircle, MessageCircle, Loader2) |
| payload | ^3.81.0 | CMS — Globals API for ContactSettings |
| next | ^16.2.2 | Server Actions, App Router, next/font |
| tailwindcss | ^4.2.2 | Styling with @theme tokens |

**Version verification (npm registry, 2026-04-03):**

```
resend:              4.3.0   (verified via npm view)
react-hook-form:     7.72.1  (verified via npm view)
zod:                 4.3.6   (verified via npm view)
@hookform/resolvers: 5.2.2   (verified via npm view)
```

Note: CLAUDE.md recommends `zod@3.x` — actual latest is 4.3.6. Zod 4 is a major version. Verify compatibility with react-hook-form and @hookform/resolvers before installing. If breakage found, pin to `zod@3` explicitly.

**Installation:**

```bash
pnpm add resend react-hook-form @hookform/resolvers zod
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Nodemailer+SMTP | CLAUDE.md forbids it; also requires SMTP server config |
| react-hook-form | native useActionState | RHF gives field-level error display and client validation without boilerplate |
| Payload Global | env var for WhatsApp number | Global allows Antoine to update without code deploy — required by D-06 |

---

## Architecture Patterns

### Recommended Project Structure (additions this phase)

```
src/
├── globals/
│   └── ContactSettings.ts       # Payload Global definition (new)
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx            # Modified: import + render FloatingWhatsApp
│   │   └── contact/
│   │       └── page.tsx          # New: /contact page (Server Component)
│   └── actions/
│       └── sendContactEmail.ts   # New: Server Action ("use server")
└── components/
    ├── sections/
    │   ├── ContactForm.tsx        # New: Client Component (react-hook-form)
    │   ├── WhatsAppBlock.tsx      # New: Server Component (link to wa.me)
    │   └── SocialBlock.tsx        # New: Server Component (Instagram + Facebook)
    └── ui/
        └── FloatingWhatsApp.tsx   # New: Client Component (entrance animation)
```

`payload.config.ts` must be updated to register the new Global in the `globals` array.

### Pattern 1: Payload Global Definition

**What:** A singleton document in Payload CMS for site-wide configuration data that Antoine can edit from the admin panel.
**When to use:** Any data that is site-wide, single-value, and must be editable without code deployment.

```typescript
// src/globals/ContactSettings.ts
// Source: https://payloadcms.com/docs/configuration/globals (HIGH confidence)
import type { GlobalConfig } from 'payload'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Parametres Contact',
  admin: {
    description: 'Numero WhatsApp, message pre-rempli et liens reseaux sociaux',
  },
  access: {
    read: () => true, // Public read — same pattern as collections in Phase 1
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'Numero WhatsApp (format international sans +)',
      required: true,
      defaultValue: '33600000000',
    },
    {
      name: 'whatsappMessage',
      type: 'text',
      label: 'Message pre-rempli WhatsApp',
      required: true,
      defaultValue: 'Bonjour Antoine, je suis interesse par vos services...',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'URL Instagram',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'URL Facebook',
    },
  ],
}
```

Register in `payload.config.ts`:
```typescript
// Add to buildConfig:
globals: [ContactSettings],
```

### Pattern 2: Querying a Global in a Server Component

**What:** Fetch Global data server-side for rendering — no client-side fetch needed.
**When to use:** Any page or layout that needs Global data at render time.

```typescript
// Source: Payload Local API — same pattern as payload.find() already used in project
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const contactSettings = await payload.findGlobal({
  slug: 'contact-settings',
})
// contactSettings.whatsappNumber, contactSettings.whatsappMessage, etc.
```

Known issue: Payload 3 `findGlobal` TypeScript types may be incomplete without a `select` parameter (GitHub issue #14383). The returned object should still have all fields at runtime — add type assertion if needed.

### Pattern 3: Server Action for Form Submission

**What:** `"use server"` function called by the ContactForm Client Component to validate and send email.
**When to use:** Any form submission that must stay server-side (API key protection, Resend).

```typescript
// src/app/actions/sendContactEmail.ts
// Source: Pattern from resend.com/docs + Next.js Server Actions docs
'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10, 'Veuillez ecrire votre message.').max(2000),
  website: z.string().max(0), // honeypot — must be empty
})

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation_error'; errors: Record<string, string[]> }

export async function sendContactEmail(
  formData: { nom: string; email: string; message: string; website: string }
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      status: 'validation_error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Honeypot check — silent discard
  if (parsed.data.website !== '') {
    return { status: 'success' } // Lie to the bot
  }

  const { error } = await resend.emails.send({
    from: 'Site Web <contact@antoineprofit.com>',
    to: [process.env.CONTACT_EMAIL!],
    subject: `Nouveau message de ${parsed.data.nom} via antoineprofit.com`,
    text: `Nom: ${parsed.data.nom}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
  })

  if (error) {
    return { status: 'error', message: 'Une erreur est survenue. Veuillez reessayer.' }
  }

  return { status: 'success' }
}
```

### Pattern 4: ContactForm Client Component with react-hook-form

**What:** Client Component that manages form state, calls Server Action, shows loading/success/error states.
**When to use:** Any form requiring client-side UX (field-level errors, loading state, inline success message).

```typescript
// src/components/sections/ContactForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { sendContactEmail } from '@/app/actions/sendContactEmail'
import { Loader2, CheckCircle } from 'lucide-react'

const schema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10, 'Veuillez ecrire votre message.').max(2000),
  website: z.string().max(0),
})
type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nom: '', email: '', message: '', website: '' },
  })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    const result = await sendContactEmail(data)
    if (result.status === 'success') {
      setSubmitted(true)
    } else {
      setServerError('Une erreur est survenue. Veuillez reessayer ou nous contacter directement via WhatsApp.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <CheckCircle size={48} className="text-vert-energie" />
        <h2 className="font-heading font-bold text-xl text-bleu-nuit">Message envoye !</h2>
        <p className="text-base text-gris-ardoise">Merci, je vous reponds dans les 24 heures.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from humans, visible to bots */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}>
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" type="text" tabIndex={-1} aria-hidden="true" {...register('website')} />
      </div>
      {/* ... visible fields ... */}
    </form>
  )
}
```

### Pattern 5: WhatsApp wa.me URL Construction

**What:** Build wa.me deep link URL from phone number and pre-filled message.
**When to use:** Both the /contact block and the floating button.

```typescript
// Source: Meta WhatsApp Click-to-Chat documentation (MEDIUM confidence, multiple sources)
// Phone number: international format, no +, no spaces (e.g., "33612345678")
// Message: URL encoded with encodeURIComponent
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
```

`encodeURIComponent` handles spaces as `%20` and all special characters. This is the correct encoding for wa.me (NOT `+` for spaces, which is only for `application/x-www-form-urlencoded`).

### Pattern 6: Floating WhatsApp Button in Frontend Layout

**What:** Client Component (needs `useEffect` for entrance animation) imported into the Server Component layout.
**When to use:** Global UI element that appears on all public pages.

The current `src/app/(frontend)/layout.tsx` is a Server Component. The floating button is a `'use client'` component. This is valid — Server Components can import Client Components and pass serializable props to them.

```typescript
// src/app/(frontend)/layout.tsx (modified)
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp'
// ... (existing imports)

export default async function FrontendLayout({ children }) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'contact-settings' })

  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp
          whatsappNumber={settings.whatsappNumber}
          whatsappMessage={settings.whatsappMessage}
        />
      </body>
    </html>
  )
}
```

### Anti-Patterns to Avoid

- **Fetching ContactSettings on the client side:** Adds a waterfall, exposes internal data shape, and is unnecessary when layout can fetch server-side.
- **Using `display: none` for honeypot:** Some bots skip `display: none` fields. Use `position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0` per UI-SPEC.
- **Initializing `new Resend()` inside the action function body:** Should be at module scope (outside the function) for efficiency. Safe because Server Actions run only on the server.
- **Forgetting `noValidate` on `<form>`:** Without it, browser native validation UI fires before react-hook-form validation, creating a mixed UX.
- **Missing `CONTACT_EMAIL` env var:** The Resend `to` address must come from env, not be hardcoded. Antoine's email address should not be in source code.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP, Nodemailer | Resend SDK | Deliverability, SPF/DKIM managed, free tier sufficient |
| Form validation | Custom validation functions | Zod + react-hook-form + zodResolver | Type inference, shared client/server schema, field-level errors |
| Admin UI for contact settings | Custom settings page | Payload Global with access: read: () => true | Zero code, immediate admin panel, type-safe |
| WhatsApp URL construction | Custom URL builder | `wa.me/${number}?text=${encodeURIComponent(msg)}` | One-liner, no library needed |

**Key insight:** Every "custom solution" in this phase adds a maintenance burden. Payload Globals + Resend + react-hook-form are all designed to solve exactly these problems at this scale.

---

## Common Pitfalls

### Pitfall 1: Payload Global not registered in buildConfig

**What goes wrong:** `payload.findGlobal({ slug: 'contact-settings' })` throws "Global not found" at runtime.
**Why it happens:** Global is defined in its own file but not added to `globals: [...]` in `payload.config.ts`.
**How to avoid:** Always update `payload.config.ts` in the same task that creates the Global file.
**Warning signs:** TypeScript error "Argument of type 'contact-settings' is not assignable" — Payload generates strict slug types.

### Pitfall 2: Resend "from" address not verified

**What goes wrong:** Resend rejects the email send with "Domain not verified" or "Sender not authorized".
**Why it happens:** Resend requires the "from" domain to be verified via DNS records, OR you use their sandbox domain `onboarding@resend.dev` during development.
**How to avoid:** For v1 development: use `onboarding@resend.dev` as the from address and Antoine's email as the `to` address. For production: verify `antoineprofit.com` domain in Resend dashboard and add DNS records.
**Warning signs:** Resend API returns `{ error: { name: 'validation_error', message: 'The gmail.com domain is not verified...' } }`.

### Pitfall 3: Missing RESEND_API_KEY env var on Vercel

**What goes wrong:** Email sends fail silently in production; server action returns error state.
**Why it happens:** `RESEND_API_KEY` and `CONTACT_EMAIL` are not set in Vercel environment variables.
**How to avoid:** Document both env vars in `.env.example`. Include a note in the phase verification checklist.
**Warning signs:** `new Resend(undefined)` — Resend constructor with undefined key.

### Pitfall 4: Frontend layout becomes a Client Component

**What goes wrong:** If `FloatingWhatsApp` import causes the layout to become a Client Component, `getPayload` (server-only) will throw.
**Why it happens:** Adding `'use client'` directive accidentally to layout.tsx, or using a hook directly in the layout.
**How to avoid:** Keep layout.tsx as an async Server Component. Only `FloatingWhatsApp.tsx` has `'use client'`. The layout passes serializable string props to it.
**Warning signs:** Next.js build error "You're importing a component that needs `useState`/`useEffect`, which only works in a Client Component."

### Pitfall 5: Zod version incompatibility

**What goes wrong:** `@hookform/resolvers@5.2.2` may not support Zod 4.x if it targets Zod 3.x internals.
**Why it happens:** CLAUDE.md recommends `zod@3.x`, but the latest published version is 4.3.6 (major version bump in 2026).
**How to avoid:** Before installing, run `npm info @hookform/resolvers@5.2.2 peerDependencies` to confirm which Zod version it expects. Install the version it specifies.
**Warning signs:** TypeScript type errors on `zodResolver(schema)`.

### Pitfall 6: wa.me URL with `+` instead of `%20`

**What goes wrong:** Pre-filled message contains literal `+` characters instead of spaces on mobile WhatsApp.
**Why it happens:** Using `encodeURI` instead of `encodeURIComponent`, or manually replacing spaces with `+`.
**How to avoid:** Always use `encodeURIComponent(whatsappMessage)` — it encodes spaces as `%20` which wa.me handles correctly.
**Warning signs:** WhatsApp opens but the pre-filled message looks like "Bonjour+Antoine%2C+je+suis...".

---

## Code Examples

### Global Field Access After findGlobal

```typescript
// Source: Payload Local API docs (HIGH confidence)
const settings = await payload.findGlobal({ slug: 'contact-settings' })
// TypeScript: cast to any if type inference is incomplete (known Payload 3 issue #14383)
const number = (settings as any).whatsappNumber as string
const message = (settings as any).whatsappMessage as string
const instagram = (settings as any).instagramUrl as string | undefined
const facebook = (settings as any).facebookUrl as string | undefined
```

After `payload-types.ts` regenerates (it auto-generates on `pnpm dev` restart), types should be available as `ContactSettings` from `@/payload-types`.

### Resend email send (minimal, text-only, no react-email needed)

```typescript
// Source: resend.com/docs (HIGH confidence)
// Note: react-email is optional — plain text or HTML string is sufficient for a contact form
const { data, error } = await resend.emails.send({
  from: 'Site Antoine Profit <onboarding@resend.dev>', // dev: use sandbox; prod: use verified domain
  to: [process.env.CONTACT_EMAIL!],
  replyTo: formData.email, // Allows Antoine to reply directly to the visitor
  subject: `Nouveau message de ${formData.nom} via antoineprofit.com`,
  text: `Nom: ${formData.nom}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
})
```

The `replyTo` field is important: it lets Antoine hit "Reply" in his inbox and reach the visitor directly.

### Zod schema (matches UI-SPEC exactly)

```typescript
// Source: UI-SPEC Validation Rules section (project document)
import { z } from 'zod'

export const contactSchema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10, 'Veuillez ecrire votre message.').max(2000),
  website: z.string().max(0), // honeypot — must be empty string
})
export type ContactFormValues = z.infer<typeof contactSchema>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Route Handler (POST /api/send) | Server Action (`'use server'`) | Next.js 14+ | No API endpoint needed; callable directly from Client Component |
| react-email required for Resend | Plain text or HTML string | Always supported | react-email is optional; use it only if rich HTML templates are needed |
| `encodeURI` for WhatsApp | `encodeURIComponent` | Always correct | `encodeURI` doesn't encode `?` and `&` which break the URL |
| Payload Globals via REST API on client | `payload.findGlobal` in Server Component | Payload 3 + Next.js App Router | Zero client requests, no CORS, type-safe |

**Deprecated/outdated:**
- `Pages Router API routes` for email: replaced by Server Actions in App Router — project is App Router only.
- `react-email` as a hard requirement: it's optional; plain text email is adequate for a contact form notification.

---

## Open Questions

1. **Zod version to install**
   - What we know: CLAUDE.md says `zod@3.x`; npm registry shows `4.3.6` as latest; `@hookform/resolvers@5.2.2` peer deps need checking
   - What's unclear: Whether `@hookform/resolvers@5.2.2` supports Zod 4 or requires Zod 3
   - Recommendation: Planner task should include `npm info @hookform/resolvers@5.2.2 peerDependencies` before installing; pin to `zod@3` if resolvers require it

2. **Resend `from` address for dev vs production**
   - What we know: Resend requires verified domain for production; sandbox `onboarding@resend.dev` works for testing
   - What's unclear: Whether Antoine has already verified `antoineprofit.com` with Resend
   - Recommendation: Use sandbox address in v1 implementation; add a comment noting the production change needed; document in `.env.example`

3. **`CONTACT_EMAIL` env var value**
   - What we know: Antoine's email address must be in env vars, not source code
   - What's unclear: The actual address (not needed for planning)
   - Recommendation: Add `CONTACT_EMAIL=` to `.env.example` with a placeholder; Antoine fills it in Vercel env vars

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | pnpm install, builds | Yes | v20.20.2 | — |
| pnpm | Package installs | Yes (via nvm) | check with `pnpm --version` | npm |
| resend npm package | Email sending | Not installed | — | Install via pnpm |
| react-hook-form | Form management | Not installed | — | Install via pnpm |
| zod | Schema validation | Not installed | — | Install via pnpm |
| @hookform/resolvers | RHF+Zod bridge | Not installed | — | Install via pnpm |
| RESEND_API_KEY | Resend SDK init | Unknown (env var) | — | Create free Resend account |
| CONTACT_EMAIL | Email delivery target | Unknown (env var) | — | Add to .env.local |
| Vercel Blob | Media (existing) | Yes (already configured) | — | — |
| Neon PostgreSQL | Payload DB | Yes (already configured) | — | — |

**Missing dependencies with no fallback:**
- `resend`, `react-hook-form`, `zod`, `@hookform/resolvers` — must be installed; Wave 0 task

**Missing dependencies with fallback:**
- `RESEND_API_KEY` — without it, email send fails; fallback is to log to console in dev mode

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected (no jest.config, no vitest.config, no test/ directory) |
| Config file | none — Wave 0 gap |
| Quick run command | none — manual testing only |
| Full suite command | none — manual testing only |

Note: This project has no automated test infrastructure as of Phase 3 completion. Given the nature of Phase 4 (UI + email integration + Payload Global), tests would require mocking Resend and Payload, which adds significant setup overhead. The planner should assess whether to add a test framework (Wave 0) or rely on manual verification for this phase.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CTCT-01 | Form submit sends email with correct fields | integration | none available | Wave 0 gap |
| CTCT-01 | Honeypot-filled submission returns success without sending | unit (Server Action) | none available | Wave 0 gap |
| CTCT-01 | Zod validation rejects empty nom/invalid email/short message | unit (schema) | none available | Wave 0 gap |
| CTCT-02 | wa.me URL built correctly from env config | unit (URL builder) | none available | Wave 0 gap |
| CTCT-02 | FloatingWhatsApp renders on all public pages | smoke (visual) | manual | — |

### Sampling Rate

- **Per task commit:** Manual: load `/contact` in browser, submit form, check email
- **Per wave merge:** Manual regression: all 5 public pages render + contact form submits
- **Phase gate:** All success criteria in ROADMAP.md verified manually before `/gsd:verify-work`

### Wave 0 Gaps

Given no test infrastructure exists:
- [ ] Consider: `src/__tests__/contactSchema.test.ts` — unit test Zod schema, no mocking needed
- [ ] Consider: `src/__tests__/whatsappUrl.test.ts` — unit test URL builder function
- [ ] Framework install if proceeding: `pnpm add -D vitest @vitejs/plugin-react` (lightweight, no DOM needed for unit tests)

*(If planner decides testing is out of scope for this phase: "Manual verification covers phase gate — no Wave 0 test infrastructure needed")*

---

## Sources

### Primary (HIGH confidence)
- [Payload Globals documentation](https://payloadcms.com/docs/configuration/globals) — Global definition, fields, access, `payload.findGlobal`
- [Resend Next.js guide](https://resend.com/docs/send-with-nextjs) — `resend.emails.send()` API, RESEND_API_KEY env var
- [Next.js Server Actions guide](https://nextjs.org/docs/app/guides/forms) — `'use server'` directive, form handling pattern
- Project source code — `src/payload.config.ts`, `src/app/(frontend)/layout.tsx`, `src/app/globals.css` (direct inspection)
- `npm view resend version`, `npm view react-hook-form version`, `npm view zod version`, `npm view @hookform/resolvers version` — package versions verified 2026-04-03

### Secondary (MEDIUM confidence)
- [WhatsApp Click-to-Chat URL format](https://support.wati.io/en/articles/11462980-how-to-create-whatsapp-click-to-chat-links) — wa.me format, `encodeURIComponent` for message
- [Meta Developer Community thread on wa.me pre-filled messages](https://developers.facebook.com/community/threads/957849225969148/) — confirms `?text=` parameter
- [react-hook-form + Server Actions pattern](https://markus.oberlehner.net/blog/using-react-hook-form-with-react-19-use-action-state-and-next-js-15-app-router) — RHF 7.x + React 19 + Next.js 15+ App Router
- [Resend free tier: 3,000 emails/month, 100/day](https://resend.com/blog/new-free-tier) — confirmed adequate for low-traffic site
- [Honeypot CSS implementation](https://dev.to/rohitnirban/honeypot-for-spam-prevention-react-tailwind-css-57lh) — `position: absolute; opacity: 0; pointer-events: none` pattern
- [Payload GitHub issue #14383](https://github.com/payloadcms/payload/issues/14383) — `findGlobal` type incompleteness without `select`

### Tertiary (LOW confidence)
- [NextJS Server Actions with Zod and React Hook Form](https://cemkarakurt.com/notes/nextjs-server-actions-zod-react-hook-form/) — community post, pattern verified against official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — packages verified against npm registry; Resend and react-hook-form verified against official docs
- Architecture: HIGH — Payload Globals API verified against official docs; patterns match existing codebase conventions
- Pitfalls: HIGH — verified against Payload GitHub issues (Zod types), Resend docs (domain verification), official Next.js docs (Client/Server Component boundary)
- WhatsApp URL: MEDIUM — verified against multiple secondary sources; official Meta docs confirm `?text=` parameter

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (Resend API and react-hook-form are stable; Payload 3 minor versions may change types)
