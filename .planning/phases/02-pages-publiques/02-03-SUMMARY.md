---
phase: 02-pages-publiques
plan: "03"
subsystem: public-pages
tags:
  - accueil
  - mon-histoire
  - hero
  - timeline
  - payload-local-api
dependency_graph:
  requires:
    - 02-01 (Header, Footer, ScrollReveal, ServiceCard, ResultatCard components)
    - 02-02 (seed data for services-apercu and resultats collections)
  provides:
    - src/app/page.tsx (Accueil route)
    - src/app/mon-histoire/page.tsx (Mon Histoire route)
    - src/components/sections/HeroSection.tsx
    - src/components/sections/ServicesApercu.tsx
    - src/components/sections/ResultatsVedette.tsx
    - src/components/sections/CTABandeau.tsx
  affects:
    - src/components/layout/Header.tsx (transparentOnLoad removed, pathname-based detection added)
tech_stack:
  added: []
  patterns:
    - Payload local API (getPayload) called directly in async Server Components
    - richText plain-text extraction helper (inline, no Lexical renderer import)
    - Pathname-based transparent header logic in Header client component
key_files:
  created:
    - src/app/page.tsx
    - src/app/mon-histoire/page.tsx
    - src/components/sections/HeroSection.tsx
    - src/components/sections/ServicesApercu.tsx
    - src/components/sections/ResultatsVedette.tsx
    - src/components/sections/CTABandeau.tsx
  modified:
    - src/components/layout/Header.tsx
decisions:
  - "Header transparent detection uses pathname === '/' instead of transparentOnLoad prop — avoids prop drilling through root layout"
  - "richText plain text extracted with inline helper accessing root.children[0].children[0].text — avoids importing full Lexical renderer for simple apercu text"
  - "ServicesApercu uses iconByIndex array fallback — PageContent schema has no icone field, icons determined by seed data order"
metrics:
  duration: "3 minutes"
  completed: "2026-04-02"
  tasks_completed: 2
  files_created: 6
  files_modified: 1
---

# Phase 02 Plan 03: Accueil and Mon Histoire Pages Summary

**One-liner:** Hero split layout with Payload-powered services/results sections and vertical timeline Mon Histoire page consuming PageContent collection.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Accueil page with hero and 4 content sections | 9b73a1d | src/app/page.tsx, HeroSection.tsx, ServicesApercu.tsx, ResultatsVedette.tsx, CTABandeau.tsx, Header.tsx |
| 2 | Create Mon Histoire page with vertical timeline | 89f25b8 | src/app/mon-histoire/page.tsx |

## What Was Built

### Accueil Page (`/`)
- Full-viewport hero split layout: text content left (H1 "Transforme ton corps. Transforme ta vie.", subheading, dual CTA buttons) and placeholder image right
- ServicesApercu grid (1/2/4 columns mobile/tablet/desktop) fetching `page-content` collection where `page=accueil` and `section=services-apercu`
- Inline presentation paragraph with "Decouvrir mon parcours →" link to Mon Histoire
- ResultatsVedette grid (1/2/3 columns) fetching `resultats` collection (limit 3, depth 2) for before/after photos
- CTABandeau full-width dark section (`bg-bleu-nuit`) with centered headline and contact CTA

### Mon Histoire Page (`/mon-histoire`)
- Vertical timeline from Payload `page-content` where `page=mon-histoire, section=mon-histoire`
- Desktop: centered line with alternating left/right entries per index parity
- Mobile: left-aligned line, all entries to the right
- Each entry wrapped in ScrollReveal for fade-in animation
- Empty state: "Parcours en cours de redaction."

### Header Update
- Removed `transparentOnLoad` prop (was unused in practice)
- Added `isHeroPage = pathname === '/'` detection inline — Header is already a client component using `usePathname()`
- Transparent on Accueil when not scrolled, solid white on all other pages

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written. The Header modification described in Task 1 was applied as specified (pathname-based detection).

## Known Stubs

- `HeroSection` right column: `<div>Photo coaching a venir</div>` — placeholder until Antoine provides a coaching photo. Non-blocking: the hero layout is fully functional, image slot reserved.
- `photoAvantUrl` / `photoApresUrl` in ResultatsVedette: passed as empty string `''` when no photos seeded (per D-15, seed intentionally has no real uploads). BeforeAfterSlider handles empty src gracefully with color block fallback. Non-blocking for v1.

## Self-Check: PASSED

All created files exist on disk. Both task commits (9b73a1d, 89f25b8) verified in git history. Build passes with zero errors (7 routes generated).
