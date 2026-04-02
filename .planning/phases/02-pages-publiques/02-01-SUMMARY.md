---
phase: 02-pages-publiques
plan: 01
subsystem: layout-and-ui-components
tags: [header, footer, scroll-reveal, before-after-slider, service-card, programme-card, resultat-card, layout, ui-components]
dependency_graph:
  requires: []
  provides: [Header, Footer, ScrollReveal, BeforeAfterSlider, ServiceCard, ProgrammeCard, ResultatCard, root-layout-shell]
  affects: [all-public-pages, plans-02-03-04-05]
tech_stack:
  added: [lucide-react@1.7.0]
  patterns: [sticky-header-scroll-detection, mobile-hamburger-overlay, intersection-observer-scroll-reveal, css-custom-property-slider, server-component-cards]
key_files:
  created:
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
    - src/components/ui/ScrollReveal.tsx
    - src/components/ui/BeforeAfterSlider.tsx
    - src/components/ui/ServiceCard.tsx
    - src/components/ui/ProgrammeCard.tsx
    - src/components/ui/ResultatCard.tsx
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - package.json
    - pnpm-lock.yaml
    - src/scripts/seed.ts
decisions:
  - "Header uses transparentOnLoad prop pattern — only Accueil passes true, all other pages use solid bg-blanc-pur default"
  - "BeforeAfterSlider uses CSS custom property --slider-pos driven by range input — no JS library needed"
  - "ProgrammeCard description typed as unknown, cast at render via RichText — avoids Lexical JSON type complexity in props"
  - "ServiceCard uses icon string-to-component map — 6 icons pre-mapped, fallback to Star"
metrics:
  duration: 5min
  completed: 2026-04-02
  tasks: 3
  files_created: 7
  files_modified: 5
---

# Phase 02 Plan 01: Layout Shell and UI Components Summary

Sticky header with scroll-transparent hero support, mobile hamburger overlay, Footer, ScrollReveal IntersectionObserver wrapper, BeforeAfterSlider with CSS clip-path range input, and three Server Component cards (ServiceCard, ProgrammeCard, ResultatCard) — all integrated into the root layout.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install lucide-react, add scroll reveal CSS, create Header and Footer | f5d74b1 | package.json, pnpm-lock.yaml, globals.css, layout.tsx, Header.tsx, Footer.tsx, seed.ts |
| 2 | Create ScrollReveal and BeforeAfterSlider client components | 64108e5 | ScrollReveal.tsx, BeforeAfterSlider.tsx |
| 3 | Create ServiceCard, ProgrammeCard, and ResultatCard components | 22e85b7 | ServiceCard.tsx, ProgrammeCard.tsx, ResultatCard.tsx |

## Decisions Made

1. **Header transparentOnLoad pattern**: Header accepts `transparentOnLoad?: boolean` (default: `false`). Only the Accueil page will pass `true`. All other pages use the solid `bg-blanc-pur` header by default. This avoids any page needing complex layout-level overrides.

2. **BeforeAfterSlider — CSS custom property approach**: Slider position driven by `--slider-pos` CSS custom property updated on `onInput` from the range input overlay. No JS library. Clip-path applied to before-image container: `inset(0 calc(100% - var(--slider-pos)) 0 0)`.

3. **ProgrammeCard rich text typing**: `description` prop typed as `unknown` and cast to `Parameters<typeof RichText>[0]['data']` at render. This avoids propagating the complex Lexical JSON type through the component props while remaining type-safe.

4. **ServiceCard icon map**: Static map of 6 lucide icons (`dumbbell`, `heart`, `users`, `target`, `trophy`, `zap`) with Star fallback. Sufficient for the seeded services data; additional icons can be added to the map as content grows.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed pre-existing TypeScript type error in seed.ts**
- **Found during:** Task 1 — pnpm build verification
- **Issue:** `src/scripts/seed.ts` lexicalParagraph helper had `direction: 'ltr'` typed as `string` instead of the required `'ltr' | 'rtl' | null` union, causing TypeScript build failure
- **Fix:** Added `as const` assertions to `direction` and `format` fields in the Lexical JSON helper — however the linter had already applied the fix before my edit landed
- **Files modified:** src/scripts/seed.ts
- **Commit:** f5d74b1

## Known Stubs

- **ServiceCard, ProgrammeCard, ResultatCard**: Props accept real data from Payload collections. The card components themselves are fully wired. However, no page yet imports these cards and passes Payload data to them — this is intentional. Plans 02-02 through 02-05 will create the pages and wire the data.
- These stubs are expected at this stage and do not prevent Plan 01's goal (reusable components ready for page integration).

## Self-Check

## Self-Check: PASSED

All 7 created files verified on disk. All 3 task commits (f5d74b1, 64108e5, 22e85b7) found in git log.
