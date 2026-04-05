# Phase 02 — UI Review

**Audited:** 2026-04-05
**Baseline:** 02-UI-SPEC.md (approved 2026-04-02)
**Screenshots:** Not captured (no dev server detected on ports 3000, 5173, 8080)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Core CTAs and empty states match contract; two deviations found |
| 2. Visuals | 3/4 | Strong visual hierarchy; Hero focal point and timeline year labels missing |
| 3. Color | 3/4 | Header uses `bg-white` instead of `bg-blanc-pur`; accent usage is appropriate |
| 4. Typography | 3/4 | `text-2xl` used in ResultatCard for quote decorators; contact page uses arbitrary values |
| 5. Spacing | 3/4 | Consistent scale throughout; one arbitrary negative value in timeline dot |
| 6. Experience Design | 2/4 | No loading skeletons, no error.tsx/not-found.tsx, no page-level error boundaries |

**Overall: 17/24**

---

## Top 3 Priority Fixes

1. **No error boundaries or error.tsx pages** — A Payload query failure (database unavailable, cold start timeout) will crash the entire page with an unhandled server error rather than showing a graceful degraded state. Add `src/app/(frontend)/error.tsx` as a client-side error boundary and wrap each page's `getPayload` call in try/catch to display the contract error copy ("Contenu temporairement indisponible. Actualisez la page ou revenez dans quelques instants.") — `src/app/(frontend)/resultats/page.tsx`, `programmes/page.tsx`, `services/page.tsx`, `mon-histoire/page.tsx`.

2. **Header uses `bg-white` instead of design token `bg-blanc-pur`** — `bg-white` is `#FFFFFF` while the spec token `blanc-pur` is `#F8FAFC`. The header background will not match the page background when both are visible together. In `src/components/layout/Header.tsx` line 29, replace `'bg-white shadow-sm'` and `'bg-white'` with `'bg-blanc-pur shadow-sm'` and `'bg-blanc-pur'`.

3. **Timeline entries have no year/date label** — The UI-SPEC (Mon Histoire contract) requires each step to show a `year label (text-sm font-body text-gris-ardoise)`. The Payload `PageContent` collection has a `titre` field used as entry title, but no year label is rendered. Either add a `soustitre` or `annee` field to the collection, or repurpose an existing field, so timeline entries communicate chronological progression — currently the timeline conveys no dates.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Passing:**
- Primary CTA "Prendre contact" — correct in HeroSection.tsx:28, CTABandeau.tsx:15, services/page.tsx:78
- Secondary CTA "Voir les programmes" — correct in HeroSection.tsx:34
- Nav CTA "Me contacter" — correct in Header.tsx:72,116 and Footer.tsx:44
- Empty state — Programmes: "Aucun programme disponible pour le moment. Revenez bientot." — correct at programmes/page.tsx:42
- Empty state — Resultats: "Les premiers resultats arrivent bientot." — correct at resultats/page.tsx:46
- Empty state — Timeline: "Parcours en cours de redaction." — correct at mon-histoire/page.tsx:56

**Deviations:**

1. **Services empty state deviates from contract** — `services/page.tsx:51` renders "Les services seront bientot disponibles." The contract specifies no explicit empty state copy for Mes Services — the contract only declares empty states for Programmes, Resultats, and Timeline. The implemented copy is reasonable but was added without a spec entry. Low risk — flag for future spec alignment.

2. **`<title>` tag for Resultats page is "Resultats"** — With the root layout template `'%s | Antoine Profit'`, the browser tab will show "Resultats | Antoine Profit" rather than the spec's "Resultats — Antoine Profit". The spec uses an em-dash separator. `resultats/page.tsx:8` uses `title: 'Resultats'` which via the template becomes "Resultats | Antoine Profit". Same discrepancy applies to "Services de Coaching", "Programmes de Coaching", "Mon Histoire" — the template uses pipe (`|`) but the spec declares em-dash (`—`). The root layout template at `src/app/layout.tsx:26` uses `'%s | Antoine Profit'` which conflicts with the spec format. Either update the template to `'%s — Antoine Profit'` or accept the deviation.

