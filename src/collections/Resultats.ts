import type { CollectionConfig } from 'payload'

export const Resultats: CollectionConfig = {
  slug: 'resultats',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'prenomClient',
  },
  fields: [
    { name: 'prenomClient', type: 'text', required: true },
    { name: 'histoire', type: 'richText', required: true },
    { name: 'programmeSuivi', type: 'text' }, // texte libre, pas de relation (D-11)
    { name: 'duree', type: 'text' },
    { name: 'citation', type: 'textarea' },
    {
      name: 'consentementCNIL',
      type: 'checkbox',
      required: true,
      admin: {
        description:
          'Le client a donne son consentement ecrit pour la publication de ces photos.',
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
