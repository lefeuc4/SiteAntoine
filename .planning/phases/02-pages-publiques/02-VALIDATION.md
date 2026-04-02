---
phase: 2
slug: pages-publiques
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (if not installed, Wave 0 adds it) |
| **Config file** | `vitest.config.ts` (Wave 0 creates if missing) |
| **Quick run command** | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | DSGN-02 | visual/manual | `pnpm dev` + browser check | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | PAGE-07 | unit | `pnpm vitest run src/__tests__/header.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | PAGE-01 | unit | `pnpm vitest run src/__tests__/accueil.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | PAGE-02 | unit | `pnpm vitest run src/__tests__/mon-histoire.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | PAGE-03 | unit | `pnpm vitest run src/__tests__/mes-services.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | PAGE-04 | unit | `pnpm vitest run src/__tests__/les-programmes.test.tsx` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 2 | PAGE-05, PAGE-06 | unit | `pnpm vitest run src/__tests__/resultats.test.tsx` | ❌ W0 | ⬜ pending |
| 02-05-01 | 05 | 3 | DSGN-03 | manual | Mobile/tablet/desktop viewport test | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@vitejs/plugin-react` + `jsdom` — install test framework if missing
- [ ] `vitest.config.ts` — configure with jsdom environment and React plugin
- [ ] Test stubs for header, each page component

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout across viewports | DSGN-03 | Visual verification needed | Open each page at 375px, 768px, 1280px widths |
| Header transparency transition | DSGN-02 | CSS scroll behavior | Scroll Accueil page, verify header background transition |
| Slider avant/apres interaction | PAGE-06 | Mouse/touch interaction | Drag slider on Resultats page, verify clip-path updates |
| Page load < 3s on mobile | PAGE-05 | Network-dependent | Lighthouse audit on mobile preset |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
