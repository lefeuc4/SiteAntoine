# Requirements: SiteAntoine

**Defined:** 2026-04-01
**Core Value:** Antoine peut mettre a jour son site de maniere autonome via une interface d'admin simple

## v1 Requirements

### Pages Publiques

- [x] **PAGE-01**: Site affiche une page d'accueil avec hero, proposition de valeur, apercu des services et CTA contact
- [x] **PAGE-02**: Site affiche une page Mon Histoire avec le parcours personnel d'Antoine sous forme de timeline/storytelling
- [x] **PAGE-03**: Site affiche une page Mes Services avec description claire de chaque offre (consultation 1:1, coaching groupe, etc.)
- [x] **PAGE-04**: Site affiche une page Les Programmes listant chaque programme avec duree, contenu, objectifs et public cible
- [x] **PAGE-05**: Site affiche une page Resultats avec galerie avant/apres incluant temoignage complet (photos, histoire, programme suivi, duree, citation client)
- [x] **PAGE-06**: Navigation claire avec max 5 items, accessible depuis toutes les pages
- [x] **PAGE-07**: Lien/bouton de contact visible sur chaque page

### Design & UX

- [x] **DSGN-01**: Nouvelle identite visuelle moderne et coherente (pas les couleurs rose/rouge actuelles)
- [x] **DSGN-02**: Design mobile-first responsive sur tous les ecrans (mobile, tablette, desktop)
- [x] **DSGN-03**: Chargement de chaque page en moins de 3 secondes

### Admin

- [x] **ADMN-01**: Interface admin protegee par authentification (login/password)
- [x] **ADMN-02**: Admin peut editer les textes et images de chaque page publique
- [x] **ADMN-03**: Admin peut creer, modifier et supprimer des programmes (titre, description, duree, contenu, objectifs, public cible)
- [x] **ADMN-04**: Admin peut creer, modifier et supprimer des resultats avant/apres (photos avant, photos apres, prenom client, histoire, programme suivi, duree, citation)
- [x] **ADMN-05**: Images uploadees sont automatiquement compressees en WebP

### Contact

- [ ] **CTCT-01**: Formulaire de contact fonctionnel (nom, email, message) avec envoi par email
- [ ] **CTCT-02**: Lien WhatsApp accessible depuis le site

### SEO & Conformite

- [ ] **SEO-01**: Meta tags, titres et structure HTML semantique sur chaque page
- [ ] **SEO-02**: Redirections 301 depuis les anciennes URLs WordPress vers les nouvelles pages
- [ ] **LGAL-01**: Bandeau cookies conforme RGPD
- [ ] **LGAL-02**: Page mentions legales
- [ ] **LGAL-03**: Champ de consentement dans l'admin pour chaque photo client (conformite CNIL)

### Deploiement

- [x] **DPLY-01**: Site deployable et fonctionnel sur Vercel (gratuit) avec Neon PostgreSQL
- [ ] **DPLY-02**: HTTPS configure avec domaine personnalise antoineprofit.com sur Vercel

## v2 Requirements

### Blog

- **BLOG-01**: Antoine peut publier des articles de blog via l'admin
- **BLOG-02**: Articles affiches sur une page Blog avec pagination

### Reservation

- **RESV-01**: Integration Calendly ou equivalent pour prise de RDV en ligne

### Multi-langue

- **LANG-01**: Version anglaise du site

## Out of Scope

| Feature | Reason |
|---------|--------|
| E-commerce / paiement en ligne | Pas necessaire — Antoine vend par contact direct |
| Comptes utilisateurs / login clients | Pas un portail client, juste un site vitrine |
| Chatbot / live chat | Cout et complexite disproportionnes pour v1 |
| Video backgrounds | Lourdes, lentes, complexes a maintenir |
| Embed reseaux sociaux | Dependance API tierce, problemes GDPR |
| Application mobile | Le site responsive suffit |
| Systeme de notes/avis | Temoignages curates sur la page Resultats suffisent |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAGE-01 | Phase 2 | Complete |
| PAGE-02 | Phase 2 | Complete |
| PAGE-03 | Phase 2 | Complete |
| PAGE-04 | Phase 2 | Complete |
| PAGE-05 | Phase 2 | Complete |
| PAGE-06 | Phase 2 | Complete |
| PAGE-07 | Phase 2 | Complete |
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 2 | Complete |
| DSGN-03 | Phase 2 | Complete |
| ADMN-01 | Phase 3 | Complete |
| ADMN-02 | Phase 3 | Complete |
| ADMN-03 | Phase 3 | Complete |
| ADMN-04 | Phase 3 | Complete |
| ADMN-05 | Phase 3 | Complete |
| CTCT-01 | Phase 4 | Pending |
| CTCT-02 | Phase 4 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| LGAL-01 | Phase 5 | Pending |
| LGAL-02 | Phase 5 | Pending |
| LGAL-03 | Phase 5 | Pending |
| DPLY-01 | Phase 1 | Complete |
| DPLY-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after roadmap creation*
