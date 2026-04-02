'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BeforeAfterSliderProps {
  avantSrc: string
  apresSrc: string
  avantAlt: string
  apresAlt: string
}

export default function BeforeAfterSlider({
  avantSrc,
  apresSrc,
  avantAlt,
  apresAlt,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Fallback for missing images
  if (!avantSrc || !apresSrc) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gris-ardoise/30 flex items-center justify-center">
        <span className="text-gris-ardoise text-sm">Photo non disponible</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
      style={{ '--slider-pos': '50%' } as React.CSSProperties}
    >
      {/* After image — full background */}
      <Image
        src={apresSrc}
        alt={apresAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Before image — clipped */}
      <div
        className="absolute inset-0"
        style={{ clipPath: 'inset(0 calc(100% - var(--slider-pos)) 0 0)' }}
      >
        <Image
          src={avantSrc}
          alt={avantAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-bleu-electrique pointer-events-none"
        style={{ left: 'var(--slider-pos)', transform: 'translateX(-50%)' }}
      />

      {/* Slider handle circle */}
      <div
        className="absolute top-1/2 w-10 h-10 bg-bleu-electrique rounded-full border-2 border-blanc-pur pointer-events-none flex items-center justify-center"
        style={{ left: 'var(--slider-pos)', transform: 'translateX(-50%) translateY(-50%)' }}
      >
        <ChevronLeft size={14} className="text-blanc-pur" />
        <ChevronRight size={14} className="text-blanc-pur" />
      </div>

      {/* Range input — transparent overlay */}
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Comparer avant et apres"
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value
          containerRef.current?.style.setProperty('--slider-pos', `${value}%`)
        }}
      />
    </div>
  )
}
