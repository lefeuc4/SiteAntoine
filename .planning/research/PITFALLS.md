# Pitfalls Research

**Domain:** Coach / wellness showcase website — WordPress-to-modern-framework rebuild with custom admin panel
**Researched:** 2026-04-01
**Confidence:** MEDIUM-HIGH (domain-specific findings from community sources, official docs, legal references)

---

## Critical Pitfalls

### Pitfall 1: Admin Panel Too Complex for the Actual Non-Technical User

**What goes wrong:**
The admin interface gets built for a developer's mental model — arbitrary rich-text editors, nested JSON structures, raw file path fields. Antoine opens it, stares at it for 10 minutes, sends a message asking for help, then gives up and stops updating the site. The "self-managed" promise collapses immediately.

**Why it happens:**
Developers prototype admin panels using developer tooling (raw CRUD, open text areas) and ship the prototype as the feature. The real constraint — a non-technical solo user working infrequently — is ignored during construction.

**How to avoid:**
- Design around concrete tasks: "Add a new before/after result", "Edit the hero text on the homepage" — not "manage the `hero_section` table".
- Break content into discrete, labelled fields instead of open free-text blocks. A field labelled "Titre principal" is less dangerous than a rich-text blob.
- Provide one worked example for each content type (first result pre-filled, first programme pre-filled) as a reference when Antoine adds more.
- Conduct a 15-minute walkthrough with Antoine before considering admin "done".

**Warning signs:**
- Admin routes mirror database tables directly rather than task flows.
- There is no field validation or preview mode.
- The admin was tested only by the developer.

**Phase to address:**
Admin panel phase — before delivery, not after.

---

### Pitfall 2: Before/After Gallery Without GDPR / CNIL Consent Documentation

**What goes wrong:**
Photos of real clients are uploaded, published, and appear in Google Images. Six months later a former client requests removal or the CNIL receives a complaint. France actively enforces GDPR (83 sanctions, €486M in 2025). Photos of identifiable people are personal data under GDPR Article 4. Publishing them without explicit, documented, purpose-specific consent is a violation.

**Why it happens:**
The gallery is treated as a pure UI feature. Legal requirements are not visible in Figma mocks or user stories.

**How to avoid:**
- Each result entry in the admin should include a mandatory "Consentement signé" checkbox / date field — Antoine cannot publish without confirming consent exists on file.
- Add a visible disclaimer on the Resultats page: consent obtained, results may vary.
- Store consent dates/references off-platform (paper or separate file) but record their existence in the admin.
- Note: a logo, a landscape photo, or a photo where the person is not identifiable does not require consent — but transformation photos almost always do.

**Warning signs:**
- Gallery admin form has no consent acknowledgement step.
- Client full names or identifiable faces published without any consent trail.
- No privacy policy page on the site.

**Phase to address:**
Before/after gallery feature phase + before public launch.

---

### Pitfall 3: Image Uploads Bloating the VPS / No Size Limits or Compression

**What goes wrong:**
Antoine uploads phone photos directly from his iPhone — 5–12 MB JPEGs each. After adding 20 client results plus service images, the upload folder holds 500 MB+ of unoptimised files. Page loads become slow. VPS disk fills. The entire "performance" goal of leaving WordPress is negated.

**Why it happens:**
Upload endpoints are built without file size limits or server-side processing because "we'll deal with images later". There is no later.

**How to avoid:**
- Enforce a hard upload limit in the API (e.g., 5 MB max per file, reject larger with a clear error message).
- Auto-convert uploaded images to WebP using Sharp (Node.js) at upload time; store only the converted version.
- Generate at least two sizes: a display version (≤ 1200px wide) and a thumbnail (≤ 400px wide).
- Never store originals alongside web-ready versions in the public directory.
- Use Next.js `<Image>` component for automatic lazy loading and responsive sizing.

**Warning signs:**
- Upload handler stores raw file with no transformation step.
- `public/uploads/` folder is the final destination without a build-time processing stage.
- No `maxFileSize` validation in the API route.

**Phase to address:**
Admin panel image upload feature — during implementation, not post-launch.

---

### Pitfall 4: Admin Panel Exposed Publicly Without Route Protection

**What goes wrong:**
The admin routes (`/admin`, `/api/admin/*`) are accessible to anyone who guesses the URL. Even with a login form, a brute-forceable password and no rate limiting means the site is one automated attack away from a full content takeover.

