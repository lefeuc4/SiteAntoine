import { getPayload } from 'payload'
import config from '../payload.config'

// Helper to build a text node
function textNode(text: string) {
  return {
    type: 'text' as const,
    text,
    format: 0 as const,
    detail: 0,
    mode: 'normal' as const,
    style: '',
    version: 1,
  }
}

// Helper to build a link node
function linkNode(text: string, url: string) {
  return {
    type: 'link' as const,
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 3,
    fields: {
      url,
      newTab: false,
      linkType: 'custom',
    },
  }
}

// Helper to build a heading node (h2)
function headingNode(text: string) {
  return {
    type: 'heading' as const,
    tag: 'h2' as const,
    children: [textNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
}

// Helper to build a paragraph node with mixed children
function paragraphNode(children: object[]) {
  return {
    type: 'paragraph' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

// Helper to build a simple text paragraph
function simpleParagraph(text: string) {
  return paragraphNode([textNode(text)])
}

async function seedMentionsLegales() {
  const payload = await getPayload({ config })

  const lexicalDoc = {
    root: {
      type: 'root' as const,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        // --- Editeur du site ---
        headingNode('Editeur du site'),
        simpleParagraph('Nom : [A COMPLETER]'),
        simpleParagraph('SIRET : [A COMPLETER]'),
        simpleParagraph('Adresse : [A COMPLETER]'),
        simpleParagraph('Email : [A COMPLETER]'),

        // --- Hebergement ---
        headingNode('Hebergement'),
        simpleParagraph(
          'Ce site est heberge par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
        ),

        // --- Directeur de publication ---
        headingNode('Directeur de publication'),
        simpleParagraph('Antoine Profit'),

        // --- Donnees personnelles et RGPD ---
        headingNode('Donnees personnelles et RGPD'),
        paragraphNode([
          textNode(
            "Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes, vous disposez d'un droit d'acces, de rectification, d'effacement et de portabilite de vos donnees personnelles. Pour exercer ces droits, contactez-nous via la ",
          ),
          linkNode('page contact', '/contact'),
          textNode('.'),
        ]),

        // --- Cookies et traceurs ---
        headingNode('Cookies et traceurs'),
        simpleParagraph(
          "Ce site utilise Vercel Analytics pour mesurer son audience de maniere anonyme. Cet outil ne depose pas de cookies de tracage et ne collecte pas d'informations personnelles identifiables. Aucune donnee n'est revendue a des tiers.",
        ),

        // --- Photos et consentement clients ---
        headingNode('Photos et consentement clients'),
        paragraphNode([
          textNode(
            'Les photos avant/apres publiees sur ce site sont diffusees avec le consentement explicite des personnes concernees, conformement aux recommandations de la CNIL. Toute demande de retrait peut etre adressee via la ',
          ),
          linkNode('page contact', '/contact'),
          textNode('.'),
        ]),

        // --- Contact ---
        headingNode('Contact'),
        paragraphNode([
          textNode(
            'Pour toute question relative a ce site ou a vos donnees personnelles, rendez-vous sur la ',
          ),
          linkNode('page contact', '/contact'),
          textNode('.'),
        ]),
      ],
    },
  }

  await payload.updateGlobal({
    slug: 'mentions-legales',
    data: {
      contenu: lexicalDoc,
    },
  })

  console.log('Seed mentions legales: OK — global populated with 7 sections')
  process.exit(0)
}

seedMentionsLegales().catch((err) => {
  console.error('Seed mentions legales failed:', err)
  process.exit(1)
})
