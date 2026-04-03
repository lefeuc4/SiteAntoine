import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import ServiceCard from '@/components/ui/ServiceCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Services de Coaching — Antoine Profit',
}

const iconByIndex: Record<number, string> = {
  0: 'heart',
  1: 'users',
  2: 'zap',
}

export default async function ServicesPage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'page-content',
    where: {
      page: { equals: 'services' },
      section: { equals: 'mes-services' },
    },
    limit: 10,
  })

  const docs = result.docs

  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12 lg:py-16">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-12 text-center">
        Mes Services
      </h1>

      {docs.length === 0 ? (
        <p className="text-gris-ardoise text-center text-base">
          Les services seront bientot disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, i) => {
            const description =
              (doc.contenu as any)?.root?.children?.[0]?.children?.[0]?.text || ''

            return (
              <ScrollReveal key={doc.id}>
                <ServiceCard
                  titre={doc.titre || ''}
                  description={description}
                  icone={iconByIndex[i] || 'star'}
                />
              </ScrollReveal>
            )
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/contact"
          className="bg-bleu-electrique text-blanc-pur rounded-full px-6 py-3 font-heading text-sm inline-block hover:brightness-110 transition"
          style={{ transitionDuration: 'var(--transition-fast)' }}
        >
          Prendre contact
        </Link>
      </div>
    </main>
  )
}
