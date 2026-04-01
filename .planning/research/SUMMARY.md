# Project Research Summary

**Project:** SiteAntoine — antoineprofit.com rebuild
**Domain:** Wellness / fitness coach showcase website (site vitrine) with built-in admin CMS, VPS-deployable
**Researched:** 2026-04-01
**Confidence:** HIGH

## Executive Summary

This project replaces a bloated WordPress site (WooCommerce + Revolution Slider) with a lean, fast, custom-built showcase site for Antoine Profit, a wellness/fitness coach. The site has two distinct audiences: public visitors (prospective clients) who must be converted into contact inquiries, and Antoine himself (single admin user) who must be able to update content, programmes, and transformation results without developer involvement. Research confirms the right approach is a single Next.js 16 + Payload CMS 3 application deployed as a Docker container on Antoine's existing VPS — one codebase, one process, one deployment unit. This avoids the complexity of separate CMS + frontend architectures at this project scale.

The recommended stack is well-established and high-confidence: Payload CMS 3 installs directly inside the Next.js `/app` directory (no separate process), PostgreSQL 17 handles persistent content, Tailwind CSS 4 and shadcn/ui handle UI, and Caddy handles reverse proxy with automatic HTTPS. The key technical differentiator versus typical coach sites is the admin panel: Antoine can independently add transformation stories, update programme listings, and edit page copy — keeping the site current without stale content, which is the primary failure mode of competitors on unmanaged WordPress.

The main risks are non-technical: an admin panel built for developer convenience rather than Antoine's actual workflow will be abandoned immediately (recovery cost: HIGH); before/after client photos published without GDPR/CNIL consent documentation create legal exposure under French law (€486M in sanctions in France in 2025 alone); and uncompressed phone-shot uploads will fill VPS disk and negate the performance goal of leaving WordPress. All three risks are preventable during construction, not after.

---

## Key Findings

### Recommended Stack

A single-repo Next.js 16 + Payload CMS 3 application is the definitive approach for this project. Payload 3 is the first headless CMS that installs directly inside a Next.js `/app` folder, eliminating the need for a separate CMS process. PostgreSQL 17 (not SQLite) is the production recommendation despite the simplicity appeal of SQLite — Payload's PostgreSQL adapter is mature and production-tested, and PostgreSQL handles future growth without migration. Caddy replaces Nginx for simpler automatic HTTPS on VPS. The full stack avoids WordPress entirely while delivering a polished admin UI out of the box.

**Core technologies:**
- **Next.js 16 + React 19**: Full-stack framework — App Router, Server Components, Server Actions; runs standalone on any VPS via `output: 'standalone'`
- **Payload CMS 3.x**: Admin panel + content API — installs inside Next.js app directory; TypeScript-native; ships polished admin UI; no second process
- **PostgreSQL 17 (Alpine)**: Primary database — Payload's recommended production DB; ACID guarantees; scales beyond SQLite without migration
- **Tailwind CSS 4 + shadcn/ui**: UI styling — utility-first, purges unused CSS; shadcn/ui has full Tailwind v4 support
- **TypeScript 5**: Type safety — Payload auto-generates types from CMS schema; zero manual type maintenance
- **Resend + react-email**: Contact form email delivery — transactional API designed for Next.js; handles SPF/DKIM; free tier covers this volume
- **Caddy 2**: Reverse proxy — simpler config than Nginx; auto-provisions Let's Encrypt certificates; first-class Docker support
- **Docker Compose**: Deployment — single `docker-compose.yml` runs app + PostgreSQL + Caddy; reproducible dev/prod environments

See `.planning/research/STACK.md` for full alternatives analysis and version compatibility matrix.

### Expected Features

The site structure (5 public pages) maps cleanly to industry best practices for coach/wellness sites. The highest-impact differentiator is the Resultats page: most French coach sites show 1–2 anonymous quote snippets; Antoine's site will show full transformation stories (before/after photos, programme followed, duration, client's own words). This is what converts visitors who comparison-shop.

