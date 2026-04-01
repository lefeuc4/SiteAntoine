import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    // NOTE: imageSizes will NOT take effect with clientUploads: true on Vercel Blob.
    // This is a known limitation (RESEARCH.md Pitfall 2). The config is kept for
    // future server-side processing. next/image handles WebP at display time.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'center' },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'center',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'full',
        width: 1200,
        height: undefined,
        position: 'center',
        formatOptions: { format: 'webp' },
      },
    ],
  },
  fields: [{ name: 'alt', type: 'text' }],
}