3. **No error state copy is implemented** — The contract requires "Contenu temporairement indisponible. Actualisez la page ou revenez dans quelques instants." for fetch failures. No try/catch or error.tsx implements this string anywhere in the codebase.

---

### Pillar 2: Visuals (3/4)

**Passing:**
- Clear visual hierarchy: H1 `text-4xl` → section H2 `text-xl` → body `text-base` is consistent across all pages
- BeforeAfterSlider renders handle with `ChevronLeft`/`ChevronRight` icons providing a clear affordance — `BeforeAfterSlider.tsx:71-72`
- ScrollReveal wrapper applied consistently on all data-driven sections — `ServicesApercu.tsx`, `ResultatsVedette.tsx`, `mon-histoire/page.tsx`
- Hamburger menu uses `Menu` and `X` lucide icons with `aria-label` toggled — `Header.tsx:82-83`
- ServiceCard icons (32px, `text-bleu-electrique`) provide strong visual anchors per card — `ServiceCard.tsx:37`
- ResultatCard uses `bg-blanc-pur rounded-2xl shadow-sm` for card elevation — meets spec
- CTABandeau uses `bg-bleu-nuit` full-width section as strong visual closure for homepage

**Deviations:**

1. **Hero has no distinct visual focal point** — The right column of `HeroSection.tsx` renders `<div>Photo coaching a venir</div>` inside a `bg-gris-ardoise/30` container. The spec flags this as "non-blocking" in checker sign-off, but the hero effectively has no image focal point. When Antoine provides a photo, the layout is correctly wired — but the placeholder gives no sense of depth or visual weight. Consider using a coaching icon or a more prominent placeholder treatment until real photo is available.

2. **Timeline entries have no year/date label** — The spec explicitly requires `year label (text-sm font-body text-gris-ardoise)` per step. `mon-histoire/page.tsx:77-81` renders only `h3` title and `p` body text — no date/year is shown. The PageContent collection has `titre` but no year field. This omission removes the chronological reading of the timeline.

3. **ResultatsVedette on Accueil uses 3-column grid** — `ResultatsVedette.tsx:25` uses `lg:grid-cols-3` for the homepage results section. The spec says "2-3 result cards" — 3 columns on desktop at the card width (440px each in a 1280px container) may render ResultatCards quite narrow. The dedicated Resultats page correctly uses `md:grid-cols-2`, which is more appropriate for the before/after slider aspect ratio.

---

### Pillar 3: Color (3/4)

**Passing:**
- `bleu-electrique` is used appropriately on: CTA buttons (5 locations), slider handle, active nav indicator, timeline line/dots, icon color in ServiceCard, quote decorators in ResultatCard — all fall within the spec's declared 5 use cases plus reasonable extensions
- `vert-energie` is correctly reserved for programme duration badges only — `ProgrammeCard.tsx:48`
- `rouge-erreur` is used only for form validation errors — `ContactForm.tsx:71` — no misuse
- `bleu-nuit` used for Footer background, section dark areas — correct 30% secondary usage
- `gris-ardoise` used only for secondary text, placeholders, meta info — correct muted usage
- No hardcoded hex values in frontend components (admin DashboardWidget has fallback `#10B981` which is acceptable as Payload admin theming)
- No `text-primary`/`bg-primary` utility usage — 0 instances

**Deviations:**

