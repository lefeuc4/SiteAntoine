# Phase 5: SEO, Conformite & Deploiement - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 05-seo-conformite-deploiement
**Areas discussed:** Redirections WordPress, Bandeau cookies RGPD, Mentions legales, Deploiement Vercel

---

## Redirections WordPress

| Option | Description | Selected |
|--------|-------------|----------|
| Non, pas d'inventaire | Mapping basique des pages principales | ✓ |
| Je connais les URLs | Lister les URLs manuellement | |
| L'ancien site est encore en ligne | Scraper les URLs automatiquement | |

**User's choice:** Pas d'inventaire existant
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, encore en ligne | Scraper les URLs principales | ✓ |
| Non, deja coupe | Mapping generique WordPress | |
| Je ne sais pas | Mapping generique par securite | |

**User's choice:** L'ancien site est encore en ligne — on pourra scraper
**Notes:** Le researcher devra extraire les URLs depuis antoineprofit.com

---

## Bandeau cookies RGPD

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel Analytics (Recommended) | Gratuit, leger, pas de cookies tiers | ✓ |
| Google Analytics | Plus complet mais necessite consentement explicite | |
| Aucun analytics pour v1 | Pas de tracking | |

**User's choice:** Vercel Analytics

| Option | Description | Selected |
|--------|-------------|----------|
| Bandeau simple en bas (Recommended) | Barre discrete, Accepter/Refuser | ✓ |
| Popup modale centree | Plus visible, interrompt navigation | |
| Bandeau avec categories | Choix par categorie, overkill | |

**User's choice:** Bandeau simple en bas

---

## Mentions legales

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-entrepreneur / micro | Mentions simplifiees: nom, SIRET, adresse | ✓ |
| Societe (SARL, SAS, etc.) | Mentions completes: raison sociale, RCS, capital | |
| Je ne sais pas encore | Template avec placeholders | |

**User's choice:** Auto-entrepreneur / micro-entreprise

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholders pour l'instant | [A COMPLETER] via admin | ✓ |
| Je les ai | Fournir les infos maintenant | |

**User's choice:** Placeholders — Antoine remplira plus tard

| Option | Description | Selected |
|--------|-------------|----------|
| Editable via admin (Recommended) | Global Payload MentionsLegales | ✓ |
| Page statique codee en dur | Fichier TSX en dur | |

**User's choice:** Editable via admin Payload

---

## Deploiement Vercel

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, les deux sont prets | Repo GitHub + Vercel connectes | |
| Repo GitHub oui, Vercel pas encore | Creer projet Vercel | |
| Rien de configure | Documenter toutes les etapes | ✓ |

**User's choice:** Rien de configure — tout a documenter

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, chez OVH | Config DNS OVH vers Vercel | ✓ |
| Autre registrar | Config similaire | |
| Je ne sais pas | Documenter les deux approches | |

**User's choice:** Domaine chez OVH

---

## Claude's Discretion

- Choix technique redirections: next.config.ts vs vercel.json
- Implementation bandeau cookies (composant client + localStorage)
- Structure Global MentionsLegales dans Payload
- Configuration Vercel Analytics

## Deferred Ideas

None
