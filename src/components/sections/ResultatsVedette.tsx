import ScrollReveal from '@/components/ui/ScrollReveal'
import ResultatCard from '@/components/ui/ResultatCard'

interface ResultatItem {
  prenomClient: string
  citation?: string | null
  programmeSuivi?: string | null
  duree?: string | null
  photoAvantUrl: string
  photoApresUrl: string
}

interface ResultatsVedetteProps {
  resultats: ResultatItem[]
}

export default function ResultatsVedette({ resultats }: ResultatsVedetteProps) {
  return (
    <section className="py-12 lg:py-16 px-8 lg:px-12 max-w-[1280px] mx-auto">
      <h2 className="text-xl font-heading font-bold text-bleu-nuit mb-8 text-center">
        Resultats &amp; Temoignages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resultats.map((resultat, i) => (
          <ScrollReveal key={i}>
            <ResultatCard
              prenomClient={resultat.prenomClient}
              citation={resultat.citation}
              programmeSuivi={resultat.programmeSuivi}
              duree={resultat.duree}
              photoAvantUrl={resultat.photoAvantUrl}
              photoApresUrl={resultat.photoApresUrl}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
