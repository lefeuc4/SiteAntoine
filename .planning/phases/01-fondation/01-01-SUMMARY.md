---
phase: 01-fondation
plan: 01
subsystem: database, infra
tags: [next.js, payload-cms, postgresql, neon, vercel-blob, typescript]

# Dependency graph
requires: []
provides:
  - "Running Next.js 16 + Payload CMS 3 project with App Router"
  - "5 Payload collections: Users, Media, Programmes, Resultats, PageContent"
  - "Neon PostgreSQL connection with applied migrations"
  - "Vercel Blob storage configured for media uploads"
  - "Payload admin UI at /admin with authentication"
  - "REST API endpoints for all content collections"
affects: [01-02, 02-pages-publiques, 03-interface-admin]

# Tech tracking
tech-stack:
  added: [next.js 16.2.2, payload 3.81.0, @payloadcms/db-postgres, @payloadcms/storage-vercel-blob, @payloadcms/richtext-lexical, sharp, tailwindcss 4, cross-env, graphql]
  patterns: [payload-inside-nextjs-app-router, server-function-for-payload-layout, public-read-access-on-content-collections]

key-files:
  created:
    - src/payload.config.ts
    - src/collections/Users.ts
    - src/collections/Media.ts
    - src/collections/Programmes.ts
    - src/collections/Resultats.ts
    - src/collections/PageContent.ts
    - src/app/(payload)/admin/[[...segments]]/page.tsx
    - src/app/(payload)/api/[...slug]/route.ts
    - src/app/(payload)/layout.tsx
    - src/app/(payload)/admin/importMap.js
    - src/migrations/20260401_205704.ts
    - .env.example
    - .gitignore
    - .nvmrc
  modified:
    - package.json
    - next.config.ts

key-decisions:
  - "Used Payload blank template as bootstrap, moved to repo root"
  - "Public read access on Programmes, Resultats, PageContent, Media for public-facing pages"
  - "migrate:fresh to clean up dev-pushed schema and apply proper migration"
  - "Added sharp import to payload.config.ts for image processing"
  - "Added serverFunction to Payload layout (required by Payload 3.81.0)"

patterns-established:
  - "Payload layout requires serverFunction prop with handleServerFunctions wrapper (use server directive)"
  - "Content collections use access: { read: () => true } for public API access"
  - "Migration files live in src/migrations/ and are committed to git"
  - "Import map generated via pnpm payload generate:importmap after plugin changes"

requirements-completed: [DPLY-01]

# Metrics
duration: 20min
completed: 2026-04-01
---

# Phase 01 Plan 01: Bootstrap Next.js + Payload CMS Summary

**Next.js 16.2.2 + Payload CMS 3.81.0 with 5 collections (Programmes, Resultats, PageContent, Media, Users) connected to Neon PostgreSQL, Vercel Blob storage, and Lexical rich-text editor**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-01T20:40:19Z
- **Completed:** 2026-04-01T21:00:19Z
- **Tasks:** 2 auto + 1 checkpoint
- **Files modified:** 18

## Accomplishments
- Full Payload CMS 3 project running inside Next.js 16 App Router
- 5 collections defined with correct field schemas per design decisions D-08 through D-12
- Neon PostgreSQL connected with initial migration created and applied
- Vercel Blob storage configured with client uploads for media
- REST API endpoints returning 200 for all content collections
- Admin UI functional at /admin with user creation flow

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js + Payload project and configure environment** - `908d037` (feat)
2. **Task 2: Define all 5 Payload collections and verify admin UI** - `227dd8b` (feat)
3. **Task 3: Verify admin UI and collections in browser** - checkpoint (human-verify)

## Files Created/Modified
- `src/payload.config.ts` - Central Payload config: DB, storage, editor, collections, sharp
- `src/collections/Users.ts` - Users collection with built-in auth
- `src/collections/Media.ts` - Media upload with image sizes (thumbnail, card, full)
- `src/collections/Programmes.ts` - Programmes with titre, description, duree, objectifs, publicCible, imageCouverture, ordre
- `src/collections/Resultats.ts` - Resultats with photos avant/apres arrays, consentementCNIL checkbox
- `src/collections/PageContent.ts` - PageContent with page select (6 options), section, titre, contenu, image
- `src/app/(payload)/layout.tsx` - Payload layout with serverFunction prop
- `src/app/(payload)/admin/importMap.js` - Generated import map for Payload plugins
- `src/migrations/20260401_205704.ts` - Initial database migration
- `.env.example` - Template for required environment variables
- `package.json` - Project dependencies (Payload, Next.js, sharp, Tailwind, etc.)

