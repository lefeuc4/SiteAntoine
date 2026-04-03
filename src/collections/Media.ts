import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Medias',
  },
  access: {
    read: () => true,
  },
  admin: {
    description: "Bibliotheque d'images. Taille maximale : 5 MB. Formats acceptes : JPEG, PNG, WebP.",
    group: 'Contenu',
  },
  upload: {
    // mimeTypes and imageSizes removed: with clientUploads: true (Vercel Blob),
    // the file goes directly to Blob storage. Payload's server never receives the
    // actual file buffer, so image-size crashes and mimeTypes gets text/plain.
    // next/image handles WebP conversion and resizing at display time.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      admin: {
        description: "Texte alternatif pour l'accessibilite. Decrivez l'image en une phrase.",
      },
    },
  ],
}
