# Phase 5: SEO, Conformite & Deploiement - Research

**Researched:** 2026-04-03
**Domain:** Next.js SEO metadata, Vercel deployment, RGPD compliance, WordPress redirects
**Confidence:** HIGH

## Summary

Phase 5 closes out the project by making the site production-ready: deploying on Vercel with the custom domain antoineprofit.com, adding SEO metadata across all 6 public pages, implementing a minimal RGPD cookie banner, creating a Mentions Legales page (admin-editable via a new Payload Global), and wiring up 301 redirects for the existing WordPress URLs.

The good news: most groundwork is already in place. All 6 pages already export a `Metadata` object — they just need `description` and `openGraph` fields added. The `consentementCNIL` field already exists in `src/collections/Resultats.ts` (LGAL-03 is done). The `ContactSettings` Global establishes the exact pattern for the new `MentionsLegales` Global. Next.js 16 provides `app/sitemap.ts` and `app/robots.ts` conventions that generate these files at build time with no external dependencies.

The only genuinely new work in this phase is: (1) install and wire `@vercel/analytics`, (2) hand-author the `CookieBanner` client component, (3) add the `MentionsLegales` Global, (4) configure Vercel project and DNS at OVH, (5) add `redirects()` to `next.config.ts`.

**Primary recommendation:** Use Next.js built-in conventions for all SEO file generation (sitemap.ts, robots.ts, Metadata exports with metadataBase). Deploy to Vercel via GitHub integration. Configure DNS at OVH with a CNAME record pointing `www` and `@` to Vercel's cname.vercel-dns.com.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Redirections WordPress (SEO-02)
- D-01: L'ancien site antoineprofit.com est encore en ligne — scraper les URLs principales avant coupure pour configurer les redirections 301
- D-02: Pas d'inventaire existant des URLs — le researcher devra extraire les URLs depuis le site WordPress live
- D-03: Redirections configurees dans next.config.ts (section `redirects`) ou vercel.json

#### Bandeau cookies RGPD (LGAL-01)
- D-04: Vercel Analytics comme solution d'analytics — leger, gratuit, pas de cookies tiers
- D-05: Bandeau simple en bas de page — barre discrete avec texte + boutons Accepter/Refuser. Pas de popup modale, pas de categories de cookies
- D-06: Le bandeau est principalement informatif puisque Vercel Analytics ne necessite pas de consentement cookie, mais il satisfait l'obligation RGPD d'information

#### Mentions legales (LGAL-02)
- D-07: Statut juridique d'Antoine: auto-entrepreneur / micro-entreprise — mentions legales simplifiees (nom, SIRET, adresse)
- D-08: Contenu avec placeholders [A COMPLETER] — Antoine remplira les infos reelles plus tard
- D-09: Mentions legales editables via admin Payload — Global "MentionsLegales" avec editeur rich text

#### Consentement CNIL photos (LGAL-03)
- D-10: Ajouter un champ boolean obligatoire "consentement" dans la collection Resultats de Payload — Antoine doit cocher avant de publier une photo client

#### SEO de base (SEO-01)
- D-11: Toutes les pages ont deja des exports Metadata Next.js — enrichir avec description, Open Graph, et structure semantique
- D-12: Ajouter sitemap.xml et robots.txt via les conventions Next.js (app/sitemap.ts, app/robots.ts)

#### Deploiement Vercel (DPLY-02)
- D-13: Rien n'est configure — documenter: creer repo GitHub, creer projet Vercel, connecter, configurer variables d'environnement
- D-14: Domaine gere chez OVH — configurer DNS OVH pour pointer vers Vercel (CNAME ou nameservers Vercel)
- D-15: Le deploiement inclut la migration des variables d'environnement (.env.local → Vercel Environment Variables)

