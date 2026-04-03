---
phase: 04-formulaire-de-contact
plan: 01
subsystem: api
tags: [resend, zod, react-hook-form, server-action, payload-global, email, honeypot]

# Dependency graph
requires:
  - phase: 03-interface-admin
    provides: payload.config.ts with collections — must add globals array alongside
provides:
  - ContactSettings Payload Global with WhatsApp and social link fields editable from admin
  - sendContactEmail Server Action with Zod validation, honeypot check, and Resend integration
  - contactSchema exported for client-side reuse in Plan 02 ContactForm component
  - ContactFormState and ContactFormValues types for form component
affects:
  - 04-02-contact-form-component (needs contactSchema, ContactFormState, ContactFormValues, ContactSettings Global)

# Tech tracking
tech-stack:
  added: [resend@6.10.0, react-hook-form@7.72.1, "@hookform/resolvers@5.2.2", zod@4.3.6]
  patterns:
    - Server Action with 'use server' directive for form submission (no API route needed)
    - Zod schema exported from Server Action file for client/server reuse (single source of truth)
    - Honeypot via hidden 'website' field — silent fake success return to bots
    - Payload Global for site-wide configurable settings (WhatsApp, social links)

key-files:
  created:
    - src/globals/ContactSettings.ts
    - src/app/actions/sendContactEmail.ts
  modified:
    - src/payload.config.ts
    - .env.example
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Zod 4.x installed (latest, not 3.x) — API surface used (z.object, z.string, z.infer, safeParse, flatten) is compatible with 4.x; @hookform/resolvers 5.x works with zod 4"
  - "ContactSettings Global uses access: { read: () => true } to allow public page fetch without auth"
  - "Resend 'from' uses sandbox onboarding@resend.dev for dev — TODO comment added for production domain verification"

patterns-established:
  - "Payload Global pattern: slug + label + group admin config + access.read: () => true for public globals"
  - "Server Action exports: action fn + Zod schema + inferred types — all from one file for colocation"

requirements-completed: [CTCT-01, CTCT-02]

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 4 Plan 01: Backend Infrastructure Summary

**Resend email Server Action with Zod validation and honeypot, plus ContactSettings Payload Global for WhatsApp and social link admin configuration**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T12:20:11Z
- **Completed:** 2026-04-03T12:22:06Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Installed resend, react-hook-form, @hookform/resolvers, zod into the project
- Created ContactSettings Payload Global (slug: 'contact-settings') with 4 fields: whatsappNumber, whatsappMessage, instagramUrl, facebookUrl — editable from admin
- Registered ContactSettings in payload.config.ts globals array
- Created sendContactEmail Server Action with full Zod validation, honeypot bot protection, and Resend email sending with replyTo

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create ContactSettings Global** - `e854cfe` (feat)
2. **Task 2: Create Server Action for contact form email submission** - `2155168` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/globals/ContactSettings.ts` - Payload Global definition for WhatsApp number, message, Instagram URL, Facebook URL
- `src/app/actions/sendContactEmail.ts` - Server Action with Zod schema, honeypot, Resend call, exported types
- `src/payload.config.ts` - Added ContactSettings import and globals: [ContactSettings] array
- `.env.example` - Documented RESEND_API_KEY and CONTACT_EMAIL env vars
- `package.json` / `pnpm-lock.yaml` - Added 4 new dependencies

## Decisions Made
- Zod 4.3.6 was installed (latest) instead of the stack doc's recommended 3.x. The API surface used by the plan code is fully compatible with Zod 4. @hookform/resolvers 5.2.2 works correctly with Zod 4.
- The `from` email uses Resend sandbox address `onboarding@resend.dev` for development. A TODO comment was added to remind switching to verified `noreply@antoineprofit.com` in production.
- ContactSettings Global `access.read: () => true` allows the public contact page to fetch WhatsApp/social data without Payload auth.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Zod 4 API compatibility with the plan's code patterns was verified before proceeding.

## User Setup Required

**External service requires configuration before the contact form will send real emails.**

1. Create a Resend account at https://resend.com and get an API key
2. Set `RESEND_API_KEY=re_yourkey` in your `.env.local`
3. Set `CONTACT_EMAIL=antoine@yourdomain.com` in your `.env.local`
4. In production: verify `antoineprofit.com` domain in Resend dashboard, then update the `from` address in `src/app/actions/sendContactEmail.ts`

## Known Stubs

- `from: 'Site Antoine Profit <onboarding@resend.dev>'` in `src/app/actions/sendContactEmail.ts` line 42 — Resend sandbox sender, must be replaced with verified domain email before production launch. TODO comment present.

## Next Phase Readiness
- Plan 02 can now import `contactSchema`, `ContactFormValues`, `ContactFormState` from `src/app/actions/sendContactEmail.ts`
- Plan 02 can use `sendContactEmail` as the form's Server Action
- ContactSettings Global appears in Payload admin under "Configuration" group for Antoine to configure WhatsApp details

---
*Phase: 04-formulaire-de-contact*
*Completed: 2026-04-03*
