import type { ReactNode } from 'react'
import { FadeUp } from './FadeUp'

interface BeliefCard {
  title: string
  description: string
  icon: ReactNode
}

const beliefs: BeliefCard[] = [
  {
    title: 'BFF for Frontend Independence',
    description:
      'A Backend-for-Frontend layer lets the UI team move fast without waiting on backend contracts. It shapes data for the client, handles aggregation, and keeps the frontend clean of server-side concerns.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Strangler Fig Migrations',
    description:
      'Big-bang rewrites fail. Strangler migrations let you wrap legacy systems, route traffic incrementally, and ship value while modernizing. Teams keep shipping; risk stays contained.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18" />
        <path d="M18 9a6 6 0 0 0-6-6" />
        <path d="M6 15a6 6 0 0 0 6 6" />
        <path d="M18 15a6 6 0 0 1-6 6" />
        <path d="M6 9a6 6 0 0 1 6-6" />
      </svg>
    ),
  },
  {
    title: 'Design Systems as Product Infra',
    description:
      'A design system isn\'t a side project — it\'s product infrastructure. It compounds velocity, enforces consistency, and reduces QA surface. Treat it like a platform, with versioning, docs, and ownership.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
]

export function Architecture() {
  return (
    <section id="architecture" className="py-20 md:py-28">
      <div className="container-narrow">
        <FadeUp>
          <span className="eyebrow mb-4 block">Principles</span>
          <h2 className="section-title mb-12 md:mb-16">Architecture Notes</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {beliefs.map((belief, index) => (
            <FadeUp key={belief.title} delay={index * 0.1}>
              <div className="card h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] mb-5">
                  {belief.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  {belief.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed flex-1">
                  {belief.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
