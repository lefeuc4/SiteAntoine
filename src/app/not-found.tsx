import React from 'react'
import { Montserrat, Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter',
  display: 'swap',
})

export default function NotFound() {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
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
      </body>
    </html>
  )
}
