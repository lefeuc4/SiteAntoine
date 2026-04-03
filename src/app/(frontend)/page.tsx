import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import HeroSection from '@/components/sections/HeroSection'
import ServicesApercu from '@/components/sections/ServicesApercu'
import ResultatsVedette from '@/components/sections/ResultatsVedette'
import CTABandeau from '@/components/sections/CTABandeau'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: { absolute: 'Antoine Profit — Coach Bien-Etre' },
  description:
    'Antoine Profit, coach bien-etre. Transformez votre sante et retrouvez votre energie avec un accompagnement personnalise.',
  openGraph: {
    title: 'Antoine Profit — Coach Bien-Etre',
    description:
      'Antoine Profit, coach bien-etre. Transformez votre sante et retrouvez votre energie avec un accompagnement personnalise.',
    url: '/',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}

function extractPlainText(contenu: unknown): string {
  if (!contenu || typeof contenu !== 'object') return ''
  const root = (contenu as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return ''
  const children = (root as Record<string, unknown>).children
  if (!Array.isArray(children) || children.length === 0) return ''
  const firstBlock = children[0]
  if (!firstBlock || typeof firstBlock !== 'object') return ''
  const innerChildren = (firstBlock as Record<string, unknown>).children
  if (!Array.isArray(innerChildren) || innerChildren.length === 0) return ''
  const firstText = innerChildren[0]
  if (!firstText || typeof firstText !== 'object') return ''
  return String((firstText as Record<string, unknown>).text ?? '')
}

const iconByIndex = ['heart', 'users', 'zap', 'target']

export default async function Home() {
  const payload = await getPayload({ config })

  // Fetch services apercu
  const servicesData = await payload.find({
    collection: 'page-content',
    where: {
      page: { equals: 'accueil' },
      section: { equals: 'services-apercu' },
    },
  })

  const services = servicesData.docs.map((doc, i) => ({
    titre: doc.titre ?? '',
    contenu: extractPlainText(doc.contenu),
    icone: iconByIndex[i] ?? 'star',
  }))

  // Fetch featured resultats
  const resultatsData = await payload.find({
    collection: 'resultats',
    limit: 3,
    depth: 2,
  })

  const resultats = resultatsData.docs.map((doc) => {
    const photosAvant = doc.photosAvant as Array<{ photo: { url?: string } }> | undefined
    const photosApres = doc.photosApres as Array<{ photo: { url?: string } }> | undefined
    return {
      prenomClient: doc.prenomClient,
      histoire: doc.histoire ?? null,
      citation: doc.citation ?? null,
      programmeSuivi: doc.programmeSuivi ?? null,
      duree: doc.duree ?? null,
      photoAvantUrl: photosAvant?.[0]?.photo?.url ?? '',
      photoApresUrl: photosApres?.[0]?.photo?.url ?? '',
    }
  })

  return (
    <>
      <HeroSection />

      <ScrollReveal>
        <ServicesApercu services={services} />
      </ScrollReveal>

      {/* Presentation section */}
      <section className="py-12 lg:py-16 px-8 lg:px-12 max-w-[1280px] mx-auto">
        <ScrollReveal>
          <p className="text-base font-body text-gris-ardoise max-w-2xl">
            Coach passionne depuis plus de 10 ans, j&apos;accompagne des femmes et des hommes dans
            leur transformation physique et mentale. Mon approche allie entrainement personnalise,
            nutrition adaptee et suivi bienveillant.{' '}
            <Link href="/mon-histoire" className="text-bleu-electrique hover:underline font-heading">
              Decouvrir mon parcours →
            </Link>
          </p>
        </ScrollReveal>
      </section>

      <ResultatsVedette resultats={resultats} />

      <CTABandeau />
    </>
  )
}
