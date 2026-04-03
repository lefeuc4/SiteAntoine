---
phase: 05-seo-conformite-deploiement
plan: 01
subsystem: SEO & conformite
tags: [seo, metadata, opengraph, sitemap, robots, redirects, analytics, rgpd]
dependency_graph:
  requires: []
  provides: [sitemap.xml, robots.txt, opengraph-metadata, wordpress-redirects, vercel-analytics]
  affects: [src/app/layout.tsx, src/app/sitemap.ts, src/app/robots.ts, next.config.ts, all-frontend-pages]
tech_stack:
  added: ["@vercel/analytics@2.0.1"]
  patterns: ["Next.js Metadata API (metadataBase, title template, openGraph)", "Next.js sitemap.ts route", "Next.js robots.ts route", "next.config.ts async redirects()"]
key_files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified:
    - src/app/layout.tsx
    - src/app/(frontend)/page.tsx
    - src/app/(frontend)/mon-histoire/page.tsx
    - src/app/(frontend)/services/page.tsx
    - src/app/(frontend)/programmes/page.tsx
    - src/app/(frontend)/resultats/page.tsx
    - src/app/(frontend)/contact/page.tsx
    - next.config.ts
    - package.json
decisions:
  - "metadataBase uses NEXT_PUBLIC_SERVER_URL env var with 'https://antoineprofit.com' fallback — clean env-driven config"
  - "Accueil uses title.absolute to override the template — prevents double suffix on homepage"
  - "robots.ts disallows /admin only (not /api) per D-12 decision"
  - "LGAL-03 (consentementCNIL required checkbox) confirmed pre-existing in Resultats collection — no change needed"
metrics:
  duration: "3min"
  completed_date: "2026-04-03"
  tasks_completed: 2
  files_modified: 9
  files_created: 2
---

# Phase 05 Plan 01: SEO Metadata + Sitemap + Robots + Redirects Summary

SEO metadata enrichment with metadataBase, OpenGraph on all 6 pages, sitemap.ts (7 pages), robots.ts (/admin disallowed), WordPress 301 redirects, and @vercel/analytics installed.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | SEO metadata enrichment — metadataBase, openGraph, sitemap, robots, @vercel/analytics | 2abf70c | layout.tsx, all 6 page.tsx, sitemap.ts, robots.ts, package.json |
| 2 | WordPress 301 redirects in next.config.ts + LGAL-03 verification | 8d39fc1 | next.config.ts |

## What Was Built

### Task 1: SEO Metadata + Analytics

**Root layout (`src/app/layout.tsx`):**
- Added `metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com')`
- Added `title: { default: ..., template: '%s | Antoine Profit' }` for consistent title suffix
- Imported and rendered `<Analytics />` from `@vercel/analytics/next`

**All 6 public pages — enriched metadata:**
- Accueil: `title.absolute` (no template suffix), description + openGraph
- Mon Histoire: `title: 'Mon Histoire'`, description + openGraph
- Services: `title: 'Services de Coaching'`, description + openGraph
- Programmes: `title: 'Programmes de Coaching'`, description + openGraph
- Resultats: `title: 'Resultats'`, description + openGraph
- Contact: `title: 'Contact'`, description + openGraph

**`src/app/sitemap.ts`:** Lists 7 public URLs (including /mentions-legales) using `MetadataRoute.Sitemap`, served at /sitemap.xml.

**`src/app/robots.ts`:** Allows all crawlers, disallows /admin, references sitemap URL. Served at /robots.txt.

**`@vercel/analytics@2.0.1`:** Installed and integrated — privacy-first analytics, no cookie consent banner needed.

### Task 2: WordPress 301 Redirects

**`next.config.ts`:** Added `async redirects()` with 18 redirect rules covering:
- All `index.php/*` page patterns mapped to French equivalents
- `/index.php/about-me` → `/mon-histoire`
- `/index.php/our-services` → `/services`
- `/index.php/programs` → `/programmes`
- `/index.php/classic-2-columns` → `/resultats`
- `/index.php/contact` → `/contact`
- Blog/category pages → `/` (no blog in v1)
- WordPress admin paths → `/` (noise reduction)

**LGAL-03 verification:** Confirmed `consentementCNIL` field is present in `src/collections/Resultats.ts` with `type: 'checkbox'` and `required: true`. No changes needed.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Environment Note

The `pnpm lint` script fails pre-existing in Next.js 16 (no `next lint` command). TypeScript type check (`tsc --noEmit`) passes cleanly. Build required copying `.env.local` to worktree — worktrees don't inherit parent `.env.local`. This is a worktree-specific constraint, not a code issue.

## Decisions Made

- **metadataBase fallback:** `'https://antoineprofit.com'` hardcoded as fallback in `process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'` — resolves OpenGraph image absolute URLs without requiring env var in all environments.
- **Accueil title.absolute:** Prevents the root template from appending " | Antoine Profit" to the homepage title, which already contains the full brand name.
- **robots.ts disallows /admin only:** Follows D-12 decision from research — /api must remain accessible for Payload's API endpoints.

## Known Stubs

None — all metadata is real content from the UI-SPEC copywriting contract.

## Self-Check: PASSED

Files created verified:
- src/app/sitemap.ts — exists
- src/app/robots.ts — exists

Commits verified:
- 2abf70c — Task 1 commit
- 8d39fc1 — Task 2 commit

Build: passed (pnpm build exits 0 with .env.local)
TypeScript: passed (tsc --noEmit exits 0)
