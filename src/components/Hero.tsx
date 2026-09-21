import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { LazyHeroBackground } from './LazyHeroBackground'
import { MagneticButton } from './MagneticButton'
import { TextReveal, SplitTextReveal } from './TextReveal'
import { Marquee } from './Marquee'
import { useReducedMotion } from '../hooks/useReducedMotion'

const trustedBy = ['Infinity Learn', 'FanCraze', 'Junglee Games']
const techStack = ['React', 'TypeScript', 'React Native', 'Next.js', 'Node.js', 'GraphQL', 'Tailwind', 'GSAP']

const easeOutExpo = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      <LazyHeroBackground />
      
      <motion.div
        className="container-narrow relative z-10 pt-24 pb-20"
        style={reducedMotion ? {} : { y, opacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative w-32 h-32 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent)] opacity-80 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent)]">
                <img
                  src={`${import.meta.env.BASE_URL}vivek-dogra.jpg`}
                  alt="Vivek Dogra"
                  className="w-full h-full rounded-full object-cover object-[center_20%]"
                  fetchPriority="high"
                />
              </div>
              
              <motion.div
                className="absolute -inset-2 rounded-full border border-[var(--color-accent)]/30"
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] text-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
              <span className="font-mono text-[var(--color-accent)]">Frontend Architect</span>
              <span className="text-[var(--color-muted)]">·</span>
              <span className="text-[var(--color-muted)]">8+ Years</span>
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              <TextReveal as="span" className="block" delay={0.1}>
                <span className="bg-gradient-to-r from-[var(--color-text)] via-[var(--color-text)] to-[var(--color-muted)] bg-clip-text text-transparent">
                  Vivek Dogra
                </span>
              </TextReveal>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <p className="text-xl md:text-2xl lg:text-3xl text-[var(--color-muted)] leading-relaxed font-light">
              <SplitTextReveal
                text="Platforms, migrations, and UI systems that scale."
                delay={0.4}
                stagger={0.03}
              />
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-[var(--color-muted)]/80 leading-relaxed mb-10 max-w-2xl"
          >
            I build and modernize consumer-scale web and mobile frontends. Currently Architect-1 at Infinity Learn, 
            leading React.js + React Native architecture, platform migrations (Angular/Kotlin → React/RN), 
            and engineering standards.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)] mb-10"
          >
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Gurgaon / Delhi NCR
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-2)]" />
              Open to opportunities
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-16"
          >
            <MagneticButton
              as="a"
              href="mailto:vivekdogra2012@gmail.com"
              className="btn-primary group"
              strength={0.2}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-12 transition-transform duration-300">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Get in Touch</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            
            <MagneticButton
              as="a"
              href="https://www.linkedin.com/in/vivek-dogra-8b6114b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary group"
              strength={0.2}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </MagneticButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-xs text-[var(--color-muted)]/60 mb-4 uppercase tracking-widest font-mono">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap gap-6">
              {trustedBy.map((company, i) => (
                <motion.span
                  key={company}
                  className="text-base font-medium text-[var(--color-text)]/50 hover:text-[var(--color-text)] transition-colors duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="py-6 bg-gradient-to-t from-[var(--color-bg)] to-transparent">
          <Marquee 
            items={techStack} 
            speed={40} 
            className="text-sm font-mono text-[var(--color-muted)]/40"
            separator="◆"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-[var(--color-muted)]/50"
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
