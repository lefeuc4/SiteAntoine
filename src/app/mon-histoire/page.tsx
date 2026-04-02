import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Mon Histoire — Antoine Profit',
  description: "Decouvrez le parcours personnel d'Antoine Profit, coach bien-etre",
}

function extractPlainText(contenu: unknown): string {
  if (!contenu || typeof contenu !== 'object') return ''
  const root = (contenu as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return ''
  const children = (root as Record<string, unknown>).children
  if (!Array.isArray(children) || children.length === 0) return ''
  const firstBlock = children[0]
  if (!firstBlock || typeof firstBlock !== 'object') return ''
  const innerChildren = (firstBlock as Record<string, unknown>).children
  if (!Array.isArray(innerChildren) || innerChildren.length === 0) return ''
  const firstText = innerChildren[0]
  if (!firstText || typeof firstText !== 'object') return ''
  return String((firstText as Record<string, unknown>).text ?? '')
}

export default async function MonHistoirePage() {
  const payload = await getPayload({ config })

  const timelineData = await payload.find({
    collection: 'page-content',
    where: {
      page: { equals: 'mon-histoire' },
      section: { equals: 'mon-histoire' },
    },
  })

  const entries = timelineData.docs

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12 lg:py-16">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-12 text-center">
        Mon Parcours
      </h1>

      {entries.length === 0 ? (
        <p className="text-gris-ardoise text-center">Parcours en cours de redaction.</p>
      ) : (
        <div className="relative pl-12 lg:pl-0">
          {/* Vertical line — left on mobile, centered on desktop */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-bleu-electrique lg:left-1/2 lg:-translate-x-1/2" />

          {entries.map((entry, i) => {
            const plainText = extractPlainText(entry.contenu)
            return (
              <ScrollReveal key={entry.id}>
                <div className="relative mb-16 lg:flex lg:items-start lg:gap-8">
                  {/* Dot */}
                  <div className="absolute left-[-2rem] top-1 w-3 h-3 rounded-full bg-bleu-electrique border-2 border-blanc-pur lg:left-1/2 lg:-translate-x-1/2 lg:top-2 z-10" />

                  {/* Content */}
                  <div
                    className={`lg:w-[calc(50%-2rem)] ${
                      i % 2 === 0
                        ? 'lg:mr-auto lg:pr-8 lg:text-right'
                        : 'lg:ml-auto lg:pl-8'
                    }`}
                  >
                    <h3 className="text-xl font-heading font-bold text-bleu-nuit mb-2">
                      {entry.titre}
                    </h3>
                    <p className="text-base font-body text-gris-ardoise">{plainText}</p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
