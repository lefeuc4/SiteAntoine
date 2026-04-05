import type { GlobalConfig } from 'payload'

export const Accueil: GlobalConfig = {
  slug: 'accueil',
  label: 'Accueil',
  admin: {
    description: "Contenu de la page d'accueil (hero, presentation, CTA)",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitre',
      type: 'text',
      label: 'Titre Hero',
      required: true,
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      label: 'Description Hero',
      required: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image Hero',
    },
    {
      name: 'presentation',
      type: 'textarea',
      label: 'Texte de presentation',
      required: true,
    },
    {
      name: 'ctaTitre',
      type: 'text',
      label: 'Titre du bandeau CTA',
      required: true,
    },
  ],
}
