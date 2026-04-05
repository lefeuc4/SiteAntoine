'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-24 text-center">
      <h1 className="text-4xl font-heading font-bold text-bleu-nuit mb-4">
        Oups, une erreur est survenue
      </h1>
      <p className="text-base font-body text-gris-ardoise mb-6">
        Contenu temporairement indisponible. Actualisez la page ou revenez dans quelques instants.
      </p>
      <button
        onClick={reset}
        className="bg-bleu-electrique text-blanc-pur rounded-full px-6 py-3 font-heading text-sm hover:brightness-110 transition-all"
        style={{ transitionDuration: 'var(--transition-fast)' }}
      >
        Reessayer
      </button>
    </main>
  )
}
