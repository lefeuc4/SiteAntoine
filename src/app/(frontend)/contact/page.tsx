import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import ContactForm from '@/components/sections/ContactForm'
import WhatsAppBlock from '@/components/sections/WhatsAppBlock'
import SocialBlock from '@/components/sections/SocialBlock'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez Antoine Profit, coach bien-etre. Formulaire de contact et lien WhatsApp pour demarrer votre transformation.',
  openGraph: {
    title: 'Contact — Antoine Profit',
    description:
      'Contactez Antoine Profit, coach bien-etre. Formulaire de contact et lien WhatsApp pour demarrer votre transformation.',
    url: '/contact',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'contact-settings' })

  const whatsappNumber = (settings as any).whatsappNumber as string
  const whatsappMessage = (settings as any).whatsappMessage as string
  const instagramUrl = (settings as any).instagramUrl as string | null
  const facebookUrl = (settings as any).facebookUrl as string | null

  return (
    <main className="max-w-[1280px] mx-auto px-8 lg:px-12 py-12 lg:py-16">
      <h1 className="text-[1.75rem] lg:text-[2.25rem] font-heading font-bold text-bleu-nuit mb-12 text-center">
        Contactez-moi
      </h1>

      <div className="max-w-[560px] mx-auto">
        <ContactForm />

        <div className="mt-8">
          <WhatsAppBlock whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage} />
        </div>

        <div className="mt-6">
          <SocialBlock instagramUrl={instagramUrl} facebookUrl={facebookUrl} />
        </div>
      </div>
    </main>
  )
}
