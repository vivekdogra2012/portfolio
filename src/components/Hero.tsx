import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLeaveProgress } from '../hooks/useLeaveProgress'
import { easeOut, shouldPlayIntro } from '../motion'

const lines = ['I build', 'digital', 'experiences', 'that scale.']

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const leave = useLeaveProgress(sectionRef)
  const scrollY = useTransform(leave, [0, 1], [0, reduced ? 0 : 90])
  const opacity = useTransform(leave, [0, 0.75], [1, reduced ? 1 : 0.15])
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const shiftX = useSpring(pointerX, { stiffness: 40, damping: 18, mass: 0.6 })
  const shiftY = useSpring(pointerY, { stiffness: 40, damping: 18, mass: 0.6 })
  const y = useTransform([scrollY, shiftY], ([scroll, shift]) => Number(scroll) + Number(shift))
  const hold = shouldPlayIntro() ? 0.72 : 0

  useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const move = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 18)
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 12)
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [pointerX, pointerY, reduced])

  return (
    <section id="top" ref={sectionRef} className="relative flex flex-col pb-16 pt-24 md:min-h-[100svh] md:justify-center md:pt-28">
      <motion.div className="shell" style={reduced ? undefined : { y, x: shiftX, opacity }}>
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: hold, ease: easeOut }}
        >
          Frontend Architect / Senior Engineer
        </motion.p>

        <h1 className="display mt-6">
          {lines.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.14em] pt-[0.05em]">
              <motion.span
                className={`block ${index === 2 ? 'text-outline' : ''}`}
                initial={reduced ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.95, delay: hold + 0.14 + index * 0.09, ease: easeOut }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: hold + 0.62, ease: easeOut }}
        >
          <p className="max-w-md text-base text-[var(--color-muted)] md:col-span-5 md:text-lg">
            Senior frontend engineer focused on React, Next.js, React Native, and scalable frontend architecture.
          </p>
          <div className="flex flex-wrap items-center gap-6 md:col-span-4">
            <a className="btn-solid" href="#work">
              View my work
            </a>
            <a className="btn-quiet" href="#contact">
              Let’s connect
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <p className="font-mono text-[0.68rem] leading-6 tracking-[0.16em] text-[var(--color-faint)] uppercase md:col-span-3 md:text-right">
            Gurgaon / Delhi NCR
            <span className="mt-1 block">8+ years · Architect-1</span>
            <span className="mt-1 block">Infinity Learn</span>
          </p>
        </motion.div>

        <div className="mt-12 hidden items-center gap-4 text-[var(--color-faint)] md:flex" aria-hidden>
          <motion.span
            className="h-px w-10 origin-left bg-white/40"
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: hold + 0.95, ease: easeOut }}
          />
          <span className="font-mono text-[0.65rem] tracking-[0.28em] uppercase">Scroll</span>
          <motion.span
            className="block h-8 w-px origin-top bg-white/40"
            initial={reduced ? false : { scaleY: 0.2, opacity: 0.3 }}
            animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
