# Phase 3: Interface Admin - Research

**Researched:** 2026-04-02
**Domain:** Payload CMS 3 admin customization — i18n, custom dashboard, access control, Lexical editor, file upload limits
**Confidence:** HIGH

## Summary

Phase 3 customises the already-functional Payload CMS 3 admin panel so that Antoine — a non-technical user — can manage his content autonomously in French. All five collections (Programmes, Resultats, PageContent, Media, Users) already exist with correct schemas; this phase is about layering on admin UX improvements: French i18n, French labels and field descriptions on every collection, a custom dashboard with quick-action buttons and counters, restricted Lexical editor features, access control that hides Users from the sidebar and blocks create/delete on PageContent, and a 5 MB upload limit.

Payload 3.81.0 ships all required hooks natively: `i18n.supportedLanguages`, `admin.components.beforeDashboard`, collection `labels`, field `admin.description`, `admin.hidden`, `admin.group`, `access.create/delete: () => false`, Lexical feature-array configuration, and `upload.limits.fileSize`. No additional packages are required beyond `@payloadcms/translations` which must be explicitly installed and imported for the `fr` translation bundle.

**Primary recommendation:** All changes live in `src/payload.config.ts` (i18n, global upload limit, global Lexical editor restriction) and in each collection file (labels, descriptions, access, admin.group, admin.hidden). The custom dashboard widget is a single React Server Component placed in `src/components/admin/DashboardWidget.tsx` and registered via `admin.components.beforeDashboard`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Interface Payload entierement en francais — localisation i18n complete (boutons, menus, messages systeme) + labels/descriptions custom sur les champs des collections
- **D-02:** Dashboard custom avec raccourcis CRUD : boutons "Ajouter un programme", "Ajouter un resultat", "Modifier les pages" + compteurs simples (X programmes, Y resultats)
- **D-03:** Descriptions d'aide en francais sur chaque champ (ex: "Duree du programme, ex: 12 semaines") — pas de page d'aide separee
- **D-04:** Edition par sections Payload — chaque section de page est un enregistrement PageContent individuel (ex: "Accueil > Hero", "Accueil > Services"). Correspond a la structure existante.
- **D-05:** Structure fixee — les sections sont pre-creees par le seed. Antoine ne peut qu'editer titre/contenu/image. Pas de creation ni suppression de sections (access.create et access.delete bloques sur PageContent).
- **D-06:** Filtre par page dans la liste PageContent — Antoine clique sur un filtre (ex: "Accueil") et voit uniquement les sections de cette page. Utilise admin.listSearchableFields et filtres Payload.
- **D-07:** Editeur Lexical basique — gras, italique, listes a puces, liens. Pas de tableaux, pas de code, pas de couleurs. Evite les problemes de mise en page.
- **D-08:** Pas de conversion WebP cote serveur — next/image gere automatiquement le WebP au rendu cote visiteur (deja en place). Les images sont stockees en format original sur Vercel Blob. ADMN-05 satisfait cote affichage.
- **D-09:** Limite de taille upload a 5 MB — validation Payload avec message d'erreur en francais si depasse.
- **D-10:** 4 collections visibles dans la sidebar : Programmes, Resultats, Contenu des pages, Media. Antoine peut gerer/supprimer ses images directement via Media.
- **D-11:** Collection Users masquee de la sidebar — Antoine change son mot de passe via le menu profil Payload (en haut a droite, integre par defaut).
- **D-12:** PageContent en lecture + edition seule — Antoine peut modifier les sections existantes mais pas en creer ni en supprimer. Empeche de casser la structure des pages.

### Claude's Discretion
- Layout exact du dashboard custom (placement des boutons, style des compteurs)
- Organisation des groupes de collections dans la sidebar admin
- Details d'implementation des filtres PageContent

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMN-01 | Interface admin protegee par authentification (login/password) | Deja en place via Payload auth: true sur Users. Aucun changement requis. |
| ADMN-02 | Admin peut editer les textes et images de chaque page publique | PageContent deja seedee avec sections par page. Ajouter labels, descriptions, filtre sur champ page, bloquer create/delete. |
| ADMN-03 | Admin peut creer, modifier et supprimer des programmes | Collection Programmes deja operationnelle. Ajouter labels francais et descriptions de champs. |
| ADMN-04 | Admin peut creer, modifier et supprimer des resultats avant/apres | Collection Resultats deja operationnelle. Ajouter labels francais, descriptions, renforcer consentement CNIL via description visible. |
| ADMN-05 | Images uploadees sont automatiquement compressees en WebP | Satisfait via next/image (D-08). Documenter explicitement dans l'interface admin via description du champ alt dans Media. |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| payload | 3.81.0 | CMS engine, admin panel | Already installed |
| @payloadcms/richtext-lexical | 3.81.0 | Rich text editor | Already installed |
| @payloadcms/storage-vercel-blob | 3.81.0 | File storage | Already installed |