### Claude's Discretion
- Choix technique entre redirections dans next.config.ts vs vercel.json
- Implementation technique du bandeau cookies (composant client avec localStorage)
- Structure exacte du Global MentionsLegales dans Payload
- Configuration Vercel Analytics (@vercel/analytics)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Meta tags, titres et structure HTML semantique sur chaque page | Next.js Metadata API: add `description` + `openGraph` to all 6 page.tsx files; add `metadataBase` to root layout; create sitemap.ts + robots.ts |
| SEO-02 | Redirections 301 depuis les anciennes URLs WordPress vers les nouvelles pages | WordPress URL inventory completed (see below); `redirects()` async function in next.config.ts wrapping withPayload |
| LGAL-01 | Bandeau cookies conforme RGPD | CookieBanner client component with localStorage persistence; @vercel/analytics package install |
| LGAL-02 | Page mentions legales | New Payload Global MentionsLegales + new route src/app/(frontend)/mentions-legales/page.tsx |
| LGAL-03 | Champ de consentement dans l'admin pour chaque photo client (conformite CNIL) | ALREADY DONE — `consentementCNIL` field already exists in src/collections/Resultats.ts (required checkbox) |
| DPLY-02 | HTTPS configure avec domaine personnalise antoineprofit.com sur Vercel | Vercel project setup + DNS CNAME at OVH + env vars migration |
</phase_requirements>

---

## Standard Stack

### Core (all already installed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| next | 16.2.2 (installed) | Metadata API, sitemap.ts, robots.ts, redirects() | All SEO file generation built-in — no external lib needed |
| payload | 3.81.0 (installed) | MentionsLegales Global, Resultats consent field | Pattern established by ContactSettings |
| @payloadcms/richtext-lexical | 3.81.0 (installed) | Rich text for MentionsLegales content | Already used everywhere |

### New Install Required
| Library | Version | Purpose | Install Command |
|---------|---------|---------|----------------|
| @vercel/analytics | 2.0.1 (latest) | Privacy-first analytics, no cookies, RGPD-friendly | `pnpm add @vercel/analytics` |

### Not Needed (built-in)
- sitemap generation: use `src/app/sitemap.ts` (Next.js convention)
- robots.txt: use `src/app/robots.ts` (Next.js convention)
- redirects: `redirects()` async function in `next.config.ts`
- No cookie consent library — localStorage + custom component is sufficient for this use case (no cookie categories needed)

---

## Architecture Patterns

### Recommended Project Structure (new files this phase)

```
src/
├── app/
│   ├── sitemap.ts                        # NEW — generates /sitemap.xml
│   ├── robots.ts                         # NEW — generates /robots.txt
│   ├── layout.tsx                        # MODIFY — add metadataBase, Analytics, CookieBanner
│   └── (frontend)/
│       └── mentions-legales/
│           └── page.tsx                  # NEW — Mentions Legales page
├── collections/
│   └── Resultats.ts                      # NO CHANGE — consentementCNIL already added
├── globals/
│   └── MentionsLegales.ts                # NEW — Payload Global
├── components/
│   └── ui/
│       └── CookieBanner.tsx              # NEW — client component
next.config.ts                            # MODIFY — add redirects() function
```

### Pattern 1: Next.js Metadata with metadataBase

**What:** Root layout exports `metadataBase` so all page-level OpenGraph image URLs resolve correctly against the production domain. Each page exports `metadata` with `title`, `description`, and `openGraph`.

**When to use:** Every page. metadataBase goes in root layout.tsx once.

```typescript
// src/app/layout.tsx — root layout
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'),
  title: {
    default: 'Antoine Profit — Coach Bien-Etre',
    template: '%s | Antoine Profit',
  },
  description: 'Coaching bien-etre, nutrition et transformation physique avec Antoine Profit',
}
```

