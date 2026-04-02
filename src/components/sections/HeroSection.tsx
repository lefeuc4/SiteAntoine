import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile: image first */}
      <div className="order-first lg:order-last flex-1 relative min-h-[200px] lg:min-h-screen">
        <div className="w-full h-full bg-gris-ardoise/30 flex items-center justify-center min-h-[200px] lg:min-h-screen">
          <span className="text-gris-ardoise text-sm">Photo coaching a venir</span>
        </div>
      </div>

      {/* Text content */}
      <div className="order-last lg:order-first flex-1 flex flex-col justify-center px-8 lg:px-12 py-16 lg:py-0 max-w-full lg:max-w-[640px]">
        <h1 className="text-4xl font-heading font-bold text-bleu-nuit leading-tight">
          Transforme ton corps. Transforme ta vie.
        </h1>
        <p className="text-base font-body text-gris-ardoise mt-4 mb-8">
          Coach bien-etre specialise en transformation physique et mentale. Un accompagnement
          personnalise pour atteindre tes objectifs.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/contact"
            className="bg-bleu-electrique text-blanc-pur rounded-full px-6 py-3 font-heading text-sm inline-block hover:brightness-110 transition"
            style={{ transitionDuration: 'var(--transition-fast)' }}
          >
            Prendre contact
          </Link>
          <Link
            href="/programmes"
            className="text-bleu-electrique font-heading text-sm inline-block hover:underline"
          >
            Voir les programmes
          </Link>
        </div>
      </div>
    </section>
  )
}
