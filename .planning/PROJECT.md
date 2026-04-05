# SiteAntoine — Coach Bien-Etre

## What This Is

Site vitrine moderne pour Antoine Profit, coach bien-etre. Remplace l'ancien site WordPress (antoineprofit.com) par une application rapide, legere et facile a maintenir. 5 pages publiques + interface d'administration pour gerer le contenu sans toucher au code.

## Core Value

Antoine peut mettre a jour son site (textes, images, programmes, resultats) de maniere autonome via une interface d'admin simple.

## Requirements

### Validated

- [x] Design moderne, nouvelle identite visuelle (pas les couleurs rose/rouge actuelles) — Validated in Phase 1: Fondation
- [x] Deploiement sur Vercel (gratuit) + Neon PostgreSQL — Validated in Phase 1: Fondation (stack operational locally)

### Active

- [ ] Pages publiques : Accueil, Mon Histoire, Mes Services, Les Programmes, Resultats
- [ ] Page Accueil : hero, introduction, apercu des services, call-to-action contact
- [ ] Page Mon Histoire : parcours personnel d'Antoine, timeline ou storytelling
- [ ] Page Mes Services : presentation des offres (consultation 1:1, coaching groupe, etc.)
- [ ] Page Les Programmes : liste de programmes avec details (duree, contenu, objectifs)
- [ ] Page Resultats : galerie avant/apres avec temoignage complet (photos, histoire, programme suivi, duree, citation)
- [ ] Formulaire de contact (email / WhatsApp)
- [x] Interface admin : editer les textes et images de chaque page — Validated in Phase 3: Interface Admin
- [x] Interface admin : creer/modifier/supprimer des programmes — Validated in Phase 3: Interface Admin
- [x] Interface admin : creer/modifier/supprimer des resultats avant/apres — Validated in Phase 3: Interface Admin

- [ ] Site responsive (mobile-first)
- [ ] Performance : chargement rapide, pas de plugins lourds


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
- Hebergement OVH actuel = mutualise (PHP only, pas de Docker/Node). Migration vers Vercel (gratuit) pour Next.js + Neon PostgreSQL gratuit.
- Contenu entierement neuf — pas de migration du contenu actuel.
- Le site cible un public francophone interessé par le coaching bien-etre / nutrition / fitness.

## Constraints

- **Hebergement**: Vercel (gratuit) + Neon PostgreSQL (gratuit) — l'offre OVH mutualisee ne supporte pas Node.js/Docker
- **Langue**: Site en francais uniquement
- **Admin**: Interface simple, pas un CMS complet — juste editer pages + gerer programmes et resultats
- **Contenu**: Placeholder pour v1, Antoine remplira ensuite via l'admin

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Framework moderne (pas WordPress) | Performance, maintenabilite, legerete | Next.js 16 + Payload CMS 3 — Phase 1 |
| Nouvelle identite visuelle | L'ancienne fait datee, besoin de moderniser | Palette "Energie & Performance", Montserrat/Inter — Phase 1 |
| Contact uniquement (pas e-commerce) | Simplifier v1, le paiement n'est pas prioritaire | — Pending |
| Vercel + Neon (pas OVH) | OVH mutualise = PHP only, pas compatible Next.js | Neon PostgreSQL connecte, Vercel Blob configure — Phase 1 |

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
*Last updated: 2026-04-05 after Phase 05.1 (Frontend Polish) complete — UX state pages added, typography/color/spacing tokens fixed, timeline year labels, card focus rings for accessibility*
