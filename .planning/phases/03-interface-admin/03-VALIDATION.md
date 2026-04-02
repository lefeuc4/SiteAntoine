---
phase: 3
slug: interface-admin
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already configured in project) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | ADMN-01 | integration | `pnpm test -- --run` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | ADMN-02 | integration | `pnpm test -- --run` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 1 | ADMN-03 | integration | `pnpm test -- --run` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 2 | ADMN-04 | unit | `pnpm test -- --run` | ❌ W0 | ⬜ pending |
| 03-05-01 | 05 | 2 | ADMN-05 | integration | `pnpm test -- --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for Payload collection access control (ADMN-01)
- [ ] Test stubs for Programme CRUD operations (ADMN-02)
- [ ] Test stubs for ResultatAvantApres CRUD with CNIL field (ADMN-03)
- [ ] Test stubs for image upload WebP conversion (ADMN-04)
- [ ] Test stubs for PageContent editing (ADMN-05)

*Existing vitest infrastructure covers framework needs; test files need creation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin UI login flow | ADMN-01 | Browser-based auth flow | Log in at /admin with credentials, verify dashboard loads |
| Image preview in admin | ADMN-04 | Visual verification | Upload image, verify WebP thumbnail renders in admin UI |
| Public page content update | ADMN-05 | End-to-end visual | Edit text in admin, refresh public page, verify change appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
