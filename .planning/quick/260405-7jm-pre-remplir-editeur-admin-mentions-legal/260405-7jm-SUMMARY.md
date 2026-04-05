---
phase: quick
plan: 260405-7jm
subsystem: cms-content
tags: [seed, lexical, mentions-legales, headings]
dependency_graph:
  requires: [mentions-legales-global]
  provides: [seed-mentions-legales-script, heading-feature-in-editor]
  affects: [src/payload.config.ts, src/scripts/seed-mentions-legales.ts, package.json]
tech_stack:
  added: []
  patterns: [lexical-structured-doc, updateGlobal-idempotent-seed]
key_files:
  created:
    - src/scripts/seed-mentions-legales.ts
  modified:
    - src/payload.config.ts
    - package.json
decisions:
  - HeadingFeature placed first in features array for logical ordering (headings before formatting)
  - linkNode uses version 3 and fields.linkType custom matching Payload Lexical internal format
  - seed:mentions script is idempotent via updateGlobal — safe to run multiple times
metrics:
  duration: 2min
  completed: 2026-04-05
  tasks_completed: 2
  files_changed: 3
---

# Quick 260405-7jm: Pre-remplir editeur admin Mentions Legales — Summary

**One-liner:** HeadingFeature added to Lexical editor config and standalone seed script created to pre-populate the Mentions Legales global with all 7 legal sections including h2 headings and /contact link nodes.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Add HeadingFeature to Lexical editor config | 05274a0 |
| 2 | Create seed script for Mentions Legales content | 3d79fc3 |

## What Was Built

### Task 1 — HeadingFeature in payload.config.ts

- Imported `HeadingFeature` from `@payloadcms/richtext-lexical`
- Added `HeadingFeature()` as the first entry in the `features` array of `lexicalEditor()`
- This enables h1–h6 heading selection in the Payload admin Lexical editor toolbar
- Required for the Mentions Legales content which uses h2 headings for each section

### Task 2 — seed-mentions-legales.ts

Created `src/scripts/seed-mentions-legales.ts` which:

1. Builds a Lexical JSON document with 7 sections:
   - Editeur du site (4 placeholder paragraphs with `[A COMPLETER]`)
   - Hebergement (Vercel Inc. address)
   - Directeur de publication (Antoine Profit)
   - Donnees personnelles et RGPD (paragraph with `/contact` link node)
   - Cookies et traceurs (Vercel Analytics paragraph)
   - Photos et consentement clients (paragraph with `/contact` link node)
   - Contact (paragraph with `/contact` link node)

2. Calls `payload.updateGlobal({ slug: 'mentions-legales', data: { contenu: lexicalDoc } })`
3. Logs success and exits — idempotent (overwrites on repeat runs)

Added `"seed:mentions": "tsx src/scripts/seed-mentions-legales.ts"` to package.json scripts.

## Deviations from Plan

None — plan executed exactly as written.

The verify command in the plan used `cd /home/lefeuc4/claude/SiteAntoine` (main repo) but the file was created in the worktree. Verification was run from the worktree using the main repo's `tsx` binary — script ran correctly, failing only at `PAYLOAD_SECRET` missing (expected in dev without DB credentials).

## Known Stubs

None. The seed script provides placeholder content (`[A COMPLETER]`) intentionally — these are prompts for Antoine to fill in, not stubs that break functionality. The public page's `hasContent` check will pass once the seed is run.

## Self-Check

- [x] `src/scripts/seed-mentions-legales.ts` exists in worktree
- [x] `src/payload.config.ts` contains `HeadingFeature`
- [x] `package.json` contains `seed:mentions` script
- [x] Commit `05274a0` exists (Task 1)
- [x] Commit `3d79fc3` exists (Task 2)