```typescript
// src/app/(frontend)/services/page.tsx — per-page metadata
export const metadata: Metadata = {
  title: 'Services de Coaching',  // renders as "Services de Coaching | Antoine Profit"
  description: 'Coaching individuel, coaching groupe, consultation nutrition...',
  openGraph: {
    title: 'Services de Coaching — Antoine Profit',
    description: 'Coaching individuel, coaching groupe, consultation nutrition...',
    url: 'https://antoineprofit.com/services',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}
```

**Note on title template:** The root layout uses `title.template` with `%s | Antoine Profit`. Each page only sets `title` as a plain string (no suffix needed — the template appends it automatically). The Accueil page uses `title.absolute` to override the template.

### Pattern 2: Next.js sitemap.ts

**What:** File at `src/app/sitemap.ts` exports a default async function returning `MetadataRoute.Sitemap`. Next.js generates `/sitemap.xml` automatically.

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'
  const now = new Date()
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/mon-histoire`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/programmes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resultats`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
```

### Pattern 3: Next.js robots.ts

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Pattern 4: redirects() in next.config.ts

**What:** Async `redirects()` function added to the Next.js config object, inside `withPayload` wrapper. Returns array of `{ source, destination, permanent: true }` objects.

**Critical:** `redirects()` must be defined on the config object passed to `withPayload`, NOT outside it. Current next.config.ts uses `withPayload(nextConfig)` — the redirects go inside `nextConfig`.

```typescript
// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ubu-dev'],
  async redirects() {
    return [
      // WordPress main pages (index.php prefix pattern)
      { source: '/index.php/about-me', destination: '/mon-histoire', permanent: true },
      { source: '/index.php/about-me/:path*', destination: '/mon-histoire', permanent: true },
      { source: '/index.php/our-services', destination: '/services', permanent: true },
      { source: '/index.php/our-services/:path*', destination: '/services', permanent: true },
      { source: '/index.php/programs', destination: '/programmes', permanent: true },
      { source: '/index.php/programs/:path*', destination: '/programmes', permanent: true },
      // Individual service pages → services (no equivalent individual pages)
      { source: '/index.php/services/:path*', destination: '/services', permanent: true },
      { source: '/index.php/services_group/:path*', destination: '/services', permanent: true },
      // WordPress blog posts (archive) → no blog in v1, redirect to home
      { source: '/index.php/category/:path*', destination: '/', permanent: true },
      { source: '/index.php/2016/:path*', destination: '/', permanent: true },
      // Results / transformations page
      { source: '/index.php/classic-2-columns', destination: '/resultats', permanent: true },
      { source: '/index.php/classic-2-columns/:path*', destination: '/resultats', permanent: true },
      // Contact page
      { source: '/index.php/contact', destination: '/contact', permanent: true },
      { source: '/index.php/contact/:path*', destination: '/contact', permanent: true },
      // WordPress API/admin paths → home (prevents 404 errors in logs)
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
```

### Pattern 5: MentionsLegales Payload Global

**What:** New Global following the exact ContactSettings pattern. Single rich-text field — Antoine edits it in the admin, the frontend page fetches it server-side.

```typescript
// src/globals/MentionsLegales.ts
import type { GlobalConfig } from 'payload'

export const MentionsLegales: GlobalConfig = {
  slug: 'mentions-legales',
  label: 'Mentions Legales',
  admin: {
    description: 'Contenu de la page Mentions Legales (RGPD, hebergeur, SIRET...)',
    group: 'Configuration',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contenu',
      type: 'richText',
      label: 'Contenu des mentions legales',
      admin: {
        description: 'Modifier le contenu complet des mentions legales. Les zones [A COMPLETER] doivent etre remplies.',
      },
    },
  ],
}
```

Then add to `src/payload.config.ts`: `globals: [ContactSettings, MentionsLegales]`.

### Pattern 6: CookieBanner client component

**What:** 'use client' component that reads localStorage on mount to decide whether to render. Uses `useEffect` to avoid SSR hydration mismatch (localStorage is not available server-side).

```typescript
// src/components/ui/CookieBanner.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleConsent = (value: 'accepted' | 'refused') => {
    localStorage.setItem('cookie-consent', value)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blanc-pur border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-bleu-nuit">
          Nous utilisons Vercel Analytics pour mesurer l&apos;audience de ce site.
          Ces outils ne deposent pas de cookies de traçage. En continuant, vous acceptez{' '}
          <Link href="/mentions-legales" className="text-bleu-electrique underline">
            notre politique de confidentialite
          </Link>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleConsent('refused')}
            className="text-sm font-bold px-4 py-2 border border-bleu-nuit text-bleu-nuit rounded hover:bg-slate-50"
          >
            Refuser
          </button>
          <button
            onClick={() => handleConsent('accepted')}
            className="text-sm font-bold px-4 py-2 bg-vert-energie text-white rounded hover:opacity-90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Pattern 7: @vercel/analytics integration

