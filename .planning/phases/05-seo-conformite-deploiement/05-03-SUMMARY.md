---
phase: 05-seo-conformite-deploiement
plan: 03
subsystem: infra
tags: [vercel, neon, postgres, resend, dns, ovh, deployment, payload-migrations]

requires:
  - phase: 05-01
    provides: SEO metadata, sitemap, robots.txt, WordPress redirects
  - phase: 05-02
    provides: MentionsLegales global, CookieBanner, /mentions-legales page
provides:
  - Live production site at https://antoineprofit.com (Vercel EU, HTTPS, HSTS)
  - Payload admin live at /admin backed by Neon Postgres (prod)
  - Transactional email pipeline via Resend with verified antoineprofit.com domain
  - Infrastructure owned by Antoine's own Vercel + Neon + Resend accounts
affects: [maintenance, future-phases, ui-reviews]

tech-stack:
  added: []
  patterns:
    - "payload migrate && next build — versioned migrations run on every Vercel deploy"
    - "force-dynamic at (frontend)/layout.tsx — opts entire public section out of static prerender since layout fetches ContactSettings global on every request"

key-files:
  created:
    - src/migrations/20260420_105036.ts
  modified:
    - package.json (build script prepends payload migrate)
    - src/app/(frontend)/layout.tsx (force-dynamic export)

key-decisions:
  - "Hosting ownership: Antoine owns Vercel + Neon + Resend accounts directly — GitHub repo made public so Antoine's Vercel can import without collaborator setup"
  - "Single database for the whole app — no dev/prod separation beyond env vars pointing at two distinct Neon projects"
  - "force-dynamic at layout level rather than per-route: simpler, keeps admin-editable content always fresh, trade-off is no static caching (acceptable for low-traffic vitrine)"

patterns-established:
  - "Deployment fix pattern: any new Payload collection or global must ship with a generated migration (payload migrate:create <name>) — push:true only works in dev, production needs versioned migrations"
  - "Seed-to-prod pattern: inline DATABASE_URI='<prod-pooled>' overrides .env.local at the shell level, no need to edit .env.local temporarily"

requirements-completed: [DPLY-02]

duration: 4h
completed: 2026-04-20
---

# Phase 05-03: Deployment Summary

**Site en production à https://antoineprofit.com sur l'infrastructure d'Antoine (Vercel + Neon + Resend), avec SSL auto, redirections WordPress 308 actives, et schéma Payload versionné via migrations.**

## What shipped

| Aspect | Valeur |
|---|---|
| URL publique | https://antoineprofit.com (apex 307→www, final www) |
| Hébergement web | Vercel Hobby (région CDG — Paris) |
| Base de données | Neon Postgres 17 (région eu-central-1, pooled connection) |
| Stockage media | Vercel Blob (intégré au projet Vercel) |
| Email transactionnel | Resend, domaine `antoineprofit.com` vérifié (SPF/DKIM/DMARC via OVH TXT) |
| Admin | https://antoineprofit.com/admin (Payload, compte admin créé par Antoine) |
| SSL | Let's Encrypt auto-provisionné par Vercel, HSTS 2 ans |
| DNS | OVH → apex A + www CNAME cname.vercel-dns.com |

## Deviations from original plan

Le plan 05-03 décrivait un déploiement "autoroute" : clean le repo → Vercel → DNS. En réalité trois problèmes ont surgi pendant l'exécution et ont nécessité des fixes de code :

### 1. Migrations Payload manquantes au build
Le script `build` original était `next build`. Il ne lançait jamais `payload migrate`, donc Neon (prod) restait avec un schéma vide → `relation "accueil" does not exist` au premier chargement de la homepage.

**Fix :** `"build": "payload migrate && next build"` dans `package.json`. Chaque déploiement Vercel applique désormais automatiquement toutes les migrations pending avant le build Next.

