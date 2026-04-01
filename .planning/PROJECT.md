# SiteAntoine — Coach Bien-Etre

## What This Is

Site vitrine moderne pour Antoine Profit, coach bien-etre. Remplace l'ancien site WordPress (antoineprofit.com) par une application rapide, legere et facile a maintenir. 5 pages publiques + interface d'administration pour gerer le contenu sans toucher au code.

## Core Value

Antoine peut mettre a jour son site (textes, images, programmes, resultats) de maniere autonome via une interface d'admin simple.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Pages publiques : Accueil, Mon Histoire, Mes Services, Les Programmes, Resultats
- [ ] Page Accueil : hero, introduction, apercu des services, call-to-action contact
- [ ] Page Mon Histoire : parcours personnel d'Antoine, timeline ou storytelling
- [ ] Page Mes Services : presentation des offres (consultation 1:1, coaching groupe, etc.)
- [ ] Page Les Programmes : liste de programmes avec details (duree, contenu, objectifs)
- [ ] Page Resultats : galerie avant/apres avec temoignage complet (photos, histoire, programme suivi, duree, citation)
- [ ] Formulaire de contact (email / WhatsApp)
- [ ] Interface admin : editer les textes et images de chaque page
- [ ] Interface admin : creer/modifier/supprimer des programmes
- [ ] Interface admin : creer/modifier/supprimer des resultats avant/apres
- [ ] Design moderne, nouvelle identite visuelle (pas les couleurs rose/rouge actuelles)
- [ ] Site responsive (mobile-first)
- [ ] Performance : chargement rapide, pas de plugins lourds
- [ ] Deploiement sur VPS existant

### Out of Scope

- Paiement en ligne — pas de e-commerce, juste contact pour reserver
- Blog / articles — pas dans le scope v1, a reconsiderer plus tard
- Reservation en ligne (Calendly) — contact direct suffit pour v1
- OAuth / comptes utilisateurs — seul l'admin se connecte
- Application mobile — site responsive suffit
- Migration de contenu WordPress — tout le contenu sera neuf

## Context

- Le site actuel (antoineprofit.com) tourne sur WordPress 6.2.9 avec Visual Composer, Revolution Slider, WooCommerce, Essential Grid. Lourd, lent, difficile a modifier.
- Antoine veut pouvoir gerer son contenu seul, sans developpeur.
- Hebergement sur un VPS existant (pas Vercel/Netlify).
- Contenu entierement neuf — pas de migration du contenu actuel.
- Le site cible un public francophone interessé par le coaching bien-etre / nutrition / fitness.

## Constraints

- **Hebergement**: VPS existant — le stack doit pouvoir tourner sur un serveur classique (Docker ou Node.js)
- **Langue**: Site en francais uniquement
- **Admin**: Interface simple, pas un CMS complet — juste editer pages + gerer programmes et resultats
- **Contenu**: Placeholder pour v1, Antoine remplira ensuite via l'admin

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Framework moderne (pas WordPress) | Performance, maintenabilite, legerete | — Pending |
| Nouvelle identite visuelle | L'ancienne fait datee, besoin de moderniser | — Pending |
| Contact uniquement (pas e-commerce) | Simplifier v1, le paiement n'est pas prioritaire | — Pending |
| VPS deployment | Infrastructure existante a reutiliser | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-01 after initialization*
