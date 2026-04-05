---
phase: quick
plan: 260405-6ai
subsystem: admin
tags: [payload-cms, hooks, beforeDelete, admin-ui, confirmation-modal, client-component]

# Dependency graph
requires:
  - phase: 01-fondations
    provides: Payload CMS collections (PageContent, Programmes, Resultats, Users)
provides:
  - Shared beforeDelete confirmation hook factory
  - SafeDeleteButton client component with type-to-confirm modal
  - Unlocked create/delete access on PageContent
affects: [admin, content-management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "beforeDelete hook factory pattern for safe deletion across collections"
    - "Client component registered via beforeDocumentControls slot with import map string"
    - "X-Delete-Confirmation header protocol between client component and server hook"

key-files:
  created:
    - src/hooks/confirmDeleteHook.ts
    - src/components/admin/SafeDeleteButton.tsx
  modified:
    - src/collections/PageContent.ts
    - src/collections/Programmes.ts
    - src/collections/Resultats.ts
    - src/collections/Users.ts

key-decisions:
  - "PageContent hook uses 'section' field (matches useAsTitle) instead of 'titre' to ensure modal title matches server validation"
  - "Local API calls (payloadAPI === 'local') bypass confirmation for seed/programmatic operations"

patterns-established:
  - "beforeDelete hook factory: createConfirmDeleteHook(titleField) for reuse across collections"
  - "Custom admin component registration via string path in beforeDocumentControls array"

requirements-completed: []

# Metrics
duration: 5min
completed: 2026-04-05
---

# Quick Task 260405-6ai: Unlock PageContent Create/Delete with Safe Confirmation Summary

**beforeDelete hook + type-to-confirm modal preventing accidental deletions across all content collections**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-05T02:36:54Z
- **Completed:** 2026-04-05T02:42:15Z
- **Tasks:** 2 (+ 1 checkpoint noted)
- **Files modified:** 6

## Accomplishments
- Unlocked create and delete access on PageContent (previously blocked by access rules)
- Created shared beforeDelete hook factory that validates X-Delete-Confirmation header against document title
- Built SafeDeleteButton client component with confirmation modal requiring exact title input (paste/drop blocked)
- Registered SafeDeleteButton on all 4 collections (PageContent, Programmes, Resultats, Users)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create beforeDelete hook and unlock collection access** - `3199642` (feat)
2. **Task 2: Create SafeDeleteButton admin component with confirmation modal** - `8c87fe4` (feat)

## Files Created/Modified
- `src/hooks/confirmDeleteHook.ts` - Factory function returning BeforeDeleteHook with title confirmation
- `src/components/admin/SafeDeleteButton.tsx` - Client component with type-to-confirm modal, paste blocked
- `src/collections/PageContent.ts` - Removed create/delete restrictions, added hook + component
- `src/collections/Programmes.ts` - Added beforeDelete hook + SafeDeleteButton registration
- `src/collections/Resultats.ts` - Added beforeDelete hook + SafeDeleteButton registration
- `src/collections/Users.ts` - Added beforeDelete hook + SafeDeleteButton registration

## Decisions Made
- PageContent hook uses `section` field (matching `useAsTitle: 'section'`) instead of `titre` to ensure the title shown in the modal matches what the server validates
- Local API calls bypass confirmation via `req.payloadAPI === 'local'` check, keeping seed scripts working

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed PageContent hook field mismatch**
- **Found during:** Task 2 (SafeDeleteButton registration)
- **Issue:** Plan specified `createConfirmDeleteHook('titre')` for PageContent, but `useAsTitle` is `'section'`. The modal shows `useDocumentInfo().title` (derived from `useAsTitle`), so the user would type the section name while the server checks `titre` — a different field value.
- **Fix:** Changed to `createConfirmDeleteHook('section')` so modal display and server validation use the same field
- **Files modified:** `src/collections/PageContent.ts`
- **Verification:** TypeScript compiles, field names match `useAsTitle` across all collections
- **Committed in:** `8c87fe4` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for correctness — without it, deletion confirmation would never match on PageContent documents.

## Issues Encountered
- `BeforeDeleteHook` type is exported as `CollectionBeforeDeleteHook` from `payload` package (not `BeforeDeleteHook` directly) — fixed import name
- `@payloadcms/ui` not hoisted to root `node_modules` in pnpm — TypeScript check in worktree fails but passes correctly from main repo

## User Setup Required
None - no external service configuration required.

## Verification Notes
- Checkpoint task (Task 3) noted for manual verification: start dev server, test create button visibility, test delete modal flow, test paste blocking, test wrong title stays disabled
- TypeScript compiles clean from main repo (`npx tsc --noEmit` passes)

---
*Quick task: 260405-6ai*
*Completed: 2026-04-05*
