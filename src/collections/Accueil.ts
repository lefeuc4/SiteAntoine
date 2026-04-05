import type { CollectionConfig } from 'payload'

export const Accueil: CollectionConfig = {
  slug: 'accueil',
  labels: {
    singular: 'Accueil',
    plural: 'Accueil',
  },
  access: {
    read: () => true,
    create: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'heroTitre',
    description: "Contenu de la page d'accueil (hero, presentation, CTA)",
    group: 'Pages',
    components: {
      beforeList: ['@/components/admin/SingletonRedirect'],
    },
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
