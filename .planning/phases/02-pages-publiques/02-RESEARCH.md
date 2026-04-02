# Phase 2: Pages Publiques - Research

**Researched:** 2026-04-02
**Domain:** Next.js 16 App Router — pages publiques, composants UI React, Payload local API, slider avant/apres, scroll reveal
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Navigation & Layout
- **D-01:** Header sticky transparent — fond transparent sur le hero, fond solide au scroll (transition fluide)
- **D-02:** Navigation mobile en hamburger menu (menu plein ecran ou slide-in au tap)
- **D-03:** Footer minimal — logo, liens de navigation, lien contact et mentions legales
- **D-04:** Bouton CTA contact dans le header (bleu electrique, toujours visible) — satisfait PAGE-07

#### Page Accueil
- **D-05:** Hero en layout split — texte (proposition de valeur + CTA) a gauche, image/photo a droite
- **D-06:** Sections sous le hero dans l'ordre : apercu services (3-4 cartes), texte de presentation (paragraphe + lien Mon Histoire), resultats en vedette (2-3 avant/apres), bandeau CTA final (pleine largeur)

#### Page Mon Histoire
- **D-07:** Timeline verticale pour le parcours d'Antoine — etapes chronologiques en colonne, progression visuelle

#### Page Mes Services
- **D-08:** Cartes cote a cote en grille (2-3 colonnes desktop, 1 colonne mobile) avec icone, titre, description et CTA

#### Page Les Programmes
- **D-09:** Claude's Discretion — meme approche cartes que Mes Services, adapte aux champs Payload (titre, description, duree, objectifs, public cible)

#### Page Resultats
- **D-10:** Slider comparatif avant/apres — curseur glissant sur image superposee pour chaque resultat
- **D-11:** Informations affichees par carte : slider avant/apres + citation client + prenom/programme/duree
- **D-12:** Layout en grille de cartes (2-3 colonnes desktop)
- **D-13:** Tout visible directement sur la carte — pas de modal ni de page detail

#### Contenu placeholder
- **D-14:** Textes placeholder realistes en francais — contenu fictif mais credible
- **D-15:** Images placeholder en blocs de couleur de la palette avec icones/texte indicatif — pas de photos externes
- **D-16:** Donnees de demo chargees depuis Payload via un script seed — les pages consomment l'API Payload des le depart

### Claude's Discretion
- Style exact des animations au scroll (scroll reveal) et au hover — subtiles, coherentes avec D-05 de Phase 1
- Page Les Programmes : layout et details de presentation
- Breakpoints responsive exacts
- Composants UI a creer (structure des dossiers, nommage)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-01 | Page Accueil : hero + proposition de valeur + apercu services + CTA contact | Hero split layout pattern, getPayload() pour PageContent section "services-apercu" |
| PAGE-02 | Page Mon Histoire : timeline/storytelling du parcours personnel | CSS vertical timeline, donnees depuis PageContent section "mon-histoire" |
| PAGE-03 | Page Mes Services : description claire de chaque offre | Grid de cartes, donnees depuis PageContent section "mes-services", lucide-react icons |
| PAGE-04 | Page Les Programmes : liste chaque programme avec duree, contenu, objectifs, public cible | Grid de cartes, donnees Payload collection `programmes` |
| PAGE-05 | Page Resultats : galerie avant/apres avec temoignage complet | Slider range input + clip-path CSS, donnees Payload collection `resultats` |
| PAGE-06 | Navigation claire max 5 items, accessible depuis toutes les pages | Header/Footer composants, Next.js `<Link>`, hamburger menu client component |
| PAGE-07 | Lien/bouton de contact visible sur chaque page | CTA button dans Header (D-04), satisfait via composant Header global dans RootLayout |
| DSGN-02 | Design mobile-first responsive sur tous les ecrans | Tailwind v4 breakpoints md/lg, mobile-first utility classes |
| DSGN-03 | Chargement de chaque page en moins de 3 secondes | React Server Components (zero JS client bundle), next/image avec placeholder blur, SSR sur Vercel |

</phase_requirements>

---

## Summary

Phase 2 construit 5 pages publiques pour un site de coaching bien-etre. La fondation (Phase 1) a livre le design system Tailwind v4, les collections Payload, et le root layout. Phase 2 cree tous les composants UI depuis zero : Header sticky, Footer, 5 routes Next.js App Router, et le composant slider avant/apres.

