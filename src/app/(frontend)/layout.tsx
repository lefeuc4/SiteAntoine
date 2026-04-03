import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'contact-settings' })

  const whatsappNumber = (settings as any).whatsappNumber as string
  const whatsappMessage = (settings as any).whatsappMessage as string

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage} />
    </>
  )
}
