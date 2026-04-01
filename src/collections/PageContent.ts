import type { CollectionConfig } from 'payload'

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
      options: [
        'accueil',
        'mon-histoire',
        'services',
        'programmes',
        'resultats',
        'contact',
      ],
    },
    { name: 'section', type: 'text', required: true },
    { name: 'titre', type: 'text' },
    { name: 'contenu', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
