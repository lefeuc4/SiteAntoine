---
phase: 03-interface-admin
plan: 02
subsystem: admin-dashboard
tags: [payload-cms, dashboard-widget, rsc, french, before-dashboard]
dependency_graph:
  requires: [03-01]
  provides: [dashboard-widget, admin-counters, quick-action-links]
  affects: [src/components/admin/DashboardWidget.tsx, src/payload.config.ts]
tech_stack:
  added: []
  patterns: [payload-local-api, react-server-component, before-dashboard-slot]
key_files:
  created:
    - src/components/admin/DashboardWidget.tsx
  modified:
    - src/payload.config.ts
decisions:
  - "DashboardWidget uses Payload CSS variables (--theme-elevation-50, --theme-text, --theme-success) with #10B981 fallback — inherits admin theme without coupling to specific colors"
  - "PageContent counter is static 5 (structure locked per D-05) — no payload.count() call needed for pages"
  - "beforeDashboard slot used instead of custom admin route — simpler integration, widget renders above default dashboard content"
metrics:
  duration: "5 minutes"
  completed: "2026-04-03"
  tasks_completed: 2
  files_modified: 2
---

# Phase 03 Plan 02: Dashboard Widget Summary

**One-liner:** Custom RSC dashboard widget with dynamic programme/resultat counters and French quick-action CRUD links registered via Payload beforeDashboard slot.

**Status: COMPLETE — All tasks done, admin verified by user**

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create DashboardWidget RSC and register in payload.config.ts | d4674be | src/components/admin/DashboardWidget.tsx, src/payload.config.ts |

## What Was Built

### Task 1: DashboardWidget RSC

- Created `src/components/admin/DashboardWidget.tsx` as an async React Server Component
- 3 counter cards in a responsive CSS grid (repeat(3, 1fr)):
  - **Programmes**: dynamic count via `payload.count({ collection: 'programmes', overrideAccess: true })`
  - **Resultats**: dynamic count via `payload.count({ collection: 'resultats', overrideAccess: true })`
  - **Pages a editer**: static value 5 (structure locked)
- Quick-action links per card:
  - "+ Ajouter un programme" → /admin/collections/programmes/create
  - "+ Ajouter un resultat" → /admin/collections/resultats/create
  - "Modifier les pages" → /admin/collections/page-content
- Design: Payload CSS variables, 2 font weights (600/700), 8-point spacing, 44px touch targets
- Registered in `src/payload.config.ts` via `admin.components.beforeDashboard: ['@/components/admin/DashboardWidget']`

## Deviations from Plan

- **Layout restructure (Rule 1 auto-fix):** Root layout wrapped all routes including /admin in `<html>/<body>/<Header>/<main>`, causing nested HTML documents with Payload's own `<html>/<body>`. Fixed by moving public pages into `(frontend)` route group with its own layout, making root layout a minimal `children`-only shell. Commit: 4e43398.

## Known Stubs

None — counter values are dynamic (payload.count), links point to real admin routes.

## Task 2: Admin Verification (human-verify)

All 11 verification points approved by user:
- Login page in French
- Dashboard widget with counters and quick-action links
- Sidebar collection groups under "Contenu"
- Field labels in French on all collections
- Restricted Lexical editor toolbar
- PageContent access control (no create/delete)

## Self-Check

- src/components/admin/DashboardWidget.tsx: FOUND
- src/payload.config.ts: contains beforeDashboard and DashboardWidget
- Commit d4674be: FOUND
- Build: PASSED (pnpm build exit 0)

## Self-Check: PASSED