**Why it happens:**
Route protection is added "after the main features", auth is treated as a checkbox, and self-hosted deployments lack the WAF layer that managed platforms provide automatically.

**How to avoid:**
- Use HTTP-only, secure cookies for admin sessions — never localStorage tokens.
- Implement rate limiting on the login endpoint (5 failed attempts → 15-minute lockout).
- Serve the admin under a non-obvious path (e.g., `/gestion` not `/admin`) — security through obscurity is weak but reduces automated scans.
- Consider restricting the admin path by IP at the Nginx level if Antoine always manages from a known location.
- Add CSRF protection on all state-changing API routes.

**Warning signs:**
- `/admin` responds with a 200 for unauthenticated GET requests.
- Session tokens stored in localStorage.
- No failed-login rate limiting in place.
- Admin API routes return data without checking an auth cookie.

**Phase to address:**
Admin panel phase, authentication sub-task — must be done before any deployment to staging.

---

### Pitfall 5: WordPress URL Redirect Blindness — Losing Existing Google Traffic

**What goes wrong:**
The old site at `antoineprofit.com` has indexed pages (`/nos-services`, `/les-programmes`, etc.). After launch, those URLs return 404s. Google's existing rankings drop. Potential clients who bookmarked or find the old links reach dead pages.

**Why it happens:**
"Content is all new anyway" is interpreted as "URLs don't matter". But URLs matter independently of content for SEO continuity and for links that exist on social media or external referrals.

**How to avoid:**
- Audit the current site before shutdown: crawl it with a tool or manually list all public URLs.
- Create a 301 redirect map in Nginx (old URL → closest new URL) before the old site is taken down.
- At minimum, ensure the homepage, contact page, and high-traffic pages redirect correctly.
- Submit a new sitemap to Google Search Console immediately after launch.

**Warning signs:**
- No redirect map created before deployment.
- Old WordPress is taken offline the same day the new site goes live without parallel running.
- `antoineprofit.com` is not set up in Google Search Console.

**Phase to address:**
Deployment / launch phase — before DNS cutover.

---

### Pitfall 6: VPS Deployment Without Process Management or Restart on Crash

**What goes wrong:**
The Next.js Node.js server is started manually with `node server.js`. The VPS reboots (kernel update, power cycle). The site goes down. Antoine has no idea until a prospective client tells him via WhatsApp. The site can stay down for days.

**Why it happens:**
Local development has no process manager, and the deployment step is copied from a quick tutorial that ends at `npm start`.

**How to avoid:**
- Use PM2 with a saved process list (`pm2 save`, `pm2 startup`) so the server restarts automatically after VPS reboots.
- Alternatively, create a `systemd` service unit for the Next.js process.
- Configure Nginx as a reverse proxy in front of Next.js — Nginx is battle-hardened for handling malformed requests, slow connections, and payload limits.
- Set up a minimal uptime monitor (UptimeRobot free tier) that emails Antoine if the site goes down.

**Warning signs:**
- Deployment instructions say `npm start` with no process manager step.
- No `systemd` service or PM2 config file committed to the repo.
- No monitoring configured.

**Phase to address:**
Deployment / infrastructure phase.

---

### Pitfall 7: Scope Creep from "Just One More Feature" During Build

**What goes wrong:**
Antoine sees the admin panel and immediately wants: an appointment booking widget, a blog section, an Instagram feed, a newsletter integration. Each "small addition" delays launch by weeks. The original lean scope — the reason WordPress was replaced — is abandoned during development.

**Why it happens:**
Non-technical clients cannot visualise the product until they see the working prototype. Seeing it triggers real ideas that were not articulable upfront. This is expected and normal — the trap is saying yes without acknowledging cost.

**How to avoid:**
- Treat PROJECT.md "Out of Scope" as a binding reference: blog, booking, e-commerce are explicitly excluded from v1.
- When Antoine requests a new feature during build, log it in a "V2 backlog" document rather than implementing it immediately.
- Communicate each addition as a trade-off: "We can add X but it pushes launch by [estimated time]."
- Ship a working v1 first. Gather real usage data before building V2 features.

**Warning signs:**
- New requirements are added to the active sprint without removing anything.
- "Out of scope" items from PROJECT.md start appearing in Figma mocks.
- Estimates keep growing without corresponding scope reduction.

**Phase to address:**
All phases — requires discipline at each milestone boundary.

---

