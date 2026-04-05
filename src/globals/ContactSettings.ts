import type { GlobalConfig } from 'payload'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Parametres Contact',
  admin: {
    description: 'Numero WhatsApp, message pre-rempli et liens reseaux sociaux',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'Numero WhatsApp (format international sans +)',
      required: true,
      defaultValue: '33600000000',
      admin: {
        description: 'Exemple : 33612345678 pour +33 6 12 34 56 78',
      },
    },
    {
      name: 'whatsappMessage',
      type: 'text',
      label: 'Message pre-rempli WhatsApp',
      required: true,
      defaultValue: 'Bonjour Antoine, je suis interesse par vos services...',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'URL Instagram',
      admin: {
        description: 'Laisser vide pour masquer le lien',
      },
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'URL Facebook',
      admin: {
        description: 'Laisser vide pour masquer le lien',
      },
    },
  ],
}
