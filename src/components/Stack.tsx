import { useState } from 'react'
import { stack } from '../content'
import { Reveal } from './Reveal'

export function Stack() {
  const [group, setGroup] = useState<string | null>(null)

  return (
    <section id="stack" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">05 / The stack</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Tools I actually ship with.</h2>
          </div>
          <p className="font-mono text-[0.72rem] tracking-[0.18em] text-[var(--color-accent)] uppercase">
            {group ?? 'Hover a technology'}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 md:mt-16">
          {stack.map((item) => (
            <button
              key={item.name}
              type="button"
              className="px-1 py-1 text-3xl font-semibold tracking-tight text-[var(--color-muted)] transition duration-200 hover:scale-[1.04] hover:text-[var(--color-text)] sm:text-5xl"
              onMouseEnter={() => setGroup(item.group)}
              onMouseLeave={() => setGroup(null)}
              onFocus={() => setGroup(item.group)}
              onBlur={() => setGroup(null)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
