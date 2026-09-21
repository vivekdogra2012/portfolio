import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticButton } from './MagneticButton'

const navLinks = [
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navLinks.map(link => link.href.slice(1))
      const scrollPosition = window.scrollY + 200

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 md:h-20">
          <MagneticButton
            as="a"
            href="#"
            className="relative group"
            strength={0.15}
          >
            <span className="font-bold text-xl tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
              VD
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </MagneticButton>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-[var(--color-accent)]' 
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="relative w-5 h-4">
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-current"
                animate={{
                  top: mobileOpen ? '50%' : '0%',
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? '-50%' : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute top-1/2 left-0 w-full h-0.5 bg-current -translate-y-1/2"
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-current"
                animate={{
                  bottom: mobileOpen ? '50%' : '0%',
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? '50%' : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-[var(--color-border)]/50"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50 rounded-lg transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
