# Codebase Concerns

**Analysis Date:** 2026-04-05

## Tech Debt

**Pervasive `as any` Type Assertions on Payload Global Fields:**
- Issue: Payload global fields are accessed with `(settings as any).whatsappNumber` instead of using generated types from `src/payload-types.ts`
- Files: `src/app/(frontend)/layout.tsx` (lines 12-13), `src/app/(frontend)/contact/page.tsx` (lines 27-30), `src/app/(frontend)/mentions-legales/page.tsx` (lines 29-31, 40)
- Impact: No compile-time type safety on global field access. Renaming a field in the Payload config silently breaks at runtime with `undefined` values instead of a TypeScript error.
- Fix approach: Import the generated types from `src/payload-types.ts` and cast `findGlobal()` results properly. Example: `const settings = await payload.findGlobal({ slug: 'contact-settings' }) as ContactSetting`

**Duplicated `extractPlainText()` Helper:**
- Issue: The same Lexical rich text plain text extraction function is copy-pasted in two files
- Files: `src/app/(frontend)/page.tsx` (lines 26-39), `src/app/(frontend)/mon-histoire/page.tsx` (lines 21-34)
- Impact: Bug fixes or improvements must be applied twice. Easy to diverge.
- Fix approach: Extract to `src/lib/lexical.ts` and import from both pages

**Inline Rich Text Traversal in Services Page:**
- Issue: `(doc.contenu as any)?.root?.children?.[0]?.children?.[0]?.text` used inline instead of the `extractPlainText()` helper
- Files: `src/app/(frontend)/services/page.tsx` (line 57)
- Impact: Inconsistent pattern, fragile, no type safety
- Fix approach: Use the shared `extractPlainText()` helper (once extracted to `src/lib/`)

**Hardcoded "5" in Dashboard Widget:**
- Issue: The "Pages a editer" counter shows a hardcoded `5` instead of querying actual count
- Files: `src/components/admin/DashboardWidget.tsx` (line 155)
- Impact: Inaccurate if page-content documents are added or removed
- Fix approach: Use `payload.count({ collection: 'page-content' })` like the other counters

**Hardcoded Hero Section Content:**
- Issue: The hero section text and CTA are hardcoded in the component, not editable from admin
- Files: `src/components/sections/HeroSection.tsx`
- Impact: Antoine cannot update the main landing section headline, description, or CTA text without code changes
- Fix approach: Add a `page-content` entry for `page: 'accueil', section: 'hero'` and fetch it in the home page

**No `loading.tsx` or `error.tsx` Boundaries:**
- Issue: No loading states or error boundaries exist for any route
- Files: Missing files in `src/app/(frontend)/` and route directories
- Impact: Users see a blank screen during slow Neon cold starts. Unhandled errors show Next.js default error page.
- Fix approach: Add `loading.tsx` with skeleton UI and `error.tsx` with user-friendly French error messages

## Known Bugs

**Resend Sender Address Still in Dev Mode:**
- Symptoms: Contact form emails are sent from `onboarding@resend.dev` instead of the production domain
- Files: `src/app/actions/sendContactEmail.ts` (line 34)
- Trigger: Every contact form submission
- Workaround: Emails still deliver but may go to spam. Marked with a TODO comment in code.

**CookieBanner Consent Has No Effect on Analytics:**
- Symptoms: `<Analytics />` from `@vercel/analytics` is always rendered regardless of cookie consent choice
- Files: `src/app/layout.tsx` (line 35), `src/components/ui/CookieBanner.tsx`
- Trigger: User clicks "Refuser" on cookie banner, but analytics still loads
- Workaround: Vercel Analytics is privacy-friendly (no cookies), so the legal risk is low. But the UX implies the user has a choice when they effectively do not.

## Security Considerations

**Public Read Access on All Collections:**
- Risk: All collections have `access: { read: () => true }` which exposes all data via the Payload REST API at `/api/`
- Files: `src/collections/Programmes.ts` (line 10), `src/collections/Resultats.ts` (line 10), `src/collections/PageContent.ts` (line 10), `src/collections/Media.ts` (line 10)
- Current mitigation: The data is already public on the frontend. No sensitive fields in these collections.
- Recommendations: Fine for current use case. If private collections are added later, remember to restrict access. Consider adding write access restrictions explicitly (currently relies on Payload defaults for non-read operations).

**No Rate Limiting on Contact Form:**
- Risk: The `sendContactEmail` Server Action can be called repeatedly, potentially abusing the Resend API quota or enabling email bombing
- Files: `src/app/actions/sendContactEmail.ts`
- Current mitigation: Honeypot field blocks simple bots. Resend has its own rate limits.
- Recommendations: Add server-side rate limiting (e.g., by IP or session). Consider adding a simple timestamp-based throttle.

**Environment Variables Required at Runtime:**
- Risk: Missing env vars cause runtime crashes with non-descriptive errors (`!` non-null assertions)
- Files: `src/payload.config.ts` (lines 29, 52, 61), `src/app/actions/sendContactEmail.ts` (line 6, 38)
- Current mitigation: `.env.example` documents all required vars
- Recommendations: Add startup validation (e.g., Zod schema for `process.env`) to fail fast with clear error messages

## Performance Bottlenecks

