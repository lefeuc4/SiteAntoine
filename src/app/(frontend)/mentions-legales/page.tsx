import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mentions legales',
  description:
    'Mentions legales du site antoineprofit.com — informations legales, hebergeur, donnees personnelles.',
  openGraph: {
    title: 'Mentions legales — Antoine Profit',
    description:
      'Mentions legales du site antoineprofit.com — informations legales, hebergeur, donnees personnelles.',
    url: '/mentions-legales',
    siteName: 'Antoine Profit — Coach Bien-Etre',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function MentionsLegalesPage() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'mentions-legales' })

  const hasContent =
    data.contenu &&
    (data.contenu as any)?.root?.children?.length > 0 &&
    !((data.contenu as any)?.root?.children?.length === 1 &&
      (data.contenu as any)?.root?.children?.[0]?.children?.length === 0)

  return (
    <div className="pt-32">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-xl font-heading font-bold text-bleu-nuit mb-8">Mentions legales</h1>

        {hasContent ? (
          <div className="prose prose-bleu max-w-none">
            <RichText data={data.contenu as any} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">Editeur du site</h2>
            <p>
              Nom : <span className="font-mono text-rouge-erreur">[A COMPLETER]</span>
            </p>
            <p>
              SIRET : <span className="font-mono text-rouge-erreur">[A COMPLETER]</span>
            </p>
            <p>
              Adresse : <span className="font-mono text-rouge-erreur">[A COMPLETER]</span>
            </p>
            <p>
              Email : <span className="font-mono text-rouge-erreur">[A COMPLETER]</span>
            </p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">Hebergement</h2>
            <p>
              Ce site est heberge par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
            </p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">
              Directeur de publication
            </h2>
            <p>Antoine Profit</p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">
              Donnees personnelles et RGPD
            </h2>
            <p>
              Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi
              Informatique et Libertes, vous disposez d&apos;un droit d&apos;acces, de
              rectification, d&apos;effacement et de portabilite de vos donnees personnelles.
              Pour exercer ces droits, contactez-nous via la{' '}
              <a href="/contact" className="text-bleu-electrique underline">
                page contact
              </a>
              .
            </p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">Cookies et traceurs</h2>
            <p>
              Ce site utilise Vercel Analytics pour mesurer son audience de maniere anonyme. Cet
              outil ne depose pas de cookies de tracage et ne collecte pas d&apos;informations
              personnelles identifiables. Aucune donnee n&apos;est revendue a des tiers.
            </p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">
              Photos et consentement clients
            </h2>
            <p>
              Les photos avant/apres publiees sur ce site sont diffusees avec le consentement
              explicite des personnes concernees, conformement aux recommandations de la CNIL. Toute
              demande de retrait peut etre adressee via la{' '}
              <a href="/contact" className="text-bleu-electrique underline">
                page contact
              </a>
              .
            </p>

            <h2 className="text-xl font-bold text-bleu-nuit mt-12 mb-4">Contact</h2>
            <p>
              Pour toute question relative a ce site ou a vos donnees personnelles, rendez-vous sur
              la{' '}
              <a href="/contact" className="text-bleu-electrique underline">
                page contact
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
