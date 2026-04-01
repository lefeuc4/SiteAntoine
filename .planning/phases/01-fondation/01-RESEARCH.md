# Phase 1: Fondation - Research

**Researched:** 2026-04-01
**Domain:** Next.js 16 + Payload CMS 3 + Neon PostgreSQL + Tailwind CSS 4 — bootstrap and design system
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Identite visuelle**
- D-01: Ambiance "Energie & Performance" — tons sombres avec accents vifs, dynamique et moderne
- D-02: Palette : bleu nuit (#0F172A), bleu electrique (#3B82F6), vert energie (#10B981), blanc pur (#F8FAFC), gris ardoise (#64748B)
- D-03: Fond clair dominant avec accents bleu nuit — pas de mode sombre
- D-04: Boutons CTA en bleu electrique (#3B82F6) plein avec texte blanc
- D-05: Animations subtiles au scroll et hover (scroll reveal, hover effects legers)

**Typographie**
- D-06: Titres en Montserrat Bold/Black — police impactante pour les headings
- D-07: Corps de texte en Inter Regular — lisible et moderne

**Modeles de donnees Payload**
- D-08: Collection Programmes : champs basiques — titre, description (rich text), duree, objectifs, public cible, image de couverture, ordre d'affichage
- D-09: Collection Resultats : multiples photos avant et multiples photos apres par resultat (pas juste 1+1)
- D-10: Collection Resultats : champs — prenom client, histoire (rich text), programme suivi (texte libre), duree, citation, consentement CNIL (obligatoire), photos avant (array), photos apres (array)
- D-11: Programmes et Resultats sont independants — le champ "programme suivi" dans Resultats est un texte libre, pas une relation Payload
- D-12: Collection PageContent structuree par sections editables — chaque page decoupee en sections qu'Antoine modifie individuellement

**Stockage images**
- D-13: Vercel Blob pour le stockage des images uploadees
- D-14: Compression WebP automatique via next/image pour le rendu (ADMN-05)

**Setup projet**
- D-15: Base de donnees Neon PostgreSQL en dev et en prod — pas de Docker Compose local
- D-16: `npm run dev` suffit pour lancer le projet localement (pas besoin de conteneurs)

### Claude's Discretion
- Choix du gestionnaire de paquets (pnpm recommande par Payload, npm acceptable)
- Structure des dossiers du projet
- Configuration ESLint/Prettier
- Details d'implementation des animations (librairie, timing, etc.)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSGN-01 | Nouvelle identite visuelle moderne et coherente (pas les couleurs rose/rouge actuelles) | Tailwind CSS v4 `@theme` directive avec palette complete (D-02) ; polices Google Fonts via `next/font` (D-06, D-07) |
| DPLY-01 | Site deployable et fonctionnel sur Vercel (gratuit) avec Neon PostgreSQL | `create-payload-app` bootstrappe un projet Next.js 16 + Payload 3 directement deployable sur Vercel ; `@payloadcms/db-postgres` + Neon connection string via `DATABASE_URI` |
</phase_requirements>

---

## Summary

Cette phase bootstrap le projet greenfield : un seul processus `npm run dev` demarre Next.js 16 avec Payload CMS 3 integre directement dans le dossier `/app`. Payload gere l'admin `/admin`, l'authentification, et les migrations PostgreSQL. Il n'y a pas de conteneur local — la base Neon est utilisee des le depart, en dev comme en prod.

La difficulte principale de cette phase n'est pas le code mais la configuration : trois tokens d'environnement sont obligatoires avant que quoi que ce soit ne fonctionne (`DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`), et la connexion Neon doit pointer vers l'URL poolee pour les requetes applicatives. La structure du projet suit exactement le template `blank` de Payload — toute deviation casse l'integration.

Le design system Tailwind CSS v4 se configure entierement en CSS via la directive `@theme` dans `globals.css`. Les polices Google Fonts sont chargees via `next/font/google` et exposees comme variables CSS consommees par Tailwind. Cette approche est zero-config par rapport a Tailwind v3 : pas de `tailwind.config.js`, tout est dans le CSS.

**Recommandation principale:** Bootstrapper avec `pnpm create payload-app@latest` template `blank`, configurer les trois variables d'environnement, definir les collections, puis ajouter le design system Tailwind. Dans cet ordre — ne pas toucher au design avant que `npm run dev` tourne sans erreur.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.2 (current stable) | Framework full-stack, App Router | Payload 3 l'exige nativement ; `npm run dev` seul suffit |
| React | 19.x | UI rendering | Peer dep de Next.js 16 ; React 19 stable |
| Payload CMS | 3.81.0 (current) | Admin panel + API collections | S'installe dans `/app`, pas de process separe ; auth integree ; PostgreSQL stable |
| TypeScript | 5.x | Type safety | Payload genere automatiquement les types depuis le schema collections |
| `@payloadcms/db-postgres` | 3.81.0 | Adaptateur PostgreSQL pour Payload | Testé PG 14–17 ; Neon compatible |
| `@payloadcms/storage-vercel-blob` | 3.81.0 | Stockage images sur Vercel Blob | Adaptateur officiel ; `clientUploads: true` requis sur Vercel (limite 4.5 MB serveur) |
| Tailwind CSS | 4.2.2 (current) | Styling | v4 CSS-first ; `@theme` directive genere les utilities automatiquement |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/font` | (built-in Next.js) | Google Fonts optimises sans requete reseau | Charger Montserrat + Inter — zero layout shift |
| `@payloadcms/richtext-lexical` | 3.81.0 | Editeur rich text dans admin | Editeur par defaut de Payload 3 ; a inclure dans les collections description/histoire |
| sharp | latest | Traitement images (resize, WebP) | Dependance de Payload pour `imageSizes` et conversion WebP |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@payloadcms/storage-vercel-blob` | `@payloadcms/storage-s3` | S3 offre plus de controle mais necessite un compte AWS/Hetzner ; Vercel Blob est zero-config sur Vercel |
| Neon PostgreSQL | SQLite via `@payloadcms/db-sqlite` | SQLite supprime la dependance reseau mais ne supporte pas Vercel serverless correctement |
| pnpm | npm | npm est acceptable ; pnpm est l'outil des templates officiels Payload et installes les `node_modules` plus vite |

**Installation:**
```bash
# Bootstrap
pnpm create payload-app@latest siteantoine --template blank

# Dans le projet (si pas deja installe par create-payload-app)
pnpm add @payloadcms/storage-vercel-blob sharp

# Dev dependencies
pnpm add -D prettier eslint-config-prettier
```

**Version verification (verified 2026-04-01):**
```bash
npm view payload version        # 3.81.0
npm view next version           # 16.2.2
npm view tailwindcss version    # 4.2.2
npm view @payloadcms/db-postgres version            # 3.81.0
npm view @payloadcms/storage-vercel-blob version    # 3.81.0
```

---

## Architecture Patterns

### Recommended Project Structure

Payload avec le template `blank` produit cette structure. La Phase 1 n'ajoute que le design system et les collections — pas encore de pages publiques.

```
siteantoine/
├── src/
│   ├── app/
│   │   ├── (payload)/              # Route group Payload (admin + API)
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       └── page.tsx    # Admin UI rendue par Payload
│   │   │   └── api/
│   │   │       └── [...slug]/
│   │   │           └── route.ts    # Payload REST + GraphQL API
│   │   ├── layout.tsx              # Root layout (fonts Montserrat/Inter)
│   │   └── page.tsx                # Placeholder accueil (Phase 2)
│   ├── collections/                # Definitions des collections Payload
│   │   ├── Programmes.ts
│   │   ├── Resultats.ts
│   │   ├── PageContent.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── payload.config.ts           # Config centrale Payload
│   └── payload-types.ts            # Auto-genere par Payload (ne pas editer)
├── public/
├── .env.local                      # DATABASE_URI, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Pattern 1: Configuration Payload (`payload.config.ts`)

**What:** Fichier central qui declare les collections, la base de donnees, le stockage, le secret.
**When to use:** Toujours — c'est le point d'entree de toute la configuration.

```typescript
// Source: https://payloadcms.com/docs/configuration/overview
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Programmes } from './collections/Programmes'
import { Resultats } from './collections/Resultats'
import { PageContent } from './collections/PageContent'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      clientUploads: true,   // OBLIGATOIRE sur Vercel — limite serveur 4.5 MB
    }),
  ],
  collections: [Users, Media, Programmes, Resultats, PageContent],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

