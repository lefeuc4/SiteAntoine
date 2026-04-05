---
phase: quick
plan: 260405-8ah
subsystem: cms-globals
tags: [payload, global, accueil, hero, seed]
dependency_graph:
  requires: []
  provides: [accueil-global, hero-editable, cta-editable, presentation-editable]
  affects: [src/app/(frontend)/page.tsx, src/components/sections/HeroSection.tsx, src/components/sections/CTABandeau.tsx]
tech_stack:
  added: []
  patterns: [payload-global, seed-script, next-image-fill]
key_files:
  created:
    - src/globals/Accueil.ts
    - src/scripts/seed-accueil.ts
  modified:
    - src/payload.config.ts
    - src/components/sections/HeroSection.tsx
    - src/components/sections/CTABandeau.tsx
    - src/app/(frontend)/page.tsx
    - package.json
decisions:
  - Accueil global placed in admin group 'Pages' (not 'Configuration') — page content, not site settings
  - heroImage uses next/image with fill={true} when URL provided, falls back to placeholder div
  - All text fields have fallbacks matching original hardcoded values for zero visual regression before seed
metrics:
  duration: 8min
  completed: 2026-04-05
  tasks: 2
  files: 7
---

# Quick 260405-8ah: Creer Global Accueil avec heroTitre/Hero Summary

**One-liner:** Payload Global "Accueil" with 5 editable fields (heroTitre, heroDescription, heroImage, presentation, ctaTitre) wired to homepage components with seed defaults.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Accueil global and register it | 386c9d0 | src/globals/Accueil.ts, src/payload.config.ts |
| 2 | Wire components to global data and create seed | c0c2dbd | HeroSection.tsx, CTABandeau.tsx, page.tsx, seed-accueil.ts, package.json |

## What Was Built

### Global Accueil (`src/globals/Accueil.ts`)
Payload global config with 5 fields:
- `heroTitre` (text, required) — Main hero headline
- `heroDescription` (textarea, required) — Hero subtitle paragraph
- `heroImage` (upload, media relation) — Optional hero photo
- `presentation` (textarea, required) — Presentation section text
- `ctaTitre` (text, required) — CTA bandeau heading

Admin group: "Pages". Public read access (`() => true`).

### Component Updates
- **HeroSection**: Accepts `heroTitre`, `heroDescription`, `heroImageUrl` props. When `heroImageUrl` provided, renders `next/image` with `fill={true}` and `object-cover`. Fallbacks match original hardcoded text.
- **CTABandeau**: Accepts `ctaTitre` prop with fallback to "Pret a transformer ta vie ?"

### Page Wiring (`src/app/(frontend)/page.tsx`)
- `payload.findGlobal({ slug: 'accueil', depth: 1 })` fetches the global with heroImage relation populated
- `heroImage` cast as `{ url?: string } | undefined` for safe URL extraction
- `presentation` text replaces hardcoded paragraph content
- Props passed to HeroSection and CTABandeau

### Seed Script (`src/scripts/seed-accueil.ts`)
- `pnpm seed:accueil` command added to package.json
- Pre-fills all text fields with default French coaching copy
- Does not set heroImage (no media to reference at seed time)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Payload types not generated for new global**
- **Found during:** Task 2 TypeScript verification
- **Issue:** `payload-types.ts` did not include 'accueil' slug — TS2322/TS2339 errors in page.tsx and seed-accueil.ts
- **Fix:** Ran `pnpm generate:types` to regenerate types; `payload-types.ts` is gitignored so not committed
- **Files modified:** src/payload-types.ts (gitignored, runtime artifact)
- **Commit:** c0c2dbd (types regenerated before commit, verified clean)

## Known Stubs

None — all fields have fallbacks matching original hardcoded values. The global itself has no default data in Payload until `pnpm seed:accueil` is run, but the fallbacks ensure zero visual regression before seed.

## Self-Check: PASSED

- src/globals/Accueil.ts: FOUND
- src/scripts/seed-accueil.ts: FOUND
- Commit 386c9d0: FOUND
- Commit c0c2dbd: FOUND
- TypeScript: no errors