La strategie de donnees est claire : toutes les pages sont des React Server Components qui appellent `getPayload()` directement (local API Payload, zero overhead HTTP). Les seuls Client Components sont les elements interactifs : Header (scroll listener + hamburger), ScrollReveal wrapper, et le slider avant/apres (input range event).

Le slider avant/apres (D-10) est l'element technique le plus delicat. L'approche retenue dans l'UI-SPEC — `<input type="range">` natif + `clip-path: inset()` CSS driven par CSS custom property — est parfaitement valide, performante, et ne necessite aucune librairie tierce.

**Primary recommendation:** Separater clairement Server Components (data fetching, layout) des Client Components (interactivite). Ne jamais `"use client"` une page entiere — wrapper uniquement les elements interactifs (Header, slider, scroll reveal).

---

## Standard Stack

### Core (deja installe — Phase 1)

| Library | Version installee | Purpose | Statut |
|---------|------------------|---------|--------|
| Next.js | 16.2.2 | App Router, RSC, routing, next/image | Installe |
| React | 19.0.0 | UI rendering | Installe |
| Payload CMS | 3.81.0 | Local API pour donnees | Installe |
| `@payloadcms/richtext-lexical` | 3.81.0 | RichText renderer | Installe |
| Tailwind CSS | 4.2.2 | Styling utilitaire | Installe |
| TypeScript | 5.x | Type safety, payload-types.ts generee | Installe |

### A installer en Phase 2

| Library | Version | Purpose | Installation |
|---------|---------|---------|-------------|
| lucide-react | 1.7.0 | Icones SVG tree-shakeable pour cartes services/programmes | `pnpm add lucide-react` |

**Verification version lucide-react:** `npm view lucide-react version` => 1.7.0 (verifie 2026-04-02)

### Pas de librairies supplementaires necessaires

| Probleme | Solution retenue | Pourquoi pas de lib |
|----------|-----------------|-------------------|
| Slider avant/apres | `<input type="range">` natif + clip-path CSS | Performant, zero bundle, supporte sur tous les navigateurs modernes |
| Scroll reveal | `IntersectionObserver` natif + classes Tailwind | Specifie dans UI-SPEC, zero dependance |
| Header scroll | `window.scrollY` avec `useEffect` | Simple, une dizaine de lignes |
| Hamburger menu | `useState` React | Pas besoin de lib externe |

**Installation Phase 2:**
```bash
pnpm add lucide-react
```

---

## Architecture Patterns

### Structure des fichiers recommandee

```
src/
├── app/
│   ├── layout.tsx              # ROOT LAYOUT existant — ajouter Header + Footer ici
│   ├── page.tsx                # Accueil (/)
│   ├── mon-histoire/
│   │   └── page.tsx            # Page Mon Histoire
│   ├── services/
│   │   └── page.tsx            # Page Mes Services
│   ├── programmes/
│   │   └── page.tsx            # Page Les Programmes
│   ├── resultats/
│   │   └── page.tsx            # Page Resultats
│   └── (payload)/              # Payload admin — NE PAS TOUCHER
│       └── ...
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Client Component (scroll + hamburger)
│   │   └── Footer.tsx          # Server Component (statique)
│   ├── ui/
│   │   ├── ServiceCard.tsx     # Server Component
│   │   ├── ProgrammeCard.tsx   # Server Component
│   │   ├── ResultatCard.tsx    # Server Component (contient BeforeAfterSlider)
│   │   ├── BeforeAfterSlider.tsx  # Client Component ("use client")
│   │   └── ScrollReveal.tsx    # Client Component ("use client")
│   └── sections/
│       ├── HeroSection.tsx     # Server Component
│       ├── ServicesApercu.tsx  # Server Component
│       ├── ResultatsVedette.tsx # Server Component
│       └── CTABandeau.tsx      # Server Component
├── lib/
│   └── payload.ts              # Helper getPayloadInstance()
└── scripts/
    └── seed.ts                 # Script seed donnees Payload (D-16)
```

### Pattern 1: Fetch de donnees Payload dans un Server Component

C'est le pattern central de toute la phase. Toutes les pages sont des `async` Server Components.