**What:** Add `<Analytics />` component to the root layout. It is a server component wrapper — no 'use client' needed at the layout level.

```typescript
// src/app/layout.tsx — add to imports
import { Analytics } from '@vercel/analytics/next'

// In the body
<body className="font-body bg-blanc-pur text-bleu-nuit">
  {children}
  <Analytics />
  <CookieBanner />
</body>
```

**Note:** `@vercel/analytics/next` is the correct import for Next.js App Router (not `@vercel/analytics/react`). The `Analytics` component auto-detects Vercel environment — it is a no-op in development unless `VERCEL_ANALYTICS_ID` is set.

### Pattern 8: Vercel deployment procedure

The deployment is procedural (not code), but the plan needs clear task steps:

1. **GitHub:** Push current codebase to a GitHub repository (public or private)
2. **Vercel project:** Go to vercel.com, "New Project", import from GitHub
3. **Environment variables:** Add in Vercel Dashboard > Settings > Environment Variables:
   - `DATABASE_URI` (Neon PostgreSQL pooled connection string)
   - `PAYLOAD_SECRET` (copy from .env.local)
   - `BLOB_READ_WRITE_TOKEN` (copy from .env.local)
   - `NEXT_PUBLIC_SERVER_URL=https://antoineprofit.com`
   - `RESEND_API_KEY` (copy from .env.local)
   - `CONTACT_EMAIL` (copy from .env.local)
4. **First deploy:** Trigger via Vercel dashboard or `git push`
5. **Custom domain:** In Vercel Dashboard > Domains, add `antoineprofit.com` and `www.antoineprofit.com`
6. **DNS at OVH:** Set CNAME `www` → `cname.vercel-dns.com` and A record `@` → Vercel IP (Vercel provides exact values in the dashboard after adding domain)
7. **SSL:** Automatic — Vercel provisions Let's Encrypt certificate once DNS propagates

**DNS propagation note:** OVH TTL is typically 3600 seconds (1 hour). Vercel validates DNS automatically. Full propagation can take up to 48 hours globally but usually completes in 1-2 hours.

### Anti-Patterns to Avoid

- **Adding redirects outside withPayload:** `redirects()` must be in the config object passed to `withPayload()`, not in a separate config that is spread. The current code is `export default withPayload(nextConfig)` — keep this structure and add `redirects` to `nextConfig`.
- **Using localStorage during SSR:** CookieBanner must read localStorage inside `useEffect`, not during initial render. Calling `useState(!!localStorage.getItem(...))` causes hydration mismatch.
- **Absolute URLs in sitemap without metadataBase:** The sitemap must use full absolute URLs. Use `process.env.NEXT_PUBLIC_SERVER_URL` as the base, with a fallback to the production URL.
- **robots.ts disallowing /api:** This would block Payload's API routes used by the admin. The disallow list should be `/admin` and `/api/graphql` if you want to block the CMS API, but for this use case `/admin` is sufficient.
- **Importing @vercel/analytics/react in App Router:** Use `@vercel/analytics/next` for the App Router version. The `/react` import works but the `/next` import enables server-side tracking.

