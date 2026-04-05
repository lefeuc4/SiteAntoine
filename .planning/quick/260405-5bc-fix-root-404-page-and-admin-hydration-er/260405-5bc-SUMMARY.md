---
phase: quick
plan: 260405-5bc
subsystem: app-layout
tags: [bugfix, layout, 404, hydration]
dependency_graph:
  requires: []
  provides: [root-passthrough-layout, root-french-404]
  affects: [admin-panel, frontend-pages, 404-handling]
tech_stack:
  added: []
  patterns: [route-group-layout-ownership, root-passthrough-pattern]
key_files:
  created:
    - src/app/not-found.tsx
  modified:
    - src/app/layout.tsx
    - src/app/(frontend)/layout.tsx
decisions:
  - Root layout pass-through pattern (return children) lets each route group own its html/body
  - Root not-found.tsx includes own html/body since root layout is a pass-through
metrics:
  duration: 2min
  completed: "2026-04-05T01:53:35Z"
---

# Quick Fix 260405-5bc: Fix Root 404 Page and Admin Hydration Errors Summary

Root layout restructured to pass-through pattern; frontend layout now owns html/body with fonts, analytics, and cookie banner; root-level French 404 page added.

## What Changed

### Task 1: Restructure layouts -- root pass-through, frontend owns html/body
**Commit:** e97c1b9

- Rewrote `src/app/layout.tsx` to a minimal pass-through (`return children as React.JSX.Element`) keeping only metadata export
- Updated `src/app/(frontend)/layout.tsx` to render `<html>` and `<body>` with Montserrat/Inter fonts, `globals.css` import (via `../globals.css`), Analytics, CookieBanner, Header, Footer, FloatingWhatsApp
- This eliminates nested `<html>` tags that caused 7 hydration errors in the admin panel, since Payload's `(payload)/layout.tsx` renders its own `<html>/<body>` independently

### Task 2: Create root-level not-found.tsx for French 404
**Commit:** f2b215a

- Created `src/app/not-found.tsx` with own `<html lang="fr">` and `<body>` wrapping (required since root layout is a pass-through)
- Content matches existing `(frontend)/not-found.tsx`: "Page introuvable" heading, description, "Retour a l'accueil" button
- Includes same Montserrat/Inter font configuration and globals.css for consistent styling

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None.

## Verification

- `pnpm build` completes successfully with all routes generated
- Route table shows `/_not-found` as static prerendered page
- No TypeScript errors

## Self-Check: PASSED

All 3 files verified on disk. Both commit hashes (e97c1b9, f2b215a) found in git log.
