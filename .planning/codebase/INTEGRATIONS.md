# External Integrations

**Analysis Date:** 2026-04-05

## APIs & External Services

**Email Service:**
- Resend - Transactional email delivery for contact form
  - SDK/Client: `resend` 6.10.0
  - Auth: `RESEND_API_KEY` environment variable
  - Usage: `src/app/actions/sendContactEmail.ts`
  - Endpoint: Contact form emails sent to `CONTACT_EMAIL` recipient
  - TODO: Migrate from `onboarding@resend.dev` to verified `noreply@antoineprofit.com` in production

**Analytics:**
- Vercel Analytics - Page performance and visitor tracking
  - SDK/Client: `@vercel/analytics` 2.0.1
  - Integration: React component injected at root layout (`src/app/layout.tsx`)
  - Automatic page view tracking (no manual setup required)

## Data Storage

**Databases:**
- PostgreSQL 17.x (Neon provider)
  - Connection: `DATABASE_URI` environment variable (pooled connection string via -pooler hostname)
  - Client: `@payloadcms/db-postgres` 3.81.0
  - Payload CMS collections stored:
    - `users` - Admin authentication
    - `media` - Image uploads
    - `page-content` - Editable page sections (hero, services, cta content)
    - `programmes` - Coaching programs with rich text descriptions
    - `resultats` - Before/after transformations with client stories
  - Migrations: Located in `src/migrations/` (auto-run on startup)

**File Storage:**
- Vercel Blob - Image and media file hosting
  - Connection: `BLOB_READ_WRITE_TOKEN` environment variable
  - Client: `@payloadcms/storage-vercel-blob` 3.81.0 plugin
  - Collections: `media` collection uploads stored in Blob (images, documents)
  - Upload limit: 5 MB (server-side only, clientUploads bypasses limit in production)
  - Client uploads: Enabled in production (NODE_ENV === 'production'), disabled in dev
  - Note: Server never receives actual file buffer; direct upload to Blob storage

**Caching:**
- None currently implemented
- Next.js default page caching via ISR/revalidation possible for frontend pages

## Authentication & Identity

**Auth Provider:**
- Payload CMS built-in authentication
  - Implementation: JWT + cookie-based auth
  - User collection: `src/collections/Users.ts`
  - Admin access: Single admin user (Antoine)
  - Password reset: Handled by Payload's built-in auth system
  - Access control: All collections have Payload access rules defined

## Content Management

**Headless CMS:**
- Payload CMS 3.81.0 (embedded in Next.js app)
  - Admin panel: `/admin` route (authenticated)
  - API: GraphQL + REST at `/api/[...slug]`
  - Collections: Users, Media, Programmes, Resultats, PageContent
  - Globals: ContactSettings, MentionsLegales
  - Rich text editor: Lexical editor with basic formatting (bold, italic, lists, links)
  - Database: PostgreSQL with Payload migrations
  - File upload handler: Vercel Blob (production) / server-side (dev)

## Monitoring & Observability

**Error Tracking:**
- None currently configured
- Console errors logged during Resend email failures
- Locations: `src/app/actions/sendContactEmail.ts` (error logging)

**Logs:**
- Server console logs (Node.js stdout)
- Email service errors logged to console
- No centralized logging service (Sentry, LogRocket, etc.)

## CI/CD & Deployment

**Hosting:**
- Vercel (assumed for Blob storage and Analytics integration)
- Alternative: Node.js VPS with Docker (via standalone Next.js output)

**CI Pipeline:**
- Not detected in codebase
- Likely configured in GitHub Actions or Vercel deployment settings

## Environment Configuration

**Required env vars:**
- `DATABASE_URI` - PostgreSQL connection string (pooled for serverless)
- `PAYLOAD_SECRET` - CMS secret (minimum 32 chars, must be cryptographically random)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob read/write token
- `NEXT_PUBLIC_SERVER_URL` - Public site URL (used in metadata, email, SEO)
- `RESEND_API_KEY` - Resend email service API key
- `CONTACT_EMAIL` - Recipient email for contact form submissions
- `NODE_ENV` - "development" or "production" (controls Vercel Blob client uploads)

**Optional env vars:**
- None detected

**Secrets location:**
- Development: `.env.local` (git-ignored)
- Production: Vercel Dashboard > Settings > Environment Variables (for Vercel deployment)
- `.env.example` provides template structure

## Webhooks & Callbacks

**Incoming:**
- Contact form submission → handled by Server Action `sendContactEmail`
  - Endpoint: `/api/actions/sendContactEmail` (implicit Next.js Server Actions route)
  - Payload: JSON form data (nom, email, message)
  - Validation: Zod schema (`src/lib/contactSchema.ts`)
  - Response: ContactFormState with status (idle, success, error, validation_error)

**Outgoing:**
- Email to `CONTACT_EMAIL` via Resend when contact form submitted
  - From: `Site Antoine Profit <onboarding@resend.dev>` (should update to verified domain)
  - To: `process.env.CONTACT_EMAIL`
  - Reply-To: Submitter's email (parsed.data.email)
  - Subject: `Nouveau message de [nom] via antoineprofit.com`
  - Body: Plain text email with form fields

## Data Flow

**Contact Form Submission:**
1. User submits form via `src/app/(frontend)/contact/page.tsx`
2. Browser calls Server Action `sendContactEmail` with form data
3. Server validates via `contactSchema` (Zod)
4. Honeypot check: If "website" field filled, return fake success (bot detection)
5. Valid submission sent to Resend API
6. Email delivered to `CONTACT_EMAIL`
7. Response returns success/error status to client

**Page Content Loading:**
1. Frontend pages fetch Payload CMS data (via REST/GraphQL API at `/api/[...slug]`)
2. Data flows through React Server Components
3. Rich text fields rendered via `@payloadcms/richtext-lexical/react` RichText component
4. Media URLs point to Vercel Blob (in production) or local server (in dev)
5. Images optimized via next/image at render time

---

*Integration audit: 2026-04-05*
