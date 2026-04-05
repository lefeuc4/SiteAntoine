import {
  Dumbbell,
  Heart,
  Users,
  Target,
  Trophy,
  Zap,
  Star,
  type LucideProps,
} from 'lucide-react'

interface ServiceCardProps {
  titre: string
  description: string
  icone: string // lucide-react icon name as string
}

type IconComponent = React.ComponentType<LucideProps>

const iconMap: Record<string, IconComponent> = {
  dumbbell: Dumbbell,
  heart: Heart,
  users: Users,
  target: Target,
  trophy: Trophy,
  zap: Zap,
}

export default function ServiceCard({ titre, description, icone }: ServiceCardProps) {
  const IconComponent: IconComponent = iconMap[icone.toLowerCase()] ?? Star

  return (
    <div
      tabIndex={0}
      className="bg-blanc-pur border border-gris-ardoise/20 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-bleu-electrique focus-visible:outline-none"
      style={{ transitionDuration: 'var(--transition-base)' }}
    >
      <IconComponent size={32} className="text-bleu-electrique mb-4" />
      <h3 className="text-xl font-heading font-bold text-bleu-nuit mb-2">{titre}</h3>
      <p className="text-base font-body text-gris-ardoise">{description}</p>
    </div>
  )
}