---

## WordPress URL Inventory (D-01, D-02 — completed during research)

The WordPress site at antoineprofit.com was scraped live. All content URLs use the `/index.php/` prefix pattern (WordPress with permalink configuration).

**Primary navigation pages:**
| WordPress URL | New URL | Notes |
|---------------|---------|-------|
| `/index.php/about-me/` | `/mon-histoire` | Direct equivalent |
| `/index.php/our-services/` | `/services` | Direct equivalent |
| `/index.php/programs/` | `/programmes` | Direct equivalent |
| `/index.php/classic-2-columns/` | `/resultats` | The "results" / before-after gallery |
| `/index.php/contact/` | `/contact` | Direct equivalent (if exists on old site) |

**Service sub-pages (no v1 equivalent — redirect to /services):**
- `/index.php/services/11-consultation/`
- `/index.php/services/30-day-challenge/`
- `/index.php/services/group-coaching/`
- `/index.php/services_group/programm/`
- `/index.php/services_group/fresh-detox/`
- `/index.php/services_group/best-deal/`

**Blog content (no v1 equivalent — redirect to /):**
- `/index.php/2016/08/15/10-ways-to-ring-more-balance-into-your-life/`
- `/index.php/2016/08/15/how-30-minutes-a-day-can-make-you-healthier/`
- `/index.php/2016/09/14/8-health-trends-your-body-needs-this-month/`
- `/index.php/2016/09/14/could-detox-teas-harm-your-health/`
- `/index.php/category/fitness/`
- `/index.php/category/health/`

**WordPress-specific URLs (redirect to / to avoid 404 log noise):**
- `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom XML builder | `src/app/sitemap.ts` (Next.js convention) | Built-in, type-safe, auto-served at /sitemap.xml |
| robots.txt | Static file in /public | `src/app/robots.ts` (Next.js convention) | Built-in, can use env vars for base URL |
| Analytics tracking | Custom script | `@vercel/analytics` | Privacy-first, no cookies, integrates with Vercel dashboard |
| Cookie consent library | — | Custom localStorage component | No cookie categories needed; existing libraries add 50+ KB for a 5-line use case |
| SSL certificate | Manual cert management | Vercel automatic Let's Encrypt | Vercel provisions and renews automatically |
| SEO redirect middleware | Custom Next.js middleware | `redirects()` in next.config.ts | Static config, evaluated at build time, no runtime overhead |

**Key insight:** Next.js 16 provides every SEO file generation primitive needed (sitemap, robots, metadata). No external SEO libraries (next-seo, etc.) are required or recommended.

---

## Common Pitfalls

### Pitfall 1: LGAL-03 Already Done

**What goes wrong:** Creating duplicate work for the consent checkbox in Resultats.
**Why it happens:** The CONTEXT.md says "add a boolean consent field" but inspection of the file shows `consentementCNIL` (required checkbox) already exists at line 51 of `src/collections/Resultats.ts`.
**How to avoid:** The planner must treat LGAL-03 as complete. The plan task for LGAL-03 should be a verification task (confirm the field is live and working in the admin), not an implementation task.
**Warning signs:** Any plan task that says "add consentementCNIL field to Resultats" is wrong.

### Pitfall 2: MentionsLegales Global not registered in payload.config.ts

**What goes wrong:** The Global is created in `src/globals/MentionsLegales.ts` but not imported and added to `globals: []` in `src/payload.config.ts`.
**Why it happens:** Same pattern as ContactSettings but easy to forget the registration step.
**How to avoid:** The plan task must explicitly include: (1) create the Global file, (2) import and add to globals array in payload.config.ts, (3) run `pnpm generate:types` to regenerate TypeScript types.

### Pitfall 3: metadataBase missing causes absolute URL failures

**What goes wrong:** OpenGraph images and canonical URLs in `openGraph` resolve as relative paths when `metadataBase` is not set on the root layout.
**Why it happens:** Next.js requires `metadataBase` on the root layout to resolve relative OpenGraph URLs.
**How to avoid:** Add `metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com')` to the root layout metadata export.

