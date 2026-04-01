import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Programmes } from './collections/Programmes'
import { Resultats } from './collections/Resultats'
import { PageContent } from './collections/PageContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  editor: lexicalEditor(),
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
  collections: [Users, Media, Programmes, Resultats, PageContent],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
