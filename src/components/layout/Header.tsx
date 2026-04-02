'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  transparentOnLoad?: boolean
}

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/mon-histoire', label: 'Mon Histoire' },
  { href: '/services', label: 'Mes Services' },
  { href: '/programmes', label: 'Les Programmes' },
  { href: '/resultats', label: 'Resultats' },
]

export default function Header({ transparentOnLoad = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTransparent = transparentOnLoad && !scrolled

  const bgClass = isTransparent ? 'bg-transparent' : 'bg-blanc-pur shadow-sm'
  const textClass = isTransparent ? 'text-blanc-pur' : 'text-bleu-nuit'

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all ${bgClass}`}
        style={{ transitionDuration: 'var(--transition-slow)' }}
      >
        <div className="max-w-[1280px] mx-auto px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-heading text-xl font-bold transition-colors ${textClass}`}
            style={{ transitionDuration: 'var(--transition-slow)' }}
          >
            Antoine Profit
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-heading transition-colors ${
                  pathname === link.href
                    ? 'text-bleu-electrique'
                    : isTransparent
                      ? 'text-blanc-pur hover:text-bleu-electrique'
                      : 'text-bleu-nuit hover:text-bleu-electrique'
                }`}
                style={{ transitionDuration: 'var(--transition-fast)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center bg-bleu-electrique text-blanc-pur rounded-full px-5 py-2 text-sm font-heading hover:brightness-110 transition-all"
            style={{ transitionDuration: 'var(--transition-fast)' }}
          >
            Me contacter
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${textClass}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{ transitionDuration: 'var(--transition-slow)' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-bleu-nuit/95 flex flex-col items-center justify-center"
          style={{
            animation: `fadeIn var(--transition-base) ease forwards`,
          }}
        >
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-xl font-heading min-h-[44px] flex items-center transition-colors ${
                  pathname === link.href
                    ? 'text-bleu-electrique underline'
                    : 'text-blanc-pur hover:text-bleu-electrique'
                }`}
                style={{ transitionDuration: 'var(--transition-fast)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center bg-bleu-electrique text-blanc-pur rounded-full px-6 py-3 text-base font-heading hover:brightness-110"
            >
              Me contacter
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
