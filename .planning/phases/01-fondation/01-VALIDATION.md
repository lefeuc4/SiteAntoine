---
phase: 1
slug: fondation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — greenfield project; Phase 1 validates via smoke tests |
| **Config file** | none — Wave 0 installs if needed |
| **Quick run command** | `pnpm run dev` + manual check |
| **Full suite command** | Smoke test: `npm run dev` then `curl -f http://localhost:3000/admin` |
| **Estimated runtime** | ~15 seconds (startup + curl check) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm run dev` — verify no startup errors
- **After every plan wave:** Full smoke: dev server starts, `/admin` loads, collections visible
- **Before `/gsd:verify-work`:** All 4 success criteria manually verified
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DPLY-01 | smoke | `pnpm run dev` starts without error | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | DPLY-01 | smoke | `curl -f http://localhost:3000/admin` returns 200 | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | DSGN-01 | manual | Verify palette colors in globals.css match D-02 values | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | DSGN-01 | manual | Verify Montserrat + Inter loaded via next/font in layout.tsx | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework needed for Phase 1 — validation is smoke test + manual verification
- [ ] If formal tests desired later: `pnpm add -D vitest @vitejs/plugin-react` + `vitest.config.ts`

*Phase 1 is a bootstrap phase. The 4 success criteria are verifiable manually in < 5 minutes. Formal test infrastructure adds complexity without proportional value at this stage.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Palette and typography visible in browser | DSGN-01 | Visual check — CSS custom properties applied correctly | Open `localhost:3000`, inspect `<html>` for font variables, verify body text uses Inter, headings use Montserrat |
| Admin UI functional at `/admin` | DPLY-01 | Interactive flow — login, see collections | Navigate to `localhost:3000/admin`, create first user, verify Programmes/Resultats/PageContent/Media collections listed |
| Collections migrated in Neon | DPLY-01 | Database state check | Run `npx payload migrate:status` — all migrations applied |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
