'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleConsent = (value: 'accepted' | 'refused') => {
    localStorage.setItem('cookie-consent', value)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blanc-pur border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-bleu-nuit">
          Nous utilisons Vercel Analytics pour mesurer l&apos;audience de ce site.
          Ces outils ne deposent pas de cookies de tra&ccedil;age. En continuant, vous acceptez{' '}
          <Link href="/mentions-legales" className="text-bleu-electrique underline">
            notre politique de confidentialite
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleConsent('refused')}
            className="text-sm font-bold px-4 py-2 border border-bleu-nuit text-bleu-nuit rounded hover:bg-slate-50"
          >
            Refuser
          </button>
          <button
            onClick={() => handleConsent('accepted')}
            className="text-sm font-bold px-4 py-2 bg-vert-energie text-white rounded hover:opacity-90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