## Decisions Made
- **Public read access on content collections**: Added `access: { read: () => true }` to Programmes, Resultats, PageContent, and Media so public pages can fetch data without authentication. Users collection remains admin-only.
- **migrate:fresh over migrate**: Dev mode had already pushed schema to Neon, causing enum conflict. Used `migrate:fresh` to drop and cleanly re-apply migration.
- **sharp passed to buildConfig**: Required for Payload image processing to work correctly.
- **serverFunction in layout**: Payload 3.81.0 requires a `serverFunction` prop wrapping `handleServerFunctions` with `'use server'` directive in the `(payload)/layout.tsx`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Payload admin 500 error - missing serverFunction prop**
- **Found during:** Task 1 verification (admin returning 500)
- **Issue:** Payload 3.81.0 RootLayout requires a `serverFunction` prop that was not in the generated template
- **Fix:** Added `handleServerFunctions` import from `@payloadcms/next/layouts`, created server function with `'use server'` directive, passed to RootLayout
- **Files modified:** `src/app/(payload)/layout.tsx`
- **Verification:** Admin returns 200, no console errors
- **Committed in:** 227dd8b

**2. [Rule 1 - Bug] Fixed sharp not found warning**
- **Found during:** Task 1 verification (console warning about sharp)
- **Issue:** `sharp` was installed but not passed to Payload config
- **Fix:** Added `import sharp from 'sharp'` and `sharp` property in buildConfig
- **Files modified:** `src/payload.config.ts`
- **Verification:** Warning no longer appears in dev server logs
- **Committed in:** 227dd8b

**3. [Rule 3 - Blocking] Generated import map for Vercel Blob plugin**
- **Found during:** Task 1 verification (admin 500, VercelBlobClientUploadHandler not in importMap)
- **Issue:** `@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler` was not registered in the import map
- **Fix:** Ran `pnpm payload generate:importmap` to regenerate the import map
- **Files modified:** `src/app/(payload)/admin/importMap.js`
- **Verification:** No more "PayloadComponent not found in importMap" errors
- **Committed in:** 227dd8b

**4. [Rule 2 - Missing Critical] Added public read access to content collections**
- **Found during:** Task 2 verification (API endpoints returning 403)
- **Issue:** Collections had no access config, defaulting to admin-only. Public pages need to read Programmes, Resultats, PageContent, Media without authentication.
- **Fix:** Added `access: { read: () => true }` to all 4 content collections
- **Files modified:** `src/collections/Programmes.ts`, `src/collections/Resultats.ts`, `src/collections/PageContent.ts`, `src/collections/Media.ts`
- **Verification:** All API endpoints return 200 with JSON response
- **Committed in:** 227dd8b

---

**Total deviations:** 4 auto-fixed (2 bugs, 1 blocking, 1 missing critical)
**Impact on plan:** All auto-fixes necessary for the admin and API to function. No scope creep.

## Issues Encountered
- Dev mode auto-pushed schema to Neon before migration creation, causing `enum_page_content_page already exists` error on `migrate`. Resolved with `migrate:fresh` which drops and re-creates cleanly.
- Port conflicts required multiple process kills during development iteration.

## User Setup Required

External services were configured during this plan:
- **Neon PostgreSQL**: DATABASE_URI set in .env.local (pooled connection string)
- **Vercel Blob**: BLOB_READ_WRITE_TOKEN set in .env.local
- **PAYLOAD_SECRET**: Generated with `openssl rand -hex 32`

## Known Stubs

None - all collections are fully wired to the database with working API endpoints.

## Next Phase Readiness
- All 5 collections are defined and migrated - ready for Phase 2 (public pages) and Phase 3 (admin CRUD)
- Tailwind CSS 4 is installed but design system tokens not yet defined (Plan 01-02)
- Admin user creation will happen on first visit to /admin (Task 3 checkpoint)

---
*Phase: 01-fondation*
*Completed: 2026-04-01*
