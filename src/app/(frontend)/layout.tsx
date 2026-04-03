import { Montserrat, Inter } from 'next/font/google'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp'

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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'contact-settings' })

  const whatsappNumber = (settings as any).whatsappNumber as string
  const whatsappMessage = (settings as any).whatsappMessage as string

  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body bg-blanc-pur text-bleu-nuit">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage} />
      </body>
    </html>
  )
}
