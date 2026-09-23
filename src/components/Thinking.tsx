import { beliefs, thinking } from '../content'
import { Reveal } from './Reveal'

export function Thinking() {
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

        <ol className="mt-14 grid gap-px bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-6">
          {thinking.map((step, index) => (
            <li key={step} className="bg-[var(--color-bg)] px-4 py-6">
              <span className="font-mono text-[0.65rem] tracking-[0.18em] text-[var(--color-accent)]">0{index + 1}</span>
              <p className="mt-3 text-lg font-medium tracking-tight">{step}</p>
            </li>
          ))}
        </ol>

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
