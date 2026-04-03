# Phase 5: SEO, Conformite & Deploiement - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Mettre le site en production sur Vercel avec HTTPS et domaine personnalise antoineprofit.com. Configurer le SEO de base (meta tags, structure semantique, sitemap). Implementer la conformite RGPD (bandeau cookies, mentions legales, consentement CNIL photos). Configurer les redirections 301 depuis les anciennes URLs WordPress.

</domain>

<decisions>
## Implementation Decisions

### Redirections WordPress (SEO-02)
- **D-01:** L'ancien site antoineprofit.com est encore en ligne — scraper les URLs principales avant coupure pour configurer les redirections 301
- **D-02:** Pas d'inventaire existant des URLs — le researcher devra extraire les URLs depuis le site WordPress live
- **D-03:** Redirections configurees dans next.config.ts (section `redirects`) ou vercel.json

### Bandeau cookies RGPD (LGAL-01)
- **D-04:** Vercel Analytics comme solution d'analytics — leger, gratuit, pas de cookies tiers
- **D-05:** Bandeau simple en bas de page — barre discrete avec texte + boutons Accepter/Refuser. Pas de popup modale, pas de categories de cookies (overkill sans cookies tiers)
- **D-06:** Le bandeau est principalement informatif puisque Vercel Analytics ne necessite pas de consentement cookie, mais il satisfait l'obligation RGPD d'information

### Mentions legales (LGAL-02)
- **D-07:** Statut juridique d'Antoine: auto-entrepreneur / micro-entreprise — mentions legales simplifiees (nom, SIRET, adresse)
- **D-08:** Contenu avec placeholders [A COMPLETER] — Antoine remplira les infos reelles plus tard
- **D-09:** Mentions legales editables via admin Payload — Global "MentionsLegales" avec editeur rich text, coherent avec l'approche du reste du site

### Consentement CNIL photos (LGAL-03)
- **D-10:** Ajouter un champ boolean obligatoire "consentement" dans la collection Resultats de Payload — Antoine doit cocher avant de publier une photo client

### SEO de base (SEO-01)
- **D-11:** Toutes les pages ont deja des exports Metadata Next.js — enrichir avec description, Open Graph, et structure semantique
- **D-12:** Ajouter sitemap.xml et robots.txt via les conventions Next.js (app/sitemap.ts, app/robots.ts)

### Deploiement Vercel (DPLY-02)
- **D-13:** Rien n'est configure — il faudra documenter: creer repo GitHub, creer projet Vercel, connecter, configurer variables d'environnement
- **D-14:** Domaine gere chez OVH — configurer DNS OVH pour pointer vers Vercel (CNAME ou nameservers Vercel)
- **D-15:** Le deploiement inclut la migration des variables d'environnement (.env.local → Vercel Environment Variables)

### Claude's Discretion
- Choix technique entre redirections dans next.config.ts vs vercel.json
- Implementation technique du bandeau cookies (composant client avec localStorage)
- Structure exacte du Global MentionsLegales dans Payload
- Configuration Vercel Analytics (@vercel/analytics)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Deploiement
- `.planning/ROADMAP.md` §Phase 5 — Success criteria and requirements
- `.planning/REQUIREMENTS.md` — SEO-01, SEO-02, LGAL-01, LGAL-02, LGAL-03, DPLY-02 acceptance criteria

### Codebase existant
- `next.config.ts` — Current Next.js config, needs redirects section
- `src/app/layout.tsx` — Root layout with metadata, needs OG tags enrichment
- `src/collections/Resultats.ts` — Collection where consent field must be added
- `src/globals/ContactSettings.ts` — Pattern for Payload Globals (reuse for MentionsLegales)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- All 6 frontend pages already export `Metadata` — need enrichment, not creation
- `ContactSettings` Global pattern (src/globals/ContactSettings.ts) — reuse for MentionsLegales Global
- Payload config (src/payload.config.ts) — already registers globals, add new one

### Established Patterns
- Payload Globals for admin-editable site-wide content (ContactSettings precedent)
- Next.js Metadata exports per page for SEO
- Frontend layout fetches Globals server-side (async layout pattern)

### Integration Points
- `next.config.ts` — add `redirects()` function for WordPress 301s
- `src/app/layout.tsx` — add Vercel Analytics script
- `src/collections/Resultats.ts` — add consent boolean field
- New page: `src/app/(frontend)/mentions-legales/page.tsx`
- New files: `src/app/sitemap.ts`, `src/app/robots.ts`

</code_context>

<specifics>
## Specific Ideas

- Scraper l'ancien site WordPress (antoineprofit.com) pendant la phase de recherche pour extraire les URLs a rediriger
- Le bandeau cookies doit etre en francais, discret, et coherent avec le design system existant (couleurs bleu-nuit, vert-energie, etc.)
- Les mentions legales doivent mentionner l'hebergeur (Vercel Inc.) conformement a la loi francaise

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-seo-conformite-deploiement*
*Context gathered: 2026-04-03*
