import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import CookieBanner from '@/components/ui/CookieBanner'
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'),
  title: {
    default: 'Antoine Profit — Coach Bien-Etre',
    template: '%s — Antoine Profit',
  },
  description: 'Coaching bien-etre, nutrition et transformation physique avec Antoine Profit',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
        {children}
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  )
}
