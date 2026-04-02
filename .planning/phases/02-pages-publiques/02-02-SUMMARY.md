---
phase: 02-pages-publiques
plan: 02
subsystem: seed
tags: [seed, payload, demo-data, programmes, resultats, page-content]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [seed-script]
  affects: [02-03, 02-04, 02-05, 02-06]
tech_stack:
  added: [tsx@4.21.0]
  patterns: [getPayload-seed, lexical-richtext-helper]
key_files:
  created:
    - src/scripts/seed.ts
  modified:
    - package.json
decisions:
  - "Empty photosAvant/photosApres arrays per D-15: color block placeholders, no real uploads needed during seed"
  - "lexicalParagraph helper function for type-safe Lexical JSON richText construction"
metrics:
  duration: 5min
  completed_date: "2026-04-02"
  tasks_completed: 1
  files_created: 1
  files_modified: 1
---

# Phase 2 Plan 02: Seed Script Demo Data Summary

## One-liner

Payload CMS seed script with 3 programmes, 3 resultats, and 12 page-content docs (French placeholder data) runnable via `pnpm seed`.

## What Was Built

### Task 1: Install tsx and create seed script with demo data

Created `src/scripts/seed.ts` — a complete seed script for populating Payload CMS with realistic French demo data across all three content collections used by the public pages.

**Key implementation details:**
- `lexicalParagraph(text: string)` helper builds type-safe Lexical JSON for richText fields using `as const` assertions to satisfy Payload's strict direction type (`'ltr' | 'rtl' | null`)
- Cleans existing data (find + delete loop) before seeding to make the script idempotent
- Seeds 3 Programmes (Transformation 12 Semaines, Coaching Performance, Equilibre & Bien-Etre)
- Seeds 3 Resultats (Sophie, Marc, Claire) with `consentementCNIL: true` and empty photo arrays
- Seeds 12 PageContent docs: 4 services-apercu items (accueil), 5 mon-histoire timeline entries, 3 mes-services items (services)
- Error handling with try/catch, `process.exit(0)` on success, `process.exit(1)` on failure

Added `"seed": "tsx src/scripts/seed.ts"` to `package.json` scripts.

## Acceptance Criteria Verification

- [x] `package.json` contains `"tsx"` in devDependencies
- [x] `package.json` scripts contains `"seed": "tsx src/scripts/seed.ts"`
- [x] `src/scripts/seed.ts` contains `getPayload`
- [x] `src/scripts/seed.ts` contains `import config from`
- [x] `src/scripts/seed.ts` contains `collection: 'programmes'`
- [x] `src/scripts/seed.ts` contains `collection: 'resultats'`
- [x] `src/scripts/seed.ts` contains `collection: 'page-content'`
- [x] `src/scripts/seed.ts` contains `Transformation 12 Semaines`
- [x] `src/scripts/seed.ts` contains `Sophie`
- [x] `src/scripts/seed.ts` contains `Marc`
- [x] `src/scripts/seed.ts` contains `services-apercu`
- [x] `src/scripts/seed.ts` contains `mon-histoire`
- [x] `src/scripts/seed.ts` contains `mes-services`
- [x] `src/scripts/seed.ts` contains `consentementCNIL: true`
- [x] `src/scripts/seed.ts` contains `lexicalParagraph` helper function
- [x] `src/scripts/seed.ts` contains `process.exit`
- [x] TypeScript compiles without errors (`tsc --noEmit` passes)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript direction type literal narrowing**
- **Found during:** Task 1 verification (pnpm build type check)
- **Issue:** `lexicalParagraph` returned `direction: 'ltr'` typed as `string`, incompatible with Payload's expected `'ltr' | 'rtl' | null` union type
- **Fix:** Added `as const` assertions on all literal string/number values in the returned object
- **Files modified:** `src/scripts/seed.ts`
- **Commit:** f5d74b1 (included in 02-01 parallel agent commit)

### Note on Parallel Execution

This plan ran in parallel with 02-01. The 02-01 agent committed `src/scripts/seed.ts` and `package.json` as part of its commit `f5d74b1`, noting "Fix pre-existing TypeScript type error in seed.ts (direction as const)". The seed script content is identical to what this plan specified — all acceptance criteria are met.

## Known Stubs

None — the seed script contains complete, realistic French placeholder content. The script is not wired to the UI directly; it's an executable that populates the database for development and staging environments.

## Self-Check: PASSED

- src/scripts/seed.ts: FOUND (committed at f5d74b1)
- package.json seed script: FOUND (committed at f5d74b1)
- tsx in devDependencies: FOUND
- TypeScript: no errors
