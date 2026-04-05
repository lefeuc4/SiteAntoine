import type { CollectionConfig } from 'payload'
import { createConfirmDeleteHook } from '@/hooks/confirmDeleteHook'

export const PageContent: CollectionConfig = {
  slug: 'page-content',
  labels: {
    singular: 'Contenu de page',
    plural: 'Contenu des pages',
  },
  access: {
    read: () => true,
    // create and delete unlocked — delete protected by confirmation hook
  },
  hooks: {
    beforeDelete: [createConfirmDeleteHook('section')],
  },
  admin: {
    useAsTitle: 'section',
    description: 'Textes et images de chaque section de page. Cliquez sur une section pour la modifier.',
    group: 'Contenu',
    defaultColumns: ['page', 'section', 'titre'],
    listSearchableFields: ['page', 'section', 'titre'],
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/SafeDeleteButton'],
      },
    },
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
      admin: {
        description:
          'Texte de la section. Mise en forme disponible : gras, italique, listes, liens.',
      },
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