**No Data Caching or Revalidation Strategy:**
- Problem: Every page request makes fresh Payload/Neon database queries. No `revalidate` exports, no `unstable_cache`, no ISR.
- Files: All pages in `src/app/(frontend)/`
- Cause: React Server Components fetch on every request by default in Next.js App Router
- Improvement path: Add `export const revalidate = 3600` (1 hour) to page files, or use `unstable_cache` for Payload queries. Content rarely changes, so aggressive caching is safe.

**Neon Cold Start Latency:**
- Problem: Neon free tier databases sleep after inactivity. First request after sleep can take 2-5 seconds for the DB connection.
- Files: Affects all pages that call `getPayload()` / `payload.find()`
- Cause: Neon serverless PostgreSQL cold start
- Improvement path: Enable Neon's "Always On" compute (paid), or add `loading.tsx` skeletons to mask the latency. ISR/caching also helps by reducing the frequency of DB hits.

**Multiple Sequential Payload Queries on Home Page:**
- Problem: Home page makes 2 sequential `payload.find()` calls (services-apercu + resultats)
- Files: `src/app/(frontend)/page.tsx` (lines 47-65)
- Cause: Queries are awaited sequentially instead of in parallel
- Improvement path: Use `Promise.all()` to run both queries concurrently

**Frontend Layout Fetches Contact Settings on Every Page:**
- Problem: `src/app/(frontend)/layout.tsx` calls `payload.findGlobal({ slug: 'contact-settings' })` on every page load to pass WhatsApp data to the floating button
- Files: `src/app/(frontend)/layout.tsx` (line 10)
- Cause: No caching; layout is a Server Component that re-executes per request
- Improvement path: Cache the global with `unstable_cache` or a `revalidate` directive

## Fragile Areas

**Lexical Rich Text Data Structure:**
- Files: `src/app/(frontend)/page.tsx`, `src/app/(frontend)/mon-histoire/page.tsx`, `src/app/(frontend)/services/page.tsx`
- Why fragile: The `extractPlainText()` function assumes a specific Lexical JSON structure (`root.children[0].children[0].text`). If the editor produces a different structure (e.g., heading instead of paragraph, or formatted text with multiple spans), it returns empty string.
- Safe modification: Always test with actual Payload editor output. Consider using the `<RichText />` renderer instead of manual extraction where possible.
- Test coverage: None

**Nav Links Duplicated in Header and Footer:**
- Files: `src/components/layout/Header.tsx` (lines 8-14), `src/components/layout/Footer.tsx` (lines 3-9)
- Why fragile: Adding a new page requires updating the nav array in two separate files. Easy to forget one.
- Safe modification: Extract `navLinks` to `src/lib/navigation.ts` and import from both
- Test coverage: None

**PageContent Collection Structure Relies on Seed Data:**
- Files: `src/collections/PageContent.ts` (access: `create: () => false`, `delete: () => false`), `src/scripts/seed.ts`
- Why fragile: The PageContent collection blocks create/delete in the admin. If seed data is lost or the database is reset, the pages show "coming soon" placeholders with no way for Antoine to recreate the structure from admin.
- Safe modification: Always run `pnpm seed` after database resets. Consider adding a "reseed" button or making create/delete available to admin users.
- Test coverage: None

## Scaling Limits

**Vercel Serverless Function Size:**
- Current capacity: Payload CMS + Next.js bundle is large. Vercel free tier allows 50 MB compressed.
- Limit: As more Payload plugins or dependencies are added, the bundle may exceed limits
- Scaling path: Monitor bundle size. Use `@next/bundle-analyzer` if needed.

**Vercel Blob Storage:**
- Current capacity: Free tier includes 1 GB storage
- Limit: Before/after photo galleries with many clients will accumulate quickly (each image ~2-5 MB)
- Scaling path: Monitor usage. Upgrade Vercel plan or migrate to external S3-compatible storage (`@payloadcms/storage-s3`)

## Dependencies at Risk

**None critical.** All dependencies are actively maintained:
- Payload CMS 3.81 — active development
- Next.js 16.2 — current stable
- React 19 — current stable
- All `@payloadcms/*` packages are pinned to `^3.81.0` and should stay in sync

## Missing Critical Features

**No Favicon or OG Image:**
- Problem: `public/` directory is empty. No favicon, no Open Graph image for social sharing.
- Blocks: Poor appearance in browser tabs and when links are shared on social media.

**No 404 Page:**
- Problem: No `not-found.tsx` file exists. Users hitting invalid URLs see the default Next.js 404.
- Blocks: Inconsistent branding, no way to guide lost users back to the site.

**No Admin Access Recovery:**
- Problem: If the single admin user loses their password, there is no documented recovery process
- Blocks: Antoine could be locked out of the CMS

## Test Coverage Gaps

**Entire Codebase is Untested:**
- What's not tested: Everything. No test framework is installed. Zero test files exist.
- Files: All files in `src/`
- Risk: Any refactoring (e.g., fixing the `as any` casts, extracting shared helpers) could introduce regressions with no safety net. The contact form email flow has no automated verification.
- Priority: High — especially for `src/lib/contactSchema.ts` and `src/app/actions/sendContactEmail.ts` which handle user input and external service calls

---

*Concerns audit: 2026-04-05*
