---
phase: 1
slug: fondation
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-01
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for Phase 1: Fondation.
> This phase delivers the design system tokens (palette, typography, spacing) and the root layout.
> No public-facing pages are built in this phase — the Payload admin at /admin is auto-generated.
> All tokens defined here are consumed by Phase 2 (Pages Publiques) and every subsequent phase.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (shadcn not initialized — greenfield project, no components.json) |
| Preset | not applicable |
| Component library | none — Phase 1 only configures tokens; components added in Phase 2 |
| Icon library | none — to be decided in Phase 2 |
| Font | Montserrat (headings) + Inter (body) via next/font/google |

**Note on shadcn:** shadcn/ui is in the recommended stack (CLAUDE.md). It will be initialized in Phase 2 when the first public components are needed. Phase 1 only establishes the Tailwind @theme tokens that shadcn will inherit.

**Source:** CONTEXT.md D-06, D-07; RESEARCH.md Pattern 4

---

## Spacing Scale

Declared values (multiples of 4 only). Applied via Tailwind v4 utility classes (e.g., `p-4`, `gap-6`).

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding between tight elements |
| sm | 8px | Compact element spacing, input inner padding |
| md | 16px | Default element spacing, card inner padding |
| lg | 24px | Section padding, form group gaps |
| xl | 32px | Layout gaps between major blocks |
| 2xl | 48px | Major section vertical breaks |
| 3xl | 64px | Page-level top/bottom padding |

Exceptions: Touch targets (buttons, links) minimum 44px height on mobile — achieved via `min-h-11` (44px) not via spacing scale override.

**Source:** Standard 8-point scale (no upstream override). Touch target minimum per WCAG 2.5.5.

---

## Typography

Two font families. Exactly 4 size roles. Exactly 2 weights per family.

| Role | Font | Size | Weight | Line Height | Usage |
|------|------|------|--------|-------------|-------|
| Body | Inter | 16px | 400 (Regular) | 1.5 | Paragraphs, descriptions, admin content |
| Label | Inter | 14px | 400 (Regular) | 1.4 | Form labels, captions, meta text, tags |
| Heading | Montserrat | 20px–28px | 700 (Bold) | 1.2 | Section headings (h2, h3) |
| Display | Montserrat | 36px–48px | 900 (Black) | 1.1 | Page titles, hero headings (h1) |

**Implementation in globals.css @theme:**

```css
@theme {
  --font-heading: var(--font-montserrat), 'Montserrat', sans-serif;
  --font-body: var(--font-inter), 'Inter', sans-serif;

  --font-size-sm: 0.875rem;   /* 14px — label */
  --font-size-base: 1rem;     /* 16px — body */
  --font-size-xl: 1.75rem;    /* 28px — heading */
  --font-size-4xl: 2.25rem;   /* 36px — display */
}
```

**Implementation in layout.tsx:**

```typescript
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter',
  display: 'swap',
})
```

**Source:** CONTEXT.md D-06, D-07; RESEARCH.md Pattern 4

---

## Color

Palette "Energie & Performance" — fond clair dominant, accents sombres et vifs.

| Role | Value | Tailwind Token | Usage |
|------|-------|----------------|-------|
| Dominant (60%) | #F8FAFC | `blanc-pur` | Page background, all surface backgrounds |
| Secondary (30%) | #0F172A | `bleu-nuit` | Navigation, footer, section overlays, heading text |
| Accent — primary (10%) | #3B82F6 | `bleu-electrique` | CTA buttons (filled), active nav indicator, links |
| Accent — secondary (5%) | #10B981 | `vert-energie` | Success states, positive indicators, badge highlights |
| Neutral | #64748B | `gris-ardoise` | Body text, secondary copy, placeholder text, borders |
| Destructive | #EF4444 | `rouge-erreur` | Form validation errors, destructive action buttons only |

Accent reserved for:
- Primary CTA buttons (`bg-bleu-electrique text-white`)
- Active navigation state indicator
- Hyperlinks within body text
- Focus ring outline (`ring-bleu-electrique`)

