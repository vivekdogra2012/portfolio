import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface BeliefCard {
  title: string
  description: string
  icon: ReactNode
  color: string
}

const beliefs: BeliefCard[] = [
  {
    title: 'BFF for Frontend Independence',
    description:
      'A Backend-for-Frontend layer lets the UI team move fast without waiting on backend contracts. It shapes data for the client, handles aggregation, and keeps the frontend clean of server-side concerns.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    color: '#5B8CFF',
  },
  {
    title: 'Strangler Fig Migrations',
    description:
      'Big-bang rewrites fail. Strangler migrations let you wrap legacy systems, route traffic incrementally, and ship value while modernizing. Teams keep shipping; risk stays contained.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18" />
        <path d="M18 9a6 6 0 0 0-6-6" />
        <path d="M6 15a6 6 0 0 0 6 6" />
        <path d="M18 15a6 6 0 0 1-6 6" />
        <path d="M6 9a6 6 0 0 1 6-6" />
      </svg>
    ),
    color: '#3DDC97',
  },
  {
    title: 'Design Systems as Product Infra',
    description:
      'A design system isn\'t a side project — it\'s product infrastructure. It compounds velocity, enforces consistency, and reduces QA surface. Treat it like a platform, with versioning, docs, and ownership.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: '#FFE66D',
  },
]

function PrincipleCard({ belief, index }: { belief: BeliefCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const reducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full"
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: `linear-gradient(135deg, ${belief.color}25, transparent 50%, ${belief.color}15)`,
          filter: 'blur(1px)',
        }}
      />

      <motion.div 
        className="relative h-full rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] overflow-hidden"
        whileHover={reducedMotion ? {} : { 
          y: -8,
          transition: { duration: 0.3 }
        }}
        style={{
          boxShadow: isHovered ? `0 20px 40px ${belief.color}15` : 'none',
        }}
      >
        <div className="p-8 flex flex-col h-full">
          <motion.div 
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
            style={{ 
              background: `linear-gradient(135deg, ${belief.color}20, ${belief.color}05)`,
              border: `1px solid ${belief.color}30`,
              color: belief.color,
            }}
            animate={reducedMotion ? {} : {
              rotate: isHovered ? [0, -5, 5, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {belief.icon}
          </motion.div>

          <h3 
            className="text-xl font-semibold mb-4 transition-colors duration-300"
            style={{ color: isHovered ? belief.color : 'var(--color-text)' }}
          >
            {belief.title}
          </h3>

          <p className="text-[var(--color-muted)] leading-relaxed flex-1">
            {belief.description}
          </p>

          <motion.div
            className="mt-6 flex items-center gap-2 text-sm font-medium"
            style={{ color: belief.color }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <span>Learn more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ 
            background: `linear-gradient(90deg, ${belief.color}, ${belief.color}60, transparent)`,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top right, ${belief.color}10, transparent 70%)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function Architecture() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="architecture" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-gradient-conic from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent-2)]/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container-narrow">
        <SectionReveal className="mb-16 text-center">
          <span className="eyebrow mb-4 block">Principles</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Architecture{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
              Notes
            </span>
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Beliefs that guide how I approach frontend platforms at scale.
          </p>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {beliefs.map((belief, index) => (
            <PrincipleCard key={belief.title} belief={belief} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-[var(--color-muted)]/60 font-mono">
            // These principles are not rules — they're defaults that earn their exceptions.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
