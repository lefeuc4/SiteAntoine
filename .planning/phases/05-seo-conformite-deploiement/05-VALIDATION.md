---
phase: 5
slug: seo-conformite-deploiement
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — build-time TypeScript + manual smoke tests |
| **Config file** | none |
| **Quick run command** | `pnpm build && pnpm lint` |
| **Full suite command** | `pnpm build && pnpm lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build && pnpm lint`
- **After every plan wave:** Run `pnpm build && pnpm lint` + manual smoke tests
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SEO-01 | smoke (build) | `pnpm build` — verifies metadata exports compile | ✅ (build pipeline) | ⬜ pending |
| 05-01-02 | 01 | 1 | SEO-01 | smoke | `curl http://localhost:3000/sitemap.xml` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | SEO-01 | smoke | `curl http://localhost:3000/robots.txt` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | SEO-02 | smoke | `curl -I http://localhost:3000/index.php/about-me` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 1 | LGAL-01 | manual | Open browser incognito, check bottom bar | manual only | ⬜ pending |
| 05-03-02 | 03 | 1 | LGAL-01 | manual | Click Accepter, reload, confirm hidden | manual only | ⬜ pending |
| 05-04-01 | 04 | 1 | LGAL-02 | smoke | `curl -I http://localhost:3000/mentions-legales` | ❌ W0 | ⬜ pending |
| 05-05-01 | 05 | 2 | LGAL-03 | manual | Try saving Resultat without consent checked | manual only | ⬜ pending |
| 05-06-01 | 06 | 2 | DPLY-02 | manual | Browser check after DNS propagation | manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework needed — smoke tests via build pipeline and curl
- [ ] Existing `pnpm build && pnpm lint` covers TypeScript compilation and lint checks

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CookieBanner renders on first load | LGAL-01 | Requires browser DOM + localStorage | Open incognito, check bottom bar visible |
| CookieBanner hidden after consent | LGAL-01 | Requires browser interaction | Click Accepter, reload, confirm hidden |
| consentementCNIL blocks save | LGAL-03 | Requires Payload admin UI interaction | Open admin, try saving Resultat without checking |
| HTTPS accessible at antoineprofit.com | DPLY-02 | Requires DNS propagation + live domain | Browser check after DNS configuration |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
