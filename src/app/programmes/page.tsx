import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import ProgrammeCard from '@/components/ui/ProgrammeCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Programmes de Coaching — Antoine Profit',
}

export default async function ProgrammesPage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'programmes',
    sort: 'ordre',
    limit: 20,
    depth: 2,
  })

  const programmes = result.docs

  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12 lg:py-16">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-12 text-center">
        Les Programmes
      </h1>

      {programmes.length === 0 ? (
        <p className="text-gris-ardoise text-center text-base">
          Aucun programme disponible pour le moment. Revenez bientot.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((prog) => {
            const imageCouverture =
              prog.imageCouverture &&
              typeof prog.imageCouverture === 'object' &&
              'url' in prog.imageCouverture
                ? { url: prog.imageCouverture.url as string, alt: (prog.imageCouverture as any).alt }
                : null

            return (
              <ScrollReveal key={prog.id}>
                <ProgrammeCard
                  titre={prog.titre}
                  description={prog.description}
                  duree={prog.duree}
                  objectifs={prog.objectifs}
                  publicCible={prog.publicCible}
                  imageCouverture={imageCouverture}
                />
              </ScrollReveal>
            )
          })}
        </div>
      )}
    </main>
  )
}
