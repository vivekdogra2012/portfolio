import { useRef, useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { roles } from '../content'
import { useLeaveProgress } from '../hooks/useLeaveProgress'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Experience() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const progress = useLeaveProgress(listRef)
  const scaleY = useTransform(progress, [0.02, 0.92], [0, 1])

  return (
    <section id="experience" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">03 / Experience</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">The arc.</h2>
          </div>
          <p className="max-w-sm text-[var(--color-muted)]">
            Three companies. One through-line: consumer products, and the frontend systems behind them.
          </p>
        </Reveal>

        <div ref={listRef} className="relative border-t border-[var(--color-line)] md:pl-8">
          <motion.span
            className="absolute top-0 bottom-0 left-0 hidden w-px origin-top bg-[var(--color-accent)] md:block"
            style={{ scaleY: reduced ? 1 : scaleY }}
            aria-hidden
          />
          {roles.map((role, index) => {
            const open = active === index
            return (
              <motion.div
                key={role.company}
                className="border-b border-[var(--color-line)]"
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className="grid w-full grid-cols-1 gap-2 py-6 text-left md:grid-cols-12 md:items-baseline md:gap-6 md:py-8"
                  aria-expanded={open}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => {
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setActive(index)
                  }}
                >
                  <span className="font-mono text-[0.68rem] tracking-[0.16em] text-[var(--color-accent)] md:col-span-2">
                    {role.period}
                  </span>
                  <span className="text-2xl font-semibold tracking-tight md:col-span-4 md:text-3xl">{role.company}</span>
                  <span className="text-[var(--color-muted)] md:col-span-4">{role.role}</span>
                  <motion.span
                    className="hidden origin-center text-right text-[var(--color-faint)] md:col-span-2 md:inline-block"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 md:grid-cols-12">
                        <div className="md:col-span-6 md:col-start-3">
                          <p className="text-[var(--color-muted)]">{role.description}</p>
                        </div>
                        <ul className="space-y-2 md:col-span-4">
                          {role.highlights.slice(0, 3).map((item) => (
                            <li key={item} className="text-sm text-[var(--color-muted)]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