```typescript
// Source: https://payloadcms.com/docs/local-api/overview
// Exemple: src/app/programmes/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProgrammesPage() {
  const payload = await getPayload({ config })

  const { docs: programmes } = await payload.find({
    collection: 'programmes',
    sort: 'ordre',
    limit: 20,
  })

  return (
    <main>
      {programmes.map((prog) => (
        <ProgrammeCard key={prog.id} programme={prog} />
      ))}
    </main>
  )
}
```

**Pourquoi pas de `getPayloadHMR` ou wrapper perso :** Depuis Payload 3.x, `getPayload({ config })` gere nativement le HMR en dev et la prod. Pas besoin de wrapper.

### Pattern 2: Client Component minimal — Header avec scroll

Isoler uniquement la logique interactive dans un Client Component. Le rendu du header est statique, seul l'etat scroll est dynamique.

```typescript
// src/components/layout/Header.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'bg-blanc-pur shadow-sm' : 'bg-transparent'
      }`}
      style={{ transitionDuration: 'var(--transition-slow)' }}
    >
      {/* ... */}
    </header>
  )
}
```

### Pattern 3: Slider avant/apres — range input + clip-path

```typescript
// src/components/ui/BeforeAfterSlider.tsx
'use client'
import { useRef } from 'react'

interface Props {
  avantSrc: string
  apresSrc: string
  prenomClient: string
}

