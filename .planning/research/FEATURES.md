# Feature Research

**Domain:** Wellness coach / personal trainer showcase website (site vitrine)
**Researched:** 2026-04-01
**Confidence:** HIGH (multiple authoritative sources cross-verified)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = site feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with clear value proposition | 94% of visitors decide to stay or leave based on above-the-fold content; if it's unclear what the coach does within 3 seconds, they leave | LOW | Headline + subtext + primary CTA; no scrolling required to understand the offer |
| Mobile-responsive design | 60%+ of fitness site traffic is mobile; Google uses mobile-first indexing; poor mobile = ranking penalty | LOW | Must be mobile-first, not mobile-adapted after the fact |
| Page load < 3 seconds | 47% expect load in ≤2 seconds; 40% abandon if > 3 seconds | MEDIUM | No heavy plugins, compressed images, lean JS bundle |
| About / personal story page | Coaches sell trust and personality — visitors need to connect with who they're hiring | LOW | "Mon Histoire" page maps directly to this expectation |
| Services page with clear descriptions | Visitors won't inquire if they don't understand what's offered and for whom | LOW | "Mes Services" covers this; must be specific, not generic marketing language |
| Social proof / testimonials | Conversion pages with testimonials convert 2.5x better; coach sites live or die on trust | MEDIUM | Photos + names + specific results — not anonymous or vague quotes |
| Before/after transformation gallery | Industry standard for fitness/coaching — concrete proof of results expected | MEDIUM | "Résultats" page; specific outcomes ("lost 15kg in 12 weeks") > generic praise |
| Visible contact path on every page | Hidden contact info prevents conversions; visitors need it reachable from any point | LOW | Contact link in nav + CTA buttons throughout pages |
| Contact form | Baseline way for passive prospects to reach out without committing to a call | LOW | Email or WhatsApp; minimal fields to reduce friction |
| Clear navigation (max 5-6 items) | Overcomplicated menus cause abandonment; visitors shouldn't have to figure out where to go | LOW | 5-page structure is naturally within the sweet spot |
| Consistent visual identity | Outdated or incoherent design signals unprofessionalism; damages credibility before reading | MEDIUM | New identity (not the current pink/red WordPress look) |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued by visitors who compare options.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Full transformation stories (not just quotes) | Most coach sites show a photo + one sentence; full stories (program followed, duration, before/after photos, client's own words) dramatically increase emotional impact and credibility | MEDIUM | "Résultats" page is designed around this — this is Antoine's main differentiator vs competitors who show lazy testimonials |
| Programs page with structured details | Visitors comparison-shop; showing duration, content, and goals makes Antoine's offering concrete vs competitors who only say "book a call to learn more" | LOW | "Les Programmes" page — specify duration, what's included, who it's for |
| Personal timeline / storytelling page | Coaches who reveal their own journey (why they got into this, struggles overcome) convert better than those with a generic bio | LOW | "Mon Histoire" timeline approach — differentiating when done authentically |
| Admin-managed content (no developer needed) | Site stays current; stale sites with old testimonials or outdated info signal a coach who isn't active | HIGH | This is the core technical differentiator of the project; competitors on WordPress often let content go stale |
| Fast, lightweight site vs WordPress competitors | Speed is a competitive signal (Google ranking + UX); most coach sites run bloated WordPress themes | MEDIUM | Replacing the current WooCommerce/Revolution Slider stack with a lean custom build |
| Specific, results-focused copywriting | Generic fitness language ("transform your life") is invisible; specific outcomes ("lose 8kg in 10 weeks, feel energized") create differentiation | LOW | Copy is Antoine's responsibility, but the site structure should guide him toward specificity |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this project specifically.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Online booking / Calendly integration | Looks modern, reduces friction for assertive clients | Passive prospects (typical wellness audience) are intimidated by direct scheduling without prior conversation; also adds external dependency and potential cost | Contact form is the right v1 approach; Antoine can add Calendly later once he identifies he has assertive clients |
| E-commerce / payment | Enables direct sales | Adds PCI compliance concerns, payment provider integration complexity, order management — none of which Antoine needs for v1 since he sells through personal contact | Contact → invoice workflow outside the site |
| Blog / article section | Establishes authority, SEO benefits | Requires Antoine to produce content regularly; empty or stale blog signals inactivity worse than no blog; massive scope addition for v1 | Defer to v2; invest that effort in testimonial quality instead |
| Video backgrounds / hero video | Visual impact, "premium" feel | Heavy to load, complex to compress correctly, needs re-encoding for mobile, slows page significantly | High-quality static photo of Antoine in action; far easier to maintain and perform better on mobile |
| Chatbot / live chat | Instant engagement | Adds third-party dependency (Intercom, Crisp, etc.), monthly cost, requires Antoine to be responsive; passive visitors are better served by a clear contact form | Clear contact form with fast expected response time stated |
| Client login / dashboard | Feels like "full platform" | Antoine's clients don't need a portal for a coaching showcase site; creates auth complexity, account management, password reset flows | Out of scope by design; clients interact via messaging/email |
| Multi-language (EN/FR) | Broader reach | Antoine's audience is explicitly francophone; doubles content management overhead; adds translation maintenance burden | French only; explicit project constraint |
| Social media feed embed | Keeps site "fresh" without effort | Third-party API dependency (Instagram, Facebook), frequent API changes break embeds, privacy compliance (GDPR) complications | Link to social profiles in footer/nav; don't embed |
| Star ratings / review widgets | Social proof aggregation | Third-party dependency (Google Reviews, Trustpilot), GDPR implications, risk of negative reviews Antoine can't control | Curated testimonials on the Résultats page give full editorial control |

## Feature Dependencies

```
[Admin authentication]
    └──required by──> [Admin panel]
                          ├──required by──> [Edit page content]
                          ├──required by──> [Manage programs (CRUD)]
                          └──required by──> [Manage results / avant-après (CRUD)]

[Programs data model]
    └──feeds into──> [Les Programmes page]
    └──referenced by──> [Résultats (program followed field)]

[Résultats data model (photos + story + program + duration + quote)]
    └──feeds into──> [Résultats page]

[Contact form]
    └──depends on──> [Email delivery (SMTP or service)]

[Hero CTA]
    └──links to──> [Contact form]

[Responsive layout system]
    └──required by──> ALL public pages
```

### Dependency Notes

- **Admin authentication required before all admin features:** Even a simple single-user password login must be in place before any content editing can be built — no admin panel works without a session gate.
- **Programs data model before Les Programmes page:** The page is a rendering of structured data; the data model and storage must be decided before the UI.
- **Programs model referenced in Résultats:** Each client result links to the program they followed. Programs must exist first (or be nullable in v1 if they're added later).
- **Contact form requires email delivery:** Sending form submissions needs an SMTP config or transactional email service (Resend, Mailgun, etc.). This is a deployment concern, not just a feature.
- **Résultats data model is richer than Programs:** Each result entry needs: before photo, after photo, client name/story, program followed, duration, quote. This is the most complex content type to model.

## MVP Definition

### Launch With (v1)

Minimum viable for the site to serve its purpose: convert visitors into contact inquiries.

- [ ] Hero section with clear CTA — first thing visitors see; drives all conversions
- [ ] Mon Histoire page with personal timeline — trust and connection before services
- [ ] Mes Services page — clear what's offered, for whom, how to proceed
- [ ] Les Programmes page — structured program cards with duration, content, goals
- [ ] Résultats page with full transformation stories — highest-impact social proof
- [ ] Contact form (email + WhatsApp link) — single conversion action for v1
- [ ] Admin login (single user, password-based) — gates all admin features
- [ ] Admin: edit page content (text + images per page) — Antoine's autonomy requirement
- [ ] Admin: CRUD for programmes — create/edit/delete program listings
- [ ] Admin: CRUD for résultats — create/edit/delete transformation stories with photos
- [ ] Mobile-first responsive layout — non-negotiable given 60%+ mobile traffic
- [ ] Performance: < 3s load, lean bundle — replaces the slow WordPress stack

### Add After Validation (v1.x)

Add when Antoine has real clients using the site and has validated the contact workflow.

- [ ] Online booking link (Calendly embed or link) — trigger: Antoine says contact-first approach creates too much back-and-forth scheduling
- [ ] Video testimonials — trigger: Antoine collects video content from clients
- [ ] Instagram profile link in footer — trigger: Antoine has an active, maintained profile
- [ ] SEO metadata management in admin — trigger: Antoine wants to improve Google ranking

### Future Consideration (v2+)

Defer until the site is validated and Antoine's audience and workflow are understood.

- [ ] Blog / article section — requires Antoine to produce content regularly; big scope
- [ ] Lead magnet (free PDF / guide opt-in) — requires email list infrastructure
- [ ] Multi-program comparison page — only needed if program catalog grows significantly
- [ ] Analytics dashboard in admin — trigger: Antoine wants to understand traffic sources

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero + CTA | HIGH | LOW | P1 |
| Mobile-responsive layout | HIGH | MEDIUM | P1 |
| Résultats page (transformation stories) | HIGH | MEDIUM | P1 |
| Contact form | HIGH | LOW | P1 |
| Mes Services page | HIGH | LOW | P1 |
| Admin: CRUD résultats | HIGH | HIGH | P1 |
| Mon Histoire timeline | MEDIUM | LOW | P1 |
| Les Programmes page | MEDIUM | MEDIUM | P1 |
| Admin: CRUD programmes | MEDIUM | MEDIUM | P1 |
| Admin: edit page content | MEDIUM | HIGH | P1 |
| Admin login / auth | LOW (technical req) | MEDIUM | P1 |
| Page load performance | HIGH | MEDIUM | P1 |
| Online booking link | MEDIUM | LOW | P2 |
| SEO metadata admin | MEDIUM | MEDIUM | P2 |
| Video testimonials | MEDIUM | LOW | P2 |
| Blog section | MEDIUM | HIGH | P3 |
| Lead magnet / email capture | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

Research looked at typical French wellness coach sites (antoineprofit.com current state, amycoachbienetre.com, moncoachbienetre.fr) and international personal trainer sites (via sitebuilderreport.com, vibeotter.com analysis).

| Feature | Typical Competitor | Antoine's Target |
|---------|-------------------|------------------|
| Testimonials | 1-2 sentence quotes, often anonymous | Full transformation stories: photos, program, duration, own words — far richer |
| Programs listing | "Contact me to learn more" with minimal detail | Structured cards: duration, content, goals, who it's for |
| Personal story | Generic 2-paragraph bio | Timeline-based narrative storytelling |
| Content freshness | Often stale (WordPress sites with outdated plugins) | Admin panel enables Antoine to update independently |
| Performance | Heavy (WordPress + Visual Composer + WooCommerce) | Lean custom build, < 3s load |
| Contact | Buried in footer or contact page only | CTA on every page, always visible |

## Sources

- [11 Must-Have Features of Personal Trainer Websites — Small Business Web](https://smallbusinessweb.co/features-of-personal-trainer-website/)
- [16 Best Personal Trainer Website Examples and Best Practices — Vibe Otter](https://vibeotter.com/blog/personal-trainer-websites-best-practices.html)
- [Top 10 Fitness Website Design Mistakes — MyPersonalTrainerWebsite](https://mypersonaltrainerwebsite.com/blog/fitness-website-design-mistakes)
- [Should I Use A Contact Page or Booking Page? — Lovely Impact](https://lovelyimpact.com/should-i-use-a-contact-page-or-booking-page-on-my-coaching-website/)
- [10 Wellness Website Examples — Elementor](https://elementor.com/blog/wellness-website-examples/)
- [Personal Trainer Websites: 31 Inspiring Examples — SiteBuilderReport](https://www.sitebuilderreport.com/inspiration/personal-trainer-websites)
- [Création Site Internet Coach Sportif — Webconceptor (French market)](https://webconceptor.com/creation-site-internet-coach-sportif/)
- [Création site web coach 2026 — Revue Positif (French market)](https://www.revue-positif.net/creation-site-web-coach-developpement-personnel-2026/)

---
*Feature research for: wellness coach showcase website (site vitrine)*
*Researched: 2026-04-01*
