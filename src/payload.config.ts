import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { fr } from '@payloadcms/translations/languages/fr'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnorderedListFeature,
  OrderedListFeature,
  LinkFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Programmes } from './collections/Programmes'
import { Resultats } from './collections/Resultats'
import { PageContent } from './collections/PageContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: {
    components: {
      beforeDashboard: ['@/components/admin/DashboardWidget'],
    },
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  editor: lexicalEditor({
    features: [
      BoldFeature(),
      ItalicFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature(),
      FixedToolbarFeature(),
    ],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      clientUploads: true, // REQUIRED on Vercel — server limit 4.5 MB
    }),
  ],
  upload: {
    limits: {
      fileSize: 5_000_000, // 5 MB — server-side only, clientUploads bypasses this (Payload #12671)
    },
  },
  collections: [Users, Media, Programmes, Resultats, PageContent],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
