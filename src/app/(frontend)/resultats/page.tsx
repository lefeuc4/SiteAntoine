import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import ResultatCard from '@/components/ui/ResultatCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Resultats',
  description:
    "Resultats concrets de clients d'Antoine Profit. Transformations avant/apres avec temoignages authentiques.",
  openGraph: {
    title: 'Resultats — Antoine Profit',
    description:
      "Resultats concrets de clients d'Antoine Profit. Transformations avant/apres avec temoignages authentiques.",
    url: '/resultats',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function ResultatsPage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'resultats',
    limit: 20,
    depth: 2,
  })

  const resultats = result.docs

  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12 lg:py-16">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-4 text-center">
        Resultats &amp; Temoignages
      </h1>

      <p className="text-base font-body text-gris-ardoise text-center mb-12 max-w-2xl mx-auto">
        Decouvrez les transformations de mes clients. Chaque parcours est unique, chaque resultat
        est le fruit d&apos;un engagement mutuel.
      </p>

      {resultats.length === 0 ? (
        <p className="text-gris-ardoise text-center text-base">
          Les premiers resultats arrivent bientot.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resultats.map((resultat) => {
            const photoAvantUrl = (() => {
              const photo = resultat.photosAvant?.[0]?.photo
              if (photo && typeof photo === 'object' && 'url' in photo) return photo.url as string
              return ''
            })()

            const photoApresUrl = (() => {
              const photo = resultat.photosApres?.[0]?.photo
              if (photo && typeof photo === 'object' && 'url' in photo) return photo.url as string
              return ''
            })()

            return (
              <ScrollReveal key={resultat.id}>
                <ResultatCard
                  prenomClient={resultat.prenomClient}
                  histoire={resultat.histoire}
                  citation={resultat.citation}
                  programmeSuivi={resultat.programmeSuivi}
                  duree={resultat.duree}
                  photoAvantUrl={photoAvantUrl}
                  photoApresUrl={photoApresUrl}
                />
              </ScrollReveal>
            )
          })}
        </div>
      )}
    </main>
  )
}
