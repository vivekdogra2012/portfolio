import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface CaseCard {
  company: string
  role: string
  period: string
  headline: string
  description: string
  highlights: string[]
  stack: string[]
  accentColor: string
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
    accentColor: '#5B8CFF',
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
    accentColor: '#3DDC97',
  },
  {
    company: 'Junglee Games',
    role: 'SDE-1 → SDE-2',
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
    accentColor: '#FFE66D',
  },
]

function TimelineCard({ caseCard, index, isActive, onActivate }: { 
  caseCard: CaseCard
  index: number
  isActive: boolean
  onActivate: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-80px' })
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent" />
        <motion.div 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-[var(--color-bg)]"
          style={{ borderColor: caseCard.accentColor }}
          whileHover={reducedMotion ? {} : { scale: 1.5 }}
          animate={isActive ? { scale: 1.3, boxShadow: `0 0 20px ${caseCard.accentColor}50` } : {}}
        />
        {isActive && (
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{ background: caseCard.accentColor }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      <div className="md:pl-12">
        <motion.article 
          className="relative group cursor-pointer"
          onClick={onActivate}
          onKeyDown={(e) => e.key === 'Enter' && onActivate()}
          tabIndex={0}
          role="button"
          whileHover={reducedMotion ? {} : { x: 8 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${caseCard.accentColor}20, transparent 60%)`,
            }}
          />
          
          <div className="relative rounded-2xl bg-[var(--color-surface)]/60 backdrop-blur-sm border border-[var(--color-border)] overflow-hidden transition-all duration-300 group-hover:border-opacity-50"
            style={{ borderColor: isActive ? caseCard.accentColor : undefined }}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                <div className="lg:w-1/3">
                  <motion.div
                    className="inline-flex px-3 py-1.5 rounded-full text-xs font-mono mb-4"
                    style={{ 
                      background: `${caseCard.accentColor}15`,
                      color: caseCard.accentColor,
                      border: `1px solid ${caseCard.accentColor}30`,
                    }}
                  >
                    {caseCard.period}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {caseCard.company}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] font-medium">
                    {caseCard.role}
                  </p>
                </div>

                <div className="lg:w-2/3">
                  <h4 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                    {caseCard.headline}
                  </h4>
                  <p className="text-[var(--color-muted)] mb-5 leading-relaxed">
                    {caseCard.description}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-3 mb-6 pt-4 border-t border-[var(--color-border)]/50">
                          {caseCard.highlights.map((highlight, i) => (
                            <motion.li
                              key={highlight}
                              className="flex items-start gap-3 text-sm text-[var(--color-muted)]"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <span 
                                className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                                style={{ background: caseCard.accentColor }}
                              />
                              {highlight}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap gap-2">
                    {caseCard.stack.map((tech, i) => (
                      <motion.span
                        key={tech}
                        className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--color-bg)]/80 text-[var(--color-muted)] border border-[var(--color-border)]/50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        whileHover={reducedMotion ? {} : { 
                          scale: 1.05, 
                          borderColor: caseCard.accentColor,
                          color: caseCard.accentColor,
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="h-1"
              style={{ 
                background: `linear-gradient(90deg, ${caseCard.accentColor}, ${caseCard.accentColor}50, transparent)`,
                transformOrigin: 'left',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.article>
      </div>
    </motion.div>
  )
}

export function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="work" ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-[var(--color-surface)]/30 via-[var(--color-surface)]/50 to-[var(--color-surface)]/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)]/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--color-accent-2)]/3 rounded-full blur-[100px]" />
      </div>

      <div className="container-narrow">
        <SectionReveal className="mb-16">
          <div className="flex items-end gap-4 mb-4">
            <span className="eyebrow">Experience</span>
            <motion.div 
              className="flex-1 h-px bg-gradient-to-r from-[var(--color-accent)]/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Selected{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)] max-w-2xl">
            A timeline of impactful roles where I've shaped frontend architecture and delivery.
          </p>
        </SectionReveal>

        <div className="space-y-8">
          {cases.map((caseCard, index) => (
            <TimelineCard
              key={caseCard.company}
              caseCard={caseCard}
              index={index}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
