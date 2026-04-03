import { z } from 'zod'

export const contactSchema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10, 'Veuillez ecrire votre message.').max(2000),
  website: z.string().max(0),
})

export type ContactFormValues = z.infer<typeof contactSchema>