**Must have (table stakes — v1 launch blockers):**
- Hero section with clear value proposition and CTA — 94% of visitors decide to stay or leave above the fold
- Mobile-first responsive layout — 60%+ of fitness site traffic is mobile
- Page load < 3 seconds — 40% of visitors abandon at > 3 seconds
- Mon Histoire page with personal timeline — coaches sell trust before services
- Mes Services page — specific descriptions, not generic marketing language
- Les Programmes page with structured cards — duration, content, goals, who it's for
- Resultats page with full transformation stories — highest-impact conversion element
- Contact form (email + WhatsApp link) — single low-friction conversion action
- Admin authentication (single user, password-based) — gates all admin features
- Admin CRUD for programmes — Antoine's autonomy requirement
- Admin CRUD for resultats with photo upload — Antoine's autonomy requirement
- Admin page content editing (text + images per page) — Antoine's autonomy requirement

**Should have (competitive differentiators, add in v1.x):**
- Online booking link (Calendly) — add when contact-first approach creates too much scheduling friction
- SEO metadata management in admin — add when Antoine wants to improve Google ranking
- Video testimonials — add when Antoine collects video content

**Defer (v2+):**
- Blog / article section — requires Antoine to produce content regularly; major scope addition
- Lead magnet / email capture — requires email list infrastructure
- Analytics dashboard in admin — add when Antoine wants traffic insights

**Anti-features to avoid entirely (do not add even if requested):**
- E-commerce / online payment — not needed for v1 contact-first workflow
- Client login / dashboard — out of scope by design
- Multi-language (EN/FR) — Antoine's audience is explicitly francophone
- Social media feed embed — third-party API instability, GDPR complications

See `.planning/research/FEATURES.md` for full feature prioritization matrix and competitor analysis.

### Architecture Approach

The application uses Next.js App Router route groups to separate public pages `(public)` from admin pages `(admin)` within a single deployment. Public pages are Server Components that query the database directly via Payload's Local API at request time — no client-side data fetching, no loading skeletons, complete HTML delivered immediately. Admin pages are protected by `middleware.ts` which checks the Payload session cookie and redirects unauthenticated requests to login. All admin mutations go through Payload's built-in Server Actions / REST API, with `revalidatePath()` called to bust ISR cache so the public site immediately reflects edits.

**Major components:**
1. **Caddy (reverse proxy)**: SSL termination, automatic HTTPS via Let's Encrypt, forwards requests to Next.js on :3000
2. **Next.js 16 + Payload 3 (app)**: SSR/SSG for 5 public pages; Payload admin panel at `/admin`; Server Actions for contact form; single Docker container
3. **PostgreSQL 17 (database)**: Persists Payload collections (programmes, results, page content, users, media); volume-mounted for persistence across container restarts
4. **`(public)` route group**: 5 showcase pages — Accueil, Mon Histoire, Mes Services, Les Programmes, Resultats, Contact; Server Components by default; shared public layout (nav, footer)
5. **`(admin)` route group**: Payload's built-in admin at `/admin/*`; protected by Payload's middleware; handles all CRUD for content, programmes, resultats
6. **Payload Local API**: Direct database queries from Server Components without HTTP overhead; type-safe; auto-generated from collection schemas
7. **Resend (contact email)**: Server Action calls Resend SDK; handles deliverability; no VPS SMTP required

**Key architectural patterns:**
- Use Payload collections (Programmes, Resultats, PageContent, Media) as the single source of truth for all content
- Public pages read from Payload Local API (not REST); admin writes through Payload's built-in admin panel
- `revalidatePath()` + ISR ensures public pages stay fresh after admin edits without full-page SSR on every request
- Images stored via Payload's built-in upload handling; `@payloadcms/storage-s3` available if VPS disk becomes a concern

**Anti-patterns to avoid:**
- Separate backend API server: unnecessary at this scale; Server Components query Payload Local API directly
- Full headless CMS like Strapi: Payload 3 is already embedded — a second CMS adds ops overhead for nothing
- Client-side data fetching for public pages: harms SEO and performance; Server Components are the correct pattern

See `.planning/research/ARCHITECTURE.md` for data flow diagrams and build order implications.

### Critical Pitfalls

1. **Admin panel too complex for Antoine** — Build around concrete task flows ("Add a new transformation result"), not raw database CRUD. Validate with Antoine in a 15-minute walkthrough before considering admin done. Recovery cost if shipped wrong: HIGH (rebuild admin UX).

2. **Before/after gallery without GDPR/CNIL consent documentation** — France actively enforces GDPR (€486M in sanctions, 2025). Photos of identifiable clients are personal data. Add a mandatory "Consentement signé" checkbox with date in the admin result form. Add a privacy policy page. Do not publish without documented consent. Recovery cost: HIGH (legal exposure, immediate unpublish required).