export default function BeforeAfterSlider({ avantSrc, apresSrc, prenomClient }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    // clip-path: inset(0 X% 0 0) revele l'image "avant" jusqu'a val%
    containerRef.current?.style.setProperty('--slider-pos', `${val}%`)
  }

  return (
    <div ref={containerRef} className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
         style={{ '--slider-pos': '50%' } as React.CSSProperties}>
      {/* Image apres — fond complet */}
      <img src={apresSrc} alt={`Photo apres de ${prenomClient}`} className="absolute inset-0 w-full h-full object-cover" />
      {/* Image avant — clippe a droite du slider */}
      <div className="absolute inset-0" style={{ clipPath: 'inset(0 calc(100% - var(--slider-pos)) 0 0)' }}>
        <img src={avantSrc} alt={`Photo avant de ${prenomClient}`} className="w-full h-full object-cover" />
      </div>
      {/* Handle visible */}
      <div className="absolute top-0 bottom-0 w-1 bg-bleu-electrique pointer-events-none"
           style={{ left: 'var(--slider-pos)', transform: 'translateX(-50%)' }} />
      {/* Range input transparent, full overlay */}
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        onInput={handleInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label={`Comparateur avant/apres pour ${prenomClient}`}
      />
    </div>
  )
}
```

**Note importante :** Utiliser `next/image` plutot que `<img>` en production pour la compression WebP automatique. Le composant ci-dessus utilise `<img>` pour la clarte — le plan devra specifier `next/image` avec `fill` prop et `object-fit: cover`.

### Pattern 4: ScrollReveal — wrapper Client Component

```typescript
// src/components/ui/ScrollReveal.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
```

Classes CSS globales a ajouter dans `globals.css` :
```css
.reveal {
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### Pattern 5: Rendu RichText Lexical

Pour les champs `richText` de Payload (histoire dans PageContent, description dans Programmes) :

```typescript
// Source: @payloadcms/richtext-lexical/react export
import { RichText } from '@payloadcms/richtext-lexical/react'

// Dans un Server Component :
<RichText data={doc.description} />
```

L'export `/react` de `@payloadcms/richtext-lexical` (verifie via `package.json exports`) inclut le composant RichText pour rendu RSC. Pas de librairie tierce necessaire.

### Pattern 6: Script seed Payload

```typescript
// src/scripts/seed.ts — execute via `npx ts-node src/scripts/seed.ts` ou payload script
import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // Creer des programmes fictifs
  await payload.create({
    collection: 'programmes',
    data: {
      titre: 'Transformation 12 semaines',
      duree: '12 semaines',
      description: { /* Lexical JSON */ },
      objectifs: 'Perdre 8-10 kg, ameliorer endurance',
      publicCible: 'Adultes 25-45 ans, debutants en coaching',
      ordre: 1,
    },
  })
  // ... autres docs
}

seed().catch(console.error)
```

### Anti-Patterns a Eviter

- **`"use client"` sur une page entiere :** Transforme toute la page en bundle JS client — perd les benefices RSC. Toujours isoler dans des sous-composants.
- **`fetch('/api/...')` dans une page :** Passe par la route HTTP de Payload au lieu de l'API locale — overhead inutile en SSR. Utiliser `getPayload()` directement.
- **Importer `payload.config.ts` dans un Client Component :** Payload config contient des imports serveur (`sharp`, drivers postgres). Toujours passer les donnees comme props depuis le Server Component parent.
- **Composants interactifs sans `"use client"` :** `useState`, `useEffect`, `addEventListener` requierent `"use client"` — oubli = erreur hydration Next.js.
- **Oublier `passive: true` sur scroll listener :** Bloque le thread principal — toujours `addEventListener('scroll', fn, { passive: true })`.

---

## Don't Hand-Roll

| Probleme | Ne pas construire | Utiliser | Pourquoi |
|----------|-----------------|---------|---------|
| Icones SVG | Collection d'icones custom | `lucide-react` | Tree-shaking, accessibilite, 1000+ icones coherentes |
| Rendu RichText Lexical | Parser JSON Lexical custom | `<RichText>` de `@payloadcms/richtext-lexical/react` | Format Lexical est complexe (nodes imbriques, mentions, liens) — le parser officiel gere tous les cas |
| Optimisation images | `<img>` natif | `next/image` | Conversion WebP automatique, lazy loading, blur placeholder, Vercel CDN |
| Routing | `<a href>` HTML natif | `next/link` | Prefetch automatique, navigation SPA sans rechargement complet |
| Font loading | CSS `@import` Google Fonts | `next/font/google` (deja configure) | Zero FOUT, subset automatique, auto-heberge |

**Key insight:** Pour ce projet, le "don't hand-roll" le plus important est le RichText renderer Lexical. Le format JSON Lexical de Payload a des dizaines de types de noeuds (paragraphe, liste, lien, titre, block custom, upload inline, etc.) — ecrire un renderer custom depuis zero prendrait des jours et raterait des cas limites.

---

## Common Pitfalls

### Pitfall 1 : CSS custom property `--slider-pos` non reconnue par TypeScript

**Ce qui va mal :** `style={{ '--slider-pos': '50%' }}` produit une erreur TypeScript car `CSSProperties` ne connait pas les custom properties.
**Pourquoi :** `React.CSSProperties` est strictement type — les `--*` ne sont pas inclus par defaut.
**Comment eviter :** Caster explicitement : `style={{ '--slider-pos': '50%' } as React.CSSProperties}`.
**Signes d'alerte :** Erreur TS `Object literal may only specify known properties`.

### Pitfall 2 : Header transparent casse la lisibilite du texte de navigation

**Ce qui va mal :** Sur des pages sans hero image en haut (Mon Histoire, Services, etc.), le header reste transparent et le texte nav est illisible sur fond blanc.
**Pourquoi :** La transparence est pensee pour le hero de l'Accueil — les autres pages commencent differemment.
**Comment eviter :** Le Header doit detecter `scrollY === 0` ET si une prop `heroPage` est passee (ou forcer fond solide par defaut sur les pages sans hero). Alternative simple : seule la page Accueil a un header transparent au depart — les autres pages commencent avec fond `bg-blanc-pur` directement. Solution recommandee : prop `transparent` optionnelle sur Header, false par defaut, true seulement sur `app/page.tsx`.
**Signes d'alerte :** Texte nav illisible au premier chargement de pages sans hero.

### Pitfall 3 : Payload `getPayload()` lance un appel de base de donnees a chaque render en dev

**Ce qui va mal :** En `next dev`, chaque refresh declenche une nouvelle connexion Payload — lenteur apparente.
**Pourquoi :** HMR reinitialise les modules. Payload 3 gere cela nativement avec un cache singleton en dev (verifie — gestion HMR built-in depuis 3.x).
**Comment eviter :** Ne pas cacher manuellement `getPayload()` — Payload le gere. Utiliser `export const dynamic = 'force-dynamic'` uniquement si besoin de donnees toujours fraiche en prod. Par defaut, Next.js 16 peut mettre en cache le resultat du Server Component.
**Signes d'alerte :** Multiples "Payload initialized" dans la console — normal en dev HMR.

### Pitfall 4 : `next/image` avec `fill` necessite un parent positionne

**Ce qui va mal :** `<Image fill />` sans `position: relative` sur le parent — l'image s'echappe du conteneur ou disparait.
**Pourquoi :** `fill` utilise `position: absolute` sur l'image — necessite un parent `relative` avec dimensions explicites.
**Comment eviter :** Toujours `<div className="relative aspect-[4/3]"><Image fill /></div>`. Definir `sizes` pour aider Next.js calculer les srcset.
**Signes d'alerte :** Image invisible ou qui couvre toute la page.

### Pitfall 5 : Slug de route conflit avec routes Payload

**Ce qui va mal :** Une route `src/app/api/` ou `src/app/admin/` serait shadowed par Payload qui gere `(payload)/api/` et `(payload)/admin/`.
**Pourquoi :** Payload utilise des route groups `(payload)` pour isoler ses routes, mais `app/api/` et `app/admin/` sans parentheses entreraient en conflit.
**Comment eviter :** Les routes publiques sont `accueil` (index `/`), `mon-histoire`, `services`, `programmes`, `resultats` — aucun conflit avec Payload.
**Signes d'alerte :** 404 sur l'admin Payload ou erreur de build sur conflits de routes.

### Pitfall 6 : PageContent collection — structure `items` non scalaire

**Ce qui va mal :** La collection `PageContent` (Phase 1) a les champs `titre`, `contenu` (richText), `image` — mais pas de champ `items[]` pour les sections avec multiple entrees (services-apercu, mon-histoire).
**Pourquoi :** Le schema Phase 1 est minimaliste — il n'a pas de champ `array` items.
**Comment eviter :** Pour Phase 2, il faut soit (a) creer plusieurs documents PageContent (un par item service/etape), soit (b) stocker les items en JSON dans le champ `contenu`. Solution recommandee : **un document PageContent par item** avec `section` = "mon-histoire" ou "services-apercu", en utilisant le champ `titre` et `contenu`. Pour le seed, creer N documents. Cela respecte le schema existant sans migration.
**Signes d'alerte :** Erreur de migration si on tente d'ajouter un champ `array` sans creer une migration Payload.

---

## Code Examples

### Fetch liste de programmes

```typescript
// src/app/programmes/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programmes de Coaching — Antoine Profit',
}

export default async function ProgrammesPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'programmes',
    sort: 'ordre',
    limit: 20,
  })

  return (
    <main className="max-w-[1280px] mx-auto px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-bleu-nuit mb-12">
        Les Programmes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((prog) => (
          <ProgrammeCard key={prog.id} programme={prog} />
        ))}
      </div>
    </main>
  )
}
```

### Fetch resultats avec profondeur

```typescript
// src/app/resultats/page.tsx
const { docs: resultats } = await payload.find({
  collection: 'resultats',
  depth: 2, // Popule les relations Media (photos)
  limit: 20,
})
```

**Note :** `depth: 2` est necessaire pour que les champs `upload` (relation vers `media`) soient peuples avec l'objet Media complet (incluant l'URL Vercel Blob), sinon on obtient juste l'ID.

