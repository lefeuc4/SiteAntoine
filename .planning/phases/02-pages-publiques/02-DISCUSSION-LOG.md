# Phase 2: Pages Publiques - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 02-pages-publiques
**Areas discussed:** Navigation & Layout, Hero & Accueil, Galerie Resultats, Contenu placeholder

---

## Navigation & Layout

### Style de navigation principale

| Option | Description | Selected |
|--------|-------------|----------|
| Header sticky transparent | Barre fixe en haut, fond transparent sur le hero puis fond solide au scroll | ✓ |
| Header fixe solide | Barre fixe avec fond bleu nuit permanent | |
| Header statique | Barre en haut de page, disparait au scroll | |

**User's choice:** Header sticky transparent (Recommande)

### Navigation mobile

| Option | Description | Selected |
|--------|-------------|----------|
| Hamburger menu | Icone hamburger qui ouvre un menu plein ecran ou slide-in | ✓ |
| Menu bottom bar | Barre de navigation fixe en bas de l'ecran avec icones | |
| Menu deroulant compact | Menu qui descend depuis le header au tap | |

**User's choice:** Hamburger menu (Recommande)

### Footer

| Option | Description | Selected |
|--------|-------------|----------|
| Footer minimal | Logo, liens de navigation, lien contact et mentions legales | ✓ |
| Footer riche | Multi-colonnes avec description, liens, reseaux sociaux, horaires, adresse | |
| Pas de footer visible | Juste un lien mentions legales discret en bas | |

**User's choice:** Footer minimal (Recommande)

### Bouton de contact persistant

| Option | Description | Selected |
|--------|-------------|----------|
| Dans le header | Bouton CTA bleu electrique toujours visible dans la barre de navigation | ✓ |
| Bouton flottant | Bouton rond fixe en bas a droite (style WhatsApp) | |
| Header + footer | CTA dans le header ET dans le footer | |

**User's choice:** Dans le header (Recommande)

---

## Hero & Accueil

### Style du hero

| Option | Description | Selected |
|--------|-------------|----------|
| Split hero | Texte a gauche (proposition de valeur + CTA) et image/photo a droite | ✓ |
| Hero plein ecran avec overlay | Grande image de fond couvrant tout l'ecran avec texte superpose | |
| Hero minimaliste texte | Fond couleur unie avec texte centre et CTA | |

**User's choice:** Split hero (Recommande)

### Sections page d'accueil

| Option | Description | Selected |
|--------|-------------|----------|
| Apercu services | 3-4 cartes resumant les services principaux | ✓ |
| Resultats en vedette | 2-3 avant/apres mis en avant | ✓ |
| Texte de presentation | Court paragraphe sur Antoine et sa philosophie | ✓ |
| Bandeau CTA final | Section pleine largeur en bas de page | ✓ |

**User's choice:** Toutes les options selectionnees (multiSelect)

### Page Mon Histoire

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline verticale | Parcours chronologique avec etapes cles en colonne | ✓ |
| Storytelling libre | Sections texte + images alternees | |
| Page simple texte | Texte long avec photos intercalees | |

**User's choice:** Timeline verticale (Recommande)

### Page Mes Services

| Option | Description | Selected |
|--------|-------------|----------|
| Cartes cote a cote | Grille de cartes (2-3 colonnes desktop, 1 mobile) | ✓ |
| Sections empilees | Chaque service en section pleine largeur | |
| Accordeon/FAQ style | Titres cliquables qui revelent le detail | |

**User's choice:** Cartes cote a cote (Recommande)

---

## Galerie Resultats

### Affichage avant/apres

| Option | Description | Selected |
|--------|-------------|----------|
| Slider comparatif | Curseur glissant sur image superposee avant/apres | ✓ |
| Side-by-side | Photos avant et apres cote a cote dans des cartes | |
| Cards avec modal | Grille de miniatures, clic ouvre un modal | |

**User's choice:** Slider comparatif (Recommande)

### Informations par resultat

| Option | Description | Selected |
|--------|-------------|----------|
| Citation client | La citation/temoignage du client en evidence | ✓ |
| Details du parcours | Prenom, programme suivi, duree | |
| Histoire complete | Texte rich text avec l'histoire detaillee | |
| Juste les photos | Avant/apres avec prenom uniquement | |

**User's choice:** Citation client (Recommande)
**Notes:** Prenom/programme/duree egalement inclus dans le layout final de la carte

### Organisation des resultats

| Option | Description | Selected |
|--------|-------------|----------|
| Grille de cartes | Cartes en grille (2-3 colonnes) avec slider + citation | ✓ |
| Liste verticale | Un resultat par rangee en pleine largeur | |
| Carousel horizontal | Resultats en carousel swipeable | |

**User's choice:** Grille de cartes (Recommande)

### Niveau de detail

| Option | Description | Selected |
|--------|-------------|----------|
| Tout sur la carte | Slider + citation + prenom/programme/duree visibles directement | ✓ |
| Modal au clic | Carte montre apercu, clic ouvre modal avec details | |
| Page dediee | Chaque resultat a sa propre page /resultats/[slug] | |

**User's choice:** Tout sur la carte (Recommande)

---

## Contenu placeholder

### Type de textes

| Option | Description | Selected |
|--------|-------------|----------|
| Textes realistes en francais | Contenu fictif mais credible | ✓ |
| Lorem ipsum | Texte latin classique | |
| Textes minimalistes | Juste les titres et quelques mots | |

**User's choice:** Textes realistes en francais (Recommande)

### Images placeholder

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholders colores | Blocs de couleur de la palette avec icones/texte indicatif | ✓ |
| Images libres de droits | Photos Unsplash/Pexels dans le theme fitness | |
| Zones grises vides | Rectangles gris avec dimension indiquee | |

**User's choice:** Placeholders colores (Recommande)

### Source du contenu

| Option | Description | Selected |
|--------|-------------|----------|
| Seed Payload | Donnees de demo injectees dans Payload via script seed | ✓ |
| En dur dans le code | Contenu hardcode dans les composants React | |
| Mixte | Pages dynamiques depuis Payload, pages statiques en dur | |

**User's choice:** Seed Payload (Recommande)

---

## Claude's Discretion

- Page Les Programmes : layout et details de presentation (approche cartes similaire a Mes Services)
- Animations scroll/hover : subtiles, coherentes avec identite "Energie & Performance"
- Breakpoints responsive exacts
- Structure des composants UI (dossiers, nommage)

## Deferred Ideas

None — discussion stayed within phase scope