3. **Uncompressed image uploads bloating VPS disk** — Antoine uploads phone photos (5–12 MB JPEGs each). Enforce a 5 MB upload limit. Auto-convert to WebP using Sharp at upload time. Generate display (≤1200px) and thumbnail (≤400px) sizes. Store only web-ready versions. Recovery cost: MEDIUM (cleanup + retroactive compression).

4. **Missing French locale signals hurting SEO** — Set `<html lang="fr">`, `og:locale="fr_FR"`, and `<link rel="canonical">` in the base layout from day one. Centralise user-facing strings in a `fr.json` (even as a single-locale project). Cost to fix early: near-zero. Cost to fix later: tedious string audit.

5. **WordPress URL 404s after DNS cutover losing Google traffic** — Audit current site URLs before shutdown. Create a 301 redirect map in Caddy (old WordPress slugs → new URLs) before DNS cutover. Submit new sitemap to Google Search Console on launch day. Recovery cost: MEDIUM (2–4 hours + days for Google re-crawl).

See `.planning/research/PITFALLS.md` for full pitfall-to-phase mapping, security checklist, and recovery strategies.

---

## Implications for Roadmap

Based on the combined research, the project naturally falls into 5 phases driven by hard dependencies: the Payload collections must exist before admin CRUD can be built, auth must be secured before admin routes are created, and public pages depend on data models being settled. Contact form and deployment are relatively independent.

### Phase 1: Foundation — Project Setup, Data Models, Auth
**Rationale:** Every other phase depends on Payload collections being defined and auth being in place. Building the schema first prevents costly migrations later. Auth must be secured before any admin routes are created — deploying unprotected admin routes to staging, even temporarily, is a security pitfall.
**Delivers:** Bootstrapped Next.js + Payload project; PostgreSQL connection; defined collections (Programmes, Resultats, PageContent, Media, Users); Payload admin accessible and protected; Docker Compose running locally.
**Addresses features:** Admin login (single user); data model for all v1 content types.
**Avoids pitfalls:** Admin route exposure (Pitfall 4); missing locale signals — set `<html lang="fr">` in root layout immediately (Pitfall 8).
**Research flag:** Standard patterns — Payload + Next.js bootstrap is well-documented via official `create payload-app` template. Skip `/gsd:research-phase`.

### Phase 2: Public Pages — All 5 Showcase Pages
**Rationale:** Once data models exist (even with placeholder content), all 5 public pages can be built in parallel. These are Server Components reading from Payload Local API. Visual design and layout decisions happen here. Building public pages before admin CRUD allows catching UX issues early (e.g., what fields Résultats actually needs to display well).
**Delivers:** Fully responsive public site — Accueil (hero + CTA), Mon Histoire (timeline), Mes Services, Les Programmes (programme cards from DB), Résultats (transformation stories from DB), Contact (static page with form placeholder).
**Uses:** Next.js Server Components, Payload Local API, Tailwind CSS 4, shadcn/ui, `next/image` for optimised photo rendering.
**Implements:** `(public)` route group with shared public layout (nav, footer, persistent CTA).
**Avoids pitfalls:** Client-side data fetching anti-pattern; mobile-first layout required (60%+ mobile traffic); Contact CTA must appear on every page.
**Research flag:** Standard patterns — Next.js App Router public pages are well-documented. Skip `/gsd:research-phase`.

### Phase 3: Admin Panel — CRUD for Programmes, Résultats, Page Content
**Rationale:** With collections defined and public pages showing how data renders, admin forms can be built against real requirements. Payload's built-in admin panel handles the majority of CRUD UI out of the box — custom admin work focuses on UX simplification for a non-technical user.
**Delivers:** Antoine can log in, add/edit/delete programmes, add/edit/delete transformation results (with before/after photo upload), and edit page content text and images. `revalidatePath()` ensures public pages update immediately.
**Uses:** Payload admin panel customisation (field labels in French, grouped views), Sharp-based image processing at upload time, Payload media collections for file handling.
**Avoids pitfalls:** Admin UX complexity (Pitfall 1) — validate with Antoine walkthrough before sign-off; GDPR consent field on Résultats admin (Pitfall 2) — mandatory checkbox required; image compression at upload time (Pitfall 3) — Sharp WebP conversion and size limits built into this phase.
**Research flag:** Payload admin customisation for non-technical users may need specific research — field label localisation, simplified admin views, upload handling with Sharp. Consider `/gsd:research-phase` for the image upload + Sharp integration specifically.