### Pattern 2: Collection avec array de photos (`Resultats.ts`)

**What:** Utiliser le type `array` avec des sous-champs `upload` pour les photos avant/apres multiples (D-09, D-10).
**When to use:** Toujours quand on veut N images par entite (pas juste 1).

```typescript
// Source: https://payloadcms.com/docs/fields/array
import { CollectionConfig } from 'payload'

export const Resultats: CollectionConfig = {
  slug: 'resultats',
  admin: {
    useAsTitle: 'prenomClient',
  },
  fields: [
    { name: 'prenomClient', type: 'text', required: true },
    { name: 'histoire', type: 'richText', required: true },
    { name: 'programmesSuivi', type: 'text' },   // texte libre — pas de relation (D-11)
    { name: 'duree', type: 'text' },
    { name: 'citation', type: 'textarea' },
    {
      name: 'consentementCNIL',
      type: 'checkbox',
      required: true,
      admin: {
        description: 'Le client a donne son consentement ecrit pour la publication de ces photos.',
      },
    },
    {
      name: 'photosAvant',
      type: 'array',
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'photosApres',
      type: 'array',
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
```

**Alternative avec `hasMany`:** Payload supporte aussi `{ type: 'upload', hasMany: true }` pour multi-upload sans wrapper array — mais le pattern `array` est plus flexible (on peut ajouter des champs de legende par photo ultérieurement).

