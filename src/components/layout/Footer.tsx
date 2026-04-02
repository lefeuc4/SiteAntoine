import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/mon-histoire', label: 'Mon Histoire' },
  { href: '/services', label: 'Mes Services' },
  { href: '/programmes', label: 'Les Programmes' },
  { href: '/resultats', label: 'Resultats' },
]

export default function Footer() {
  return (
    <footer className="bg-bleu-nuit text-blanc-pur">
      <div className="max-w-[1280px] mx-auto py-12 lg:py-16 px-8 lg:px-12">
        {/* Three-zone layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-1">
            <span className="font-heading text-xl font-bold">Antoine Profit</span>
            <span className="text-sm text-gris-ardoise">Coach Bien-Etre</span>
          </div>

          {/* Center: Nav links */}
          <nav className="flex flex-col lg:flex-row gap-3 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gris-ardoise hover:text-blanc-pur transition-colors"
                style={{ transitionDuration: 'var(--transition-fast)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Contact link */}
          <div>
            <Link
              href="/contact"
              className="text-bleu-electrique text-sm font-heading hover:brightness-110 transition-all"
              style={{ transitionDuration: 'var(--transition-fast)' }}
            >
              Me contacter
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gris-ardoise/30 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Link
            href="/mentions-legales"
            className="text-sm text-gris-ardoise hover:text-blanc-pur transition-colors"
            style={{ transitionDuration: 'var(--transition-fast)' }}
          >
            Mentions legales
          </Link>
          <span className="text-sm text-gris-ardoise">© 2026 Antoine Profit</span>
        </div>
      </div>
    </footer>
  )
}
