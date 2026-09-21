import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface SkillGroup {
  lens: string
  description: string
  chips: string[]
  icon: string
  color: string
}

const skillGroups: SkillGroup[] = [
  {
    lens: 'Core',
    description: 'The foundation — TypeScript-first, performance-aware, pixel-polished.',
    chips: ['TypeScript', 'JavaScript', 'React.js', 'Next.js', 'React Native', 'HTML5', 'CSS3'],
    icon: '⚡',
    color: '#5B8CFF',
  },
  {
    lens: 'UI Systems',
    description: 'Component libraries, design tokens, and consistent engineering bars.',
    chips: ['Design Systems', 'Component Libraries', 'Tailwind CSS', 'Material UI', 'Framer Motion'],
    icon: '🎨',
    color: '#3DDC97',
  },
  {
    lens: 'State & Data',
    description: 'Clean data flow from API to UI, with predictable state management.',
    chips: ['Redux', 'Context API', 'REST APIs', 'Data Fetching', 'Caching Strategies'],
    icon: '📊',
    color: '#FF6B6B',
  },
  {
    lens: 'Architecture',
    description: 'Platform decisions, migrations, and systems that scale with the team.',
    chips: ['Frontend Architecture', 'Monorepo', 'Micro-frontends', 'Performance Optimization', 'Code Splitting'],
    icon: '🏗️',
    color: '#FFE66D',
  },
  {
    lens: 'Delivery',
    description: 'Shipping reliably with mentoring, reviews, and cross-functional partnerships.',
    chips: ['Technical Leadership', 'Mentoring', 'Code Reviews', 'Technical Hiring', 'Agile/Scrum'],
    icon: '🚀',
    color: '#C9B1FF',
  },
]

function SkillChip({ chip, color, index }: { chip: string; color: string; index: number }) {
  const reducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.span
      className="relative inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-muted)] cursor-default select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        boxShadow: isHovered ? `0 8px 30px ${color}20, 0 0 0 1px ${color}40` : 'none',
      }}
    >
      <motion.span
        className="absolute inset-0 opacity-0"
        style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <span className="relative z-10 transition-colors duration-200" style={{ color: isHovered ? color : undefined }}>
        {chip}
      </span>
    </motion.span>
  )
}

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const reducedMotion = useReducedMotion()
  const [isExpanded, setIsExpanded] = useState(index === 0)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${group.color}30, transparent, ${group.color}10)`,
        }}
      />
      
      <div 
        className="relative rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] overflow-hidden cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${group.color}20, ${group.color}05)`,
                border: `1px solid ${group.color}30`,
              }}
              whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {group.icon}
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 
                  className="text-xl font-semibold transition-colors duration-300"
                  style={{ color: isExpanded ? group.color : 'var(--color-text)' }}
                >
                  {group.lens}
                </h3>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--color-muted)]"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="m6 9 6 6 6-6" />
                </motion.svg>
              </div>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {group.description}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-[var(--color-border)]/50">
                  <div className="flex flex-wrap gap-2">
                    {group.chips.map((chip, chipIndex) => (
                      <SkillChip
                        key={chip}
                        chip={chip}
                        color={group.color}
                        index={chipIndex}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${group.color}, transparent)` }}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          whileInView={{ scaleX: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

export function Skills() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[var(--color-accent-2)]/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow">
        <SectionReveal className="mb-16">
          <div className="flex items-end gap-4 mb-4">
            <span className="eyebrow">What I Do</span>
            <motion.div 
              className="flex-1 h-px bg-gradient-to-r from-[var(--color-accent)]/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Skills Through an{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
              Architect Lens
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)] max-w-2xl">
            Click each category to explore the technologies and practices I bring to every project.
          </p>
        </SectionReveal>

        <div className="grid gap-4 md:gap-6">
          {skillGroups.map((group, index) => (
            <SkillCard key={group.lens} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
