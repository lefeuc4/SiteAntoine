'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Instagram } from 'lucide-react'

function FacebookIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

interface FloatingWhatsAppProps {
  whatsappNumber: string
  whatsappMessage: string
  instagramUrl?: string
  facebookUrl?: string
}

export default function FloatingWhatsApp({ whatsappNumber, whatsappMessage, instagramUrl, facebookUrl }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      setBannerVisible((e as CustomEvent).detail.visible)
    }
    window.addEventListener('cookie-banner', handler)
    return () => window.removeEventListener('cookie-banner', handler)
  }, [])

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
  const bottomBase = bannerVisible ? '5rem' : '1.5rem'

  return (
    <div
      className={`fixed right-6 z-50 flex items-center gap-3 transition-all ${
        visible ? 'opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{
        bottom: bottomBase,
        transitionDuration: 'var(--transition-slow, 300ms)',
      }}
    >
      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          aria-label="Ouvrir Facebook"
          className="w-10 h-10 bg-vert-energie rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all"
          style={{ transitionDuration: 'var(--transition-slow, 300ms)' }}
        >
          <FacebookIcon size={18} className="text-blanc-pur" />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          aria-label="Ouvrir Instagram"
          className="w-10 h-10 bg-vert-energie rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all"
          style={{ transitionDuration: 'var(--transition-slow, 300ms)' }}
        >
          <Instagram size={18} className="text-blanc-pur" />
        </a>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Contactez-moi sur WhatsApp"
        aria-label="Ouvrir WhatsApp"
        className="w-14 h-14 bg-vert-energie rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all"
        style={{ transitionDuration: 'var(--transition-slow, 300ms)' }}
      >
        <MessageCircle size={24} className="text-blanc-pur" />
      </a>
    </div>
  )
}