### Pitfall 4: Vercel deployment fails — missing environment variables

**What goes wrong:** Build succeeds but runtime fails with "Missing environment variable" errors from Payload or Resend.
**Why it happens:** Variables in `.env.local` are not automatically copied to Vercel.
**How to avoid:** Migrate all 6 variables from `.env.local` to Vercel Dashboard > Settings > Environment Variables before the first deploy. Current variables needed: `DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SERVER_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`.

### Pitfall 5: DNS domain conflict — OVH keeps old WordPress site live

**What goes wrong:** DNS is changed to Vercel but the old WordPress site is still at the same IP, causing certificate verification failures or mixed content.
**Why it happens:** DNS cutover must happen atomically — once DNS points to Vercel, the old WordPress site is no longer reachable at antoineprofit.com.
**How to avoid:** The deployment plan should have a clear cutover step. Lower OVH TTL to 300s several hours before cutover. Have the Vercel deploy fully working on the `.vercel.app` domain before touching DNS.

### Pitfall 6: CookieBanner z-index conflict with FloatingWhatsApp

**What goes wrong:** CookieBanner (z-50) and FloatingWhatsApp overlap at the bottom of the viewport.
**Why it happens:** Both are fixed to the bottom. The UI-SPEC specifies CookieBanner z-50 vs FloatingWhatsApp z-40.
**How to avoid:** CookieBanner uses `z-50`, FloatingWhatsApp uses `z-40`. CookieBanner renders above. When CookieBanner is visible, FloatingWhatsApp may be partially covered — this is acceptable behavior per the UI-SPEC.

### Pitfall 7: Neon PostgreSQL connection in production

**What goes wrong:** `DATABASE_URI` on Vercel must be the **pooled** connection string from Neon (hostname contains `-pooler`), not the direct connection string.
**Why it happens:** Vercel serverless functions each open a new DB connection; Neon pooler handles connection pooling efficiently; direct connections hit Neon's limit quickly.
**How to avoid:** Confirm the `DATABASE_URI` in `.env.local` already uses the pooled connection string (check if hostname contains `-pooler`). Use this exact value in Vercel env vars.

---

## Code Examples

### sitemap.ts (complete)
```typescript
// Source: Next.js 16 built-in API — MetadataRoute.Sitemap type verified from node_modules
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'
  const now = new Date()
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/mon-histoire`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/programmes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resultats`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
```

### robots.ts (complete)
```typescript
// Source: Next.js 16 built-in API — MetadataRoute.Robots type verified from node_modules
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Root layout metadata update
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'),
  title: {
    default: 'Antoine Profit — Coach Bien-Etre',
    template: '%s | Antoine Profit',
  },
  description: 'Coaching bien-etre, nutrition et transformation physique avec Antoine Profit',
}
```

### Per-page OpenGraph enrichment pattern (services as example)
```typescript
// src/app/(frontend)/services/page.tsx
export const metadata: Metadata = {
  title: 'Services de Coaching',
  description: 'Coaching individuel, coaching groupe, consultation nutrition — decouvrez les services d\'Antoine Profit, coach bien-etre.',
  openGraph: {
    title: 'Services de Coaching — Antoine Profit',
    description: 'Coaching individuel, coaching groupe, consultation nutrition — decouvrez les services d\'Antoine Profit, coach bien-etre.',
    url: '/services',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}
```

