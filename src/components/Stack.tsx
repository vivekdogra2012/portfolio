import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { stack } from '../content'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Stack() {
  const [group, setGroup] = useState<string | null>(null)
  const reduced = useReducedMotion()

  return (
    <section id="stack" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">05 / The stack</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Tools I actually ship with.</h2>
          </div>
          <div className="min-h-5 font-mono text-[0.72rem] tracking-[0.18em] text-[var(--color-accent)] uppercase md:text-right">
            <AnimatePresence mode="wait">
              <motion.p
                key={group ?? 'idle'}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                {group ?? 'Hover a technology'}
              </motion.p>
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 md:mt-16">
          {stack.map((item, index) => (
            <motion.button
              key={item.name}
              type="button"
              className="stack-word px-1 py-1 text-3xl font-semibold tracking-tight text-[var(--color-muted)] sm:text-5xl"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              whileHover={reduced ? undefined : { y: -8, transition: { delay: 0, duration: 0.28 } }}
              transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setGroup(item.group)}
              onMouseLeave={() => setGroup(null)}
              onFocus={() => setGroup(item.group)}
              onBlur={() => setGroup(null)}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
