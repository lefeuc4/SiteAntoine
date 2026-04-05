# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Next.js App Router monolith with Payload CMS embedded — single deployment unit

**Key Characteristics:**
- Payload CMS 3 lives inside the Next.js `/app` directory as a route group `(payload)`
- Public frontend is a separate route group `(frontend)` with its own layout (Header/Footer)
- All pages are React Server Components that fetch data directly via the Payload Local API (`getPayload()`)
- One Server Action handles the contact form email via Resend
- No GraphQL, no REST client calls — all data access is server-side through Payload's Node.js API
- Vercel Blob handles media storage; Neon PostgreSQL handles structured data

## Layers

**Public Frontend (Route Group `(frontend)`):**
- Purpose: Renders the 6 public pages + 1 legal page for site visitors
- Location: `src/app/(frontend)/`
- Contains: Page components (RSC), page-level metadata exports
- Depends on: Payload Local API, section components, UI components
- Used by: End users via browser

**Payload CMS Admin (Route Group `(payload)`):**
- Purpose: Auto-generated admin panel for content management
- Location: `src/app/(payload)/`
- Contains: Payload-generated layout, admin pages, REST API routes
- Depends on: Payload config (`src/payload.config.ts`), collections, globals
- Used by: Antoine (site owner) via `/admin` URL

**Collections & Globals (Data Schema):**
- Purpose: Define the CMS data model — what content exists and how it's structured
- Location: `src/collections/` and `src/globals/`
- Contains: Payload collection configs (5) and global configs (2)
- Depends on: Payload types (`CollectionConfig`, `GlobalConfig`)
- Used by: Payload admin UI, frontend pages via Local API, seed script

**Components:**
- Purpose: Reusable UI building blocks for the frontend
- Location: `src/components/`
- Contains: Layout components (`layout/`), page sections (`sections/`), atomic UI (`ui/`)
- Depends on: Lucide icons, `next/image`, `next/link`, Payload RichText renderer
- Used by: Frontend page components

**Server Actions:**
- Purpose: Server-side form processing
- Location: `src/app/actions/`
- Contains: `sendContactEmail.ts` — validates with Zod, sends via Resend SDK
- Depends on: `src/lib/contactSchema.ts`, Resend SDK
- Used by: `ContactForm` client component

**Shared Library:**
- Purpose: Cross-cutting utilities and schemas
- Location: `src/lib/`
- Contains: `contactSchema.ts` (Zod schema shared between client validation and server action)
- Used by: `ContactForm` component (client-side), `sendContactEmail` action (server-side)

## Data Flow

**Page Render (Server Component):**

1. User requests a public page (e.g., `/programmes`)
2. Next.js App Router matches `src/app/(frontend)/programmes/page.tsx`
3. The `(frontend)` layout wraps the page with Header + Footer (fetches `contact-settings` global for WhatsApp data)
4. Page component calls `getPayload({ config })` to get a Payload instance
5. Page calls `payload.find()` or `payload.findGlobal()` to fetch content from Neon PostgreSQL
6. Data is passed as props to presentational components (cards, sections)
7. Server-rendered HTML is sent to the client

**Contact Form Submission:**

1. User fills out the form in `ContactForm` (client component using react-hook-form)
2. Client-side Zod validation runs via `@hookform/resolvers`
3. On submit, the client calls the `sendContactEmail` Server Action
4. Server Action re-validates with Zod, checks honeypot field
5. If valid, calls `resend.emails.send()` to deliver the email
6. Returns a status object (`success` | `error` | `validation_error`)
7. Client component updates UI based on returned status

**Admin Content Edit:**

1. Antoine navigates to `/admin` (Payload admin panel)
2. Payload renders its built-in React admin UI
3. Edits go through Payload's REST API at `src/app/(payload)/api/[...slug]/route.ts`
4. Payload writes to Neon PostgreSQL; media uploads go to Vercel Blob
5. On next public page request, the RSC fetches updated data from the database

**State Management:**
- No client-side state management library (no Redux, Zustand, etc.)
- Server Components fetch fresh data on each request
- Client state is limited to: form state (react-hook-form), scroll state (Header), UI toggles (mobile menu, cookie banner)
- Cookie consent stored in `localStorage` (key: `cookie-consent`)

## Key Abstractions