### Pitfall 8: Single-Language Site Treated as "No i18n Work Needed"

**What goes wrong:**
The site is French-only, so i18n is skipped entirely. All strings are hardcoded in French directly in JSX. Six months later Antoine wants even a single English page, or Google's Core Web Vitals audit flags missing `lang` attribute and improper locale signals. SEO suffers because `<html lang="fr">` is missing, OpenGraph locale is wrong, and no `<link rel="alternate">` hreflang is declared for the canonical French locale.

**Why it happens:**
Single-language sites feel like they need zero i18n work. But locale signals and HTML lang attributes are required for basic SEO correctness regardless of whether multiple languages are planned.

**How to avoid:**
- Set `<html lang="fr">` on every page.
- Set `og:locale` to `fr_FR` in OpenGraph meta tags.
- Include `<link rel="canonical">` on every page.
- Centralise all user-facing strings in locale files from day one (even with a single `fr.json`) — this costs almost nothing and enables future expansion.
- Use `next-intl` with a single `fr` locale if using Next.js — this also handles date and number formatting correctly for French users.

**Warning signs:**
- `<html>` tag has no `lang` attribute.
- Strings are hardcoded directly in JSX with no abstraction layer.
- No `og:locale` in page metadata.

**Phase to address:**
Foundation / initial setup phase — fix in the base layout, not as an afterthought.

---

### Pitfall 9: Contact Form With No Spam Protection or Delivery Verification

**What goes wrong:**
A bare `<form>` that POSTs to `mailto:` or a basic fetch to a send-mail endpoint starts receiving spam within 48 hours of launch. Alternatively, transactional emails from the VPS land in Antoine's spam folder — he never sees legitimate enquiries and concludes "the form doesn't work".

**Why it happens:**
Form spam protection is invisible until it's missing. Email deliverability from a VPS is unreliable because the IP reputation is unknown and SPF/DKIM records are often misconfigured.

**How to avoid:**
- Use a honeypot field (hidden from users, bots fill it in) as a first anti-spam layer.
- Add a rate limit on the contact API route (maximum 3 submissions per IP per hour).
- For email delivery, use a transactional email service (Resend, Brevo free tier) instead of `sendmail` from the VPS — these services handle deliverability, SPF, and DKIM correctly.
- Send a copy of every form submission to Antoine's email AND store it in the database as a fallback.
- Test end-to-end email delivery (including spam folder check) before launch.

**Warning signs:**
- Contact form POSTs directly to an SMTP server running on the VPS.
- No rate limiting on the form API route.
- No honeypot or CAPTCHA.
- Form delivery was never tested from a real email client.