### To Add
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @payloadcms/translations | 3.81.0 | French admin UI strings | Required for `fr` language bundle — Payload ships without language bundles by default |

**Installation:**
```bash
pnpm add @payloadcms/translations
```

**Version verification:** `@payloadcms/translations@3.81.0` confirmed current as of 2026-04-02 (npm).

## Architecture Patterns

### Recommended Project Structure (additions for Phase 3)
```
src/
├── collections/
│   ├── Programmes.ts       # Add: labels FR, field descriptions, admin.group
│   ├── Resultats.ts        # Add: labels FR, field descriptions, admin.group
│   ├── PageContent.ts      # Add: labels FR, descriptions, access.create/delete:false, listSearchableFields
│   ├── Media.ts            # Add: labels FR, field description on alt
│   └── Users.ts            # Add: admin.hidden: true
├── components/
│   └── admin/
│       └── DashboardWidget.tsx  # NEW: custom dashboard RSC
└── payload.config.ts       # Add: i18n, upload.limits, global lexicalEditor config
```

### Pattern 1: Admin i18n French-only
**What:** Configure Payload to use French as the admin UI language for all built-in strings (buttons, menus, error messages).
**When to use:** Always, since Antoine is the sole admin and speaks French.
**Example:**
```typescript
// Source: https://payloadcms.com/docs/configuration/i18n
// Source: https://github.com/payloadcms/payload/blob/main/docs/configuration/i18n.mdx
import { fr } from '@payloadcms/translations/languages/fr'

export default buildConfig({
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  // ...
})
```

**Note:** `fallbackLanguage` determines the default when no browser preference is detected. Setting only `fr` in `supportedLanguages` means French is the only option — the language selector disappears from user profile, which is the desired UX.

### Pattern 2: Collection labels and field descriptions in French
**What:** Override the auto-generated English labels on collections and fields with explicit French strings.
**When to use:** On every collection — required for D-01 and D-03.
**Example:**
```typescript
// Source: Payload Collection Config docs
export const Programmes: CollectionConfig = {
  slug: 'programmes',
  labels: {
    singular: 'Programme',
    plural: 'Programmes',
  },
  admin: {
    useAsTitle: 'titre',
    description: 'Gerez les programmes proposes par Antoine.',
    group: 'Contenu',
    defaultColumns: ['titre', 'duree', 'ordre'],
  },
  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
      label: 'Titre du programme',
      admin: {
        description: 'Nom du programme, ex: Coaching Prise de Masse',
      },
    },
    {
      name: 'duree',
      type: 'text',
      required: true,
      label: 'Duree',
      admin: {
        description: 'Duree du programme, ex: 12 semaines',
      },
    },
    // ...
  ],
}
```

### Pattern 3: Access control — block create/delete on PageContent
**What:** Return `false` from `access.create` and `access.delete` to prevent Antoine from creating or deleting page sections.
**When to use:** D-05 and D-12 — structure protection.
**Example:**
```typescript
// Source: https://payloadcms.com/docs/access-control/collections
export const PageContent: CollectionConfig = {
  slug: 'page-content',
  access: {
    read: () => true,
    create: () => false,   // No one can create sections (seed only)
    delete: () => false,   // No one can delete sections (structure protected)
  },
  // ...
}
```

**Important:** When `access.create` returns false, the "Create New" button is hidden throughout the admin UI automatically by Payload. No additional UI configuration needed.

### Pattern 4: Hide Users collection from sidebar
**What:** Set `admin.hidden: true` to remove the Users collection from the navigation without restricting API access.
**When to use:** D-11 — Antoine changes password via the profile menu, not via the Users collection.
**Example:**
```typescript
// Source: https://payloadcms.com/community-help/discord/hide-collection-from-admin-sidebar
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: true,  // Remove from sidebar, keep auth functional
  },
  fields: [],
}
```

