import Link from 'next/link'

interface CTABandeauProps {
  ctaTitre?: string
}

export default function CTABandeau({ ctaTitre }: CTABandeauProps) {
  return (
    <section className="bg-bleu-nuit py-12 lg:py-16 px-8">
      <div className="max-w-[1280px] mx-auto text-center">
        <h2 className="text-xl lg:text-4xl font-heading font-bold text-blanc-pur mb-6">
          {ctaTitre ?? 'Pret a transformer ta vie ?'}
        </h2>
        <Link
          href="/contact"
          className="bg-bleu-electrique text-blanc-pur rounded-full px-8 py-4 font-heading text-base inline-block hover:brightness-110 transition"
          style={{ transitionDuration: 'var(--transition-fast)' }}
        >
          Prendre contact
        </Link>
      </div>
    </section>
  )
}
