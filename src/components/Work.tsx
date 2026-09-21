import { FadeUp } from './FadeUp'

interface CaseCard {
  company: string
  role: string
  period: string
  headline: string
  description: string
  highlights: string[]
  stack: string[]
}

const cases: CaseCard[] = [
  {
    company: 'Infinity Learn',
    role: 'Architect-1, Frontend',
    period: 'Jul 2026 – Present',
    headline: 'Unified web + mobile frontend platform',
    description:
      'Revamped student.infinitylearn.com and led React Native architecture for Android/iOS apps. Drove AngularJS + Kotlin to React.js + React Native platform migration.',
    highlights: [
      'Own frontend architecture across React and React Native surfaces',
      'Led phased platform migration with dual-stack support',
      'Established engineering standards and scalable delivery practices',
      'Mentor senior engineers; raise code-review quality org-wide',
    ],
    stack: ['React.js', 'Next.js', 'React Native', 'TypeScript'],
  },
  {
    company: 'FanCraze',
    role: 'Senior Frontend Engineer',
    period: 'Jul 2024 – Sep 2025',
    headline: 'Product frontend at scale',
    description:
      'Built consumer-facing UI for FanCraze.com and FC5 — high-visibility features including Team Packs, leaderboards, and motion-rich engagement surfaces.',
    highlights: [
      'Delivered high-traffic product features with React and TypeScript',
      'Implemented Framer Motion animations while preserving performance',
      'Collaborated with product and design for rapid iteration',
      'Built reusable component patterns with Material UI',
    ],
    stack: ['React', 'TypeScript', 'Context API', 'Material UI', 'Framer Motion'],
  },
  {
    company: 'Junglee Games',
    role: 'SDE-2 → SDE-1',
    period: 'Feb 2018 – Jun 2024',
    headline: 'Ownership ladder on consumer gaming',
    description:
      'Progressed from SDE-1 to SDE-2 building analytics dashboards and gaming site revamps across Junglee Rummy, Howzat, and more.',
    highlights: [
      'Built analytics dashboards with React, Node.js, and Express',
      'Led gaming site revamps driving engagement improvements',
      'Developed reusable UI components with Tailwind CSS and Redux',
      'Mentored junior engineers; raised review quality and consistency',
    ],
    stack: ['React', 'Redux', 'AngularJS', 'Node.js', 'Tailwind CSS'],
  },
]

export function Work() {
  return (
    <section id="work" className="py-20 md:py-28 bg-[var(--color-surface)]/30">
      <div className="container-narrow">
        <FadeUp>
          <span className="eyebrow mb-4 block">Experience</span>
          <h2 className="section-title mb-12 md:mb-16">Selected Work</h2>
        </FadeUp>

        <div className="grid gap-8">
          {cases.map((caseCard, index) => (
            <FadeUp key={caseCard.company} delay={index * 0.1}>
              <article className="card p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  <div className="md:w-1/3">
                    <div className="mb-3">
                      <span className="font-mono text-xs text-[var(--color-accent)]">
                        {caseCard.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-1">
                      {caseCard.company}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      {caseCard.role}
                    </p>
                  </div>

                  <div className="md:w-2/3">
                    <h4 className="text-lg font-medium text-[var(--color-text)] mb-3">
                      {caseCard.headline}
                    </h4>
                    <p className="text-[var(--color-muted)] mb-5 leading-relaxed">
                      {caseCard.description}
                    </p>

                    <ul className="space-y-2 mb-5">
                      {caseCard.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-sm text-[var(--color-muted)]"
                        >
                          <span className="text-[var(--color-accent-2)] mt-1.5 flex-shrink-0">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {caseCard.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-1 rounded bg-[var(--color-bg)] text-[var(--color-muted)] border border-[var(--color-border)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