### Pattern 3: Collection Media avec imageSizes WebP (`Media.ts`)

**What:** Configurer le traitement automatique WebP et le redimensionnement au moment de l'upload (ADMN-05).
**When to use:** Collection Media — unique collection d'upload pour tout le projet.

```typescript
// Source: https://payloadcms.com/docs/upload/overview
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'center' },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'center',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'full',
        width: 1200,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp' },
      },
    ],
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
}
```

**Note critique:** `clientUploads: true` dans le plugin Vercel Blob bypasse le traitement serveur de Sharp (resize, WebP). Les `imageSizes` ne fonctionnent PAS avec `clientUploads: true`. Il faut choisir : soit les tailles automatiques (sans Vercel, avec un serveur long-lived), soit Vercel Blob sans les tailles auto. Sur Vercel, `clientUploads: true` est requis. En Phase 1, configurer `imageSizes` dans le schema mais documenter cette limitation pour Phase 3.

### Pattern 4: Design System Tailwind CSS v4 (`globals.css`)

**What:** Toute la configuration du theme se fait en CSS avec `@theme` — plus de `tailwind.config.js` (D-01 a D-07).
**When to use:** Ficher CSS global uniquement.

```css
/* globals.css */
@import "tailwindcss";
@import url("https://fonts.googleapis.com");  /* NE PAS FAIRE — utiliser next/font */

@theme {
  /* Palette "Energie & Performance" (D-02) */
  --color-bleu-nuit: #0F172A;
  --color-bleu-electrique: #3B82F6;
  --color-vert-energie: #10B981;
  --color-blanc-pur: #F8FAFC;
  --color-gris-ardoise: #64748B;

  /* Typographie (D-06, D-07) */
  --font-heading: var(--font-montserrat), 'Montserrat', sans-serif;
  --font-body: var(--font-inter), 'Inter', sans-serif;
}
```

```typescript
// src/app/layout.tsx — chargement polices via next/font
import { Montserrat, Inter } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
        {children}
      </body>
    </html>
  )
}
```

### Pattern 5: Collection PageContent — sections par page (D-12)

**What:** Chaque page publique est representee par des documents dans la collection, avec un champ `page` (select) et `section` (text) pour identifier quel bloc editer.
**When to use:** Contenu editable de chaque page publique.

