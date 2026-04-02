import ScrollReveal from '@/components/ui/ScrollReveal'
import ServiceCard from '@/components/ui/ServiceCard'

interface ServiceItem {
  titre: string
  contenu: string
  icone: string
}

interface ServicesApercuProps {
  services: ServiceItem[]
}

const iconByIndex = ['heart', 'users', 'zap', 'target']

export default function ServicesApercu({ services }: ServicesApercuProps) {
  return (
    <section className="py-12 lg:py-16 px-8 lg:px-12 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <ScrollReveal key={i}>
            <ServiceCard
              titre={service.titre}
              description={service.contenu}
              icone={service.icone || iconByIndex[i] || 'star'}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
