# Technology Stack

**Analysis Date:** 2026-04-05

## Languages

**Primary:**
- TypeScript 5.7 - All source code (collections, pages, components, migrations)
- JavaScript - Configuration files (next.config.ts transpiled)

**Secondary:**
- CSS 4 (via Tailwind CSS) - Styling via `@theme` directive in `src/app/globals.css`

## Runtime

**Environment:**
- Node.js 20.x (specified in `.nvmrc`)
- ES modules (type: "module" in package.json)

**Package Manager:**
- pnpm (recommended in project documentation)
- Lockfile: pnpm-lock.yaml (inferred from onlyBuiltDependencies config)

## Frameworks

**Core:**
- Next.js 16.2.2 - Full-stack framework (App Router)
- React 19.0.0 - UI rendering and components
- Payload CMS 3.81.0 - Headless CMS embedded in Next.js app, admin panel at `/admin`

**Content & Rich Text:**
- @payloadcms/richtext-lexical 3.81.0 - Rich text editor for content fields (histoire, temoignages)
- @payloadcms/translations 3.81.0 - i18n support (French only currently via fallbackLanguage: 'fr')

**Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework with @theme directive
- @tailwindcss/postcss 4.2.2 - PostCSS plugin for Tailwind v4

**Form Handling:**
- react-hook-form 7.72.1 - Form state management (contact form)
- @hookform/resolvers 3.10.0 - Zod schema adapter for react-hook-form

**Validation:**
- Zod 3.23.8 - Schema validation (contact form schema in `src/lib/contactSchema.ts`)

## Key Dependencies

**Critical:**
- @payloadcms/db-postgres 3.81.0 - PostgreSQL database adapter for Payload
- @payloadcms/storage-vercel-blob 3.81.0 - Media/image storage via Vercel Blob (production only, clientUploads: true)
- @payloadcms/next 3.81.0 - Next.js integration layer for Payload (admin routes, API routes)

**Frontend Utilities:**
- next/image - Built-in image optimization and lazy loading
- lucide-react 1.7.0 - Icon library for UI components
- sharp 0.33.5 - Image processing library (included in Payload for image optimization)

**Infrastructure & Observability:**
- @vercel/analytics 2.0.1 - Analytics tracking (integrated at root layout)
- graphql 16.9.0 - GraphQL API support (used by Payload)

**Server-Side Utilities:**
- cross-env 7.0.3 - Cross-platform environment variable management
- tsx 4.21.0 - TypeScript execution for seed scripts

## Configuration

**Environment:**
- Location: `.env.local` (git-ignored)
- Example template: `.env.example` present
- Critical variables:
  - `DATABASE_URI` - Neon PostgreSQL pooled connection string
  - `PAYLOAD_SECRET` - Payload CMS secret (minimum 32 chars, generate with openssl)
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token for media uploads
  - `NEXT_PUBLIC_SERVER_URL` - Public site URL (used in metadata and email)
  - `RESEND_API_KEY` - Email service API key
  - `CONTACT_EMAIL` - Recipient email for contact form submissions

**Build:**
- `next.config.ts` - Next.js configuration with:
  - WordPress URL redirects (301 permanent redirects from old paths)
  - Payload CMS integration via `withPayload()` wrapper
  - Dev origin whitelist for local development (ubu-dev)

**TypeScript:**
- `tsconfig.json` - Strict mode enabled
- Path aliases:
  - `@/*` → `./src/*`
  - `@payload-config` → `./src/payload.config.ts`
- Target: ES2017

## Platform Requirements

**Development:**
- Node.js 20.x
- pnpm package manager
- Environment variables in `.env.local`
- PostgreSQL database (local or Neon)
- Vercel Blob token (for testing media uploads, optional in dev)

**Production:**
- Deployment target: Vercel (for Blob storage) or Node.js VPS with Docker
- PostgreSQL 17.x (Neon recommended for managed service)
- Environment variables in production deployment config
- Vercel Blob token (mandatory for production media uploads)

**Payload CMS:**
- Database URL with pooled connection string (required for serverless)
- Payload secret (32+ character random string)
- Storage token (Vercel Blob in current setup)

---

*Stack analysis: 2026-04-05*
