---
phase: 05-seo-conformite-deploiement
plan: 02
subsystem: RGPD & conformite legale
tags: [rgpd, cookie-consent, mentions-legales, payload-global, cookie-banner, cnil]
dependency_graph:
  requires: [05-01]
  provides: [cookie-banner, mentions-legales-page, mentions-legales-global]
  affects: [src/app/layout.tsx, src/components/ui/CookieBanner.tsx, src/globals/MentionsLegales.ts, src/app/(frontend)/mentions-legales/page.tsx]
tech_stack:
  added: []
  patterns: ["Payload Global (richText field)", "localStorage cookie consent", "'use client' banner with useState+useEffect", "force-dynamic page for Payload-fetching routes"]
key_files:
  created:
    - src/globals/MentionsLegales.ts
    - src/app/(frontend)/mentions-legales/page.tsx
    - src/components/ui/CookieBanner.tsx
    - src/migrations/20260403_142821.ts
    - src/migrations/20260403_142821.json
  modified:
    - src/payload.config.ts
    - src/app/layout.tsx
    - src/migrations/index.ts
decisions:
  - "dynamic = 'force-dynamic' on /mentions-legales prevents static prerendering error when DB table doesn't exist at build time"
  - "CookieBanner uses useState(false) + useEffect to avoid SSR mismatch — banner hidden server-side, shown client-side only if no consent in localStorage"
  - "Footer already had /mentions-legales link from Phase 02 design — no change needed"
metrics:
  duration: "10min"
  completed_date: "2026-04-03"
  tasks_completed: 2
  files_modified: 3
  files_created: 5
---

# Phase 05 Plan 02: RGPD Conformite — CookieBanner + Mentions Legales Summary

RGPD compliance via localStorage cookie consent banner (Accepter/Refuser, z-50 fixed bottom bar) and MentionsLegales Payload Global with 7-section fallback placeholder page at /mentions-legales.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | MentionsLegales Payload Global + /mentions-legales page | 490ab39 | MentionsLegales.ts, payload.config.ts, mentions-legales/page.tsx, migrations |
| 2 | CookieBanner component + wire into root layout | 2fde8bb | CookieBanner.tsx, layout.tsx |

## What Was Built

### Task 1: MentionsLegales Global + Page

**`src/globals/MentionsLegales.ts`:**
- Payload Global with `slug: 'mentions-legales'`, `group: 'Configuration'`
- Single `richText` field named `contenu` — editable via Payload admin
- Public read access (`read: () => true`)
- Follows ContactSettings pattern exactly (same admin group, same access pattern)

**`src/payload.config.ts`:**
- Imported `MentionsLegales` and added to `globals: [ContactSettings, MentionsLegales]`

**`src/migrations/20260403_142821.ts`:**
- Auto-generated Payload migration adding `mentions_legales` table and associated Payload metadata tables

**`src/app/(frontend)/mentions-legales/page.tsx`:**
- Server component with `export const dynamic = 'force-dynamic'` (prevents prerender error)
- Metadata with `title: 'Mentions legales'`, description, and openGraph (url: '/mentions-legales', locale: 'fr_FR')
- Fetches via `payload.findGlobal({ slug: 'mentions-legales' })`
- Renders `<RichText data={data.contenu} />` from `@payloadcms/richtext-lexical/react` when content exists
- Fallback: 7 static sections with `[A COMPLETER]` styled `font-mono text-rouge-erreur`:
  1. Editeur du site (Nom, SIRET, Adresse, Email placeholders)
  2. Hebergement (Vercel Inc. — hardcoded, always accurate)
  3. Directeur de publication (Antoine Profit)
  4. Donnees personnelles et RGPD
  5. Cookies et traceurs (Vercel Analytics, no tracking cookies)
  6. Photos et consentement clients (CNIL)
  7. Contact (link to /contact page)
- Layout: `pt-32` clearance, `max-w-3xl mx-auto px-4 py-16`, h1 `text-2xl font-bold text-bleu-nuit mb-8`
- Section headings: `text-xl font-bold text-bleu-nuit mt-12 mb-4`

**Footer:** Already contained `/mentions-legales` link in bottom bar — no change needed.

### Task 2: CookieBanner Component

**`src/components/ui/CookieBanner.tsx`:**
- `'use client'` component — localStorage access requires browser environment
- `useState(false)` initial value prevents SSR hydration mismatch
- `useEffect` checks `localStorage.getItem('cookie-consent')` on mount — shows banner only if no prior choice
- `handleConsent(value)` writes to `localStorage.setItem('cookie-consent', value)` and hides banner
- Two buttons: Refuser (ghost: `border border-bleu-nuit text-bleu-nuit`) and Accepter (`bg-vert-energie text-white`)
- Position: `fixed bottom-0 left-0 right-0 z-50` (above FloatingWhatsApp at z-40)
- Background: `bg-blanc-pur border-t border-slate-200`
- Text links to `/mentions-legales` with `text-bleu-electrique underline` styling
- No animation — simple conditional render via `if (!visible) return null`

**`src/app/layout.tsx`:**
- Imported `CookieBanner from '@/components/ui/CookieBanner'`
- Rendered `<CookieBanner />` after `<Analytics />` inside `<body>`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added `export const dynamic = 'force-dynamic'` to /mentions-legales page**
- **Found during:** Task 1 — build verification
- **Issue:** Static prerendering attempted `payload.findGlobal()` at build time, failing with "relation mentions_legales does not exist" since migration only runs in deployed environment
- **Fix:** Added `export const dynamic = 'force-dynamic'` at module level — defers DB lookup to request time
- **Files modified:** `src/app/(frontend)/mentions-legales/page.tsx`
- **Commit:** 490ab39

### Environment Note

`pnpm lint` fails pre-existing (Next.js 16 / Next.js `next lint` command not found in worktree context). Pre-existing issue documented in 05-01-SUMMARY. Build (`pnpm build`) passes cleanly.

## Decisions Made

- **force-dynamic on mentions-legales:** Any page fetching from Payload at render time must opt out of static generation — otherwise build fails if DB table doesn't exist at build time (common on first deploy before migration).
- **CookieBanner useState(false) init:** Initial state `false` ensures banner is hidden during SSR, preventing hydration mismatch. `useEffect` then shows it client-side if no consent stored.
- **Footer /mentions-legales link:** Already present from Phase 02 design (bottom bar). No duplication needed.

## Known Stubs

- `/mentions-legales` fallback content includes `[A COMPLETER]` placeholders for: Nom, SIRET, Adresse, Email in the "Editeur du site" section. These are intentional per plan spec (D-08) — Antoine fills them via Payload admin after deployment. The page renders correctly with fallback until then.

## Self-Check: PASSED

Files created verified:
- src/globals/MentionsLegales.ts — exists
- src/app/(frontend)/mentions-legales/page.tsx — exists
- src/components/ui/CookieBanner.tsx — exists

Commits verified:
- 490ab39 — Task 1 commit
- 2fde8bb — Task 2 commit

Build: passed (pnpm build exits 0)
