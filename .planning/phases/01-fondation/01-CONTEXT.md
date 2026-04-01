# Phase 1: Fondation - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Bootstrap du projet Next.js 16 + Payload CMS 3 + Neon PostgreSQL + Tailwind CSS 4. Le projet tourne localement avec `npm run dev`, l'admin Payload est accessible a `/admin`, les collections sont definies et migrees, et l'identite visuelle (palette, typo) est configuree dans le design system Tailwind.

</domain>

<decisions>
## Implementation Decisions

### Identite visuelle
- **D-01:** Ambiance "Energie & Performance" — tons sombres avec accents vifs, dynamique et moderne
- **D-02:** Palette : bleu nuit (#0F172A), bleu electrique (#3B82F6), vert energie (#10B981), blanc pur (#F8FAFC), gris ardoise (#64748B)
- **D-03:** Fond clair dominant avec accents bleu nuit — pas de mode sombre
- **D-04:** Boutons CTA en bleu electrique (#3B82F6) plein avec texte blanc
- **D-05:** Animations subtiles au scroll et hover (scroll reveal, hover effects legers)

### Typographie
- **D-06:** Titres en Montserrat Bold/Black — police impactante pour les headings
- **D-07:** Corps de texte en Inter Regular — lisible et moderne

### Modeles de donnees Payload
- **D-08:** Collection Programmes : champs basiques — titre, description (rich text), duree, objectifs, public cible, image de couverture, ordre d'affichage
- **D-09:** Collection Resultats : multiples photos avant et multiples photos apres par resultat (pas juste 1+1) — permet differents angles ou etapes
- **D-10:** Collection Resultats : champs — prenom client, histoire (rich text), programme suivi (texte libre, pas de relation), duree, citation, consentement CNIL (obligatoire), photos avant (array), photos apres (array)
- **D-11:** Programmes et Resultats sont independants — le champ "programme suivi" dans Resultats est un texte libre, pas une relation Payload
- **D-12:** Collection PageContent structuree par sections editables — chaque page decoupee en sections (hero, intro, services...) qu'Antoine modifie individuellement

### Stockage images
- **D-13:** Vercel Blob pour le stockage des images uploadees (photos avant/apres, couvertures programmes)
- **D-14:** Compression WebP automatique via next/image pour le rendu (ADMN-05)

### Setup projet
- **D-15:** Base de donnees Neon PostgreSQL en dev et en prod — pas de Docker Compose local
- **D-16:** `npm run dev` suffit pour lancer le projet localement (pas besoin de conteneurs)

### Claude's Discretion
- Choix du gestionnaire de paquets (pnpm recommande par Payload, npm acceptable)
- Structure des dossiers du projet
- Configuration ESLint/Prettier
- Details d'implementation des animations (librairie, timing, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in:

### Project docs
- `.planning/PROJECT.md` — Vision, contraintes, decisions cles du projet
- `.planning/REQUIREMENTS.md` — Requirements v1 traces par phase (DSGN-01, DPLY-01 pour Phase 1)
- `.planning/ROADMAP.md` — Phase 1 success criteria et dependances

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Aucun code existant — projet greenfield

### Established Patterns
- Aucun pattern etabli — cette phase definit les conventions fondatrices

### Integration Points
- Payload CMS s'installe dans le dossier `/app` de Next.js (pas de process separe)
- L'admin est servie a `/admin` par Payload dans Next.js
- Neon PostgreSQL via `@payloadcms/db-postgres`
- Vercel Blob via l'adaptateur de stockage Payload

</code_context>

<specifics>
## Specific Ideas

- L'ambiance "Energie & Performance" doit evoquer la transformation physique et la discipline — pas un spa zen
- Les titres Montserrat Bold doivent donner du "punch" — style fitness/coaching moderne
- Pas de reference visuelle specifique citee — design original base sur la palette definie

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-fondation*
*Context gathered: 2026-04-01*