**PageContent Collection:**
- Purpose: Generic CMS-editable content blocks for any page section
- File: `src/collections/PageContent.ts`
- Pattern: Each document has a `page` (select) + `section` (text) identifier, plus optional `titre`, `contenu` (richText), and `image`
- Access: Read-only for public; create/delete disabled (structure seeded, only editable)
- Used by: Home page (services-apercu), Mon Histoire (timeline), Services (mes-services)

**Payload Globals:**
- Purpose: Singleton configuration objects editable from admin
- Files: `src/globals/ContactSettings.ts`, `src/globals/MentionsLegales.ts`
- Pattern: `payload.findGlobal({ slug: '...' })` returns the single document
- Used by: Frontend layout (WhatsApp number), Contact page (social links), Mentions Legales page

**Lexical Rich Text:**
- Purpose: Structured rich text content from Payload's editor
- Config: `src/payload.config.ts` (editor features: Bold, Italic, Lists, Links, FixedToolbar)
- Rendering: `<RichText data={...} />` from `@payloadcms/richtext-lexical/react`
- Plain text extraction: Manual `extractPlainText()` helper duplicated in `src/app/(frontend)/page.tsx` and `src/app/(frontend)/mon-histoire/page.tsx`

**ScrollReveal Animation:**
- Purpose: Fade-in-on-scroll animation wrapper
- File: `src/components/ui/ScrollReveal.tsx`
- Pattern: Client component using IntersectionObserver; wraps any content; triggers `.revealed` CSS class
- CSS: `.reveal` / `.revealed` classes in `src/app/globals.css`

## Entry Points

**Next.js Application:**
- Location: `src/app/layout.tsx` (root layout)
- Triggers: All HTTP requests
- Responsibilities: Sets `<html lang="fr">`, loads fonts (Montserrat, Inter), includes `<Analytics />` and `<CookieBanner />`

**Frontend Layout:**
- Location: `src/app/(frontend)/layout.tsx`
- Triggers: All public page requests (routes under `(frontend)`)
- Responsibilities: Wraps pages with `<Header />`, `<Footer />`, `<FloatingWhatsApp />`; fetches contact settings from Payload

**Payload Config:**
- Location: `src/payload.config.ts`
- Triggers: Server startup, all Payload operations
- Responsibilities: Registers collections, globals, editor, database adapter, blob storage, admin customization

**REST API:**
- Location: `src/app/(payload)/api/[...slug]/route.ts`
- Triggers: Payload admin panel CRUD operations, any direct API calls
- Responsibilities: Delegates to Payload's built-in REST handlers (GET, POST, PATCH, DELETE, PUT, OPTIONS)

**Seed Script:**
- Location: `src/scripts/seed.ts`
- Triggers: Manual execution via `pnpm seed`
- Responsibilities: Populates demo content (3 programmes, 3 resultats, 12 page-content docs)

**SEO Files:**
- `src/app/robots.ts`: Generates `robots.txt` (allows all, disallows `/admin`)
- `src/app/sitemap.ts`: Generates static sitemap with 7 URLs

## Error Handling

**Strategy:** Minimal — relies on Next.js defaults. No custom error boundaries or error pages.

**Patterns:**
- Contact form: Server Action catches Resend errors, returns user-friendly French error messages; never exposes raw errors
- Honeypot anti-spam: Returns fake `success` status to avoid tipping off bots
- Empty content: All pages render graceful "coming soon" messages when collections are empty
- Missing images: `BeforeAfterSlider` shows "Photo non disponible" placeholder
- Payload globals: Uses `as any` type assertions when accessing global fields (type-safety gap)

## Cross-Cutting Concerns

**Logging:** `console.error` only, in `sendContactEmail.ts` for Resend failures. No structured logging framework.

**Validation:** Zod schema in `src/lib/contactSchema.ts` shared between client (react-hook-form resolver) and server (Server Action). Payload handles its own field validation for admin edits.

**Authentication:** Payload's built-in auth system (JWT + cookies). Single admin user. Users collection is hidden from sidebar (`src/collections/Users.ts`). No public-facing auth.

**Internationalization:** French only. Payload admin UI configured for French via `@payloadcms/translations/languages/fr`. All frontend text is hardcoded in French.

**SEO:** Each page exports static `metadata` with `title`, `description`, and `openGraph`. Root layout sets `metadataBase`. WordPress redirect rules in `next.config.ts` preserve old URL equity.

---

*Architecture analysis: 2026-04-05*