```typescript
// Pattern "content blocks" — une ligne par section editable
export const PageContent: CollectionConfig = {
  slug: 'page-content',
  admin: {
    useAsTitle: 'section',
    defaultColumns: ['page', 'section'],
  },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      options: ['accueil', 'mon-histoire', 'services', 'programmes', 'resultats', 'contact'],
    },
    { name: 'section', type: 'text', required: true },   // ex: 'hero_titre', 'intro_texte'
    { name: 'titre', type: 'text' },
    { name: 'contenu', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
```

**Alternative Globals:** Payload supporte aussi les Globals (un document singleton par entite). Pour des pages uniques comme l'accueil, un Global `AccueilPage` serait plus intuitif dans l'admin que de filtrer une collection. Cependant, les Globals ne peuvent pas etre references dans des Relationship fields, ce qui les rend moins flexibles. Recommandation : utiliser des Globals distincts par page en Phase 3 si l'UX admin en a besoin — pour Phase 1, la collection PageContent suffit pour definir le schema.

### Anti-Patterns to Avoid

- **Ne pas commencer le design avant que `npm run dev` tourne.** La configuration Payload (DATABASE_URI manquant, PAYLOAD_SECRET absent) produit des erreurs cryptiques au demarrage — debugger le setup d'abord.
- **Ne pas utiliser `@payloadcms/db-vercel-postgres` a la place de `@payloadcms/db-postgres`.** Les deux existent ; `db-postgres` avec la connection string Neon est la voie correcte pour ce projet.
- **Ne pas committer `.env.local`** — le `PAYLOAD_SECRET` et `DATABASE_URI` sont des secrets. Committer uniquement `.env.example` avec des valeurs placeholder.
- **Ne pas appeler `payload.init()` manuellement** — Payload 3 s'initialise automatiquement via le fichier `payload.config.ts` et les routes Next.js dans `(payload)`. Un appel manuel produit des doublons de connexion.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentification admin | Custom JWT + bcrypt + session store | Payload built-in auth | Payload gere JWT, cookies HTTP-only, reset password, creation du premier user au demarrage |
| Interface CRUD collections | Formulaires React custom | Payload Admin UI | Admin complet auto-genere depuis les schemas collections — zero code UI pour la Phase 1 |
| Stockage et URL de fichiers | Upload handler custom + URL generation | `@payloadcms/storage-vercel-blob` | Gere BLOB_READ_WRITE_TOKEN, URLs publiques, et disableLocalStorage automatiquement |
| Migrations PostgreSQL | SQL manuel ou Drizzle standalone | `payload migrate` | Payload gere les migrations Drizzle en interne — `payload migrate:create` + `payload migrate` |
| Types TypeScript des collections | Interfaces manuelles | `payload generate:types` | Payload genere `payload-types.ts` depuis le schema — types toujours en sync |

**Key insight:** Payload 3 est un framework complet, pas une librairie. Ne construire que ce que Payload ne fournit pas (pages publiques, design system, logique metier specifique).

---

## Common Pitfalls

### Pitfall 1: DATABASE_URI — URL directe vs URL poolee Neon

**What goes wrong:** On configure `DATABASE_URI` avec l'URL directe Neon (sans `-pooler` dans le hostname). En dev c'est transparent. En prod sur Vercel (serverless), chaque invocation ouvre une nouvelle connexion TCP — Neon atteint sa limite de connexions simultanees tres vite et renvoie des erreurs `too many connections`.

**Why it happens:** Neon fournit deux URLs differentes dans son dashboard : directe et poolee. La difference n'est pas evidente a premiere vue.

**How to avoid:** Toujours utiliser l'URL poolee pour `DATABASE_URI` (elle contient `-pooler` dans le hostname, ex: `ep-cool-rain-123456-pooler.us-east-2.aws.neon.tech`). L'URL poolee route via PgBouncer integre a Neon.

**Warning signs:** Erreurs `connection refused` ou `too many connections` intermittentes en production sur Vercel.

### Pitfall 2: `clientUploads: true` desactive les imageSizes

**What goes wrong:** On configure `imageSizes` avec conversion WebP dans la collection Media, on deploie sur Vercel, et les thumbnails / versions WebP ne sont jamais generees. Les photos sont stockees en JPEG original uniquement.

