import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-24 text-center">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-4">
        Page introuvable
      </h1>
      <p className="text-base font-body text-gris-ardoise mb-6">
        Cette page n&apos;existe pas ou a ete deplacee.
      </p>
      <Link
        href="/"
        className="bg-bleu-electrique text-blanc-pur rounded-full px-6 py-3 font-heading text-sm hover:brightness-110 transition-all inline-block"
        style={{ transitionDuration: 'var(--transition-fast)' }}
      >
        Retour a l&apos;accueil
      </Link>
    </main>
  )
}
