# Phase 3: Interface Admin - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Antoine peut gerer de maniere autonome les programmes, les resultats avant/apres et le contenu textuel et visuel de chaque page depuis l'admin Payload. L'admin est personnalise en francais, simplifie pour un utilisateur non-technique, avec un dashboard custom et un controle d'acces adapte.

</domain>

<decisions>
## Implementation Decisions

### Personnalisation admin
- **D-01:** Interface Payload entierement en francais — localisation i18n complete (boutons, menus, messages systeme) + labels/descriptions custom sur les champs des collections
- **D-02:** Dashboard custom avec raccourcis CRUD : boutons "Ajouter un programme", "Ajouter un resultat", "Modifier les pages" + compteurs simples (X programmes, Y resultats)
- **D-03:** Descriptions d'aide en francais sur chaque champ (ex: "Duree du programme, ex: 12 semaines") — pas de page d'aide separee

### Edition contenu pages
- **D-04:** Edition par sections Payload — chaque section de page est un enregistrement PageContent individuel (ex: "Accueil > Hero", "Accueil > Services"). Correspond a la structure existante.
- **D-05:** Structure fixee — les sections sont pre-creees par le seed. Antoine ne peut qu'editer titre/contenu/image. Pas de creation ni suppression de sections (access.create et access.delete bloques sur PageContent).
- **D-06:** Filtre par page dans la liste PageContent — Antoine clique sur un filtre (ex: "Accueil") et voit uniquement les sections de cette page. Utilise admin.listSearchableFields et filtres Payload.
- **D-07:** Editeur Lexical basique — gras, italique, listes a puces, liens. Pas de tableaux, pas de code, pas de couleurs. Evite les problemes de mise en page.

### Conversion WebP & uploads
- **D-08:** Pas de conversion WebP cote serveur — next/image gere automatiquement le WebP au rendu cote visiteur (deja en place). Les images sont stockees en format original sur Vercel Blob. ADMN-05 satisfait cote affichage.
- **D-09:** Limite de taille upload a 5 MB — validation Payload avec message d'erreur en francais si depasse.

### Controle d'acces
- **D-10:** 4 collections visibles dans la sidebar : Programmes, Resultats, Contenu des pages, Media. Antoine peut gerer/supprimer ses images directement via Media.
- **D-11:** Collection Users masquee de la sidebar — Antoine change son mot de passe via le menu profil Payload (en haut a droite, integre par defaut).
- **D-12:** PageContent en lecture + edition seule — Antoine peut modifier les sections existantes mais pas en creer ni en supprimer. Empeche de casser la structure des pages.

### Claude's Discretion
- Layout exact du dashboard custom (placement des boutons, style des compteurs)
- Organisation des groupes de collections dans la sidebar admin
- Details d'implementation des filtres PageContent

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project docs
- `.planning/PROJECT.md` — Vision, contraintes, decisions cles du projet
- `.planning/REQUIREMENTS.md` — Requirements v1 traces par phase (ADMN-01 a ADMN-05 pour Phase 3)
- `.planning/ROADMAP.md` — Phase 3 success criteria et dependances

### Prior phase context
- `.planning/phases/01-fondation/01-CONTEXT.md` — Identite visuelle, palette, typographie, modeles Payload, stockage images (D-08 a D-16)
- `.planning/phases/02-pages-publiques/02-CONTEXT.md` — Navigation, layout des pages, contenu placeholder, structure PageContent

### Existing code
- `src/payload.config.ts` — Configuration Payload CMS (collections, plugins, DB, storage)
- `src/collections/Programmes.ts` — Schema collection Programmes (champs, access)
- `src/collections/Resultats.ts` — Schema collection Resultats (photos avant/apres, consentement CNIL)
- `src/collections/PageContent.ts` — Schema collection PageContent (page, section, titre, contenu, image)
- `src/collections/Media.ts` — Schema collection Media (mimeTypes, imageSizes, clientUploads)
- `src/collections/Users.ts` — Schema collection Users (auth Payload)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Collections Payload deja definies : Programmes, Resultats, PageContent, Media, Users — champs et relations en place
- Design tokens Tailwind v4 dans `src/app/globals.css` — palette, fonts, transitions (pour le dashboard custom si besoin)
- Composants UI existants : `ProgrammeCard`, `ResultatCard`, `ServiceCard`, `BeforeAfterSlider` (cote public, pas admin)

### Established Patterns
- Payload CMS 3 integre dans Next.js App Router — admin a `/admin`
- `clientUploads: true` sur Vercel Blob — uploads directs du navigateur vers Blob
- Lexical editor par defaut (`lexicalEditor()` dans payload.config.ts)
- Collections avec `access.read: () => true` pour l'API publique

### Integration Points
- `src/payload.config.ts` — point central pour ajouter la localisation i18n, modifier les access, configurer les groups
- Chaque collection `.ts` — ajout de labels francais, descriptions, admin.hidden, access.create/delete
- Dashboard custom via Payload `admin.components.afterDashboard` ou custom views
- Rich text editor Lexical — configuration des features (gras, italique, listes, liens) dans payload.config.ts ou par collection

</code_context>

<specifics>
## Specific Ideas

- Antoine est un utilisateur non-technique — l'admin doit etre intuitif, pas un CMS generique
- La localisation complete en francais est essentielle — Antoine ne doit jamais voir de boutons en anglais
- Le dashboard avec raccourcis CRUD remplace la vue par defaut Payload et guide Antoine vers les actions frequentes
- La structure fixee des sections de page protege le layout public contre les modifications accidentelles
- L'editeur Lexical basique empeche Antoine de casser le design avec du formatage complexe

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-interface-admin*
*Context gathered: 2026-04-02*