### Phase 4: Contact Form + Email Delivery
**Rationale:** The contact form is a standalone feature with no dependencies on admin CRUD. It can be built any time after the public layout exists. However, email deliverability testing must be done before launch — this phase should complete before final deployment, not at the last minute.
**Delivers:** Functional contact form (email + WhatsApp link); Server Action calling Resend SDK; honeypot spam protection; rate limiting on the endpoint; end-to-end delivery verified including spam folder check.
**Uses:** react-hook-form + Zod for client/server validation; Resend SDK via Server Action; honeypot hidden field pattern.
**Avoids pitfalls:** Contact form spam and delivery failure (Pitfall 9) — Resend handles SPF/DKIM correctly; honeypot and rate limiting required; WhatsApp `wa.me/` link with correct `+33` prefix format.
**Research flag:** Standard patterns — Resend + Next.js Server Actions is officially documented. Skip `/gsd:research-phase`.

### Phase 5: Deployment — Docker, Caddy, VPS, Launch
**Rationale:** Deployment is last because it requires a working application. However, the Docker Compose structure should be designed early (Phase 1) to avoid surprises. This phase covers production hardening, redirect mapping, and DNS cutover.
**Delivers:** Docker Compose production config (Next.js app + PostgreSQL + Caddy); GitHub Actions CI/CD pipeline; Caddy config with automatic HTTPS; 301 redirect map for old WordPress URLs; Google Search Console setup; UptimeRobot monitoring; VPS reboot test confirming auto-restart.
**Uses:** Docker Compose, Caddy 2, GitHub Actions, `next build` with `output: 'standalone'`.
**Avoids pitfalls:** VPS process management (Pitfall 6) — Docker Compose handles restart automatically; WordPress URL 404s (Pitfall 5) — redirect map required before DNS cutover; scope creep (Pitfall 7) — v2 backlog maintained throughout.
**Research flag:** Caddy + Next.js Docker deployment on VPS is well-documented (community guides exist). Skip `/gsd:research-phase`.

### Phase Ordering Rationale

- **Data models before everything:** Payload collections are the foundation. Building pages or admin UI before schema is settled causes rework.
- **Auth before admin routes:** Even staging deployment should have protected admin routes. Deploying an open admin panel, even temporarily, is a security risk.
- **Public pages before admin CRUD:** Seeing real rendered pages reveals what fields the admin forms actually need. Prevents building admin forms for data that displays poorly.
- **Contact form decoupled:** No dependencies on admin; can be built at any point after public layout. Scheduled last to leave the most time for deliverability testing before launch.
- **Deployment last but designed early:** Docker Compose structure should be set up in Phase 1 for local dev parity; production deployment config is Phase 5 work.

### Research Flags

Phases that benefit from deeper research during planning:
- **Phase 3 (Admin Panel):** Payload admin customisation for non-technical users — French field labels, simplified collection views, upload handling with Sharp image processing. The Sharp + Payload upload integration is the least-documented aspect of this stack. Recommend `/gsd:research-phase` for this integration.

Phases with standard, well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1 (Foundation):** `pnpm create payload-app` with PostgreSQL is officially documented and templated.
- **Phase 2 (Public Pages):** Next.js App Router Server Components + Tailwind CSS is one of the most-documented patterns in the ecosystem.
- **Phase 4 (Contact Form):** Resend + Next.js Server Actions is officially documented by Resend.
- **Phase 5 (Deployment):** Caddy + Docker + Next.js standalone has multiple current community guides.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core technologies sourced from official docs (Next.js, Payload, Resend, shadcn/ui). Version compatibility matrix verified. Payload 3 + Next.js 16 is the current official pairing. |
| Features | HIGH | Multiple French and international coach site analyses cross-verified. Feature list matches industry consensus from 5+ authoritative sources. Anti-features validated against specific failure modes. |
| Architecture | HIGH | Payload 3's monorepo architecture is the official design (not an improvisation). Data flow patterns sourced from official Next.js and Payload docs. Anti-patterns sourced from documented failure modes. |
| Pitfalls | MEDIUM-HIGH | GDPR/CNIL pitfall sourced from official French data protection references and 2025 enforcement statistics. Technical pitfalls (image compression, process management, redirects) sourced from multiple community guides. Admin UX pitfall is based on documented patterns from CMS UX research. |

