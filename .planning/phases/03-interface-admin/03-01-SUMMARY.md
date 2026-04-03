---
phase: 03-interface-admin
plan: 01
subsystem: admin-config
tags: [payload-cms, i18n, french, access-control, lexical, collections]
dependency_graph:
  requires: []
  provides: [french-admin-ui, collection-labels, access-restrictions, lexical-restriction]
  affects: [src/payload.config.ts, src/collections/*, src/scripts/seed.ts]
tech_stack:
  added: ["@payloadcms/translations@3.81.0"]
  patterns: [payload-i18n, lexical-feature-restriction, collection-access-control, seed-overrideAccess]
key_files:
  created: []
  modified:
    - src/payload.config.ts
    - src/collections/Programmes.ts
    - src/collections/Resultats.ts
    - src/collections/PageContent.ts
    - src/collections/Media.ts
    - src/collections/Users.ts
    - src/scripts/seed.ts
decisions:
  - "defaultSort is not a valid CollectionAdminOptions property in Payload 3.81.0 — removed from PageContent admin config"
  - "payload-types.ts is gitignored — generate:types ran successfully but file not committed"
metrics:
  duration: "4 minutes"
  completed: "2026-04-03"
  tasks_completed: 2
  files_modified: 7
---

# Phase 03 Plan 01: Payload Admin French Configuration Summary

**One-liner:** French-only Payload admin with restricted 6-feature Lexical editor, 5 MB upload limit, French labels/descriptions on all 5 collections, access control on PageContent, Users hidden from sidebar, and seed script fixed for overrideAccess.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Configure i18n French, restricted Lexical, upload limit | 2854170 | src/payload.config.ts, package.json, pnpm-lock.yaml, importMap.js |
| 2 | French labels, access control, sidebar groups, fix seed | 297089a | src/collections/*.ts (5 files), src/scripts/seed.ts |

## What Was Built

### Task 1: payload.config.ts
- Installed `@payloadcms/translations@3.81.0`
- Added `i18n: { fallbackLanguage: 'fr', supportedLanguages: { fr } }` — admin UI displays in French
- Replaced default `lexicalEditor()` with restricted 6-feature config: BoldFeature, ItalicFeature, UnorderedListFeature, OrderedListFeature, LinkFeature, FixedToolbarFeature
- Added `upload.limits.fileSize: 5_000_000` (5 MB server-side limit)

### Task 2: Collection Files
All 5 collections updated:
- **Programmes.ts**: French `labels`, `admin.group: 'Contenu'`, French label and description on every field
- **Resultats.ts**: French `labels`, `admin.group: 'Contenu'`, CNIL consent field with mandatory notice, French descriptions on all fields
- **PageContent.ts**: `access.create: () => false`, `access.delete: () => false`, French labels, `listSearchableFields: ['page', 'section', 'titre']`, `group: 'Contenu'`, select options with French labels
- **Media.ts**: French `labels`, `admin.group: 'Contenu'`, French description on alt field
- **Users.ts**: `admin.hidden: true` — removed from sidebar, password change via Payload profile menu

### seed.ts Fix
Added `overrideAccess: true` to all 13 `page-content` operations (1 delete loop + 12 create calls) so the seed script still works after access restrictions were added.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed invalid `defaultSort` from PageContent admin config**
- **Found during:** Task 2 — TypeScript build failure
- **Issue:** `defaultSort: 'page'` is not a valid property of `CollectionAdminOptions` in Payload 3.81.0, causing TS type error
- **Fix:** Removed `defaultSort` from `PageContent.admin` block. The list can still be sorted by column headers in the UI.
- **Files modified:** `src/collections/PageContent.ts`
- **Commit:** 297089a

## Known Stubs

None — this plan configures admin metadata only, no content or UI rendering paths.

## Verification

```bash
# All pass:
grep "fallbackLanguage" src/payload.config.ts      # -> 'fr'
grep "BoldFeature" src/payload.config.ts            # match
grep "fileSize: 5_000_000" src/payload.config.ts    # match
grep -c "group: 'Contenu'" src/collections/*.ts     # 4 (Programmes, Resultats, PageContent, Media)
grep "hidden: true" src/collections/Users.ts        # match
grep "create: () => false" src/collections/PageContent.ts  # match
grep -c "overrideAccess: true" src/scripts/seed.ts  # 13
pnpm build                                          # exit 0
```

## Self-Check: PASSED

- src/payload.config.ts: FOUND
- src/collections/Programmes.ts: FOUND
- src/collections/Resultats.ts: FOUND
- src/collections/PageContent.ts: FOUND
- src/collections/Media.ts: FOUND
- src/collections/Users.ts: FOUND
- src/scripts/seed.ts: FOUND
- Commit 2854170: FOUND
- Commit 297089a: FOUND
