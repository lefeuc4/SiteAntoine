import type { CollectionConfig } from 'payload'
import { createConfirmDeleteHook } from '@/hooks/confirmDeleteHook'

export const Resultats: CollectionConfig = {
  slug: 'resultats',
  labels: {
    singular: 'Resultat',
    plural: 'Resultats avant/apres',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeDelete: [createConfirmDeleteHook('prenomClient')],
  },
  admin: {
    useAsTitle: 'prenomClient',
    description: 'Gerez les transformations clients avec photos avant/apres et temoignages.',
    group: 'Contenu',
  },
  fields: [
    {
      name: 'prenomClient',
      type: 'text',
      required: true,
      label: 'Prenom du client',
      admin: { description: 'Prenom du client (visible sur le site)' },
    },
    {
      name: 'histoire',
      type: 'richText',
      required: true,
      label: 'Histoire',
      admin: { description: 'Parcours du client : point de depart, evolutions, resultats obtenus' },
    },
    {
      name: 'programmeSuivi',
      type: 'text',
      label: 'Programme suivi',
      admin: { description: 'Nom du programme suivi, ex : Coaching Prise de Masse' },
    },
    {
      name: 'duree',
      type: 'text',
      label: 'Duree du suivi',
      admin: { description: 'Duree du suivi, ex : 3 mois' },
    },
    {
      name: 'citation',
      type: 'textarea',
      label: 'Citation du client',
      admin: { description: 'Citation du client, entre guillemets' },
    },
    {
      name: 'consentementCNIL',
      type: 'checkbox',
      required: true,
      label: 'Consentement CNIL',
      admin: {
        description:
          'Obligatoire — le client a donne son accord ecrit pour la publication de ses photos (conformite CNIL)',
      },
    },
    {
      name: 'photosAvant',
      type: 'array',
      label: 'Photos avant',
      admin: { description: 'Photos avant la transformation (max 5 MB chacune, JPEG/PNG/WebP)' },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true, label: 'Photo' },
      ],
    },
    {
      name: 'photosApres',
      type: 'array',
      label: 'Photos apres',
      admin: { description: 'Photos apres la transformation (max 5 MB chacune, JPEG/PNG/WebP)' },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true, label: 'Photo' },
      ],
    },
  ],
}