**Phase to address:**
Contact form phase — deliverability testing is a go/no-go criterion.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode French strings in JSX | Faster initial dev | Impossible to centralise or audit strings later; `lang` attribute often forgotten | Never — add a single `fr.json` from day one, cost is minimal |
| Store uploaded images as-is without compression | Simpler upload handler | VPS disk fills, pages load slowly, performance goal fails | Never for user-uploaded photos |
| Skip PM2 / systemd, run with `npm start` | Works locally | Site stays down after any VPS restart | Never for production |
| Use a single long-lived JWT stored in localStorage for admin | Easier auth implementation | XSS vulnerability exposes admin token | Never — use HTTP-only session cookies |
| Skip redirect map when cutting over from WordPress | Saves ~2 hours | Loses all existing Google rankings and breaks bookmarked links | Never if the old domain has any existing SEO value |
| Build admin CRUD generically (raw fields) before validating UX with Antoine | Faster to build | Non-technical user abandons the tool; "self-managed" promise broken | Only for internal throwaway prototypes, not for delivery |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| WhatsApp contact button | Deep-link to `wa.me/` without phone number format validation — French numbers need `+33` prefix, not `06...` | Pre-construct the URL server-side: `https://wa.me/33XXXXXXXXX` where the leading `0` is dropped |
| Transactional email (Resend/Brevo) | Use VPS `sendmail` directly | Configure SPF/DKIM on the domain; route through a transactional provider; verify delivery in staging |
| Next.js `<Image>` component on VPS | Forget to configure `next.config.js` `remotePatterns` for the upload domain, breaking all image optimisation | Set `remotePatterns` or use a local `loader` at project setup |
| Nginx as reverse proxy | Forget `proxy_set_header Host` and `X-Real-IP` headers — Next.js request logs show wrong IPs, rate limiting breaks | Use the standard recommended Nginx config for Next.js from official docs |
| PM2 + Next.js | Running `pm2 start npm -- start` instead of pointing PM2 at the compiled server | Build first (`next build`), then `pm2 start node -- .next/standalone/server.js` for standalone output |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimised before/after images loaded at full resolution | Resultats page loads in 8+ seconds on mobile | Sharp compression at upload time, Next.js `<Image>` with `sizes` prop, WebP format | From the first uploaded image if unaddressed |
| No HTTP caching headers on static assets | Every page visit re-fetches CSS, JS, fonts | Set `Cache-Control: public, max-age=31536000, immutable` on hashed assets via Nginx | Impacts all users immediately; most painful on mobile |
| Next.js development server in production | Site is noticeably slower; hot-reload overhead active; memory leaks | Always run `next build && next start` or standalone output in production | Immediate — but often missed on first VPS deploy |
| Blocking font load (no `font-display: swap`) | Flash of invisible text (FOIT) on slow connections | Use `next/font` with `display: 'swap'`; subset fonts for Latin + accented characters | Every page load on slow connections |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Admin route at predictable `/admin` with no IP restriction | Automated scanners attempt credential stuffing immediately | Rename to non-obvious path AND add Nginx IP restriction if Antoine's IP is stable |
| No CSRF token on admin form submissions | Cross-site request forgery can modify content if admin is logged in and visits a malicious page | Implement CSRF token validation on all state-changing API routes (Next.js middleware or `iron-session`) |
| No file type validation on image uploads | Attacker uploads a PHP script or malicious SVG disguised as a JPEG | Validate MIME type server-side (not just file extension); restrict to `image/jpeg`, `image/png`, `image/webp` |
| Publishing client photos without consent documentation | CNIL complaint, GDPR violation, potential fine (France: 83 sanctions in 2025, €486M total) | Add consent checkbox in admin; add privacy policy page; do not publish without documented consent |
| Storing admin password in plaintext in `.env` committed to git | Full site takeover if repo is ever public or leaked | Hash passwords with `bcrypt`; never commit `.env` — use `.env.example` with placeholder values |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No clear path from any page to "contact Antoine" | Potential clients interested after reading about services cannot immediately act; they leave | Persistent CTA in the navigation and at the bottom of every service/programme page; one WhatsApp button always visible |
| Before/after gallery without context (no programme, duration, story) | Photos feel like stock photos; trust is not built | Each result entry must include: photo pair + programme followed + duration + client quote — the story sells, not just the image |
| Mobile menu that requires precise taps on small targets | French mobile traffic is 60%+ of web visits; poor mobile nav kills conversions | Design mobile navigation first; touch targets minimum 44×44px; test on real devices |
| Admin "Save" without confirmation or undo | Antoine accidentally overwrites content and cannot recover it | Show a success toast with "Modifications enregistrées"; keep last-saved value in DB so a "Annuler" restores previous state |
| Contact form with only email option | Some users prefer WhatsApp; a single channel creates friction for those who prefer the other | Offer both channels distinctly: a form for structured enquiries AND a WhatsApp link for instant contact |

---

## "Looks Done But Isn't" Checklist

