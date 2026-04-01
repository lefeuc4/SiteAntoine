# Stack Research

**Domain:** Coach/wellness showcase website with built-in admin CMS, VPS-deployable
**Researched:** 2026-04-01
**Confidence:** HIGH

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x (stable since Oct 2025) | Full-stack framework, public pages + API routes | Runs standalone on any VPS via Node.js; App Router + React Server Components make pages fast by default; Payload CMS 3 requires it natively |
| React | 19.x | UI rendering | Peer dependency of Next.js 16; React 19 stable, no more forwardRef boilerplate |
| Payload CMS | 3.x (3.80+ as of April 2026) | Admin panel + content API | Installs directly inside the Next.js `/app` folder — no separate CMS process; TypeScript-native; PostgreSQL support is stable; ships a polished admin UI without configuration; single codebase = single Docker container |
| PostgreSQL | 17.x (17.7 Alpine) | Primary database | Payload's recommended production database; full relational model for programmes and before/after results; ACID guarantees for content edits |
| Tailwind CSS | 4.x | Styling | 75M+/month npm downloads in 2025; utility-first makes responsive design fast; purges unused CSS; officially supported by Next.js and shadcn/ui |
| TypeScript | 5.x | Type safety | Payload is TypeScript-native; types flow automatically from CMS schema to frontend — zero manual type maintenance |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest (Tailwind v4 supported) | UI component primitives | Admin-facing forms and public page sections; accessible, unstyled-by-default components that match any visual identity; no runtime CSS-in-JS overhead |
| react-hook-form | 7.x | Contact form state management | Zero re-renders on keystroke; works with Server Actions; pairs with Zod for shared client/server validation |
| Zod | 3.x | Schema validation | Single schema validates both client-side (react-hook-form) and server-side (Server Action); prevents duplication |
| Resend | latest (`resend` npm) | Transactional email for contact form | Modern email API designed for Next.js; free tier covers small volume; Server Actions call the SDK directly; no SMTP config |
| react-email | latest | Email template rendering | Render HTML emails as React components; pairs with Resend; maintainable templates |
| next/image | (built-in) | Image optimisation | Automatic WebP conversion, lazy loading, blur placeholders; critical for before/after photo gallery performance |
| @payloadcms/storage-s3 | latest | Media file storage (optional) | Use if VPS disk space is a concern; compatible with any S3-compatible provider (Hetzner Object Storage, DigitalOcean Spaces); skip for v1 if local disk is adequate |
| Caddy | 2.x | Reverse proxy + automatic HTTPS | Simpler config than Nginx; auto-provisions Let's Encrypt certificates; single `Caddyfile`; first-class Docker support |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Faster installs than npm, smaller `node_modules`; used in official Payload templates |
| Docker + Docker Compose | Container orchestration | One `docker-compose.yml` runs Next.js/Payload + PostgreSQL + Caddy; reproducible between dev and prod |
| ESLint + Prettier | Code quality | Next.js ships default ESLint config; add Prettier for consistent formatting |
| GitHub Actions | CI/CD | Build Docker image, push to registry, SSH-deploy to VPS; zero-downtime restart via `docker compose pull && docker compose up -d` |

---

## Installation