### Integrer Header et Footer dans RootLayout

```typescript
// src/app/layout.tsx — modification de l'existant
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### Script seed — structure recommandee

```typescript
// src/scripts/seed.ts
import { getPayload } from 'payload'
import config from '../payload.config'

const PROGRAMMES_SEED = [
  {
    titre: 'Transformation 12 semaines',
    duree: '12 semaines',
    objectifs: 'Perdre 8-10 kg, ameliorer endurance cardiovasculaire',
    publicCible: 'Adultes 25-45 ans, debutants ou intermediaires',
    ordre: 1,
  },
  // ... 2 autres programmes
]

async function seed() {
  const payload = await getPayload({ config })

  // Nettoyer avant de seeder
  const existing = await payload.find({ collection: 'programmes', limit: 100 })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'programmes', id: doc.id })
  }

  // Creer les docs
  for (const prog of PROGRAMMES_SEED) {
    await payload.create({ collection: 'programmes', data: prog })
  }

  console.log('Seed termine')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
```

---

## State of the Art

| Ancien Approche | Approche Actuelle | Quand Change | Impact |
|-----------------|------------------|--------------|--------|
| `getPayloadHMR` (Payload 2.x) | `getPayload({ config })` (Payload 3.x) | Payload 3.0 (2024) | Plus simple, HMR gere nativement |
| Pages Router `getServerSideProps` | App Router async Server Components | Next.js 13+ | Fetch direct dans le composant, plus de props drilling |
| `next/image` avec `layout="fill"` | `next/image` avec `fill` prop | Next.js 13 | `layout` prop supprime |
| Tailwind v3 `@layer components` | Tailwind v4 `@theme` CSS variables | Tailwind 4.0 (2025) | Design tokens = CSS variables natives, pas de config JS |
| `forwardRef` React pour composants | Props directes React 19 | React 19 (2024) | Simplifie les composants — `ref` est une prop normale |

**Deprecated/outdated dans ce contexte :**
- `getPayloadHMR` : remplace par `getPayload` — ne pas utiliser
- `next/image layout="fill"` : remplace par `fill` prop directe
- `getServerSideProps` : architecture Pages Router — ne pas utiliser (App Router only)

---

## Open Questions

1. **Header transparent sur pages sans hero**
   - Ce que l'on sait : D-01 specifie "transparent sur le hero" — mais seule la page Accueil a un hero image
   - Ce qui est flou : comportement exact sur les autres pages au top-of-page
   - Recommandation : Le plan doit specifier explicitement que le Header commence en `bg-blanc-pur` sur toutes les pages SAUF Accueil. Une prop `transparentOnLoad` (default: false) passee depuis chaque page.

2. **Script seed — execution**
   - Ce que l'on sait : D-16 exige un script seed ; le projet utilise pnpm + TypeScript ESM (`"type": "module"`)
   - Ce qui est flou : La commande exacte pour lancer un script TS avec `payload` CLI ou `tsx`
   - Recommandation : Ajouter `tsx` comme devDependency (`pnpm add -D tsx`) et un script `"seed": "tsx src/scripts/seed.ts"` dans `package.json`. Alternative : `pnpm payload` si Payload expose un script runner.

3. **Champ `items[]` absent de PageContent**
   - Ce que l'on sait : PageContent a `titre`, `contenu`, `image`, `section`, `page` — pas de `array`
   - Ce qui est flou : Comment stocker les N items d'une section (services-apercu a 3-4 items, mon-histoire a N etapes)
   - Recommandation documentee dans Pitfall 6 : un document par item, filtre par `section`. Le plan doit prevoir cette requete.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime dev | oui | 18.19.1 | — |
| pnpm | Package manager | oui | 10.33.0 | npm |
| Next.js | Framework | oui | 16.2.2 | — |
| Payload CMS | Local API + admin | oui | 3.81.0 | — |
| lucide-react | Icones composants | non (a installer) | 1.7.0 dispo | SVG inline manuel |
| Neon PostgreSQL | Base de donnees | non verifiable localement | — | Connexion via DATABASE_URI env |
| Vercel Blob | Stockage images | non verifiable localement | — | Placeholder couleur (Phase 2 utilise blocs couleur) |

**Missing dependencies with no fallback :**
- `DATABASE_URI` env var doit pointer vers Neon PostgreSQL pour que le seed fonctionne. Sans DB, le script seed echoue.

**Missing dependencies with fallback :**
- `lucide-react` : a installer via `pnpm add lucide-react` — SVG inline utilisable si besoin mais non recommande.
- Vercel Blob : non necessaire en Phase 2 car D-15 specifie blocs couleur placeholder (pas de vraies photos).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Aucun framework de test configure en Phase 1 |
| Config file | Absent — a creer en Wave 0 |
| Quick run command | `pnpm test` (apres configuration) |
| Full suite command | `pnpm test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | Page Accueil rend hero, services, CTA | smoke (build check) | `pnpm build` | Pas encore |
| PAGE-02 | Page Mon Histoire rend timeline | smoke (build check) | `pnpm build` | Pas encore |
| PAGE-03 | Page Mes Services rend cartes | smoke (build check) | `pnpm build` | Pas encore |
| PAGE-04 | Page Les Programmes rend cartes depuis Payload | smoke (build check) | `pnpm build` | Pas encore |
| PAGE-05 | Page Resultats rend slider avant/apres | smoke (build check) | `pnpm build` | Pas encore |
| PAGE-06 | Navigation presente sur toutes les pages | manual | n/a — navigation manuelle | Pas encore |
| PAGE-07 | Bouton contact visible sur toutes les pages | manual | n/a — inspection visuelle | Pas encore |
| DSGN-02 | Layout responsive correct | manual | n/a — DevTools mobile | Pas encore |
| DSGN-03 | Chargement < 3s mobile | manual | `pnpm build && pnpm start` + Lighthouse | Pas encore |