`vert-energie` reserved for:
- Success confirmation messages
- Positive result badges (e.g., "Programme actif")

`rouge-erreur` reserved for:
- Form field error states
- Destructive action buttons (delete confirmations)

**Implementation in globals.css @theme:**

```css
@theme {
  --color-blanc-pur: #F8FAFC;
  --color-bleu-nuit: #0F172A;
  --color-bleu-electrique: #3B82F6;
  --color-vert-energie: #10B981;
  --color-gris-ardoise: #64748B;
  --color-rouge-erreur: #EF4444;
}
```

**Body default** (applied in layout.tsx): `className="font-body bg-blanc-pur text-bleu-nuit"`

**Source:** CONTEXT.md D-02, D-03, D-04; RESEARCH.md Pattern 4

---

## Animations

Defined in Phase 1 as CSS custom properties; implemented in Phase 2 on public pages.

| Type | Behavior | Implementation |
|------|----------|----------------|
| Scroll reveal | Elements fade-in + translate-up on viewport entry | `IntersectionObserver` or Tailwind `animate-` utility — library TBD in Phase 2 |
| Hover on cards | Subtle scale (1.02) + shadow increase | `transition-transform duration-200 hover:scale-[1.02]` |
| Hover on CTA buttons | Brightness increase (`hover:brightness-110`) | `transition-all duration-150` |
| Focus visible | Blue ring 2px offset | `focus-visible:ring-2 focus-visible:ring-bleu-electrique focus-visible:ring-offset-2` |

Animation timing defaults (CSS variables in @theme):

```css
@theme {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease-out;
}
```

**Source:** CONTEXT.md D-05; Claude's discretion for timing values

---

## Copywriting Contract

Phase 1 has no public-facing pages. The only visible UI elements are:

1. The Payload admin at `/admin` — auto-generated by Payload, not customized in this phase (French localization deferred to Phase 3 planning, per STATE.md blocker note)
2. A placeholder page at `/` — minimal copy, signals "site en construction"

| Element | Copy |
|---------|------|
| Placeholder home heading | `Site en cours de construction` |
| Placeholder home body | `Le site d'Antoine Profit, coach bien-etre, arrive bientot.` |
| Admin page title (Payload default) | `Dashboard — Payload CMS` (Payload default, not overridden) |
| Empty state (collections with no data) | Payload default — not overridden in Phase 1 |
| Error state (dev only) | Next.js default error boundary — not overridden in Phase 1 |
| Destructive confirmation | Not applicable — no destructive actions in Phase 1 scope |

**Primary CTA for Phase 2 (defined here for continuity):** `Prendre rendez-vous` — verb + noun, action-oriented, aligns with coaching context.

**Source:** Phase 1 scope (no public UI); Phase 2 CTA defined ahead from REQUIREMENTS.md PAGE-01

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | None — shadcn not initialized in Phase 1 | not applicable |
| Third-party | None declared | not applicable |

**Phase 1 install commands use no third-party registries.** All packages are from the official npm registry (`pnpm create payload-app@latest`, `pnpm add tailwindcss`, etc.).

---

## Implementation Checklist for Executor

These are the Phase 1 UI deliverables (in dependency order):

1. **globals.css** — `@import "tailwindcss"` + `@theme` block with all color tokens, font family tokens, and transition tokens listed above
2. **layout.tsx** — `next/font/google` loading Montserrat (700, 900) + Inter (400); CSS variables `--font-montserrat` and `--font-inter` applied to `<html>`; `lang="fr"` on `<html>`; `className="font-body bg-blanc-pur text-bleu-nuit"` on `<body>`
3. **page.tsx (placeholder)** — Single centered block using the heading + body copy from Copywriting Contract; uses `font-heading text-bleu-nuit` for heading, `font-body text-gris-ardoise` for body; no images, no navigation

**Verification:** Open `http://localhost:3000` and confirm:
- Background is #F8FAFC (blanc-pur)
- Heading renders in Montserrat Bold
- Body text renders in Inter Regular
- Browser dev tools shows `lang="fr"` on `<html>`

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
