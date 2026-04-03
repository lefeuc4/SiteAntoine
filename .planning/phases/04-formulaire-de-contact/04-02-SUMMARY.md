---
phase: 04-formulaire-de-contact
plan: 02
subsystem: frontend-contact
tags: [contact-form, whatsapp, social, floating-button, react-hook-form, zod]
dependency_graph:
  requires: [04-01]
  provides: [contact-page, floating-whatsapp-button, whatsapp-cta, social-icons]
  affects: [frontend-layout, all-public-pages]
tech_stack:
  added: []
  patterns:
    - react-hook-form + Zod client validation with zodResolver
    - Server Component page fetching Payload Global with getPayload
    - Async frontend layout fetching Payload Global for global UI element
    - Entrance animation via useEffect + state boolean toggling CSS classes
key_files:
  created:
    - src/components/sections/ContactForm.tsx
    - src/components/sections/WhatsAppBlock.tsx
    - src/components/sections/SocialBlock.tsx
    - src/components/ui/FloatingWhatsApp.tsx
    - src/app/(frontend)/contact/page.tsx
  modified:
    - src/app/(frontend)/layout.tsx
decisions:
  - "Page heading uses text-[1.75rem] lg:text-[2.25rem] for exact 28px/36px match per UI-SPEC Typography"
  - "SocialBlock returns null when both Instagram and Facebook URLs are empty/null — renders nothing"
  - "layout.tsx made async to fetch ContactSettings for FloatingWhatsApp — single Global fetch per page load"
  - "Honeypot uses inline style (position: absolute; opacity: 0) not display:none — bots detect display:none"
metrics:
  duration: 2min
  completed: 2026-04-03
  tasks_completed: 2
  tasks_total: 3
  files_created: 5
  files_modified: 1
---

# Phase 4 Plan 02: Frontend Contact Components Summary

**One-liner:** Contact page with react-hook-form + Zod validation form, WhatsApp CTA, social icons, and global floating WhatsApp button via async layout.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ContactForm, WhatsAppBlock, SocialBlock, FloatingWhatsApp | c0d5263 | 4 new components |
| 2 | Create /contact page and wire FloatingWhatsApp into frontend layout | 8d2cb8f | contact/page.tsx, layout.tsx |
| 3 | Visual verification of contact page and floating button | — | checkpoint (human-verify) |

## What Was Built

### ContactForm (Client Component)

`src/components/sections/ContactForm.tsx` — Full contact form using react-hook-form with zodResolver against the shared `contactSchema` from plan 01. Features:
- 3 visible fields: nom, email, message with French labels and placeholders
- Honeypot field (website) hidden via CSS `position: absolute; opacity: 0` — not `display: none`
- Field-level validation errors with `text-rouge-erreur` styling
- Loading state: Loader2 spinner + "Envoi en cours..." text, fields disabled
- Success state: CheckCircle icon (48px, vert-energie) + "Message envoye !" + "Merci..." (replaces form in-place)
- Server error state: inline message above button

### WhatsAppBlock (Server Component)

`src/components/sections/WhatsAppBlock.tsx` — WhatsApp CTA banner for the /contact page. Green tinted card (bg-vert-energie/10) with MessageCircle icon, label text, and "Ouvrir WhatsApp" pill button linking to `wa.me/{number}?text={encoded}`.

### SocialBlock (Server Component)

`src/components/sections/SocialBlock.tsx` — Instagram and Facebook icon links. Uses inline SVG (no external icon dependency). Both icons default `text-gris-ardoise` and hover `text-bleu-electrique`. Returns `null` when both URLs are empty.

### FloatingWhatsApp (Client Component)

`src/components/ui/FloatingWhatsApp.tsx` — Fixed bottom-right 56px circle button. Entrance animation via `useEffect` + state: starts as `translate-y-4 opacity-0`, transitions to `translate-y-0 opacity-100` after 100ms. Uses `--transition-slow` CSS variable (300ms).

### /contact Page

`src/app/(frontend)/contact/page.tsx` — Async Server Component. Fetches ContactSettings Global with `getPayload`. Renders ContactForm + WhatsAppBlock + SocialBlock in a `max-w-[560px]` centered container. Exports Next.js `Metadata` with French title.

### Frontend Layout Update

`src/app/(frontend)/layout.tsx` — Changed `export default function` to `export default async function`. Added `getPayload` + `@payload-config` imports. Fetches ContactSettings Global once. Passes `whatsappNumber` + `whatsappMessage` props to `<FloatingWhatsApp>` rendered after `<Footer />`. All existing code (fonts, Header, Footer) preserved.

## Decisions Made

1. **Page heading sizing:** Used `text-[1.75rem] lg:text-[2.25rem]` for exact 28px mobile / 36px desktop per UI-SPEC Typography table, rather than approximate Tailwind class names like `text-xl` / `text-4xl`.

2. **SocialBlock null return:** When both `instagramUrl` and `facebookUrl` are empty or null, the component returns `null` with no DOM output — clean conditional rendering.

3. **Async layout:** The frontend layout must be async to call `payload.findGlobal`. This is the correct approach for a global UI element that needs server data. The alternative (passing props down from each page) would require every page to fetch ContactSettings — more duplication.

4. **Honeypot implementation:** Uses inline `style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}` instead of `display: none`. This is intentional — some bots skip `display: none` elements; opacity + pointer-events none maintains DOM presence while hiding from humans.

## Deviations from Plan

None — plan executed exactly as written. Component implementations match UI-SPEC and plan action code exactly.

## Known Stubs

None. All components are fully wired to real data from ContactSettings Payload Global. Social links and WhatsApp URLs are fetched at render time from the database.

## Checkpoint: Task 3

Task 3 is a `checkpoint:human-verify` gate requiring visual browser verification. The checkpoint was reached after completing Tasks 1 and 2. The user must:

1. Visit http://localhost:3000/contact and verify form, WhatsApp block, social icons
2. Test form validation (empty submit) and form success state (valid submit)
3. Visit homepage and verify floating WhatsApp button with entrance animation
4. Verify Payload admin has "Parametres Contact" Global with 4 editable fields

## Self-Check: PASSED

- FOUND: src/components/sections/ContactForm.tsx
- FOUND: src/components/sections/WhatsAppBlock.tsx
- FOUND: src/components/sections/SocialBlock.tsx
- FOUND: src/components/ui/FloatingWhatsApp.tsx
- FOUND: src/app/(frontend)/contact/page.tsx
- FOUND: src/app/(frontend)/layout.tsx
- FOUND commit c0d5263
- FOUND commit 8d2cb8f
