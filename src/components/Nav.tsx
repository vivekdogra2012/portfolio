import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../content'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'bg-[var(--color-bg)]/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <a href="#top" className="text-[0.78rem] font-semibold tracking-[0.18em]">
            VIVEK DOGRA
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.72rem] font-medium tracking-[0.16em] text-[var(--color-muted)] uppercase transition-colors hover:text-[var(--color-text)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn-quiet hidden lg:inline-flex">
            Let’s talk
            <Arrow />
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-white transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-px w-5 bg-white transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-[var(--color-bg)] px-6 pb-16 pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Mobile"
          >
            <ul className="space-y-2">
              {links.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <a
                    href={link.href}
                    className="block py-2 text-4xl font-semibold tracking-tight"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={`mailto:${profile.email}`} className="btn-quiet mt-10" onClick={() => setOpen(false)}>
              {profile.email}
              <Arrow />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
