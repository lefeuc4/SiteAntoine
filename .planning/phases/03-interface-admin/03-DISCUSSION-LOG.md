# Phase 3: Interface Admin - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 03-interface-admin
**Areas discussed:** Personnalisation admin, Edition contenu pages, Conversion WebP, Controle d'acces

---

## Personnalisation admin

### Niveau de personnalisation

| Option | Description | Selected |
|--------|-------------|----------|
| Francais + simplifie | Labels francais, dashboard custom avec raccourcis, sections techniques masquees | ✓ |
| Francais seulement | Labels francais mais dashboard et navigation Payload par defaut | |
| Admin Payload par defaut | Aucune personnalisation, interface en anglais | |

**User's choice:** Francais + simplifie
**Notes:** Antoine doit voir uniquement ce dont il a besoin, interface completement adaptee.

### Dashboard custom

| Option | Description | Selected |
|--------|-------------|----------|
| Raccourcis CRUD | Boutons directs "Ajouter un programme", "Ajouter un resultat", "Modifier les pages" + compteurs | ✓ |
| Dashboard minimal | Juste les liens vers les 3 collections | |
| Tu decides | Claude choisit le layout | |

**User's choice:** Raccourcis CRUD

### Localisation i18n

| Option | Description | Selected |
|--------|-------------|----------|
| Tout en francais | Localisation Payload complete (boutons, menus, messages) + labels custom | ✓ |
| Labels custom seulement | Interface Payload en anglais, noms de champs en francais | |

**User's choice:** Tout en francais

### Aide contextuelle

| Option | Description | Selected |
|--------|-------------|----------|
| Descriptions sur les champs | Chaque champ a une description claire en francais | ✓ |
| Aucune aide | Les noms de champs suffisent | |
| Tu decides | Claude juge ou les descriptions sont utiles | |

**User's choice:** Descriptions sur les champs

---

## Edition contenu pages

### Methode d'edition

| Option | Description | Selected |
|--------|-------------|----------|
| Sections Payload | Chaque section de page = un enregistrement Payload individuel | ✓ |
| Page complete | Toutes les sections d'une page dans un seul formulaire | |
| Live preview | Apercu en temps reel a cote du formulaire d'edition | |

**User's choice:** Sections Payload

### Verrouillage structure

| Option | Description | Selected |
|--------|-------------|----------|
| Structure fixee | Sections pre-creees, Antoine ne peut qu'editer titre/contenu/image | ✓ |
| Structure libre | Antoine peut creer, supprimer et reordonner les sections | |
| Tu decides | Claude choisit le niveau de verrouillage | |

**User's choice:** Structure fixee

### Navigation dans PageContent

| Option | Description | Selected |
|--------|-------------|----------|
| Filtre par page | Filtre/vue groupee par page dans l'admin | ✓ |
| Label combine | useAsTitle affiche "Accueil - Hero" etc. dans une liste plate | |
| Tu decides | Claude choisit | |

**User's choice:** Filtre par page

### Editeur rich text

| Option | Description | Selected |
|--------|-------------|----------|
| Basique | Gras, italique, listes a puces, liens. Pas de tableaux ni code | ✓ |
| Complet | Tous les outils Lexical par defaut | |
| Tu decides | Claude choisit les outils adaptes | |

**User's choice:** Basique

---

## Conversion WebP

### Strategie WebP

| Option | Description | Selected |
|--------|-------------|----------|
| next/image suffit | Images stockees en format original, WebP au rendu cote visiteur | ✓ |
| Hook Payload + Sharp | Conversion serveur via afterChange hook | |
| Limiter les formats | N'accepter que WebP dans mimeTypes | |

**User's choice:** next/image suffit

### Limite de taille upload

| Option | Description | Selected |
|--------|-------------|----------|
| Limite 5 MB | Validation Payload avec message d'erreur en francais | ✓ |
| Pas de limite | Laisser uploader sans contrainte | |
| Tu decides | Claude choisit une limite raisonnable | |

**User's choice:** Limite 5 MB

---

## Controle d'acces

### Collections visibles

| Option | Description | Selected |
|--------|-------------|----------|
| 3 collections | Programmes, Resultats, Contenu des pages. Media et Users masquees | |
| 4 collections + Media | Programmes, Resultats, Contenu des pages + Media visible | ✓ |
| Tout visible | Toutes les collections sans restriction | |

**User's choice:** 4 collections + Media

### Permissions PageContent

| Option | Description | Selected |
|--------|-------------|----------|
| Lecture + edition seule | Modifier les sections existantes, pas creer ni supprimer | ✓ |
| CRUD complet | Creer, modifier et supprimer des sections | |

**User's choice:** Lecture + edition seule

### Collection Users

| Option | Description | Selected |
|--------|-------------|----------|
| Masquee + profil | Users masquee, mot de passe via menu profil Payload | ✓ |
| Completement masquee | Users masquee, pas d'acces au profil | |
| Visible | Users visible dans la sidebar | |

**User's choice:** Masquee + profil

---

## Claude's Discretion

- Layout exact du dashboard custom
- Organisation des groupes de collections dans la sidebar
- Details d'implementation des filtres PageContent

## Deferred Ideas

None — discussion stayed within phase scope
