import type { CollectionConfig } from 'payload'
import { createConfirmDeleteHook } from '@/hooks/confirmDeleteHook'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: true, // Masque de la sidebar — mot de passe via menu profil (D-11)
  },
  hooks: {
    beforeDelete: [createConfirmDeleteHook('email')],
  },
  fields: [
    // email and password are automatically added by auth: true
  ],
}
