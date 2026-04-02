import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface ResultatCardProps {
  prenomClient: string
  histoire?: SerializedEditorState | null
  citation?: string | null
  programmeSuivi?: string | null
  duree?: string | null
  photoAvantUrl: string
  photoApresUrl: string
}

export default function ResultatCard({
  prenomClient,
  histoire,
  citation,
  programmeSuivi,
  duree,
  photoAvantUrl,
  photoApresUrl,
}: ResultatCardProps) {
  const metaItems = [
    prenomClient,
    programmeSuivi,
    duree,
  ].filter(Boolean)

  return (
    <div className="bg-blanc-pur rounded-2xl overflow-hidden shadow-sm border border-gris-ardoise/10">
      {/* Before/after slider */}
      <BeforeAfterSlider
        avantSrc={photoAvantUrl}
        apresSrc={photoApresUrl}
        avantAlt={`Photo avant de ${prenomClient}`}
        apresAlt={`Photo apres de ${prenomClient}`}
      />

      <div className="p-4">
        {/* Histoire */}
        {histoire && (
          <div className="text-sm font-body text-gris-ardoise mb-3 line-clamp-4">
            <RichText data={histoire} />
          </div>
        )}

        {/* Citation */}
        {citation && (
          <blockquote className="italic text-base font-body text-bleu-nuit mb-3">
            <span className="text-bleu-electrique text-2xl not-italic">&ldquo;</span>
            {citation}
            <span className="text-bleu-electrique text-2xl not-italic">&rdquo;</span>
          </blockquote>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2 text-sm font-body text-gris-ardoise px-4 pb-4">
        {metaItems.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mr-2">·</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
