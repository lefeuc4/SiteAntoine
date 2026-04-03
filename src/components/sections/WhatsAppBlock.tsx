import { MessageCircle } from 'lucide-react'

interface WhatsAppBlockProps {
  whatsappNumber: string
  whatsappMessage: string
}

export default function WhatsAppBlock({ whatsappNumber, whatsappMessage }: WhatsAppBlockProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="bg-vert-energie/10 rounded-xl p-6 flex items-center gap-4">
      <MessageCircle size={24} className="text-vert-energie shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-bold text-bleu-nuit">Preferer WhatsApp ?</p>
        <p className="text-sm text-gris-ardoise">Repondez directement en message prive.</p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-vert-energie text-blanc-pur rounded-full px-5 py-2 text-sm font-heading hover:brightness-110 transition-all shrink-0"
        style={{ transitionDuration: 'var(--transition-fast)' }}
      >
        Ouvrir WhatsApp
      </a>
    </div>
  )
}