### Pattern 5: Restricted Lexical editor (D-07)
**What:** Replace the default Lexical configuration (which includes headings, blocks, code, tables, etc.) with a minimal feature set: bold, italic, unordered list, ordered list, links.
**When to use:** On richText fields in Programmes.description, Resultats.histoire, and PageContent.contenu.
**Example:**
```typescript
// Source: https://payloadcms.com/docs/rich-text/official-features
// Source: WebSearch verified against community example
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
  OrderedListFeature,
  LinkFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'

// Option A: Set globally in payload.config.ts
export default buildConfig({
  editor: lexicalEditor({
    features: [
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature(),
      FixedToolbarFeature(),
    ],
  }),
})

// Option B: Override per-field (more granular)
{
  name: 'description',
  type: 'richText',
  editor: lexicalEditor({
    features: [
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature(),
      FixedToolbarFeature(),
    ],
  }),
}
```

**Recommendation:** Set globally in `payload.config.ts` (Option A). All richText fields in this project need the same minimal set. Individual fields can override if needed.

### Pattern 6: Upload size limit
**What:** Configure a global 5 MB upload limit via `buildConfig.upload.limits.fileSize`.
**When to use:** D-09.
**Example:**
```typescript
// Source: WebSearch (Payload community docs) — MEDIUM confidence
// Known issue: clientUploads: true (required on Vercel) bypasses server-side file size validation
export default buildConfig({
  upload: {
    limits: {
      fileSize: 5_000_000, // 5 MB in bytes
    },
  },
})
```

