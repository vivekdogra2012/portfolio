import { motion } from 'framer-motion'
import { beliefs, thinking } from '../content'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Thinking() {
  const reduced = useReducedMotion()

  return (
    <section id="thinking" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">06 / How I think</p>
          <h2 className="mt-4 max-w-[14ch] text-4xl font-semibold tracking-tight sm:text-6xl">
            Past the component.
          </h2>
          <p className="mt-6 max-w-xl text-[var(--color-muted)]">
            I trace a feature from the product decision through the interface, the client API, and the platform underneath — so the UI can move without a rewrite.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="mb-4 hidden overflow-hidden lg:block" aria-hidden>
            <div className="h-px bg-white/10" />
            {!reduced && (
              <motion.div
                className="relative -mt-px h-px w-1/6 bg-[var(--color-accent)]"
                animate={{ x: ['0%', '500%'] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
              />
            )}
          </div>
        <ol className="grid gap-px bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-6">
          {thinking.map((step, index) => (
            <motion.li
              key={step}
              className="relative bg-[var(--color-bg)] px-4 py-6"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="absolute top-0 left-0 h-px origin-left bg-[var(--color-accent)]"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
              />
              <span className="font-mono text-[0.65rem] tracking-[0.18em] text-[var(--color-accent)]">0{index + 1}</span>
              <p className="mt-3 text-lg font-medium tracking-tight">{step}</p>
            </motion.li>
          ))}
        </ol>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {beliefs.map((belief) => (
            <Reveal key={belief.title}>
              <h3 className="text-xl font-semibold tracking-tight">{belief.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{belief.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