```bash
# Bootstrap a new Payload + Next.js project
pnpm create payload-app@latest siteantoine --template website

# Inside the project
pnpm install

# Additional supporting libraries
pnpm add resend react-email zod react-hook-form

# Dev dependencies
pnpm add -D prettier eslint-config-prettier
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Payload CMS 3 | Strapi 5 | When a non-technical team needs a GUI-first content-type builder; Strapi has a larger plugin marketplace but is a separate process from Next.js — adds operational complexity on a VPS |
| Payload CMS 3 | Directus | When content editors are non-developers who need a feature-rich Vue-based UI; Directus is database-first and excellent for existing schemas, but heavier to operate |
| Payload CMS 3 | Sanity / Contentful | When budget allows managed hosting and global CDN; fully managed SaaS removes ops burden but adds monthly cost and vendor lock-in |
| PostgreSQL | SQLite (via Payload adapter) | When absolute simplicity is paramount and concurrency is not a concern; SQLite is supported by Payload 3 and is valid for low-traffic solo sites, but PostgreSQL is the production recommendation |
| Caddy | Nginx | When the team already has Nginx config expertise; Nginx is equally capable but requires manual cert renewal setup |
| Resend | Nodemailer + SMTP | When you already have a reliable SMTP server; Nodemailer works fine but requires managing credentials and delivery reputation |
| Docker Compose | PM2 direct on VPS | When you want to avoid Docker overhead; PM2 + nvm is lighter but makes environment reproducibility harder and upgrades more manual |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| WordPress | The stated problem: heavy, slow, difficult to customise, loaded with unused plugins (WooCommerce, Revolution Slider present on current site) | Next.js + Payload CMS |
| Vercel / Netlify | Explicitly out of scope — VPS constraint; also introduces vendor lock-in and pay-per-use pricing | Docker on existing VPS |
| Next.js Pages Router | Deprecated path; App Router is the current architecture; Payload 3 requires App Router | Next.js App Router (default in all new projects) |
| Tailwind CSS v3 | v4 is the current stable release and is what shadcn/ui now targets; v3 projects need migration tooling to upgrade | Tailwind CSS v4 |
| Mongoose / MongoDB | Payload 3's MongoDB adapter exists but PostgreSQL is the recommended production path with stable migrations | PostgreSQL via `@payloadcms/db-postgres` |
| Separate frontend + backend repos | Payload 3 is designed to coexist inside the Next.js app directory — splitting into two repos doubles DevOps effort for no benefit at this project scale | Monorepo: single Next.js + Payload app |
| Custom auth system | Payload ships a built-in auth system (JWT, cookies, password reset) — sufficient for a single admin user | Payload's built-in auth |

---

## Stack Patterns by Variant

**If VPS disk space is limited (< 20 GB usable):**
- Add `@payloadcms/storage-s3` and connect to Hetzner Object Storage or DigitalOcean Spaces
- Store only DB + app code on VPS; all uploaded photos served from object storage + CDN
- Because before/after photo galleries can accumulate hundreds of MB quickly

**If Antoine needs mobile image uploads from his phone:**
- Payload's admin panel is responsive and works on mobile browsers
- No additional native app needed for v1

**If the site later needs a blog (out of scope v1):**
- Payload's Lexical rich-text editor and existing collection system handle blog posts natively — add a `Posts` collection, no migration needed

**If traffic grows significantly:**
- Next.js standalone output supports horizontal scaling behind a load balancer
- Move PostgreSQL to a managed provider (Supabase, Neon) without changing Payload config

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `payload@3.x` | `next@16.x`, `react@19.x` | Payload 3 requires Next.js 15+ and React 19; Next.js 16 is fully supported |
| `tailwindcss@4.x` | `shadcn/ui` latest | shadcn/ui added full Tailwind v4 support; CLI initialises with `@theme` directive automatically |
| `react-hook-form@7.x` | `react@19.x` | RHF 7.x is React 19 compatible; `forwardRef` removal in React 19 is handled internally |
| `postgres:17-alpine` | `@payloadcms/db-postgres` | Payload's Postgres adapter is tested against PG 14–17; Alpine image is smaller for Docker |
| `next@16.x` | `zod@3.x` | No conflicts; Zod 3 stable, widely adopted with Server Actions pattern |

---

## Deployment Architecture (VPS)

```
VPS (Ubuntu 24.04)
└── Docker Compose
    ├── caddy:2          → :80/:443, auto-HTTPS, reverse proxy to :3000
    ├── siteantoine:app  → Next.js 16 + Payload 3 on port 3000 (standalone output)
    └── postgres:17-alpine → internal port 5432, volume-mounted data
```

Environment variables required:
```
DATABASE_URL=postgres://payload:PASSWORD@postgres:5432/payload
PAYLOAD_SECRET=<random 32+ char string>
NEXT_PUBLIC_SERVER_URL=https://antoineprofit.com
RESEND_API_KEY=re_...
```

---

## Sources

- [Next.js 15.2.4 stable — current version confirmation](https://www.abhs.in/blog/nextjs-current-version-march-2026-stable-release-whats-new) — MEDIUM confidence (secondary source)
- [Next.js 16 release October 2025](https://nextjs.org/blog/next-16) — HIGH confidence (official)
- [Next.js Self-Hosting Guide](https://nextjs.org/docs/app/guides/self-hosting) — HIGH confidence (official docs)
- [Payload 3.0 announcement — Next.js native CMS](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app) — HIGH confidence (official)
- [Payload Production Deployment docs](https://payloadcms.com/docs/production/deployment) — HIGH confidence (official)
- [Payload Storage Adapters (S3)](https://payloadcms.com/docs/upload/storage-adapters) — HIGH confidence (official)
- [Payload CMS npm — version 3.80+](https://www.npmjs.com/package/payload) — HIGH confidence
- [Self-hosted Payload + PostgreSQL on Docker guide](https://simplesteps.guide/guides/technology/web-development/self-hosted-payloadcms-and-postgresql-website-on-docker/setup-ubuntu-tailscale-docker) — MEDIUM confidence (community guide, Feb 2026)
- [Headless CMS comparison Strapi vs Directus vs Payload 2026](https://dasroot.net/posts/2026/01/headless-cms-comparison-strapi-directus-payload/) — MEDIUM confidence
- [shadcn/ui Tailwind v4 support docs](https://ui.shadcn.com/docs/tailwind-v4) — HIGH confidence (official)
- [Caddy reverse proxy for Next.js VPS deployment](https://emirazazi.de/blog/nextjs-vps-deployment/) — MEDIUM confidence (community guide 2025)
- [Resend + Next.js Server Actions](https://resend.com/docs/send-with-nextjs) — HIGH confidence (official)
- [react-hook-form + Zod + Server Actions pattern](https://nehalist.io/react-hook-form-with-nextjs-server-actions/) — MEDIUM confidence (community)
- [PostgreSQL 17.7 Docker Official Image](https://hub.docker.com/_/postgres) — HIGH confidence (Docker Hub official)

---

*Stack research for: Coach/wellness showcase website with admin CMS, VPS deployment*
*Researched: 2026-04-01*
