# Codebase Structure

**Analysis Date:** 2026-04-05

## Directory Layout

```
SiteAntoine/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, analytics, cookie banner)
│   │   ├── globals.css             # Tailwind imports + custom theme + animations
│   │   ├── robots.ts               # robots.txt generation
│   │   ├── sitemap.ts              # sitemap.xml generation
│   │   ├── actions/                # Server Actions
│   │   │   └── sendContactEmail.ts
│   │   ├── (frontend)/             # Public pages route group
│   │   │   ├── layout.tsx          # Header + Footer + FloatingWhatsApp
│   │   │   ├── page.tsx            # Home page (/)
│   │   │   ├── contact/page.tsx
│   │   │   ├── mentions-legales/page.tsx
│   │   │   ├── mon-histoire/page.tsx
│   │   │   ├── programmes/page.tsx
│   │   │   ├── resultats/page.tsx
│   │   │   └── services/page.tsx
│   │   └── (payload)/              # Payload CMS route group (auto-generated)
│   │       ├── layout.tsx
│   │       ├── admin/
│   │       │   ├── importMap.js
│   │       │   └── [[...segments]]/page.tsx
│   │       └── api/
│   │           └── [...slug]/route.ts
│   ├── collections/                # Payload collection schemas
│   │   ├── Media.ts
│   │   ├── PageContent.ts
│   │   ├── Programmes.ts
│   │   ├── Resultats.ts
│   │   └── Users.ts
│   ├── globals/                    # Payload global schemas
│   │   ├── ContactSettings.ts
│   │   └── MentionsLegales.ts
│   ├── components/
│   │   ├── admin/                  # Payload admin customizations
│   │   │   └── DashboardWidget.tsx
│   │   ├── layout/                 # Persistent layout elements
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/               # Page-level content sections
│   │   │   ├── ContactForm.tsx
│   │   │   ├── CTABandeau.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ResultatsVedette.tsx
│   │   │   ├── ServicesApercu.tsx
│   │   │   ├── SocialBlock.tsx
│   │   │   └── WhatsAppBlock.tsx
│   │   └── ui/                     # Reusable atomic components
│   │       ├── BeforeAfterSlider.tsx
│   │       ├── CookieBanner.tsx
│   │       ├── FloatingWhatsApp.tsx
│   │       ├── ProgrammeCard.tsx
│   │       ├── ResultatCard.tsx
│   │       ├── ScrollReveal.tsx
│   │       └── ServiceCard.tsx
│   ├── lib/                        # Shared utilities
│   │   └── contactSchema.ts
│   ├── migrations/                 # Payload DB migrations
│   │   ├── index.ts
│   │   ├── 20260401_205704.ts
│   │   ├── 20260401_205704.json
│   │   ├── 20260403_142821.ts
│   │   └── 20260403_142821.json
│   ├── scripts/                    # CLI scripts
│   │   └── seed.ts
│   ├── payload.config.ts           # Payload CMS configuration
│   └── payload-types.ts            # Auto-generated TypeScript types
├── public/                         # Static assets (empty — no favicon/images yet)
├── .env.example                    # Template for required env vars
├── .env.local                      # Actual env vars (gitignored)
├── next.config.ts                  # Next.js config + WordPress redirects
├── tsconfig.json                   # TypeScript config with path aliases
├── postcss.config.mjs              # PostCSS config for Tailwind
├── package.json                    # Dependencies and scripts
├── pnpm-lock.yaml                  # Lock file
└── .nvmrc                          # Node.js version pin
```

## Directory Purposes

**`src/app/(frontend)/`:**
- Purpose: All public-facing pages
- Contains: One `page.tsx` per route, a shared layout with Header/Footer
- Key files: `page.tsx` (home), `contact/page.tsx`, `programmes/page.tsx`, `resultats/page.tsx`

**`src/app/(payload)/`:**
- Purpose: Payload CMS admin panel and REST API
- Contains: Auto-generated files by Payload — do NOT edit manually
- Key files: `api/[...slug]/route.ts` (REST endpoints), `admin/[[...segments]]/page.tsx` (admin UI)

**`src/app/actions/`:**
- Purpose: Next.js Server Actions
- Contains: Server-side form handlers
- Key files: `sendContactEmail.ts`

**`src/collections/`:**
- Purpose: Payload CMS collection definitions (database tables)
- Contains: One file per collection, exported as named constants
- Key files: `Programmes.ts`, `Resultats.ts`, `PageContent.ts`, `Media.ts`, `Users.ts`

**`src/globals/`:**
- Purpose: Payload CMS global configs (singleton documents)
- Contains: One file per global
- Key files: `ContactSettings.ts` (WhatsApp, social links), `MentionsLegales.ts` (legal page content)

**`src/components/layout/`:**
- Purpose: Persistent page chrome (header, footer)
- Contains: `Header.tsx` (sticky nav, mobile menu), `Footer.tsx` (links, copyright)