- [ ] **Contact form:** Verify email delivery end-to-end from a real external email address, including spam folder check
- [ ] **Before/after gallery:** Verify consent acknowledgement field is mandatory and cannot be bypassed in the admin
- [ ] **Image uploads:** Verify that a 15 MB JPEG is rejected with a clear error message, not silently accepted
- [ ] **Admin authentication:** Verify that accessing `/gestion` (or whatever path) while logged out redirects to the login page, not a blank page or error
- [ ] **VPS deployment:** Verify the site comes back up automatically after a simulated reboot (`sudo reboot` test)
- [ ] **SEO basics:** Verify `<html lang="fr">`, page `<title>`, meta description, and `og:locale` on every public page
- [ ] **Performance:** Verify Resultats page loads under 3 seconds on a simulated 3G connection (Chrome DevTools throttling)
- [ ] **Redirects:** Verify that key old WordPress URLs (at minimum `/`, `/contact`) redirect with 301 to the new site
- [ ] **Responsive:** Verify every page on a real mobile device (or BrowserStack at iPhone 14 size), not just Chrome DevTools
- [ ] **WhatsApp link:** Verify the `wa.me/` link format is correct and opens a conversation on both mobile and desktop

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Admin too hard for Antoine to use | HIGH | Redesign admin UX, re-implement form flows, re-test — essentially rebuild the admin phase |
| GDPR / CNIL issue with published client photos | HIGH | Immediately unpublish affected photos; draft GDPR-compliant consent documentation; potentially notify CNIL proactively |
| VPS disk full from uncompressed uploads | MEDIUM | Compress and replace all uploaded images; add file size limits retroactively; may require manual cleanup |
| Site stays down after VPS reboot | LOW | SSH in, start PM2 / restart service, run `pm2 save` and `pm2 startup` — 30-minute fix, but embarrassing if discovered by Antoine |
| WordPress URL 404s after launch | MEDIUM | Audit old URLs from Google Search Console; add 301 redirects in Nginx config; resubmit sitemap — takes 2–4 hours plus days for Google to re-crawl |
| Contact form emails going to spam | MEDIUM | Set up transactional email provider; configure SPF/DKIM DNS records; notify Antoine to check spam and whitelist sender |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Admin UX too complex for non-technical user | Admin panel implementation phase | Walkthrough session with Antoine before sign-off |
| GDPR / CNIL on client photos | Before/after gallery phase | Consent field present and mandatory in admin; privacy policy page live |
| Uncompressed image uploads | Admin image upload implementation | 15 MB upload rejected; uploaded images are WebP and under 200 KB |
| Exposed admin routes | Auth/admin foundation phase | Unauthenticated requests to all admin routes return 302 to login |
| WordPress URL 404s after DNS cutover | Deployment / launch phase | 301 redirects verified for all key old URLs before cutover |
| No process manager on VPS | Infrastructure / deployment phase | VPS reboot test confirms auto-restart |
| Scope creep during build | All phases (milestone boundary discipline) | "Out of scope" items from PROJECT.md not present in any milestone deliverable |
| Missing French locale signals | Foundation / layout phase | `<html lang="fr">` and `og:locale` present in base layout |
| Contact form spam or delivery failure | Contact form phase | End-to-end delivery test; rate limiting verified; spam folder checked |

---

## Sources

- [WordPress to Next.js Migration: SEO Wins and Fails — Dashweb Agency](https://dashweb.agency/posts/migrating-wordpress-to-nextjs-seo-story)
- [Next.js Self-Hosting Guide — Official Next.js Docs](https://nextjs.org/docs/app/guides/self-hosting)
- [How to set up a CMS that will make non-technical users happy — TBH Creative](https://www.tbhcreative.com/blog/cms-setup-for-non-technical-users/)
- [Common Admin Panel Problems and Practical Solutions — Medium / AllPanel](https://medium.com/@allpanelexche/common-admin-panel-problems-and-practical-solutions-af3fa09dbe84)
- [How to build a secure admin panel — Aikido Security](https://www.aikido.dev/blog/build-secure-admin-panel)
- [5 Common Mistakes on Wellness Websites — Floating Lotus Design](https://floatinglotusdesign.com/blog/five-common-mistakes-on-wellness-websites)
- [GDPR for Images: Compliance Overview — GDPR Local](https://gdprlocal.com/gdpr-for-images/)
- [France Data Privacy Laws: GDPR & CNIL Compliance Guide 2026 — Recording Law](https://www.recordinglaw.com/world-data-privacy-laws/france-data-privacy-laws/)
- [Deploying a Next.js Website to a VPS — Dev.to / ardunster](https://dev.to/ardunster/deploying-a-nextjs-website-to-a-virtual-private-server-gpm)
- [Zero configuration Next.js deployment to VPS with Kamal — Ronald Ink](https://ronald.ink/zero-configuration-nextjs-deployment-to-a-self-hosted-vps-with-kamal-a-comprehensive-guide/)
- [Next.js i18n Multilingual SEO — eastondev.com](https://eastondev.com/blog/en/posts/dev/20251225-nextjs-i18n-seo/)
- [WhatsApp Integration for Websites — BotPenguin](https://botpenguin.com/blogs/how-to-integrate-whatsapp-in-website)
- [From Scope Creep to Scope Control — DEV Community](https://dev.to/michelle_turner/from-scope-creep-to-scope-control-managing-client-expectations-in-digital-projects-2ak0)

---
*Pitfalls research for: wellness coach showcase website (WordPress to modern framework rebuild)*
*Researched: 2026-04-01*
