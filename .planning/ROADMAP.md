# Roadmap: SiteAntoine — Coach Bien-Etre

## Overview

Le projet livre un site vitrine moderne pour Antoine Profit en 5 phases ordonnees par dependances techniques. La fondation etablit le stack (Next.js + Payload + PostgreSQL) et les modeles de donnees. Les pages publiques construisent le site visible. L'interface admin donne a Antoine son autonomie. Le formulaire de contact active la conversion. La derniere phase traite le SEO, la conformite RGPD et le deploiement Vercel avec coupure DNS depuis WordPress.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Fondation** - Bootstrap du projet, modeles de donnees Payload, Docker Compose local (completed 2026-04-01)
- [ ] **Phase 2: Pages Publiques** - Les 5 pages du site vitrine, design system, navigation responsive
- [ ] **Phase 3: Interface Admin** - CRUD programmes et resultats, edition de contenu, upload images WebP
- [ ] **Phase 4: Formulaire de Contact** - Formulaire email + lien WhatsApp, livraison Resend, anti-spam
- [ ] **Phase 5: SEO, Conformite & Deploiement** - SEO, RGPD/CNIL, redirections 301, Vercel production, HTTPS

## Phase Details

### Phase 1: Fondation
**Goal**: Le projet tourne localement avec le stack complet, les collections Payload definies et l'authentification admin operationnelle
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DPLY-01
**Success Criteria** (what must be TRUE):
  1. `npm run dev` demarre l'application Next.js + Payload localement sans erreur
  2. L'interface admin Payload est accessible a `/admin` et protegee par login/password
  3. Les collections Payload (Programmes, Resultats, PageContent, Media, Users) sont definies et migrees en base
  4. La nouvelle identite visuelle (palette, typographie) est definie dans le design system Tailwind
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js + Payload CMS, collections, Neon PostgreSQL + Vercel Blob
- [x] 01-02-PLAN.md — Design system Tailwind v4 (palette, fonts, tokens) + placeholder page
**UI hint**: yes

### Phase 2: Pages Publiques
**Goal**: Les 5 pages publiques du site sont visibles, navigables et responsives sur tous les ecrans
**Depends on**: Phase 1
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, DSGN-02, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Un visiteur peut naviguer entre les 5 pages (Accueil, Mon Histoire, Mes Services, Les Programmes, Resultats) depuis n'importe quelle page via la navigation principale (max 5 items)
  2. La page Accueil affiche un hero avec proposition de valeur claire, un apercu des services et un bouton CTA de contact visible above the fold
  3. La page Resultats affiche une galerie avant/apres avec temoignages complets (photos, histoire, programme suivi, duree, citation client) en se basant sur les donnees Payload
  4. Chaque page affiche un lien/bouton de contact persistent (header ou footer)
  5. Chaque page charge en moins de 3 secondes sur connexion mobile et le layout est correct sur mobile, tablette et desktop
**Plans**: TBD
**UI hint**: yes

### Phase 3: Interface Admin
**Goal**: Antoine peut gerer de maniere autonome les programmes, les resultats avant/apres et le contenu textuel et visuel de chaque page
**Depends on**: Phase 2
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05
**Success Criteria** (what must be TRUE):
  1. Antoine peut se connecter a l'admin avec son login/password et acceder uniquement aux sections qui le concernent
  2. Antoine peut creer, modifier et supprimer un programme (titre, description, duree, contenu, objectifs, public cible) et voir le changement reflete immediatement sur la page publique Les Programmes
  3. Antoine peut creer, modifier et supprimer un resultat avant/apres (photos avant, photos apres, prenom client, histoire, programme suivi, duree, citation) avec un champ de consentement CNIL obligatoire
  4. Les images uploadees par Antoine sont automatiquement converties en WebP et redimensionnees sans intervention technique
  5. Antoine peut modifier les textes et images de chaque page publique depuis l'admin
**Plans**: TBD

### Phase 4: Formulaire de Contact
**Goal**: Les visiteurs peuvent contacter Antoine via un formulaire email et un lien WhatsApp depuis le site
**Depends on**: Phase 2
**Requirements**: CTCT-01, CTCT-02
**Success Criteria** (what must be TRUE):
  1. Un visiteur peut envoyer un message via le formulaire de contact (nom, email, message) et Antoine recoit l'email dans sa boite de reception (pas dans les spams)
  2. Un visiteur peut cliquer sur le lien WhatsApp depuis le site et ouvrir directement une conversation avec Antoine
  3. Une tentative de spam via le formulaire est bloquee silencieusement (honeypot actif)
**Plans**: TBD

### Phase 5: SEO, Conformite & Deploiement
**Goal**: Le site est en ligne sur Vercel avec HTTPS, domaine personnalise, les redirections WordPress en place, le SEO de base configure et la conformite RGPD satisfaite
**Depends on**: Phase 3, Phase 4
**Requirements**: SEO-01, SEO-02, LGAL-01, LGAL-02, LGAL-03, DPLY-02
**Success Criteria** (what must be TRUE):
  1. Le site est accessible en HTTPS sur Vercel avec le domaine antoineprofit.com configure et certificat SSL automatique
  2. Les anciennes URLs WordPress renvoient des redirections 301 vers les nouvelles pages (configurees dans vercel.json/next.config)
  3. Chaque page publique dispose de meta tags, titre et structure HTML semantique corrects (verifiable via les outils developpeur)
  4. Un bandeau cookies RGPD s'affiche au premier chargement et une page Mentions Legales est accessible
  5. Le champ de consentement CNIL est present et obligatoire dans l'admin pour chaque photo client
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fondation | 2/2 | Complete   | 2026-04-01 |
| 2. Pages Publiques | 0/? | Not started | - |
| 3. Interface Admin | 0/? | Not started | - |
| 4. Formulaire de Contact | 0/? | Not started | - |
| 5. SEO, Conformite & Deploiement | 0/? | Not started | - |
