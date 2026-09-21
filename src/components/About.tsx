import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="py-24 md:py-32 bg-gradient-to-b from-[var(--color-surface)]/50 to-transparent relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-accent)]/5 to-transparent" />
      </div>

      <div className="container-narrow">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-2 relative">
            <motion.div
              ref={imageRef}
              className="relative"
              style={reducedMotion ? {} : { y: imageY }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent-2)]/20 blur-2xl"
                  animate={reducedMotion ? {} : { 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <motion.div
                  className="relative rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="aspect-[4/5] relative">
                    <img
                      src={`${import.meta.env.BASE_URL}vivek-dogra.jpg`}
                      alt="Vivek Dogra"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/60 via-transparent to-transparent" />
                  </div>

                  <motion.div
                    className="absolute inset-0 border-2 border-[var(--color-accent)]/30 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 px-6 py-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl"
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      Available for opportunities
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <SectionReveal>
              <div className="flex items-end gap-4 mb-4">
                <span className="eyebrow">About</span>
                <motion.div 
                  className="flex-1 h-px bg-gradient-to-r from-[var(--color-accent)]/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
                A Bit{' '}
                <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
                  More
                </span>
              </h2>
            </SectionReveal>

            <div className="space-y-6">
              <SectionReveal delay={0.1}>
                <p className="text-lg text-[var(--color-text)]/90 leading-relaxed">
                  I'm Vivek Dogra — a Frontend Architect with 8+ years building consumer-scale 
                  web and mobile UI. I'm currently Architect-1 at Infinity Learn, where I own 
                  frontend architecture across our React and React Native surfaces.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  My work sits at the intersection of platform thinking and hands-on delivery. 
                  I led the migration from AngularJS + Kotlin to React + React Native — not as 
                  a big-bang rewrite, but as a phased modernization where product kept shipping 
                  throughout. That's the kind of challenge I enjoy: balancing technical ambition 
                  with real-world constraints.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  Before Infinity Learn, I built engagement-focused UI at FanCraze (Team Packs, 
                  leaderboards, Framer Motion interfaces) and progressed through SDE-1 to SDE-2 
                  at Junglee Games, working on high-traffic gaming products like Junglee Rummy 
                  and Howzat.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  Beyond code, I care about raising the engineering bar — mentoring SDE-1/SDE-2 
                  engineers, improving code-review quality, and building systems that help teams 
                  ship reliably. I'm based in Gurgaon/Delhi NCR and open to Staff Frontend 
                  Engineer, Frontend Architect, and FE Lead roles — remote within India or 
                  Delhi-NCR.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.5}>
                <div className="flex flex-wrap gap-4 pt-4">
                  {[
                    { label: 'Years', value: '8+' },
                    { label: 'Companies', value: '3' },
                    { label: 'Platform Migrations', value: '2' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="flex items-baseline gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <span className="text-2xl font-bold text-[var(--color-accent)]">{stat.value}</span>
                      <span className="text-sm text-[var(--color-muted)]">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