**Why it happens:** `clientUploads: true` dans le plugin Vercel Blob fait que le fichier est uploade directement du navigateur vers Vercel Blob — il ne passe jamais par le serveur Next.js / Sharp. Le traitement `imageSizes` est donc bypasse.

**How to avoid:** Accepter la limitation en Phase 1 et documenter. En Phase 3 (admin), evaluer si un middleware de traitement cote client (ex: `browser-image-compression`) peut pre-compresser avant l'upload. Alternativement, un webhook post-upload pourrait declencher un traitement cote serveur, mais c'est complexe. Pour v1, les images sont en format original via Vercel Blob ; `next/image` assure la conversion WebP a l'affichage via son optimiseur.

**Warning signs:** Collection Media configuree avec `imageSizes` ET `clientUploads: true` sans commentaire documentant la limitation.

### Pitfall 3: Premier demarrage sans migration — Payload en mode "push" en dev

**What goes wrong:** On lance `npm run dev` avec Neon PostgreSQL et Payload modifie le schema directement en base (mode push). On commence ensuite a faire des migrations propres avec `payload migrate` et Payload detecte un conflit entre l'etat push precedent et les fichiers de migration.

**Why it happens:** En mode dev, Payload synchronise automatiquement le schema (`db push`). En prod, il faut des fichiers de migration explicites. Si on commence avec le push puis tente de passer aux migrations, il y a un "drift" a resoudre manuellement via SQL.

**How to avoid:** Des Phase 1, generer une migration initiale apres avoir defini toutes les collections : `npx payload migrate:create --name=initial`. Lancer ensuite `npx payload migrate` pour l'appliquer. Ne jamais laisser Payload en mode push pur si on deploie sur Vercel — le mode push est explicitement unsafe en production.

**Warning signs:** La table `payload_migrations` contient une ligne avec le marker dev-mode (`_dev`) sans aucune migration fichier correspondante.

### Pitfall 4: PAYLOAD_SECRET trop court ou previsible

**What goes wrong:** En copiant un exemple, on utilise `PAYLOAD_SECRET=my-secret` ou une chaine de 8 caracteres. En production, cela fragilise la signature des JWT admin.

**How to avoid:** Generer un secret cryptographiquement aleatoire d'au moins 32 caracteres : `openssl rand -hex 32`. Stocker uniquement dans les variables d'environnement Vercel — jamais dans le code ou dans un `.env.local` committe.

### Pitfall 5: `<html lang="fr">` manquant — oublie en posant le layout

**What goes wrong:** Le root layout `layout.tsx` est cree sans `lang="fr"` sur la balise `<html>`. Les 5 phases se construisent par-dessus. Au lancement, Google indexe le site sans signal de langue et les outils SEO rapportent une erreur d'accessibilite.

**How to avoid:** Phase 1 definit le root layout — mettre `lang="fr"` des maintenant, ca ne peut pas etre oublie plus tard.

---

## Code Examples

### Variables d'environnement requises (`.env.local`)

