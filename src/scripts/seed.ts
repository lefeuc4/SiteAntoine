import { getPayload } from 'payload'
import config from '../payload.config'

// Helper to build Lexical richText JSON for a single paragraph
function lexicalParagraph(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text,
              format: 0 as const,
              detail: 0,
              mode: 'normal' as const,
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  // Clean existing demo data
  const existingProgrammes = await payload.find({ collection: 'programmes', limit: 100 })
  for (const doc of existingProgrammes.docs) {
    await payload.delete({ collection: 'programmes', id: doc.id })
  }

  const existingResultats = await payload.find({ collection: 'resultats', limit: 100 })
  for (const doc of existingResultats.docs) {
    await payload.delete({ collection: 'resultats', id: doc.id })
  }

  const existingPageContent = await payload.find({ collection: 'page-content', limit: 100 })
  for (const doc of existingPageContent.docs) {
    await payload.delete({ collection: 'page-content', id: doc.id, overrideAccess: true })
  }

  // Seed Programmes (3)
  await payload.create({
    collection: 'programmes',
    data: {
      titre: 'Transformation 12 Semaines',
      duree: '12 semaines',
      objectifs:
        "Perdre entre 8 et 10 kg de masse grasse\nAmeliorer l'endurance cardiovasculaire\nAdopter de nouvelles habitudes alimentaires durables",
      publicCible: 'Adultes de 25 a 45 ans, debutants ou intermediaires en remise en forme',
      ordre: 1,
      description: lexicalParagraph(
        'Un programme complet de transformation physique et mentale. Trois seances par semaine combinent renforcement musculaire, cardio et souplesse. Un plan alimentaire personnalise accompagne chaque etape.',
      ),
    },
  })

  await payload.create({
    collection: 'programmes',
    data: {
      titre: 'Coaching Performance',
      duree: '8 semaines',
      objectifs:
        'Augmenter la force fonctionnelle de 20%\nAmeliorer la composition corporelle\nDevelopper une routine d\'entrainement autonome',
      publicCible: 'Sportifs intermediaires a confirmes, 20 a 50 ans',
      ordre: 2,
      description: lexicalParagraph(
        'Pour ceux qui veulent passer au niveau superieur. Quatre seances hebdomadaires intensives avec progression lineaire. Suivi des performances et ajustements toutes les deux semaines.',
      ),
    },
  })

  await payload.create({
    collection: 'programmes',
    data: {
      titre: 'Equilibre & Bien-Etre',
      duree: '6 semaines',
      objectifs:
        'Reduire le stress et les tensions musculaires\nAmeliorer la qualite du sommeil\nRetrouver une mobilite articulaire optimale',
      publicCible: 'Tous publics, ideal pour les plus de 40 ans ou personnes sedentaires',
      ordre: 3,
      description: lexicalParagraph(
        'Un programme doux et progressif axe sur le bien-etre global. Deux seances par semaine melant yoga, stretching et exercices de respiration. Accompagnement nutritionnel centre sur l\'anti-inflammation.',
      ),
    },
  })

  // Seed Resultats (3) — no photos, empty arrays (D-15: color block placeholders)
  await payload.create({
    collection: 'resultats',
    data: {
      prenomClient: 'Sophie',
      programmeSuivi: 'Transformation 12 Semaines',
      duree: '12 semaines',
      citation:
        "Je ne me suis jamais sentie aussi bien dans mon corps. Antoine m'a accompagnee a chaque etape avec une bienveillance incroyable.",
      consentementCNIL: true,
      histoire: lexicalParagraph(
        'Sophie est venue me voir apres des annees de regime yo-yo. En 12 semaines, elle a perdu 9 kg et surtout retrouve confiance en elle. Aujourd\'hui, elle court son premier 10 km.',
      ),
      photosAvant: [],
      photosApres: [],
    },
  })

  await payload.create({
    collection: 'resultats',
    data: {
      prenomClient: 'Marc',
      programmeSuivi: 'Coaching Performance',
      duree: '8 semaines',
      citation:
        "Les resultats ont depasse mes attentes. J'ai gagne en force et en energie au quotidien.",
      consentementCNIL: true,
      histoire: lexicalParagraph(
        "Marc, 38 ans, cadre sportif du dimanche, voulait structurer son entrainement. En 8 semaines, il a augmente ses charges de 25% et perdu 5 cm de tour de taille.",
      ),
      photosAvant: [],
      photosApres: [],
    },
  })

  await payload.create({
    collection: 'resultats',
    data: {
      prenomClient: 'Claire',
      programmeSuivi: 'Equilibre & Bien-Etre',
      duree: '6 semaines',
      citation:
        'Mes douleurs de dos ont quasiment disparu. Je dors enfin correctement.',
      consentementCNIL: true,
      histoire: lexicalParagraph(
        "Claire souffrait de douleurs lombaires chroniques liees a la sedentarite. Le programme Equilibre & Bien-Etre lui a permis de retrouver une mobilite qu'elle pensait perdue.",
      ),
      photosAvant: [],
      photosApres: [],
    },
  })

  // Seed PageContent — services-apercu (page: 'accueil', 4 items)
  await payload.create({
    collection: 'page-content',
    data: {
      page: 'accueil',
      section: 'services-apercu',
      titre: 'Coaching Individuel',
      contenu: lexicalParagraph(
        'Un accompagnement sur mesure adapte a vos objectifs et votre rythme de vie.',
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'accueil',
      section: 'services-apercu',
      titre: 'Programmes de Groupe',
      contenu: lexicalParagraph(
        'Des seances collectives motivantes pour progresser ensemble dans la bonne humeur.',
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'accueil',
      section: 'services-apercu',
      titre: 'Suivi Nutritionnel',
      contenu: lexicalParagraph(
        'Des conseils alimentaires pratiques et un plan adapte a vos besoins, sans regime restrictif.',
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'accueil',
      section: 'services-apercu',
      titre: 'Bilan Complet',
      contenu: lexicalParagraph(
        'Une evaluation complete de votre condition physique pour definir un point de depart clair.',
      ),
    },
    overrideAccess: true,
  })

  // Seed PageContent — mon-histoire (page: 'mon-histoire', 5 timeline entries)
  await payload.create({
    collection: 'page-content',
    data: {
      page: 'mon-histoire',
      section: 'mon-histoire',
      titre: '2010 — Les Premiers Pas',
      contenu: lexicalParagraph(
        "Passion pour le sport des l'adolescence. Premiers cours de fitness donnes a des amis et collegues.",
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'mon-histoire',
      section: 'mon-histoire',
      titre: '2013 — Formation Certifiee',
      contenu: lexicalParagraph(
        'Obtention du BPJEPS Activites de la Forme. Debut en salle de sport en tant que coach independant.',
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'mon-histoire',
      section: 'mon-histoire',
      titre: '2016 — Specialisation Nutrition',
      contenu: lexicalParagraph(
        "Formation complementaire en micro-nutrition sportive. Approche holistique du coaching integrant alimentation et entrainement.",
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'mon-histoire',
      section: 'mon-histoire',
      titre: '2019 — Lancement en Solo',
      contenu: lexicalParagraph(
        "Creation de mon propre espace de coaching. Plus de 200 clients accompagnes avec un taux de satisfaction de 95%.",
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'mon-histoire',
      section: 'mon-histoire',
      titre: '2024 — Nouveau Chapitre',
      contenu: lexicalParagraph(
        "Lancement des programmes en ligne pour toucher un public plus large, tout en gardant l'accompagnement personnalise.",
      ),
    },
    overrideAccess: true,
  })

  // Seed PageContent — mes-services (page: 'services', 3 items)
  await payload.create({
    collection: 'page-content',
    data: {
      page: 'services',
      section: 'mes-services',
      titre: 'Consultation Individuelle',
      contenu: lexicalParagraph(
        "Seances d'une heure en face-a-face ou en visio. Bilan initial, programme sur mesure et suivi regulier de vos progres.",
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'services',
      section: 'mes-services',
      titre: 'Coaching en Groupe',
      contenu: lexicalParagraph(
        "Sessions de 4 a 8 personnes, deux fois par semaine. Cardio, renforcement et etirements dans une ambiance conviviale et motivante.",
      ),
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'page-content',
    data: {
      page: 'services',
      section: 'mes-services',
      titre: 'Programme a Distance',
      contenu: lexicalParagraph(
        "Un plan d'entrainement et nutritionnel personnalise livre chaque semaine. Suivi par messages et visio bimensuelle.",
      ),
    },
    overrideAccess: true,
  })

  const programmesCount = 3
  const resultatsCount = 3
  const pageContentCount = 4 + 5 + 3 // services-apercu + mon-histoire + mes-services

  console.log(
    `Seed complete: ${programmesCount} programmes, ${resultatsCount} resultats, ${pageContentCount} page-content docs`,
  )

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