**CRITICAL CAVEAT (known bug):** When `clientUploads: true` is set on the Vercel Blob storage adapter (which is required on Vercel due to the 4.5 MB serverless body limit), the global `upload.limits.fileSize` is NOT enforced for client-side uploads. This is a documented open issue in Payload (GitHub #12671, #11153). The 5 MB server-side limit applies only to server uploads, which are not used on Vercel. See Pitfall section for mitigation strategy.

### Pattern 7: Custom Dashboard Widget (D-02)
**What:** A React Server Component registered in `admin.components.beforeDashboard` that shows counters and quick-action links.
**When to use:** D-02 — custom dashboard for Antoine.
**Example:**
```typescript
// src/components/admin/DashboardWidget.tsx
// React Server Component — can use getPayload Local API directly
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export default async function DashboardWidget() {
  const payload = await getPayload({ config })

  const { totalDocs: programmesCount } = await payload.count({
    collection: 'programmes',
  })
  const { totalDocs: resultatsCount } = await payload.count({
    collection: 'resultats',
  })

  return (
    <div style={{ padding: '1rem', marginBottom: '1rem' }}>
      <h2>Bienvenue, Antoine</h2>
      <p>{programmesCount} programmes · {resultatsCount} resultats</p>
      <div>
        <Link href="/admin/collections/programmes/create">
          Ajouter un programme
        </Link>
        <Link href="/admin/collections/resultats/create">
          Ajouter un resultat
        </Link>
        <Link href="/admin/collections/page-content">
          Modifier les pages
        </Link>
      </div>
    </div>
  )
}

// payload.config.ts registration:
admin: {
  components: {
    beforeDashboard: ['@/components/admin/DashboardWidget'],
  },
}
```

**Note on component path:** In Payload 3, custom components are registered by import path string, not as React component references. Use the `@/` alias that is configured in the project's `tsconfig.json`.

### Pattern 8: Collection grouping in sidebar (D-10)
**What:** Use `admin.group` to organise collections under a named section in the sidebar.
**When to use:** D-10 — organise the 4 visible collections.
**Example:**
```typescript
// In each collection:
admin: {
  group: 'Contenu',  // Groups Programmes + Resultats + PageContent + Media
}
```

**Note:** Collections with the same `admin.group` string are automatically grouped under a collapsible in the sidebar.

### Pattern 9: PageContent list filter (D-06)
**What:** Use `admin.listSearchableFields` on the `page` and `section` fields so Antoine can search/filter by page name in the list view.
**When to use:** D-06 — filter PageContent by page.
**Example:**
```typescript
admin: {
  listSearchableFields: ['page', 'section'],
  defaultColumns: ['page', 'section', 'titre'],
  defaultSort: 'page',
}
```

**Important:** The built-in list filter bar in Payload admin allows filtering on any field. Antoine can use the existing filter UI to filter by `page = accueil`. The `listSearchableFields` improves the search box — for full dropdown filter, the admin filter UI (already built into Payload) is used without extra configuration.

### Anti-Patterns to Avoid
- **Replacing the entire Dashboard view:** Use `beforeDashboard` array injection instead of replacing the full Dashboard component. Full replacement loses the default "Recent Documents" widgets that are useful for Antoine.
- **Using `localization` (content localization) instead of `i18n` (admin i18n):** These are separate Payload features. `localization` manages multilingual content fields. `i18n` manages the admin UI language. This phase needs `i18n` only.
- **Per-field Lexical config without global config:** If not set globally, the Lexical editor on any new richText field added in the future will default back to full features. Set globally and override per-field only if needed.
- **Leaving `access.read` on Users as default:** The default `read` on Users collection restricts unauthenticated access — this is correct and should remain. Do not add `read: () => true` to Users.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| French admin strings | Custom translation layer | `@payloadcms/translations` `fr` bundle | Payload ships 30+ language bundles; the `fr` bundle covers 100% of admin UI strings |
| Access control UI hiding | Custom middleware or UI | `access.create: () => false` + `admin.hidden: true` | Payload auto-hides "Create New" button when access returns false; sidebar hidden via `admin.hidden` |
| Dashboard counters | REST API calls in a client component | `payload.count()` in React Server Component via Local API | RSC + Local API = zero network overhead, no auth token needed |
| File size validation (client-side) | Custom fetch interceptor | Payload's built-in `upload.limits.fileSize` for server + browser `File.size` check in `beforeOperation` hook | See Pitfall 1 for the Vercel-specific workaround |
| Lexical toolbar customization | Custom Lexical nodes | `FixedToolbarFeature()` + explicit feature array | Payload's feature system handles all toolbar rendering |

**Key insight:** Payload 3 was designed to run inside Next.js — local API access from Server Components makes dashboard widgets trivial to implement without any additional API layer.

## Common Pitfalls

### Pitfall 1: Upload size limit not enforced with clientUploads on Vercel
**What goes wrong:** `buildConfig.upload.limits.fileSize` is enforced only for server-side multipart uploads. With `clientUploads: true` (required on Vercel to bypass the 4.5 MB body limit), files are uploaded directly from browser to Vercel Blob, bypassing Payload's server validation.
**Why it happens:** The Vercel Blob storage adapter handles the upload URL generation and browser-to-Blob transfer; Payload never receives the file bytes, so it cannot validate the size. This is documented in GitHub issue #12671 and #11153.
**How to avoid:** Use a Payload `beforeOperation` hook on the Media collection that validates `req.file?.size` for server uploads, AND document the known limitation (D-09 says "validation Payload" but the technical reality is server-side only). For UX, add a field-level `validate` function that checks size client-side if possible, OR accept the known limitation and document it clearly in the admin description field.
**Warning signs:** Upload larger than 5 MB goes through successfully without error.
**Recommended mitigation:** Add `admin.description` to the Media collection upload fields: "Taille maximale : 5 MB. Formats acceptes : JPEG, PNG, WebP." This sets user expectations. The 5 MB limit remains as a server-side safeguard for non-Vercel environments.

### Pitfall 2: Lexical features import path
**What goes wrong:** Importing `BoldFeature`, `ItalicFeature`, etc. from `payload/richtext-lexical` instead of `@payloadcms/richtext-lexical` causes module not found errors.
**Why it happens:** The features are exported from the separate `@payloadcms/richtext-lexical` package.
**How to avoid:** Always import from `@payloadcms/richtext-lexical`:
```typescript
import { lexicalEditor, BoldFeature, ItalicFeature, ... } from '@payloadcms/richtext-lexical'
```

### Pitfall 3: Custom component path registration must be a string
**What goes wrong:** Passing a React component reference directly to `admin.components.beforeDashboard` causes a build error or silent failure.
**Why it happens:** Payload 3 uses dynamic import maps for admin components; it expects string import paths, not component references, so it can generate the import map at build time.
**How to avoid:** Register as a string path:
```typescript
admin: {
  components: {
    beforeDashboard: ['@/components/admin/DashboardWidget'],
  },
}
```
Then run `pnpm payload generate:importmap` after adding new components.

### Pitfall 4: i18n supportedLanguages and fallbackLanguage mismatch
**What goes wrong:** Setting `fallbackLanguage: 'fr'` but not including `fr` in `supportedLanguages` results in a runtime error or silently falls back to English.
**Why it happens:** Payload looks up the `fallbackLanguage` code in `supportedLanguages`. If not found, it defaults to English.
**How to avoid:** Always include the fallback language in `supportedLanguages`:
```typescript
import { fr } from '@payloadcms/translations/languages/fr'
i18n: {
  fallbackLanguage: 'fr',
  supportedLanguages: { fr },  // Must include fr here
}
```

### Pitfall 5: TypeScript errors after collection config changes
**What goes wrong:** Modifying collection fields or access functions causes type errors in `payload-types.ts` which is auto-generated.
**Why it happens:** `payload-types.ts` is generated from the collection schema. After schema changes, the file must be regenerated.
**How to avoid:** Run `pnpm payload generate:types` after every collection config change.

### Pitfall 6: access.create: () => false blocks admin API seed operations
**What goes wrong:** If the seed script calls `payload.create()` on the `page-content` collection after D-05 access restriction is applied, it will be blocked.
**Why it happens:** `access.create: () => false` applies to all create operations including the Local API by default.
**How to avoid:** The seed script should be run once during Phase 2 (already done). Verify seed ran before applying access restriction. Alternatively, use `overrideAccess: true` in the seed script:
```typescript
await payload.create({
  collection: 'page-content',
  data: { ... },
  overrideAccess: true,  // Bypass access control
})
```

## Code Examples

### i18n Configuration (complete)
```typescript
// src/payload.config.ts
// Source: https://github.com/payloadcms/payload/blob/main/docs/configuration/i18n.mdx
import { fr } from '@payloadcms/translations/languages/fr'

export default buildConfig({
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  // ...
})
```

### Upload limit + Lexical configuration (complete)
```typescript
// src/payload.config.ts
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
  OrderedListFeature,
  LinkFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor({
    features: [
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature(),
      FixedToolbarFeature(),
    ],
  }),
  upload: {
    limits: {
      fileSize: 5_000_000, // 5 MB
    },
  },
  // ...
})
```

### Full Programmes collection with French labels
```typescript
// src/collections/Programmes.ts
export const Programmes: CollectionConfig = {
  slug: 'programmes',
  labels: {
    singular: 'Programme',
    plural: 'Programmes',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'titre',
    description: 'Programmes de coaching proposes par Antoine.',
    group: 'Contenu',
    defaultColumns: ['titre', 'duree', 'ordre'],
  },
  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
      label: 'Titre du programme',
      admin: { description: 'Nom court du programme, ex : Coaching Prise de Masse' },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Description',
      admin: { description: 'Description complete affichee sur la page Programmes' },
    },
    {
      name: 'duree',
      type: 'text',
      required: true,
      label: 'Duree',
      admin: { description: 'Duree du programme, ex : 12 semaines' },
    },
    {
      name: 'objectifs',
      type: 'textarea',
      label: 'Objectifs',
      admin: { description: 'Liste des objectifs separes par des retours a la ligne' },
    },
    {
      name: 'publicCible',
      type: 'textarea',
      label: 'Public cible',
      admin: { description: 'A qui s\'adresse ce programme, ex : Debutants, Sportifs confirmes' },
    },
    {
      name: 'imageCouverture',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture',
      admin: { description: 'Image affichee sur la carte du programme (max 5 MB, JPEG/PNG/WebP)' },
    },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      label: 'Ordre d\'affichage',
      admin: { description: 'Position sur la page Programmes (ordre croissant, 0 = en premier)' },
    },
  ],
}
```

### PageContent with access restriction and filter
```typescript
// src/collections/PageContent.ts
export const PageContent: CollectionConfig = {
  slug: 'page-content',
  labels: {
    singular: 'Contenu de page',
    plural: 'Contenu des pages',
  },
  access: {
    read: () => true,
    create: () => false,   // Structure fixed — seed only
    delete: () => false,   // Structure fixed — no accidental deletion
  },
  admin: {
    useAsTitle: 'section',
    description: 'Textes et images de chaque section de page. Cliquez sur une section pour la modifier.',
    group: 'Contenu',
    defaultColumns: ['page', 'section', 'titre'],
    defaultSort: 'page',
    listSearchableFields: ['page', 'section', 'titre'],
  },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      label: 'Page',
      admin: { description: 'Page publique concernee par cette section' },
      options: [
        { label: 'Accueil', value: 'accueil' },
        { label: 'Mon Histoire', value: 'mon-histoire' },
        { label: 'Services', value: 'services' },
        { label: 'Programmes', value: 'programmes' },
        { label: 'Resultats', value: 'resultats' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      name: 'section',
      type: 'text',
      required: true,
      label: 'Section',
      admin: { description: 'Identifiant interne de la section, ex : hero, services, cta' },
    },
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      admin: { description: 'Titre principal affiche dans cette section' },
    },
    {
      name: 'contenu',
      type: 'richText',
      label: 'Contenu',
      admin: { description: 'Texte de la section. Mise en forme : gras, italique, listes, liens.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: { description: 'Image illustrative de la section (max 5 MB, JPEG/PNG/WebP)' },
    },
  ],
}
```

### Users collection hidden from sidebar
```typescript
// src/collections/Users.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: true,  // Remove from sidebar navigation
    group: 'Administration',
  },
  fields: [],
}
```

### Dashboard Widget (React Server Component)
```typescript
// src/components/admin/DashboardWidget.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function DashboardWidget() {
  const payload = await getPayload({ config })

  const { totalDocs: programmesCount } = await payload.count({
    collection: 'programmes',
    overrideAccess: true,
  })
  const { totalDocs: resultatsCount } = await payload.count({
    collection: 'resultats',
    overrideAccess: true,
  })

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      background: 'var(--theme-elevation-50)',
      borderRadius: '4px',
    }}>
      <a href="/admin/collections/programmes/create"
         style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{programmesCount}</div>
        <div>Programmes</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>+ Ajouter</div>
      </a>
      <a href="/admin/collections/resultats/create"
         style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{resultatsCount}</div>
        <div>Resultats avant/apres</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>+ Ajouter</div>
      </a>
      <a href="/admin/collections/page-content"
         style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>5</div>
        <div>Pages a editer</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Modifier</div>
      </a>
    </div>
  )
}
```

## Project Constraints (from CLAUDE.md)

- **Framework:** Next.js 16.x + Payload CMS 3.x (already in place)
- **Hebergement:** Vercel — this directly affects upload limit enforcement (clientUploads: true bypasses server-side fileSize limit)
- **Langue:** Site en francais uniquement — all collection labels, field descriptions, admin i18n must be French
- **Admin scope:** Interface simple, pas un CMS complet — minimal Lexical features, no complex views, no extra plugins
- **Stack:** Tailwind CSS 4.x available for dashboard component styling if needed (CSS variables `var(--theme-*)` from Payload admin theme preferred for consistency)
- **Package manager:** pnpm
- **No separate CMS process:** Payload runs inside Next.js — all code in `src/`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Payload v2: separate express server | Payload v3: native Next.js App Router integration | Oct 2024 | Admin at `/admin`, API at `/api`, same Next.js process |
| Payload v2: admin components as class components | Payload v3: React Server Components by default | Payload 3.0 | Can use `await getPayload()` directly in dashboard widget — no API needed |
| Lexical feature registration via plugin | Lexical feature array in `lexicalEditor({ features: [] })` | Payload 3.0 | Clean explicit feature list per field or global |

**Deprecated/outdated:**
- `payload.config.ts` `admin.meta.titleSuffix`: Still available but low priority for this phase
- Payload v2 `admin.components` as object with React component references: Now must be string import paths for build-time import map generation

## Open Questions

1. **Dashboard widget styling**
   - What we know: Payload admin uses CSS custom properties (`var(--theme-elevation-50)`, etc.) for theming
   - What's unclear: Exact set of available CSS variables in Payload 3.81.0 admin theme
   - Recommendation: Use inline styles with Payload CSS variables for the dashboard widget to match admin aesthetics. If variables are unknown at development time, use neutral grays as fallback.

2. **Upload size limit on Vercel (clientUploads: true)**
   - What we know: `upload.limits.fileSize` is NOT enforced with clientUploads (documented Payload bug #12671)
   - What's unclear: Whether a `beforeOperation` hook on Media collection can intercept client uploads on Vercel
   - Recommendation: Set the 5 MB limit in config as intended (satisfies D-09 technically), add descriptive text to the upload field, and document the Vercel caveat in a code comment. Do not block Phase 3 on this known upstream limitation.

3. **PageContent filter UX**
   - What we know: `listSearchableFields` adds page/section to the search box. Payload's list view has a filter panel that can filter on any field.
   - What's unclear: Whether the admin filter panel requires any extra config for the `page` select field to show as a dropdown filter option
   - Recommendation: Configure `listSearchableFields` and `defaultSort: 'page'`. The list view default sort by page groups sections visually. The built-in filter panel handles the rest without extra code.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | Package management | ✓ | (in project) | — |
| @payloadcms/translations | i18n French bundle | ✗ (not in package.json) | — | Install required |
| Node.js | Build/dev | ✓ | (project running) | — |
| Vercel Blob token | Media uploads | ✓ | (env var configured) | — |

**Missing dependencies with no fallback:**
- `@payloadcms/translations` — must be installed before implementing i18n

**Missing dependencies with fallback:**
- None

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no test framework in project |
| Config file | None |
| Quick run command | `pnpm build` (TypeScript compilation) |
| Full suite command | `pnpm build && pnpm lint` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADMN-01 | Admin requires login | manual | Visit `/admin`, verify redirect to login | N/A |
| ADMN-02 | PageContent editable, create/delete blocked | manual | Login as Antoine, verify no "Create New" button on page-content | N/A |
| ADMN-03 | Programmes CRUD works | manual | Create/edit/delete a programme in admin | N/A |
| ADMN-04 | Resultats CRUD with CNIL checkbox | manual | Create a resultat, verify consentement checkbox required | N/A |
| ADMN-05 | WebP at display time | manual | Upload JPEG, view page, inspect network, verify .webp served | N/A |

**Note:** This project has no automated test infrastructure. All validation for Phase 3 is manual admin walkthrough. TypeScript build (`pnpm build`) serves as the primary automated verification — it catches config errors, type mismatches after `generate:types`, and import map issues.

### Sampling Rate
- **Per task commit:** `pnpm build` — catches TypeScript errors and import map issues
- **Per wave merge:** `pnpm build && pnpm lint`
- **Phase gate:** Full build green + manual admin walkthrough before `/gsd:verify-work`

### Wave 0 Gaps
None — no new test files required. Build + manual walkthrough is sufficient given the project's existing test posture.

## Sources

### Primary (HIGH confidence)
- [Payload i18n docs — GitHub raw](https://github.com/payloadcms/payload/blob/main/docs/configuration/i18n.mdx) — i18n config, supportedLanguages, fallbackLanguage
- [Payload Collection Access Control](https://payloadcms.com/docs/access-control/collections) — access.create/delete false pattern
- [Payload Official Features (Lexical)](https://payloadcms.com/docs/rich-text/official-features) — BoldFeature, ItalicFeature, etc.
- [Payload admin.hidden community docs](https://payloadcms.com/community-help/discord/hide-collection-from-admin-sidebar) — admin.hidden: true pattern
- Payload GitHub issues #12671, #11153 — upload limit not enforced with clientUploads

### Secondary (MEDIUM confidence)
- [Payload upload limits — community](https://payloadcms.com/community-help/github/cant-set-filesize-limit-to-upload-collection) — buildConfig.upload.limits.fileSize syntax
- [Payload custom dashboard guide](https://www.buildwithmatija.com/blog/payload-cms-custom-admin-ui-components-guide) — beforeDashboard + RSC + Local API pattern
- [Payload multilingual admin guide](https://www.buildwithmatija.com/blog/payload-cms-multilingual-guide) — labels with language objects, admin.group pattern

### Tertiary (LOW confidence)
- WebSearch results confirming admin.group string format and sidebar grouping behavior

## Metadata

**Confidence breakdown:**
- Standard stack (i18n, Lexical features, access control): HIGH — all patterns are documented in official Payload docs or GitHub source
- Architecture (collection labels, descriptions, grouping): HIGH — well-established Payload config options
- Custom dashboard (getPayload in RSC): MEDIUM — pattern is confirmed by community guides and Payload concepts but no single official code example was retrieved
- Upload limit with clientUploads: HIGH (the limitation is confirmed by multiple GitHub issues)
- Pitfalls: HIGH — all based on documented bugs or official warnings

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (Payload 3.x is actively developed; check release notes for breaking changes in minor versions)