### 2. Prerender statique qui bouffe la DB au build
Next.js essayait de prerender `/contact`, `/services`, `/resultats` et les autres pages au build-time. Ces pages appellent `payload.find()`, ce qui ouvre une connexion Postgres pendant le build. Fragile (le build devient dépendant de l'état runtime de la DB) et carrément cassé quand les tables n'existent pas encore.

**Fix :** `export const dynamic = 'force-dynamic'` dans `src/app/(frontend)/layout.tsx`. Propagation à toutes les routes enfantes — plus de prerender statique pour les pages publiques. Coût : toutes les pages sont SSR, pas de cache statique (OK pour un site vitrine à faible trafic).

### 3. Collection `accueil` sans migration versionnée
La collection `Accueil` a été ajoutée pendant le quick task `260405-8ah` mais personne n'a lancé `payload migrate:create` derrière. En dev ça passait à cause de `push:true` (auto-sync Payload ↔ DB). En prod : `relation "accueil" does not exist`.

**Fix :** migration `20260420_105036.ts` générée + committée. Elle crée la table `accueil`, la FK `accueil_hero_image_id → media.id`, et la colonne de liaison dans `payload_locked_documents_rels`.

### 4. Migration de propriété Vercel/Neon/Resend en cours de route
Décision prise mid-execution de passer du compte perso du dev aux comptes d'Antoine (Vercel + Neon + Resend). Timing choisi : avant la bascule DNS, pendant que la DB ne contenait que du seed (zero perte de données). Repo GitHub rendu public pour simplifier l'import côté Vercel d'Antoine.

Les 3 seeds ont été relancés contre la nouvelle DB Neon d'Antoine :
- `seed:accueil` — idempotent (update si existe)
- `seed` — destructif sur programmes/resultats/page-content
- `seed:mentions` — updateGlobal

## Env vars configurées (Vercel — compte Antoine)

- `DATABASE_URI` — Neon pooled string du projet d'Antoine
- `PAYLOAD_SECRET` — nouvelle string random
- `BLOB_READ_WRITE_TOKEN` — token du Blob Store créé dans le Vercel d'Antoine
- `NEXT_PUBLIC_SERVER_URL` — `https://antoineprofit.com`
- `RESEND_API_KEY` — clé du compte Resend d'Antoine (domaine vérifié)
- `CONTACT_EMAIL` — adresse de réception fournie par Antoine

## Vérifications production

- ✅ `https://antoineprofit.com` sert le site Next.js avec SSL valide (HSTS max-age 2 ans)
- ✅ `https://www.antoineprofit.com` répond 200 OK avec content
- ✅ `https://antoineprofit.com/index.php/about-me` → 307 (apex→www) → 308 (WordPress redirect) → `/mon-histoire`
- ✅ `/admin` accessible, Payload login fonctionnel
- ✅ DNS OVH nettoyé (ancienne redirection interne supprimée) et pointe vers Vercel

## Cleanup restant (côté dev, pas côté Antoine)

- [ ] Supprimer le projet Vercel de transition utilisé pour tester initialement
- [ ] Supprimer le projet Neon de transition (`ep-winter-moon-al3gy41h`)
- [ ] Rotate le mot de passe Neon du projet dev si la leak terminale est jugée sensible
- [ ] Optionnel : ContactSettings — Antoine doit remplir `whatsappNumber` / `instagramUrl` / `facebookUrl` via `/admin` pour activer le bouton flottant WhatsApp

## Notes pour la suite

- **Phase 05.1 (frontend-polish)** reste à planifier/exécuter — c'est de la polish visuelle, indépendant du déploiement.
- Tout changement futur de schéma Payload (nouvelle collection, nouveau champ, changement de type) doit passer par `pnpm payload migrate:create <name>` avant commit, sinon cassure en prod garantie.
- `payload migrate` dans le build est idempotent (skip les migrations déjà appliquées via la table `payload_migrations`), donc aucun risque en re-deploy.