### Mentions Legales page (fetch pattern)
```typescript
// src/app/(frontend)/mentions-legales/page.tsx
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Mentions legales',
  description: 'Mentions legales du site antoineprofit.com — informations legales, hebergeur, donnees personnelles.',
  openGraph: {
    title: 'Mentions legales | Antoine Profit',
    url: '/mentions-legales',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function MentionsLegalesPage() {
  const payload = await getPayload({ config })
  const mentionsLegales = await payload.findGlobal({ slug: 'mentions-legales' })
  // Render content using Payload's Lexical serializer or plain text fallback
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| next-seo library | Next.js built-in Metadata API | No external dependency needed; metadata is colocated with pages |
| Static /public/sitemap.xml | app/sitemap.ts convention | Type-safe, regenerated on each build, supports dynamic routes |
| Cookie consent libraries (react-cookie-consent, cookieconsent) | Custom localStorage component | No bundle overhead; sufficient for informational-only banners |
| separate vercel.json redirects | redirects() in next.config.ts | Single source of truth for config; works in both Vercel and self-hosted Next.js |

---

## Environment Availability

| Dependency | Required By | Available | Version | Notes |
|------------|------------|-----------|---------|-------|
| Node.js | Build, dev | Yes | v20.20.2 | Sufficient |
| pnpm | Package install | Yes | 10.33.0 | Sufficient |
| Vercel CLI | Deployment | No | — | Not needed — deployment via Vercel Dashboard + GitHub is preferred for this project |
| @vercel/analytics | LGAL-01 | No | — | Must install: `pnpm add @vercel/analytics` |
| GitHub account | DPLY-02 | Not verified | — | Required for Vercel GitHub integration; assumed available |
| Vercel account | DPLY-02 | Not verified | — | Required; must create if not exists (free tier) |
| OVH domain management access | DPLY-02 | Not verified | — | Antoine must have OVH admin credentials to change DNS |

**Missing dependencies with no fallback:**
- `@vercel/analytics` — must install before implementing LGAL-01
- GitHub repository — must exist for Vercel GitHub integration (DPLY-02 deployment step)
- Vercel account — must exist for deployment

**Missing dependencies with fallback:**
- Vercel CLI — not needed; Vercel Dashboard + git push is the recommended workflow

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — no test directory found |
| Config file | None |
| Quick run command | `pnpm build` (build verification) + `pnpm lint` |
| Full suite command | `pnpm build && pnpm lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Meta tags present on all pages | smoke (build check) | `pnpm build` — verifies no TypeScript errors in metadata exports | ✅ (build pipeline) |
| SEO-01 | sitemap.xml served at /sitemap.xml | smoke | `curl http://localhost:3000/sitemap.xml` after `pnpm dev` | ❌ Wave 0 |
| SEO-01 | robots.txt served at /robots.txt | smoke | `curl http://localhost:3000/robots.txt` after `pnpm dev` | ❌ Wave 0 |
| SEO-02 | 301 redirects return correct status | smoke | `curl -I http://localhost:3000/index.php/about-me` | ❌ Wave 0 |
| LGAL-01 | CookieBanner renders on first load | manual | Open browser in incognito, check bottom bar visible | manual only |
| LGAL-01 | CookieBanner hidden after consent | manual | Click Accepter, reload, confirm hidden | manual only |
| LGAL-02 | /mentions-legales page returns 200 | smoke | `curl -I http://localhost:3000/mentions-legales` | ❌ Wave 0 |
| LGAL-03 | consentementCNIL blocks save when unchecked | manual | Open Payload admin, try saving Resultat without checking | manual only |
| DPLY-02 | HTTPS accessible at antoineprofit.com | manual | Browser check after DNS propagation | manual only |

### Sampling Rate
- **Per task commit:** `pnpm build && pnpm lint` — confirms TypeScript types and no import errors
- **Per wave merge:** `pnpm build && pnpm lint` + manual smoke test of redirects locally
- **Phase gate:** Full manual checklist before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] No test framework installed — smoke tests are manual curl commands (acceptable for this phase)
- [ ] No automated redirect test — verified manually with `curl -I` during development

