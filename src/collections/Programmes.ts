import type { CollectionConfig } from 'payload'
import { createConfirmDeleteHook } from '@/hooks/confirmDeleteHook'

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  labels: {
    singular: 'Programme',
    plural: 'Programmes',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeDelete: [createConfirmDeleteHook('titre')],
  },
  admin: {
    useAsTitle: 'titre',
    description: 'Gerez les programmes de coaching proposes par Antoine.',
    group: 'Pages',
    defaultColumns: ['titre', 'duree', 'ordre'],
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/SafeDeleteButton'],
      },
    },
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
      admin: { description: 'Liste des objectifs, un par ligne' },
    },
    {
      name: 'publicCible',
      type: 'textarea',
      label: 'Public cible',
      admin: { description: "A qui s'adresse ce programme, ex : Debutants, Sportifs confirmes" },
    },
    {
      name: 'imageCouverture',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture',
      admin: { description: 'Image affichee sur la carte (max 5 MB, JPEG/PNG/WebP)' },
    },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      label: "Ordre d'affichage",
      admin: { description: 'Position sur la page (ordre croissant, 0 = en premier)' },
    },
  ],
}
