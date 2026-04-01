# Phase 1: Fondation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 01-fondation
**Areas discussed:** Identite visuelle, Modeles de donnees, Stockage images, Setup projet

---

## Identite visuelle

### Ambiance

| Option | Description | Selected |
|--------|-------------|----------|
| Nature & Serenite | Tons verts/beiges, ambiance zen et organique | |
| Energie & Performance | Tons sombres avec accents vifs, coaching fitness/transformation | ✓ |
| Elegance Minimaliste | Tons neutres chauds, typo elegante, coaching premium | |
| Chaleureux & Accessible | Tons chauds et lumineux, coaching bienveillant | |

**User's choice:** Energie & Performance
**Notes:** Palette bleu nuit, bleu electrique, vert energie, blanc pur, gris ardoise

### Typographie

| Option | Description | Selected |
|--------|-------------|----------|
| Sans-serif moderne | Inter Bold/Black pour tout — clean et neutre | |
| Titres impactants + corps lisible | Montserrat Bold titres + Inter Regular corps | ✓ |
| Tu decides | Claude choisit | |

**User's choice:** Titres impactants + corps lisible
**Notes:** Montserrat Bold/Black pour les headings, Inter Regular pour le corps

### Mode couleur

| Option | Description | Selected |
|--------|-------------|----------|
| Fond clair | Fond blanc/clair avec accents sombres — standard site vitrine | ✓ |
| Fond sombre | Fond bleu nuit dominant — immersif style sport | |
| Mix hero sombre + contenu clair | Hero et sections cles en sombre, reste en clair | |

**User's choice:** Fond clair
**Notes:** None

### Boutons CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Bleu electrique plein | #3B82F6 avec texte blanc — visibles et dynamiques | ✓ |
| Vert energie plein | #10B981 avec texte blanc — action positive | |
| Tu decides | Claude choisit | |

**User's choice:** Bleu electrique plein
**Notes:** None

### References visuelles

| Option | Description | Selected |
|--------|-------------|----------|
| Non, pas de reference | Partir des choix faits sans modele specifique | ✓ |
| Oui, j'en ai | URLs ou noms de sites en inspiration | |

**User's choice:** Non, pas de reference
**Notes:** Design original

### Animations

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, subtiles | Animations legeres au scroll et hover | ✓ |
| Non, statique | Pas d'animations | |
| Tu decides | Claude decide selon le contexte | |

**User's choice:** Oui, subtiles
**Notes:** None

---

## Modeles de donnees

### Collection Programmes

| Option | Description | Selected |
|--------|-------------|----------|
| Basique | Titre, description, duree, objectifs, public cible, image, ordre | ✓ |
| Detaille | Basique + prix, nb seances, frequence, prerequis, temoignages lies | |
| Tu decides | Claude definit selon requirements | |

**User's choice:** Basique
**Notes:** None

### Photos Resultats

| Option | Description | Selected |
|--------|-------------|----------|
| 1 avant + 1 apres | Une paire de photos simple | |
| Multiples photos | Plusieurs photos avant et apres | ✓ |
| Tu decides | Claude choisit | |

**User's choice:** Multiples photos
**Notes:** Permet differents angles ou etapes de transformation

### Granularite contenu pages

| Option | Description | Selected |
|--------|-------------|----------|
| Par section | Chaque page decoupee en sections editables | ✓ |
| Page entiere rich text | Un seul bloc rich text par page | |
| Tu decides | Claude choisit | |

**User's choice:** Par section
**Notes:** Antoine modifie section par section

### Relations Programme-Resultat

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, lies | Relation Payload entre resultat et programme | |
| Non, independants | Programme suivi = texte libre | ✓ |
| Tu decides | Claude choisit | |

**User's choice:** Non, independants
**Notes:** Plus simple, texte libre suffit

---

## Stockage images

### Solution de stockage

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel Blob | Integre Vercel, simple, gratuit jusqu'a 1 Go | ✓ |
| Cloudinary | CDN + transformations, gratuit 25 Go bande passante | |
| Upload local Payload | Filesystem — non compatible Vercel serverless | |

**User's choice:** Vercel Blob
**Notes:** None

---

## Setup projet

### Base de donnees dev

| Option | Description | Selected |
|--------|-------------|----------|
| Neon direct | Neon gratuit meme en dev, pas besoin de Docker | ✓ |
| Docker Compose | PostgreSQL local via Docker | |
| Tu decides | Claude choisit | |

**User's choice:** Neon direct
**Notes:** Pas de Docker, simplifie le setup

### Gestionnaire de paquets

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm | Recommande par Payload, plus rapide | |
| npm | Standard, pas d'installation supplementaire | |
| Tu decides | Claude choisit | ✓ |

**User's choice:** Tu decides
**Notes:** Claude a discretion — pnpm recommande par Payload

---

## Claude's Discretion

- Gestionnaire de paquets (pnpm vs npm)
- Structure des dossiers du projet
- Configuration ESLint/Prettier
- Details d'implementation des animations

## Deferred Ideas

None — discussion stayed within phase scope
