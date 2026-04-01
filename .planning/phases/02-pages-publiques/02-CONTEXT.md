# Phase 2: Pages Publiques - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Les 5 pages publiques du site (Accueil, Mon Histoire, Mes Services, Les Programmes, Resultats) sont visibles, navigables et responsives sur mobile, tablette et desktop. Navigation principale avec max 5 items. Bouton de contact visible sur chaque page. Chaque page charge en moins de 3 secondes sur connexion mobile.

</domain>

<decisions>
## Implementation Decisions

### Navigation & Layout
- **D-01:** Header sticky transparent — fond transparent sur le hero, fond solide au scroll (transition fluide)
- **D-02:** Navigation mobile en hamburger menu (menu plein ecran ou slide-in au tap)
- **D-03:** Footer minimal — logo, liens de navigation, lien contact et mentions legales
- **D-04:** Bouton CTA contact dans le header (bleu electrique, toujours visible) — satisfait PAGE-07

### Page Accueil
- **D-05:** Hero en layout split — texte (proposition de valeur + CTA) a gauche, image/photo a droite
- **D-06:** Sections sous le hero dans l'ordre : apercu services (3-4 cartes), texte de presentation (paragraphe + lien Mon Histoire), resultats en vedette (2-3 avant/apres), bandeau CTA final (pleine largeur)

### Page Mon Histoire
- **D-07:** Timeline verticale pour le parcours d'Antoine — etapes chronologiques en colonne, progression visuelle

### Page Mes Services
- **D-08:** Cartes cote a cote en grille (2-3 colonnes desktop, 1 colonne mobile) avec icone, titre, description et CTA

### Page Les Programmes
- **D-09:** Claude's Discretion — meme approche cartes que Mes Services, adapte aux champs Payload (titre, description, duree, objectifs, public cible)

### Page Resultats
- **D-10:** Slider comparatif avant/apres — curseur glissant sur image superposee pour chaque resultat
- **D-11:** Informations affichees par carte : slider avant/apres + citation client + prenom/programme/duree
- **D-12:** Layout en grille de cartes (2-3 colonnes desktop)
- **D-13:** Tout visible directement sur la carte — pas de modal ni de page detail

### Contenu placeholder
- **D-14:** Textes placeholder realistes en francais — contenu fictif mais credible (faux programmes, faux temoignages, faux parcours)
- **D-15:** Images placeholder en blocs de couleur de la palette avec icones/texte indicatif — pas de photos externes
- **D-16:** Donnees de demo chargees depuis Payload via un script seed — les pages consomment l'API Payload des le depart

### Claude's Discretion
- Style exact des animations au scroll (scroll reveal) et au hover — subtiles, coherentes avec D-05 de Phase 1
- Page Les Programmes : layout et details de presentation
- Breakpoints responsive exacts
- Composants UI a creer (structure des dossiers, nommage)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project docs
- `.planning/PROJECT.md` — Vision, contraintes, decisions cles du projet
- `.planning/REQUIREMENTS.md` — Requirements v1 traces par phase (PAGE-01 a PAGE-07, DSGN-02, DSGN-03 pour Phase 2)
- `.planning/ROADMAP.md` — Phase 2 success criteria et dependances

### Phase 1 context
- `.planning/phases/01-fondation/01-CONTEXT.md` — Identite visuelle, palette, typographie, modeles Payload, stockage images

### Existing code
- `src/app/globals.css` — Design tokens Tailwind v4 (@theme: couleurs, fonts, font sizes, transitions)
- `src/app/layout.tsx` — Root layout avec fonts Montserrat/Inter chargees
- `src/collections/Programmes.ts` — Schema collection Payload Programmes
- `src/collections/Resultats.ts` — Schema collection Payload Resultats (photos avant/apres multiples)
- `src/collections/PageContent.ts` — Schema collection Payload PageContent (sections editables)
- `src/collections/Media.ts` — Schema collection Payload Media
- `src/payload.config.ts` — Configuration Payload CMS

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Aucun composant UI existant — tout est a creer dans cette phase
- Design tokens Tailwind v4 definis dans `globals.css` (palette, fonts, transitions)
- Fonts Montserrat (headings) et Inter (body) chargees via `next/font` dans `layout.tsx`

### Established Patterns
- Tailwind CSS v4 avec `@theme` pour les tokens
- Font variables CSS (`--font-montserrat`, `--font-inter`) bridgees vers Tailwind
- Classes utilitaires Tailwind (ex: `font-heading`, `text-bleu-nuit`, `bg-blanc-pur`)

### Integration Points
- Collections Payload (Programmes, Resultats, PageContent, Media) fournissent les donnees via l'API locale Payload
- Root layout (`src/app/layout.tsx`) wrape toutes les pages — le header/footer s'y integrent
- Routes Next.js App Router dans `src/app/` — chaque page publique = un dossier route
- Vercel Blob pour le stockage des images uploadees

</code_context>

<specifics>
## Specific Ideas

- L'ambiance "Energie & Performance" (Phase 1) doit se refleter dans les pages : dynamique, moderne, coaching fitness
- Les titres Montserrat Bold donnent du "punch" — style fitness/coaching moderne
- Le slider avant/apres est un element central de la page Resultats — impact visuel fort pour la preuve sociale
- La page Accueil doit convaincre en quelques secondes : hero split + 4 sections (services, presentation, resultats, CTA)
- Le contenu seed dans Payload permet a Antoine de voir le workflow reel avant de remplacer par son propre contenu

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-pages-publiques*
*Context gathered: 2026-04-02*