*(No automated test framework will be installed in this phase — the verification approach is build-time TypeScript checks + manual browser validation, consistent with all previous phases.)*

---

## Open Questions

1. **Mentions Legales rich text rendering**
   - What we know: ContactSettings uses `@payloadcms/richtext-lexical` for rich text; the MentionsLegales Global will also use Lexical
   - What's unclear: The current codebase uses a manual `extractPlainText` helper for apercu text, not the full Lexical serializer. For Mentions Legales we need full HTML rendering (headers, paragraphs, bold, links).
   - Recommendation: Import and use `@payloadcms/richtext-lexical/react` (`RichText` or `SerializedEditorState` renderer) in the MentionsLegales page component. If the package export is ambiguous, fall back to serializing as structured HTML using the `root.children` approach from the existing codebase.

2. **Vercel account and GitHub repository state**
   - What we know: DPLY-01 is marked complete ("Site deployable and fonctionnel sur Vercel") in REQUIREMENTS.md, suggesting a Vercel project and GitHub repo may already exist
   - What's unclear: STATE.md says "Rien n'est configure" for DPLY-02 — this may mean the custom domain is not configured, not that the Vercel project is new
   - Recommendation: The plan task for DPLY-02 should start by verifying whether a Vercel project already exists. If it does, only the domain configuration steps are needed. If not, the full setup procedure applies.

---

## Project Constraints (from CLAUDE.md)

| Constraint | Impact on Phase 5 |
|------------|-------------------|
| Hebergement: Vercel + Neon PostgreSQL | DPLY-02 targets Vercel specifically; Neon connection string must use pooled URL |
| Langue: francais uniquement | All CookieBanner copy, Mentions Legales headings, meta descriptions in French |
| Admin: Interface simple | MentionsLegales Global uses one rich text field — not a multi-field structured form |
| Stack: Next.js 16 + Payload 3 + Tailwind 4 | Use Next.js built-in Metadata API; no external SEO libraries; Tailwind utility classes only |
| No custom auth | Payload built-in auth for admin — no changes needed |
| GSD Workflow: Edit/Write only through GSD commands | Research only — planner and executor handle |

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.2 node_modules — `MetadataRoute.Sitemap`, `MetadataRoute.Robots` types verified directly from `/home/lefeuc4/claude/SiteAntoine/node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`
- Next.js Metadata API — `metadataBase`, `title.template`, `openGraph` fields verified from TypeScript type definitions in installed package
- `src/collections/Resultats.ts` — `consentementCNIL` required checkbox field confirmed present (lines 51-58)
- `src/globals/ContactSettings.ts` — MentionsLegales Global pattern source
- `src/payload.config.ts` — globals registration pattern confirmed
- `package.json` — all installed package versions verified; `@vercel/analytics` not installed
- npm registry — `@vercel/analytics` version 2.0.1 confirmed current

### Secondary (MEDIUM confidence)
- WordPress site scrape (antoineprofit.com) — URL inventory extracted live during research session 2026-04-03; site is responsive and accessible
- Vercel Analytics documentation pattern — `import { Analytics } from '@vercel/analytics/next'` for App Router

### Tertiary (LOW confidence)
- OVH DNS CNAME procedure for Vercel — standard CNAME configuration; specific OVH UI steps not verified; Vercel dashboard provides exact DNS values after domain addition

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from installed node_modules and npm registry
- Architecture patterns: HIGH — code examples derived from existing codebase patterns (ContactSettings, layout.tsx) and verified Next.js type definitions
- WordPress URL inventory: HIGH — scraped live from antoineprofit.com during research
- Pitfalls: HIGH — LGAL-03 already-done finding directly verified from source file; other pitfalls from codebase inspection
- Vercel deployment procedure: MEDIUM — standard procedure, not verified with live account
- OVH DNS steps: LOW — not verified against OVH UI

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable domain — WordPress URL inventory valid until site is taken down)
