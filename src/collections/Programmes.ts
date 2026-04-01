import type { CollectionConfig } from 'payload'

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'duree', 'ordre'],
  },
  fields: [
    { name: 'titre', type: 'text', required: true },
    { name: 'description', type: 'richText', required: true },
    { name: 'duree', type: 'text', required: true },
    { name: 'objectifs', type: 'textarea' },
    { name: 'publicCible', type: 'textarea' },
    { name: 'imageCouverture', type: 'upload', relationTo: 'media' },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: "Ordre d'affichage sur la page Programmes (croissant)",
      },
    },
  ],
}
