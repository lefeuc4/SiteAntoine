'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/contactSchema'
import { sendContactEmail } from '@/app/actions/sendContactEmail'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nom: '', email: '', message: '', website: '' },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null)
    const result = await sendContactEmail(data)
    if (result.status === 'success') {
      setSubmitted(true)
    } else if (result.status === 'error') {
      setServerError(result.message)
    } else if (result.status === 'validation_error') {
      setServerError(
        'Une erreur est survenue. Veuillez reessayer ou nous contacter directement via WhatsApp.',
      )
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <CheckCircle size={48} className="text-vert-energie" />
        <h2 className="font-heading font-bold text-xl text-bleu-nuit">Message envoye !</h2>
        <p className="text-base text-gris-ardoise">Merci, je vous reponds dans les 24 heures.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from humans, visible to bots (per D-11) */}
      <div
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 0,
          height: 0,
        }}
      >
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" type="text" tabIndex={-1} aria-hidden="true" {...register('website')} />
      </div>

      <div>
        <label htmlFor="nom" className="block text-sm font-bold text-bleu-nuit mb-1">
          Votre nom
        </label>
        <input
          id="nom"
          type="text"
          placeholder="Marie Dupont"
          className={`w-full border ${errors.nom ? 'border-rouge-erreur focus:ring-rouge-erreur' : 'border-gris-ardoise/40 focus:ring-bleu-electrique focus:border-bleu-electrique'} rounded-lg px-4 py-3 text-base text-bleu-nuit bg-blanc-pur focus:outline-none focus:ring-2 transition-all`}
          style={{ transitionDuration: 'var(--transition-fast)' }}
          disabled={isSubmitting}
          {...register('nom')}
        />
        {errors.nom && <p className="text-sm text-rouge-erreur mt-1">{errors.nom.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-bleu-nuit mb-1">
          Votre adresse email
        </label>
        <input
          id="email"
          type="email"
          placeholder="marie@exemple.fr"
          className={`w-full border ${errors.email ? 'border-rouge-erreur focus:ring-rouge-erreur' : 'border-gris-ardoise/40 focus:ring-bleu-electrique focus:border-bleu-electrique'} rounded-lg px-4 py-3 text-base text-bleu-nuit bg-blanc-pur focus:outline-none focus:ring-2 transition-all`}
          style={{ transitionDuration: 'var(--transition-fast)' }}
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-rouge-erreur mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold text-bleu-nuit mb-1">
          Votre message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Bonjour Antoine, je souhaite en savoir plus sur vos programmes..."
          className={`w-full border ${errors.message ? 'border-rouge-erreur focus:ring-rouge-erreur' : 'border-gris-ardoise/40 focus:ring-bleu-electrique focus:border-bleu-electrique'} rounded-lg px-4 py-3 text-base text-bleu-nuit bg-blanc-pur focus:outline-none focus:ring-2 transition-all`}
          style={{ transitionDuration: 'var(--transition-fast)' }}
          disabled={isSubmitting}
          {...register('message')}
        />
        {errors.message && (
          <p className="text-sm text-rouge-erreur mt-1">{errors.message.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-rouge-erreur">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bleu-electrique text-blanc-pur rounded-full px-8 py-4 font-heading text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ transitionDuration: 'var(--transition-fast)' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          'Envoyer mon message'
        )}
      </button>
    </form>
  )
}