```bash
# Neon PostgreSQL — URL poolee (avec -pooler dans le hostname)
DATABASE_URI=postgres://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Payload secret — generer avec: openssl rand -hex 32
PAYLOAD_SECRET=your-32-char-minimum-random-secret

# Vercel Blob — token disponible dans Vercel Dashboard > Storage > Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx

# URL publique du site (utilisee par Payload pour construire les URLs)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Collection Programmes (`Programmes.ts`)

```typescript
// D-08: titre, description rich text, duree, objectifs, public cible, image couverture, ordre
import { CollectionConfig } from 'payload'

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'duree', 'ordre'],
  },
  fields: [
    { name: 'titre', type: 'text', required: true },
    { name: 'description', type: 'richText', required: true },
    { name: 'duree', type: 'text', required: true },   // ex: "12 semaines"
    { name: 'objectifs', type: 'textarea' },
    { name: 'publicCible', type: 'textarea' },
    { name: 'imageCouverture', type: 'upload', relationTo: 'media' },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordre d\'affichage sur la page Programmes (croissant)' },
    },
  ],
}
```

### Collection Users (admin single user)

```typescript
// Payload cree automatiquement une collection Users pour l'authentification
// On la personnalise minimalement — le premier user est cree via /admin au premier lancement
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,   // Active l'authentification Payload pour cette collection
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // email et password sont automatiquement ajoutes par auth: true
  ],
}
```

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime Next.js/Payload | ✓ | v18.19.1 | — |
| npm / pnpm | Gestionnaire paquets | ✓ | npm 9.2.0 / pnpm 9.2.0 | — |
| Neon PostgreSQL | Base de donnees | Externe (compte a creer) | Managed | Aucun — requis D-15 |
| Vercel Blob | Stockage images | Externe (compte Vercel a creer) | Managed | Aucun — requis D-13 |
| Internet access | npm install, Neon | ✓ | — | — |

**Note Node.js:** v18.19.1 est supporte par Next.js 16 (minimum recommande Node.js 18.18). Compatible.

**Missing dependencies with no fallback:**
- Compte Neon PostgreSQL actif avec projet cree et connection string poolee disponible
- Compte Vercel avec Blob Storage active et `BLOB_READ_WRITE_TOKEN` genere

Ces deux items sont des prerequis humains (creation de compte, pas du code) — le plan doit inclure une etape de setup des comptes cloud avant le premier `npm run dev`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Aucun detecte — projet greenfield |
| Config file | none — a creer si tests ajoutes |
| Quick run command | `pnpm test` (a configurer) |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | Palette et polices appliquees dans le layout | smoke / visuel | Verification manuelle dans le navigateur | ❌ Wave 0 |
| DPLY-01 | `npm run dev` demarre sans erreur, `/admin` accessible | smoke | `curl -f http://localhost:3000/admin` apres demarrage | ❌ Wave 0 |

### Sampling Rate

- **Par commit:** Demarrage `npm run dev` + verification manuelle `/admin`
- **En fin de phase:** Verification smoke complete des 4 success criteria
- **Phase gate:** Les 4 success criteria verts avant passage en Phase 2

### Wave 0 Gaps

- [ ] Pas de framework de test configure — Phase 1 est une phase de bootstrap ; les tests unitaires sont hors scope pour cette phase. La validation est par smoke test manuel.
- [ ] Si tests formels requis : `pnpm add -D vitest @vitejs/plugin-react` + `vitest.config.ts`

