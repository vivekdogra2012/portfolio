import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const lines = ['I build', 'digital', 'experiences', 'that scale.']

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="top" className="relative flex flex-col pb-16 pt-24 md:min-h-[100svh] md:justify-center md:pt-28">
      <div className="shell">
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Frontend Architect / Senior Engineer
        </motion.p>

        <h1 className="display mt-6">
          {lines.map((line, index) => (
            <motion.span
              key={line}
              className={`block ${index === 2 ? 'text-outline' : ''}`}
              initial={reduced ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
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
        </div>

        <div className="mt-12 hidden items-center gap-4 text-[var(--color-faint)] md:flex" aria-hidden>
          <span className="h-px w-10 bg-white/25" />
          <span className="font-mono text-[0.65rem] tracking-[0.28em] uppercase">Scroll</span>
        </div>
      </div>
    </section>
  )
}
