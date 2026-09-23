import { useState } from 'react'
import { expertise } from '../content'
import { Reveal } from './Reveal'

export function Expertise() {
  const [active, setActive] = useState(0)

  return (
    <section id="expertise" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">04 / Expertise</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">What I build.</h2>
        </Reveal>

        <div className="mt-12 border-t border-[var(--color-line)] md:mt-16">
          {expertise.map((item, index) => {
            const open = active === index
            return (
              <button
                key={item.title}
                type="button"
                className="group relative block w-full border-b border-[var(--color-line)] py-6 text-left md:py-8"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span
                  className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 font-semibold tracking-tight text-white/[0.04] transition-opacity duration-300"
                  style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', opacity: open ? 1 : 0 }}
                  aria-hidden
                >
                  {item.index}
                </span>
                <span className="relative grid items-baseline gap-3 md:grid-cols-12">
                  <span className="font-mono text-[0.68rem] tracking-[0.18em] text-[var(--color-accent)] md:col-span-1">
                    {item.index}
                  </span>
                  <span className="text-2xl font-semibold tracking-tight md:col-span-5 md:text-4xl">{item.title}</span>
                  <span className={`text-sm text-[var(--color-muted)] transition-opacity md:col-span-6 md:text-base ${open ? 'opacity-100' : 'opacity-0 md:opacity-40'}`}>
                    {item.detail}
                  </span>
                </span>
                <span
                  className="absolute bottom-0 left-0 h-px bg-[var(--color-accent)] transition-all duration-500"
                  style={{ width: open ? '100%' : '0%' }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
