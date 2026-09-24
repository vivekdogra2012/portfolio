import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import { profile } from '../content'
import { usePageProgress } from '../hooks/useLeaveProgress'
import { useReducedMotion } from '../hooks/useReducedMotion'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const page = usePageProgress()

  const revealLock = useRef(0)

  useEffect(() => {
    const show = () => {
      revealLock.current = performance.now() + 1400
      setHidden(false)
    }
    window.addEventListener('anchor-scroll', show)
    return () => window.removeEventListener('anchor-scroll', show)
  }, [])

  const onLenis = useCallback(
    (lenis: Lenis) => {
      const y = lenis.animatedScroll
      setScrolled(y > 24)
      if (open || y < 80 || performance.now() < revealLock.current) {
        setHidden(false)
        return
      }
      if (lenis.direction === 1 && lenis.velocity > 0.4) setHidden(true)
      else if (lenis.direction === -1 && lenis.velocity < -0.4) setHidden(false)
    },
    [open],
  )

  useLenis(onLenis, [open])

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
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 ${
          scrolled || open ? 'bg-[var(--color-bg)]/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--color-accent)]"
          style={{ scaleX: reduced ? 0 : page }}
          aria-hidden
        />
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <a href="#top" className="text-[0.78rem] font-semibold tracking-[0.18em]">
            VIVEK DOGRA
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-[0.72rem] font-medium tracking-[0.16em] text-[var(--color-muted)] uppercase"
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
      </motion.header>

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
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + 0.05 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