**Overall confidence:** HIGH

### Gaps to Address

- **Sharp + Payload upload integration:** Payload 3's media upload handling and how to hook in Sharp for automatic WebP conversion and resizing is the least-documented aspect of the recommended stack. This is the one integration that warrants a focused research spike during Phase 3 planning.
- **Payload admin French localisation:** How much of the Payload admin UI can be localised to French out of the box (field labels vs. full UI translation) should be verified during Phase 3 planning. Antoine will use the admin in French context — unclear labels will cause the admin UX pitfall.
- **VPS disk capacity:** Whether Antoine's VPS has sufficient disk for local image storage, or whether `@payloadcms/storage-s3` is needed from v1, depends on the VPS spec. This should be confirmed before Phase 1 starts — if S3 storage is needed, it affects Phase 1 setup.
- **Current WordPress URL inventory:** Pitfall 5 (redirect map) requires auditing `antoineprofit.com` before it goes down. This should be done before Phase 5 (during Phase 1 at the latest), not the day before launch.

---

## Sources

### Primary (HIGH confidence)
- [Next.js 16 official blog](https://nextjs.org/blog/next-16) — Next.js 16 release confirmation
- [Next.js Self-Hosting Guide](https://nextjs.org/docs/app/guides/self-hosting) — standalone output, VPS deployment
- [Payload CMS 3.0 announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app) — monorepo architecture rationale
- [Payload Production Deployment docs](https://payloadcms.com/docs/production/deployment) — PostgreSQL, environment variables
- [Payload Storage Adapters (S3)](https://payloadcms.com/docs/upload/storage-adapters) — S3-compatible object storage option
- [shadcn/ui Tailwind v4 support docs](https://ui.shadcn.com/docs/tailwind-v4) — Tailwind v4 compatibility
- [Resend + Next.js Server Actions](https://resend.com/docs/send-with-nextjs) — contact form email integration
- [Auth.js protecting routes](https://authjs.dev/getting-started/session-management/protecting) — admin middleware pattern
- [PostgreSQL 17 Docker Official Image](https://hub.docker.com/_/postgres) — container setup
- [France GDPR/CNIL enforcement data 2025](https://www.recordinglaw.com/world-data-privacy-laws/france-data-privacy-laws/) — GDPR pitfall severity

### Secondary (MEDIUM confidence)
- [Next.js + SQLite portfolio architecture — Krimsonhart/Medium](https://krimsonhart.medium.com/how-i-built-my-portfolio-using-next-js-and-sqlite-db-part-1-e26df9e17911) — content blocks pattern
- [Self-hosted Payload + PostgreSQL on Docker — simplesteps.guide (Feb 2026)](https://simplesteps.guide/guides/technology/web-development/self-hosted-payloadcms-and-postgresql-website-on-docker/setup-ubuntu-tailscale-docker) — VPS Docker setup
- [Headless CMS comparison Strapi vs Directus vs Payload 2026 — dasroot.net](https://dasroot.net/posts/2026/01/headless-cms-comparison-strapi-directus-payload/) — alternatives validation
- [Caddy reverse proxy for Next.js VPS — emirazazi.de (2025)](https://emirazazi.de/blog/nextjs-vps-deployment/) — Caddy config
- [Création site internet coach sportif — Webconceptor (French market)](https://webconceptor.com/creation-site-internet-coach-sportif/) — French coach site feature expectations
- [16 Best Personal Trainer Website Examples — Vibe Otter](https://vibeotter.com/blog/personal-trainer-websites-best-practices.html) — coach site best practices
- [Should I Use A Contact Page or Booking Page — Lovely Impact](https://lovelyimpact.com/should-i-use-a-contact-page-or-booking-page-on-my-coaching-website/) — contact-first vs booking validation
- [WordPress to Next.js Migration SEO — Dashweb Agency](https://dashweb.agency/posts/migrating-wordpress-to-nextjs-seo-story) — redirect and SEO pitfalls
- [How to build a secure admin panel — Aikido Security](https://www.aikido.dev/blog/build-secure-admin-panel) — security pitfalls
- [GDPR for Images — GDPR Local](https://gdprlocal.com/gdpr-for-images/) — consent requirements for transformation photos

---
*Research completed: 2026-04-01*
*Ready for roadmap: yes*