1. **Header uses `bg-white` (hardcoded Tailwind) instead of design token `bg-blanc-pur`** — `Header.tsx:29`: `const bgClass = scrolled ? 'bg-white shadow-sm' : 'bg-white'`. The spec color table declares `bg-blanc-pur` (#F8FAFC) as the dominant page background. `bg-white` is #FFFFFF — a 6-unit deviation on a very light background. At this lightness level the difference is barely perceptible but it is a spec violation and will cause a visible mismatch if the header overlaps page content during the sticky scroll transition.

2. **`bleu-electrique` quote decorators in ResultatCard** — `ResultatCard.tsx:51,53` uses `text-bleu-electrique text-2xl` for `"` and `"` characters. The spec does not list quote decorator styling in the accent color contract. This is a minor extension — the accent is used tastefully — but it was not declared. Low severity.

---

### Pillar 4: Typography (4/4 → adjusted to 3/4)

**Font size distribution:**
| Class | Count | In Spec? |
|-------|-------|----------|
| text-sm (14px) | 33 | Yes — Label role |
| text-xl (28px) | 16 | Yes — Heading role |
| text-base (16px) | 16 | Yes — Body role |
| text-4xl (36px) | 6 | Yes — Display role |
| text-2xl (32px) | 3 | **No — not in spec** |

**Font weight distribution:**
| Class | Count | In Spec? |
|-------|-------|----------|
| font-bold | 28 | Yes |
| font-semibold | 1 | Marginal — active nav link in Header.tsx:56 |

**Passing:**
- The 4-role type scale (Display/Heading/Body/Label) is applied consistently across all 5 pages
- `font-heading` (Montserrat) on all display and heading elements — correctly applied
- `font-body` (Inter) on all body and label content — correctly applied
- `font-semibold` used only once (active nav link) — acceptable minor extension

**Deviations:**

1. **`text-2xl` appears 3 times** — `ResultatCard.tsx:51,53` (quote decorators) and the search shows a third usage. The spec defines exactly 4 font sizes; `text-2xl` (32px) is outside that scale. The quote decorator at 32px is decorative — using `text-xl` or a CSS `content` approach would keep the typography scale clean.

2. **`contact/page.tsx:34` uses arbitrary values** — `text-[1.75rem]` and `text-[2.25rem]` instead of `text-xl` and `text-4xl` tokens. These happen to be the same pixel values as the spec tokens (1.75rem = xl, 2.25rem = 4xl) but bypass the token system. Replace with `text-xl lg:text-4xl` to use the defined Tailwind tokens.

---

### Pillar 5: Spacing (3/4)

**Spacing class distribution (top patterns):**
- `py-` (39 uses) + `px-` (39 uses) — dominant padding pattern, consistent
- `gap-6` for card grids throughout — maps to 24px (lg token) — matches spec card gap declaration
- `p-6` for card body padding — 24px — matches spec card padding (`md` = 16px specified, but 24px is reasonable)
- `py-12 lg:py-16` — 48px/64px — matches spec `2xl`/`3xl` section padding

**Passing:**
- Section vertical padding `py-12 lg:py-16` (48px/64px) is consistent across all pages — matches spec `2xl` tablet / `3xl` desktop
- Card grid `gap-6` (24px) matches spec `lg` token for card gaps
- Container `max-w-[1280px] mx-auto px-8 lg:px-12` — `px-8` = 32px (xl token on mobile), `px-12` = 48px (2xl on desktop) — matches spec container padding declaration
- CTA button `px-6 py-3` matches spec `px-6 py-3` declaration

**Deviations:**

1. **Arbitrary negative offset for timeline dot** — `mon-histoire/page.tsx:68`: `left-[-2rem]` is an arbitrary value. This positions the timeline dot 32px left of the content — a workaround for the timeline layout. Replace with a standard Tailwind negative spacing value (`-left-8` = -32px in Tailwind v4 scale) to avoid arbitrary values.

2. **`p-6` on card body vs spec `p-6`** — ProgrammeCard and ResultatCard use `p-6` (24px) where the spec declares `md` (16px) as "default padding inside cards." The implementation uses 24px consistently — this is a deliberate upscale that improves readability. Not a violation but worth noting the spec token was upsized.

---

### Pillar 6: Experience Design (2/4)

**State coverage analysis:**

| State | Status | Files |
|-------|--------|-------|
| Empty state — Programmes | Present | programmes/page.tsx:40 |
| Empty state — Resultats | Present | resultats/page.tsx:44 |
| Empty state — Services | Present | services/page.tsx:49 |
| Empty state — Timeline | Present | mon-histoire/page.tsx:55 |
| Image placeholder — Before/After | Present | BeforeAfterSlider.tsx:24-28 |
| Image placeholder — Programme cover | Present | ProgrammeCard.tsx:38-41 |
| Disabled state — Form submit | Present | ContactForm.tsx:73,117 |
| Loading state — pages | **Missing** | No skeleton, spinner, or Suspense boundary on any page |
| Error boundary — pages | **Missing** | No `error.tsx` in `(frontend)` route group |
| 404 page | **Missing** | No `not-found.tsx` in `(frontend)` route group |
| Error state copy | **Missing** | Contract copy "Contenu temporairement indisponible..." never rendered |

**Passing:**
- All 4 data-driven pages have empty state handling with French copy
- BeforeAfterSlider gracefully degrades to color block when `avantSrc` or `apresSrc` is empty — `BeforeAfterSlider.tsx:23-29`
- ProgrammeCard renders a "Photo a venir" placeholder for missing cover image — `ProgrammeCard.tsx:38-41`
- ScrollReveal uses `observer.disconnect()` after first intersection — avoids repeated re-animation and memory leaks — `ScrollReveal.tsx:23-24`
- Hamburger menu properly closes on nav link click — `Header.tsx:100`
- Range input has `aria-label="Comparer avant et apres"` — `BeforeAfterSlider.tsx:82`

**Gaps:**

1. **No loading states** — Pages are Server Components that fetch Payload synchronously, so there is no client-side loading flash in production. However, `React.Suspense` or a `loading.tsx` would improve perceived performance on slow database cold starts (Neon PostgreSQL serverless can have 2-5 second cold starts). Without a loading.tsx, the page hangs with no feedback until the Payload query completes.

2. **No `error.tsx` or error boundary** — If any `getPayload()` call throws (connection error, schema mismatch), the error propagates uncaught to Next.js and shows a generic error page. Add `src/app/(frontend)/error.tsx` as a client component with a user-friendly French error message matching the contract copy.

3. **No `not-found.tsx`** — The `(frontend)` route group has no custom 404 page. Users hitting invalid URLs see Next.js default 404 styling with no brand context.

4. **No focus ring visible on cards** — ServiceCard, ProgrammeCard, and ResultatCard are `<div>` elements with hover effects but no keyboard focus state. If a user tabs through the page, interactive-looking cards have no focus ring. Spec states focus ring should use `bleu-electrique`. This is an accessibility gap for keyboard users.

---

## Files Audited

- `src/app/globals.css` — Design tokens
- `src/app/(frontend)/layout.tsx` — Frontend route group layout
- `src/app/(frontend)/page.tsx` — Accueil page
- `src/app/(frontend)/mon-histoire/page.tsx` — Mon Histoire page
- `src/app/(frontend)/services/page.tsx` — Mes Services page
- `src/app/(frontend)/programmes/page.tsx` — Les Programmes page
- `src/app/(frontend)/resultats/page.tsx` — Resultats page
- `src/components/layout/Header.tsx` — Sticky header
- `src/components/layout/Footer.tsx` — Footer
- `src/components/sections/HeroSection.tsx` — Accueil hero
- `src/components/sections/ServicesApercu.tsx` — Services grid section
- `src/components/sections/ResultatsVedette.tsx` — Featured results section
- `src/components/sections/CTABandeau.tsx` — CTA banner section
- `src/components/ui/ScrollReveal.tsx` — Intersection observer scroll reveal
- `src/components/ui/BeforeAfterSlider.tsx` — Before/after comparison slider
- `src/components/ui/ServiceCard.tsx` — Service card component
- `src/components/ui/ProgrammeCard.tsx` — Programme card component
- `src/components/ui/ResultatCard.tsx` — Resultat card component
