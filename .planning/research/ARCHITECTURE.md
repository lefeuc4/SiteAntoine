# Architecture Research

**Domain:** Coach wellness showcase website with built-in admin panel
**Researched:** 2026-04-01
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet / Browser                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    Nginx (Reverse Proxy)                      │
│  - SSL termination (Let's Encrypt)                           │
│  - Static asset serving (/uploads, /_next/static)           │
│  - Request forwarding to Next.js                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP :3000
┌──────────────────────────▼──────────────────────────────────┐
│                  Next.js Application (Node.js)               │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────────┐     │
│  │  (public) routes     │  │  (admin) routes           │     │
│  │  /                   │  │  /admin/*                  │     │
│  │  /mon-histoire       │  │  Protected by middleware   │     │
│  │  /services           │  │  Session auth (Auth.js)   │     │
│  │  /programmes         │  │                            │     │
│  │  /resultats          │  │  Pages: content, programs, │     │
│  │  /contact            │  │  results (CRUD)            │     │
│  └──────────┬───────────┘  └───────────┬──────────────┘     │
│             │                          │                      │
│  ┌──────────▼──────────────────────────▼──────────────┐     │
│  │               Server Actions / API Routes            │     │
│  │  - Content reads (public pages)                      │     │
│  │  - Content mutations (admin forms)                   │     │
│  │  - Contact form email dispatch                       │     │
│  └──────────────────────────┬───────────────────────────┘    │
└─────────────────────────────┼────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────┐
│                     Data Layer                                 │
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────┐     │
│  │   SQLite (DB file)   │    │  /uploads/ (local FS)    │     │
│  │   page_content       │    │  Images served via       │     │
│  │   programs           │    │  /public/uploads/*       │     │
│  │   results            │    │  or dedicated /uploads   │     │
│  │   users (admin only) │    │  route in Nginx           │     │
│  └─────────────────────┘    └──────────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Nginx | SSL termination, static file serving, rate limiting, reverse proxy | nginx.conf with upstream block pointing to :3000 |
| Next.js App | SSR/SSG for public pages, admin panel UI, Server Actions, auth | Single Next.js 15 app, `output: 'standalone'` |
| Public routes `(public)` | Render 5 showcase pages from DB content; optimized for performance | Route group, Server Components, SSR/ISR |
| Admin routes `(admin)` | CRUD interface for page content, programs, results | Route group, protected by middleware, Client Components for forms |
| Server Actions | Mutate DB content (admin), send contact email | `'use server'` functions co-located with forms |
| Middleware | Protect `/admin/*` routes, redirect unauthenticated users | `middleware.ts` at project root, checks session cookie |
| Auth (Auth.js) | Single admin user login via credentials, session management | Credentials provider, database session or JWT |
| SQLite + Drizzle | Persist content, programs, results, admin user | Drizzle ORM with better-sqlite3 driver |
| File uploads | Store program/result images on local disk | Multipart form upload → `/public/uploads/` or `/var/www/uploads/` |
| Nodemailer | Send contact form submissions to Antoine's email | SMTP transport, called from Server Action |

## Recommended Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public-facing pages (no auth)
│   │   │   ├── layout.tsx            # Public layout (header, footer, nav)
│   │   │   ├── page.tsx              # Accueil
│   │   │   ├── mon-histoire/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── programmes/
│   │   │   │   └── page.tsx
│   │   │   ├── resultats/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── (admin)/                  # Admin panel (requires auth)
│   │   │   ├── layout.tsx            # Admin layout (sidebar, top bar)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Admin dashboard
│   │   │   │   ├── contenu/
│   │   │   │   │   └── [page]/
│   │   │   │   │       └── page.tsx  # Edit page text/images
│   │   │   │   ├── programmes/
│   │   │   │   │   ├── page.tsx      # List programs
│   │   │   │   │   ├── nouveau/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── resultats/
│   │   │   │       ├── page.tsx      # List results
│   │   │   │       ├── nouveau/page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # Auth.js route
│   │   │   │   └── route.ts
│   │   │   └── uploads/              # Image upload endpoint
│   │   │       └── route.ts
│   │   └── layout.tsx                # Root layout (fonts, metadata)
│   ├── actions/                      # Server Actions
│   │   ├── content.actions.ts        # Update page content blocks
│   │   ├── programs.actions.ts       # CRUD programs
│   │   ├── results.actions.ts        # CRUD before/after results
│   │   └── contact.actions.ts        # Send contact email
│   ├── components/
│   │   ├── public/                   # Public page components
│   │   │   ├── Hero.tsx
│   │   │   ├── ProgramCard.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── ContactForm.tsx
│   │   └── admin/                    # Admin UI components
│   │       ├── ContentEditor.tsx     # Rich text or simple textarea
│   │       ├── ImageUpload.tsx
│   │       ├── ProgramForm.tsx
│   │       └── ResultForm.tsx
│   ├── db/
│   │   ├── schema.ts                 # Drizzle table definitions
│   │   ├── migrations/               # Auto-generated SQL migrations
│   │   └── index.ts                  # DB connection singleton
│   ├── lib/
│   │   ├── auth.ts                   # Auth.js config
│   │   ├── mailer.ts                 # Nodemailer transport config
│   │   └── validators/               # Zod schemas for forms
│   └── middleware.ts                 # Auth guard for /admin/*
├── public/
│   └── uploads/                      # User-uploaded images (persisted)
├── .env.local
├── next.config.ts
├── drizzle.config.ts
├── Dockerfile
└── docker-compose.yml
```

### Structure Rationale

- **`(public)/` route group:** Groups the 5 showcase pages under a shared layout (nav, footer) without adding URL segments. Server Components by default for best performance.
- **`(admin)/` route group:** Separate layout (admin sidebar/toolbar). Routes start with `/admin/` making middleware matching trivial. Client Components only where interactivity is needed.
- **`actions/`:** All Server Actions extracted to a dedicated folder. Keeps `page.tsx` files lean. Each entity has its own file for clear boundaries.
- **`db/`:** Database schema and connection isolated. Single connection instance prevents SQLite lock issues.
- **`public/uploads/`:** Images stored under `public/` are served directly by Next.js (or Nginx). Simpler than a separate media server for this scale.

## Architectural Patterns

### Pattern 1: Route Groups for Public/Admin Separation

**What:** Two route groups `(public)` and `(admin)` coexist in the same Next.js app. Each has its own `layout.tsx`. The `middleware.ts` at root level intercepts all `/admin/*` requests and redirects to `/login` if no valid session exists.

**When to use:** Any app where the same codebase serves both public and authenticated areas — avoids running two separate servers.

**Trade-offs:** Single deployment unit (simpler ops). Slightly larger bundle if code splitting is not done carefully. For this project size, the simplicity wins clearly.

**Example:**
```typescript
// src/middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

### Pattern 2: Server Actions for All Admin Mutations

**What:** Admin forms call `'use server'` functions directly. No dedicated REST API layer. The Server Action validates input (Zod), writes to SQLite via Drizzle, and returns a result. The form uses `useActionState` (React 19) or `useFormStatus` for pending state.

**When to use:** When the same Next.js app owns both the UI and the data layer. Eliminates the API route boilerplate.

**Trade-offs:** Tightly coupled to Next.js (no external API consumer). For this project that is fine — Antoine's admin is the only consumer.

**Example:**
```typescript
// src/actions/programs.actions.ts
'use server'
import { db } from '@/db'
import { programs } from '@/db/schema'
import { programSchema } from '@/lib/validators/program'
import { revalidatePath } from 'next/cache'

export async function createProgram(formData: FormData) {
  const parsed = programSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }

  await db.insert(programs).values(parsed.data)
  revalidatePath('/programmes')      // Bust public page cache
  revalidatePath('/admin/programmes')
  return { success: true }
}
```

### Pattern 3: Content Blocks for Page Editing

**What:** Each public page has named "content blocks" stored in the database (e.g., `{ page: 'accueil', key: 'hero_title', value: '...' }`). The admin interface renders a form with one field per block. Antoine edits text and saves. Public pages read from the DB at request time (SSR) or with ISR.

**When to use:** When the page structure is fixed but the copy needs to be editable. Simpler than a full block-editor CMS like Sanity or Strapi.

**Trade-offs:** Antoine cannot reorganize page layouts (by design). He can only change text, images within predefined slots. This matches the requirement of a simple admin, not a full CMS.

## Data Flow

### Public Page Request Flow

```
User visits /programmes
    ↓
Next.js Server Component (programmes/page.tsx)
    ↓
db.select().from(programs)  [Drizzle, synchronous SQLite read]
    ↓
Render HTML with program data
    ↓
Response (SSR or ISR-cached HTML)
```

### Admin Content Edit Flow

```
Antoine edits hero title in /admin/contenu/accueil
    ↓
<form action={updateContent}>  [React 19 form with Server Action]
    ↓
Server Action: validates with Zod → writes to SQLite
    ↓
revalidatePath('/') called → Next.js ISR cache busted
    ↓
Redirect or success state shown in admin form
    ↓
Next public visitor to / receives fresh content
```

### Contact Form Flow

```
Visitor fills /contact form
    ↓
Client-side validation (React Hook Form + Zod)
    ↓
Server Action: contact.actions.ts
    ↓
Nodemailer → Antoine's SMTP → Email delivered
    ↓
Success message shown to visitor
```

### Image Upload Flow

```
Admin uploads image in program/result form
    ↓
POST /api/uploads  (multipart/form-data)
    ↓
API route: validates file type/size → writes to /public/uploads/{uuid}.ext
    ↓
Returns { url: '/uploads/{uuid}.ext' }
    ↓
Server Action saves URL string to SQLite record
    ↓
Public page renders <Image src="/uploads/..." /> via next/image
```

### Authentication Flow

```
Antoine visits /admin/programmes (first visit)
    ↓
middleware.ts: no session → redirect /login
    ↓
Login form → Server Action → Auth.js credentials provider
    ↓
Bcrypt password check against DB user record
    ↓
Session cookie set → redirect /admin/programmes
    ↓
Subsequent /admin/* requests: middleware reads session → pass through
```

### Key Data Flows Summary

1. **Public reads:** Server Component → Drizzle → SQLite → rendered HTML (no client JS needed)
2. **Admin writes:** Client form → Server Action → Drizzle → SQLite + `revalidatePath` to bust ISR cache
3. **Images:** Upload to local disk → URL stored in DB → served by Nginx directly (bypasses Next.js)
4. **Contact:** Server Action → Nodemailer → SMTP (no data stored in DB)

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–1k monthly visitors | Current architecture is sufficient. Single VPS, SQLite, local image storage. |
| 1k–50k monthly visitors | Add Nginx caching for static HTML. SQLite remains fine for this read-heavy workload with rare writes. |
| 50k+ monthly visitors | Migrate SQLite to PostgreSQL. Move images to object storage (S3/Backblaze). Add CDN in front of Nginx. |

### Scaling Priorities

1. **First bottleneck:** Image delivery. Nginx should serve `/uploads/` directly, bypassing Node.js entirely. This is already in the recommended architecture.
2. **Second bottleneck:** Database write contention. SQLite serializes writes. For Antoine's use (rare admin writes, many public reads), this is never a real concern at this scale.

## Anti-Patterns

### Anti-Pattern 1: Separate Backend API Server

**What people do:** Build a separate Express/Fastify API on port 4000, then have Next.js call it via `fetch()` from Server Components.

**Why it's wrong:** For a showcase site with a single admin user, this adds two deployment units, two processes to manage, CORS configuration, and network overhead — with zero benefit. Next.js Server Actions and Server Components access the database directly with lower latency and less complexity.

**Do this instead:** Server Actions for mutations, Server Components querying Drizzle directly for reads.

### Anti-Pattern 2: Using a Full Headless CMS (Strapi, Sanity, Contentful)

**What people do:** Install Strapi on the same VPS, configure content types, build a custom frontend consuming the Strapi API.

**Why it's wrong:** Strapi adds ~300MB RAM overhead, a separate Node process, a complex admin UI Antoine doesn't need, and a separate database. The project requirement is a *simple* admin interface for defined content slots — not a full editorial CMS.

**Do this instead:** Custom content block table in SQLite + simple form-based admin in the same Next.js app. Antoine only ever edits what is predefined.

### Anti-Pattern 3: Client-Side Data Fetching for Public Pages

**What people do:** Fetch programs/results from an API route inside a `useEffect()` in a Client Component.

**Why it's wrong:** Public pages rendered with client-side fetching show a loading skeleton on every visit, hurt SEO, and are slower on mobile. For a showcase site this is unacceptable.

**Do this instead:** Server Components fetch from SQLite at request time. Pages are SSR or ISR. Visitors receive complete HTML immediately.

### Anti-Pattern 4: Storing Images in the Database

**What people do:** Store image binary data as BLOBs in SQLite.

**Why it's wrong:** SQLite is not optimized for binary blobs. DB file grows uncontrollably. Backups become huge. Image serving performance degrades.

**Do this instead:** Store image files on disk under `/public/uploads/`, store only the URL string in SQLite.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| SMTP (Gmail / OVH / Mailgun) | Nodemailer via Server Action | Store SMTP credentials in `.env`. Antoine's email is the recipient. |
| Let's Encrypt SSL | Certbot + Nginx config | Auto-renews. No application code changes needed. |
| WhatsApp (optional) | Static `wa.me/` link on contact page | No API, just a hyperlink. Zero integration complexity. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Public routes ↔ DB | Direct Drizzle query in Server Component | No abstraction layer needed at this scale |
| Admin routes ↔ DB | Via Server Actions with Zod validation | Validation must happen server-side before any DB write |
| Admin routes ↔ File system | Via `/api/uploads` API route | Isolated from Server Actions to handle multipart/form-data properly |
| Next.js ↔ Nginx | HTTP on :3000, Nginx proxies | Nginx serves `/uploads/` and `/_next/static/` directly to avoid Node.js overhead |
| Middleware ↔ Auth.js | `auth()` wrapper on middleware function | Auth.js v5 (beta) integrates directly with Next.js middleware |

## Build Order Implications

The architecture has clear dependencies that suggest this build order:

1. **Database schema + Drizzle setup** — All other components depend on the data models being defined first.
2. **Auth.js + login page + middleware** — Admin routes must be protected before any admin UI is built.
3. **Public layout + static public pages** — Unblocks visual design work. Pages can be built with placeholder data.
4. **Server Actions for content, programs, results** — Mutation layer. Needed before admin forms work.
5. **Admin CRUD pages** — Depends on Server Actions. Programs and results can be built in parallel.
6. **Contact form + Nodemailer** — Standalone feature, can be built at any point after public layout.
7. **Image upload API route** — Needed before program/result forms that include images.
8. **Docker + Nginx deployment config** — Best done with a working app, not before.

## Sources

- Next.js 15 self-hosting official docs (version 16.2.2, 2026-03-31): https://nextjs.org/docs/app/guides/self-hosting
- SoftwareMill: Modern Full Stack Application Architecture Using Next.js 15+: https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/
- Payload CMS (Payload 3.0 architecture): https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app
- Auth.js protecting routes: https://authjs.dev/getting-started/session-management/protecting
- Next.js middleware authentication (2025): https://www.hashbuilds.com/articles/next-js-middleware-authentication-protecting-routes-in-2025
- Next.js + SQLite portfolio architecture: https://krimsonhart.medium.com/how-i-built-my-portfolio-using-next-js-and-sqlite-db-part-1-e26df9e17911
- Next.js contact form with Server Actions + Nodemailer: https://dev.to/tigawanna/adding-a-nextjs-contact-me-form-using-server-actions-and-nodemailer-475j
- VPS deployment guide (Nginx + PM2 + HTTPS): https://medium.com/@touhidulislamnl/deploying-a-next-js-app-on-a-vps-with-nginx-pm2-and-https-complete-production-guide-5b2d80c24dd4

---
*Architecture research for: Coach wellness showcase website with admin panel*
*Researched: 2026-04-01*
