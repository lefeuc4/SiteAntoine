import { getPayload } from 'payload'
import config from '../payload.config'

async function seedAccueil() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'accueil', limit: 1 })

  const data = {
    heroTitre: 'Transforme ton corps. Transforme ta vie.',
    heroDescription:
      'Coach bien-etre specialise en transformation physique et mentale. Un accompagnement personnalise pour atteindre tes objectifs.',
    presentation:
      "Coach passionne depuis plus de 10 ans, j'accompagne des femmes et des hommes dans leur transformation physique et mentale. Mon approche allie entrainement personnalise, nutrition adaptee et suivi bienveillant.",
    ctaTitre: 'Pret a transformer ta vie ?',
  }

  if (existing.docs.length > 0) {
    await payload.update({ collection: 'accueil', id: existing.docs[0].id, data })
  } else {
    await payload.create({ collection: 'accueil', data })
  }

  console.log('Seed accueil: OK — collection pre-filled with default hero, presentation and CTA content')
  process.exit(0)
}

seedAccueil().catch((err) => {
  console.error('Seed accueil failed:', err)
  process.exit(1)
})