*(Pour Phase 1 (bootstrap + design system), les success criteria sont verifiables manuellement en < 5 minutes. Un framework de test formel apporterait peu de valeur.)*

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` avec `theme.extend.colors` | `@theme` directive dans CSS | Tailwind v4 (2025) | Plus de fichier config JS — tout en CSS |
| `next/font` avec `variable: '--font-x'` + reference dans `tailwind.config.js` | `next/font` variable CSS + reference dans `@theme` inline | Tailwind v4 + Next.js 15+ | Meme pattern `next/font`, raccordement dans `@theme` uniquement |
| Payload 2 : CMS separe du projet Next.js | Payload 3 : installe dans `/app` | Payload 3.0 (nov 2024) | Un seul process, un seul repo |
| `@payloadcms/plugin-cloud-storage` | `@payloadcms/storage-vercel-blob` (package dedie) | Payload 3.x | Plugin cloud-storage v2 n'est plus necessaire pour Vercel Blob |
| Docker Compose pour dev local | Neon PostgreSQL directement depuis dev | Decision D-15 (ce projet) | Pas de conteneur — `npm run dev` seul suffit |

**Deprecated/outdated:**
- `@payloadcms/plugin-cloud-storage` (v2 pattern): remplace par les packages `@payloadcms/storage-*` dedies en Payload 3
- `tailwind.config.js` : toujours supporte en Tailwind v4 via `@config`, mais la voie canonique est `@theme` dans CSS

---

## Open Questions

1. **`clientUploads: true` et imageSizes : confirmation de la limitation**
   - Ce que nous savons : la doc officielle dit que `clientUploads: true` bypasse le traitement serveur
   - Ce qui est flou : existe-t-il un workaround officiel Payload pour avoir a la fois Vercel Blob ET le traitement Sharp ?
   - Recommandation : accepter la limitation en Phase 1, noter en Phase 3 d'investiguer un middleware pre-upload cote client

2. **Globals vs Collection PageContent pour l'UX admin**
   - Ce que nous savons : les Globals sont plus intuitifs pour des pages uniques ; la collection PageContent avec filtre par `page` est plus flexible
   - Ce qui est flou : quel pattern Antoine trouvera plus simple dans l'admin Payload ?
   - Recommandation : commencer avec la collection PageContent en Phase 1 (plus rapide a bootstrapper) ; reevaluer en Phase 3 lors du test UX admin avec Antoine

3. **Node.js v18 sur Vercel : suffisant pour Next.js 16 ?**
   - Ce que nous savons : Next.js 16 recommande Node.js 18.18+ ; la machine locale a v18.19.1 (compatible)
   - Ce qui est flou : Vercel utilise Node.js 20 par defaut depuis 2024 — a verifier dans les settings Vercel au moment du deploy (Phase 1 ne deploie pas, Phase 5 si)
   - Recommandation : aucune action en Phase 1 ; noter pour Phase 5

---

## Sources

### Primary (HIGH confidence)
- [Payload CMS npm — payload@3.81.0](https://www.npmjs.com/package/payload) — version verifiee 2026-04-01
- [Payload Storage Adapters — doc officielle](https://payloadcms.com/docs/upload/storage-adapters) — configuration `@payloadcms/storage-vercel-blob`
- [Payload Postgres adapter — doc officielle](https://payloadcms.com/docs/database/postgres) — configuration DATABASE_URI
- [Payload Array Field — doc officielle](https://payloadcms.com/docs/fields/array) — pattern photos avant/apres
- [Payload Uploads — doc officielle](https://payloadcms.com/docs/upload/overview) — imageSizes, Sharp, WebP
- [Tailwind CSS v4 theme variables — doc officielle](https://tailwindcss.com/docs/theme) — `@theme` directive, namespaces couleurs et polices
- [npm view next version — 16.2.2](https://www.npmjs.com/package/next) — version verifiee 2026-04-01

### Secondary (MEDIUM confidence)
- [Payload CMS + Next.js 16.2 compatibility](https://www.buildwithmatija.com/blog/payload-cms-nextjs-16-compatibility-breakthrough) — confirmation compatibilite Next.js 16
- [Using Payload CMS with Neon Postgres — Neon guide officiel](https://neon.com/guides/payload) — format connection string Neon, setup steps
- [How to configure storage adapters in Payload (Vercel Blob, R2)](https://payloadcms.com/posts/guides/how-to-configure-file-storage-in-payload-with-vercel-blob-r2-and-uploadthing) — configuration clientUploads
- [Google Fonts in Next.js 15 + Tailwind v4](https://www.buildwithmatija.com/blog/how-to-use-custom-google-fonts-in-next-js-15-and-tailwind-v4) — pattern next/font + @theme
- [Payload CMS disable push mode / migration workflow](https://www.buildwithmatija.com/blog/payloadcms-postgres-push-to-migrations) — pitfall mode push vs migrations
- [Neon connection pooling docs](https://neon.com/docs/connect/connection-pooling) — URLs poolees, pgBouncer integre

### Tertiary (LOW confidence)
- [Payload CMS 3 pitfalls community discussion](https://payloadcms.com/community-help/discord/) — erreurs courantes premiere installation, non verifie officiellement

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verifiees via `npm view`, documentation officielle Payload
- Architecture (collections, payload.config): HIGH — patterns directement depuis doc officielle Payload
- Design system Tailwind v4: HIGH — doc officielle Tailwind, pattern next/font stable
- Pitfalls: MEDIUM-HIGH — pitfall clientUploads/imageSizes verifie officiellement ; pitfall migration DATABASE_URI verifie via multiple sources communautaires + doc Neon

**Research date:** 2026-04-01
**Valid until:** 2026-07-01 (stack stable ; Payload 3.x peut patcher mais pas de breaking change attendu)
