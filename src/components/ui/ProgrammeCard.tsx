import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface ProgrammeCardProps {
  titre: string
  description: unknown // Lexical rich text JSON — rendered via RichText component
  duree: string
  objectifs?: string | null
  publicCible?: string | null
  imageCouverture?: { url: string; alt?: string } | null
}

export default function ProgrammeCard({
  titre,
  description,
  duree,
  objectifs,
  publicCible,
  imageCouverture,
}: ProgrammeCardProps) {
  return (
    <div
      tabIndex={0}
      className="bg-blanc-pur border border-gris-ardoise/10 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-bleu-electrique focus-visible:outline-none"
      style={{ transitionDuration: 'var(--transition-base)' }}
    >
      {/* Image area */}
      {imageCouverture ? (
        <div className="relative aspect-video">
          <Image
            fill
            src={imageCouverture.url}
            alt={imageCouverture.alt || titre}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gris-ardoise/20 flex items-center justify-center">
          <span className="text-gris-ardoise text-sm">Photo a venir</span>
        </div>
      )}

      {/* Body */}
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold text-bleu-nuit mb-2">{titre}</h3>

        {/* Duration badge */}
        <span className="inline-block text-sm text-vert-energie bg-vert-energie/10 rounded-full px-3 py-1 mb-3">
          {duree}
        </span>

        {/* Description */}
        <div className="text-base font-body text-gris-ardoise mb-3">
          <RichText data={description as Parameters<typeof RichText>[0]['data']} />
        </div>

        {/* Objectives */}
        {objectifs && (
          <ul className="mb-3 space-y-1">
            {objectifs
              .split('\n')
              .filter(Boolean)
              .map((obj, i) => (
                <li key={i} className="text-sm font-body text-bleu-nuit flex items-start gap-2">
                  <span className="text-bleu-electrique mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
          </ul>
        )}

        {/* Target audience */}
        {publicCible && <p className="text-sm text-gris-ardoise">{publicCible}</p>}
      </div>
    </div>
  )
}
