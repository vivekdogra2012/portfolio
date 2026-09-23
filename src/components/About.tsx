import { about } from '../content'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="about" className="section-space scroll-mt-24">
      <div className="shell">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow">01 / About</p>
          </Reveal>
          <Reveal className="lg:col-span-9" delay={0.08}>
            <h2 className="max-w-[16ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.05]">
              {about.statement}
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid items-start gap-12 lg:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--color-line)]">
              <img
                src={`${import.meta.env.BASE_URL}vivek-dogra-suit.jpg`}
                alt="Vivek Dogra"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <p className="mt-4 font-mono text-[0.68rem] tracking-[0.18em] text-[var(--color-faint)] uppercase">
              Gurgaon / Delhi NCR · 8+ years
            </p>
          </Reveal>

          <div className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-6">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={0.06 * index}>
                <p className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
