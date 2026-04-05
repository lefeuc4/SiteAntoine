import type { GlobalConfig } from 'payload'

export const MentionsLegales: GlobalConfig = {
  slug: 'mentions-legales',
  label: 'Mentions Legales',
  admin: {
    description: 'Contenu de la page Mentions Legales (RGPD, hebergeur, SIRET...)',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contenu',
      type: 'richText',
      label: 'Contenu des mentions legales',
      admin: {
        description:
          'Modifier le contenu complet des mentions legales. Les zones [A COMPLETER] doivent etre remplies.',
      },
    },
  ],
}