**`src/components/sections/`:**
- Purpose: Larger page sections composed of multiple elements
- Contains: Sections used by specific pages (ContactForm, HeroSection, CTABandeau, etc.)

**`src/components/ui/`:**
- Purpose: Small, reusable atomic components
- Contains: Cards (ProgrammeCard, ResultatCard, ServiceCard), interactive widgets (BeforeAfterSlider, ScrollReveal, CookieBanner, FloatingWhatsApp)

**`src/lib/`:**
- Purpose: Shared utilities, schemas, helpers
- Contains: `contactSchema.ts` (Zod validation schema)

**`src/migrations/`:**
- Purpose: Payload database migration files (auto-generated)
- Contains: Timestamped SQL migration files
- Generated: Yes — by `payload migrate:create`
- Committed: Yes

**`src/scripts/`:**
- Purpose: One-off CLI scripts
- Contains: `seed.ts` (populates demo content)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML layout (fonts, analytics, meta)
- `src/app/(frontend)/layout.tsx`: Public pages layout (header, footer, WhatsApp)
- `src/payload.config.ts`: Payload CMS configuration (collections, globals, DB, storage, editor)

**Configuration:**
- `next.config.ts`: Next.js config with Payload plugin + WordPress redirect rules
- `tsconfig.json`: TypeScript config with `@/*` and `@payload-config` path aliases
- `postcss.config.mjs`: PostCSS + Tailwind
- `.nvmrc`: Node.js version
- `.env.example`: Required environment variables template

**Core Logic:**
- `src/app/actions/sendContactEmail.ts`: Contact form email delivery
- `src/lib/contactSchema.ts`: Shared Zod validation schema
- `src/scripts/seed.ts`: Database seeding script

**Auto-Generated (do not edit):**
- `src/payload-types.ts`: TypeScript types from Payload schema
- `src/app/(payload)/layout.tsx`: Payload admin layout
- `src/app/(payload)/admin/[[...segments]]/page.tsx`: Payload admin pages
- `src/app/(payload)/admin/importMap.js`: Payload import map
- `src/app/(payload)/api/[...slug]/route.ts`: Payload REST API routes

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention, inside route directories)
- Components: PascalCase — `HeroSection.tsx`, `ProgrammeCard.tsx`
- Collections: PascalCase — `Programmes.ts`, `PageContent.ts`
- Globals: PascalCase — `ContactSettings.ts`
- Server Actions: camelCase — `sendContactEmail.ts`
- Utilities: camelCase — `contactSchema.ts`

**Directories:**
- Route groups: Parenthesized — `(frontend)`, `(payload)`
- Route segments: kebab-case — `mon-histoire/`, `mentions-legales/`
- Component groups: lowercase — `layout/`, `sections/`, `ui/`, `admin/`

**Exports:**
- Components: `export default function ComponentName()`
- Collections/Globals: `export const CollectionName: CollectionConfig`
- Server Actions: `export async function actionName()`
- Schemas: `export const schemaName` + `export type TypeName`

## Where to Add New Code

**New Public Page:**
- Create directory: `src/app/(frontend)/{route-name}/page.tsx`
- Pattern: async Server Component, fetch data via `getPayload()`, export `metadata`
- Layout: Automatically wrapped by `src/app/(frontend)/layout.tsx` (Header + Footer)
- Add to sitemap: `src/app/sitemap.ts`
- Add to nav: Update `navLinks` array in both `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`

**New Payload Collection:**
- Create: `src/collections/{CollectionName}.ts`
- Register: Add to `collections` array in `src/payload.config.ts`
- Run: `pnpm payload migrate:create` to generate migration
- Run: `pnpm generate:types` to update `src/payload-types.ts`

**New Payload Global:**
- Create: `src/globals/{GlobalName}.ts`
- Register: Add to `globals` array in `src/payload.config.ts`
- Run migrations and type generation as above

**New Component:**
- Layout component (header/footer level): `src/components/layout/{Name}.tsx`
- Page section (used by one page): `src/components/sections/{Name}.tsx`
- Reusable widget/card: `src/components/ui/{Name}.tsx`
- Admin custom component: `src/components/admin/{Name}.tsx`

**New Server Action:**
- Create: `src/app/actions/{actionName}.ts`
- Must include `'use server'` directive at top
- Pattern: Validate with Zod, return typed status object

**New Utility/Schema:**
- Create: `src/lib/{name}.ts`
- Keep pure functions, no side effects
- Export types alongside runtime values

**New Seed Data:**
- Add to: `src/scripts/seed.ts`
- Pattern: Use `payload.create()` with `overrideAccess: true` for access-restricted collections

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and dev server cache
- Generated: Yes
- Committed: No (gitignored)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via `pnpm install`)
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD workflow artifacts — phase plans, codebase docs, reports
- Generated: By GSD commands
- Committed: Yes

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: Currently empty — no favicon or static images yet
- Committed: Yes

---

*Structure analysis: 2026-04-05*
