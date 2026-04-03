# Phase 4: Formulaire de Contact - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Les visiteurs peuvent contacter Antoine via un formulaire email fonctionnel (nom, email, message) et un lien WhatsApp. La page /contact affiche le formulaire centre avec WhatsApp et reseaux sociaux en dessous. Un bouton WhatsApp flottant est visible sur toutes les pages. L'anti-spam repose sur un honeypot. Resend gere l'envoi email.

</domain>

<decisions>
## Implementation Decisions

### Page layout
- **D-01:** Page /contact avec formulaire centre (max-width), lien WhatsApp en dessous, puis icones reseaux sociaux (Instagram + Facebook)
- **D-02:** Pas de hero ni d'infos supplementaires (horaires, adresse) — page epuree et focalisee
- **D-03:** Reseaux sociaux : Instagram + Facebook affiches en icones simples sous le bloc WhatsApp
- **D-04:** Liens reseaux sociaux configurables par Antoine depuis l'admin (Global Payload avec les URLs Instagram/Facebook)

### WhatsApp integration
- **D-05:** Lien WhatsApp present sur la page /contact (bloc sous le formulaire) ET bouton flottant visible sur toutes les pages du site
- **D-06:** Numero WhatsApp et message pre-rempli configurables depuis un Global Payload (ex: "Bonjour Antoine, je suis interesse par vos services...")
- **D-07:** Le bouton flottant ouvre wa.me avec le meme numero et message pre-rempli que la page contact

### Confirmation UX
- **D-08:** Apres envoi du formulaire, message de succes inline remplacant le formulaire ("Merci, je vous reponds sous 24h" + icone check)
- **D-09:** Pas de page de confirmation separee, pas de redirect
- **D-10:** Pas d'email de confirmation automatique au visiteur — seul Antoine recoit l'email

### Anti-spam
- **D-11:** Honeypot seul — champ invisible rempli par les bots, ignore par les humains. Zero friction visiteur.
- **D-12:** Pas de reCAPTCHA ni de rate limiting — honeypot suffisant pour un site a faible trafic

### Claude's Discretion
- Design exact du bouton WhatsApp flottant (taille, position, animation)
- Style des icones reseaux sociaux (taille, espacement, hover effects)
- Textes placeholder du formulaire et message de succes exact
- Implementation technique du Global Payload (SiteSettings ou ContactSettings)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project docs
- `.planning/PROJECT.md` — Vision, contraintes, decisions cles du projet
- `.planning/REQUIREMENTS.md` — Requirements v1 traces par phase (CTCT-01, CTCT-02 pour Phase 4)
- `.planning/ROADMAP.md` — Phase 4 success criteria et dependances

### Prior phase context
- `.planning/phases/01-fondation/01-CONTEXT.md` — Identite visuelle, palette, typographie, modeles Payload, stockage images
- `.planning/phases/02-pages-publiques/02-CONTEXT.md` — Navigation, layout des pages, CTA contact dans Header/Footer
- `.planning/phases/03-interface-admin/03-CONTEXT.md` — Admin personnalise francais, Lexical basique, controle d'acces

### Existing code
- `src/components/layout/Header.tsx` — CTA "Me contacter" pointe deja vers /contact
- `src/components/layout/Footer.tsx` — Lien contact dans le footer
- `src/components/sections/CTABandeau.tsx` — Bandeau CTA "Prendre contact" vers /contact
- `src/app/globals.css` — Design tokens Tailwind v4 (palette, fonts, transitions)
- `src/payload.config.ts` — Configuration Payload CMS (collections, plugins, DB, storage)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Header et Footer ont deja des liens vers /contact — la page doit simplement exister a cette route
- Design tokens Tailwind v4 en place (bleu electrique #3B82F6 pour les CTA, vert energie #10B981)
- Payload CMS integre avec i18n francais (Phase 3)

### Established Patterns
- Pages publiques dans `src/app/(frontend)/` — route group frontend
- Sections de pages en composants dans `src/components/sections/`
- react-hook-form + Zod recommandes dans CLAUDE.md pour validation formulaire
- Resend recommande dans CLAUDE.md pour envoi email
- Server Actions pattern avec Next.js App Router

### Integration Points
- Route `/contact` dans le route group `(frontend)`
- Global Payload pour les parametres contact (WhatsApp, reseaux sociaux) — nouveau
- Server Action pour traiter le formulaire et envoyer via Resend
- Bouton WhatsApp flottant dans le layout racine ou le layout frontend

</code_context>

<specifics>
## Specific Ideas

- Icones reseaux sociaux simples (Instagram + Facebook) sous le bloc WhatsApp — style epure, coherent avec le reste du site
- Bouton WhatsApp flottant sur toutes les pages — acces immediat sans passer par /contact
- Global Payload pour centraliser tous les parametres contact (numero WhatsApp, message pre-rempli, URLs Instagram/Facebook)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-formulaire-de-contact*
*Context gathered: 2026-04-03*
