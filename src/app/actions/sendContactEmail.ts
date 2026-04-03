'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

export const contactSchema = z.object({
  nom: z.string().min(2, 'Veuillez indiquer votre nom.').max(100),
  email: z.string().email('Veuillez saisir une adresse email valide.'),
  message: z.string().min(10, 'Veuillez ecrire votre message.').max(2000),
  website: z.string().max(0),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation_error'; errors: Record<string, string[]> }

export async function sendContactEmail(
  formData: ContactFormValues,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      status: 'validation_error',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Honeypot check — bots fill the hidden "website" field; humans leave it empty
  // Return fake success to avoid tipping off the bot (per D-11)
  if (parsed.data.website !== '') {
    return { status: 'success' }
  }

  try {
    // TODO: In production, replace 'onboarding@resend.dev' with verified 'noreply@antoineprofit.com'
    const { error } = await resend.emails.send({
      from: 'Site Antoine Profit <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL!],
      replyTo: parsed.data.email,
      subject: `Nouveau message de ${parsed.data.nom} via antoineprofit.com`,
      text: `Nom: ${parsed.data.nom}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return { status: 'error', message: 'Une erreur est survenue. Veuillez reessayer.' }
    }

    return { status: 'success' }
  } catch (err) {
    console.error('Email send error:', err)
    return { status: 'error', message: 'Une erreur est survenue. Veuillez reessayer.' }
  }
}
