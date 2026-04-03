'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

interface FloatingWhatsAppProps {
  whatsappNumber: string
  whatsappMessage: string
}

export default function FloatingWhatsApp({ whatsappNumber, whatsappMessage }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Contactez-moi sur WhatsApp"
      aria-label="Ouvrir WhatsApp"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-vert-energie rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDuration: 'var(--transition-slow, 300ms)' }}
    >
      <MessageCircle size={24} className="text-blanc-pur" />
    </a>
  )
}