**Note :** Pour ce projet de site vitrine avec React Server Components, les tests les plus utiles sont (a) la compilation TypeScript sans erreur et (b) le build Next.js sans erreur. Les tests d'integration Playwright seraient ideaux pour DSGN-02/DSGN-03 mais sont hors scope Phase 2. Le plan doit specifier `pnpm build` comme gate de verification.

### Sampling Rate

- **Per task commit :** `pnpm build` (verifie TypeScript + rendu statique)
- **Per wave merge :** `pnpm build && pnpm lint`
- **Phase gate :** `pnpm build` green + verification manuelle des 5 pages sur mobile/desktop avant `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Aucun framework de test installe — `pnpm build` est le seul filet de securite automatise
- [ ] `pnpm add lucide-react` — requis avant implementation des composants cartes
- [ ] Variables d'environnement (`DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`) doivent etre presentes pour le seed et le build

*(Si build echoue sans DB connectee, configurer `DATABASE_URI` en Wave 0 du plan.)*

---

## Project Constraints (from CLAUDE.md)

Directives a respecter — le planner doit verifier la conformite :

| Directive | Detail |
|-----------|--------|
| Hebergement | Vercel + Neon PostgreSQL — pas de Docker, pas d'autre provider |
| Langue | Site en francais uniquement — tous les textes, labels, placeholders |
| Admin | Phase 2 ne touche pas l'admin Payload — scope = pages publiques uniquement |
| Stack | Next.js 16 + Payload 3 + Tailwind 4 + TypeScript — pas d'alternatives |
| Pages Router | INTERDIT — App Router uniquement |
| Tailwind v3 | INTERDIT — Tailwind v4 avec `@theme` uniquement |
| Repos separes | INTERDIT — monorepo unique, Payload dans `/app` |
| WordPress | INTERDIT — remplacement en cours |
| Auth custom | Hors scope Phase 2 — Payload auth utilise en Phase 3 |
| GSD Workflow | Toute modification de fichier doit passer par un workflow GSD (`/gsd:execute-phase`) |

---

## Sources

### Primary (HIGH confidence)
- `src/app/globals.css`, `src/app/layout.tsx` — Design tokens et fonts confirmes dans le code Phase 1
- `src/payload-types.ts` — Types Payload generes automatiquement — structure exacte des collections
- `package.json` — Versions installees verifiees directement (Next.js 16.2.2, Payload 3.81.0, Tailwind 4.2.2)
- `src/payload.config.ts` — Configuration Payload verifiee (Vercel Blob, Neon, collections)
- `@payloadcms/richtext-lexical/package.json exports` — Export `/react` confirme disponible
- [Payload Local API Overview](https://payloadcms.com/docs/local-api/overview) — Pattern `getPayload({ config })`
- [Payload Converting JSX](https://payloadcms.com/docs/rich-text/converting-jsx) — RichText renderer

### Secondary (MEDIUM confidence)
- [Mastering Payload CMS 3.0 Local API](https://mm25zamanian.ir/blog/payload-local-api) — Pattern Server Component verifie avec docs officielles
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Pattern separation RSC/CC
- [lucide-react npm](https://www.npmjs.com/package/lucide-react) — Version 1.7.0 verifiee via `npm view`

### Tertiary (LOW confidence)
- Aucun — toutes les affirmations critiques sont verifiees par sources primaires

---

## Metadata

**Confidence breakdown :**
- Standard stack : HIGH — packages installes, versions verifiees dans node_modules et npm registry
- Architecture : HIGH — patterns Payload officiel + Next.js App Router standards
- Slider avant/apres : HIGH — technique native range input + clip-path, aucune librairie, API browser universelle
- Pitfalls : MEDIUM — identifies par analyse du code et patterns connus Next.js/Payload 3
- Script seed : MEDIUM — pattern verifie conceptuellement, commande exacte (`tsx`) a valider en Wave 0

**Research date :** 2026-04-02
**Valid until :** 2026-05-02 (stack stable — Payload 3.x, Next.js 16.x, Tailwind 4.x)
