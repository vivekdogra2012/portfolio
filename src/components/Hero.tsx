import { motion } from 'framer-motion'

const trustedBy = ['Infinity Learn', 'FanCraze', 'Junglee Games']

const easeOutExpo = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easeOutExpo,
    },
  },
}

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 md:pb-24">
      <div className="container-narrow">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#5B8CFF] to-[#5B8CFF]/60">
              <img
                src={`${import.meta.env.BASE_URL}vivek-dogra.jpg`}
                alt="Vivek Dogra"
                className="w-full h-full rounded-full object-cover"
                fetchPriority="high"
              />
            </div>
          </motion.div>

          <motion.span variants={itemVariants} className="eyebrow mb-4 block">
            Frontend Architect · Staff FE · 8+ Years
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            Vivek Dogra
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-[var(--color-muted)] leading-relaxed mb-4"
          >
            Frontend Architect — platforms, migrations, and UI systems that scale.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed mb-8"
          >
            I build and modernize consumer-scale web and mobile frontends. Currently Architect-1 at Infinity Learn, 
            leading React.js + React Native architecture, platform migrations (Angular/Kotlin → React/RN), 
            and engineering standards.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)] mb-8"
          >
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Gurgaon / Delhi NCR
            </span>
            <span className="text-[var(--color-border)]">·</span>
            <span>Open to Staff/Architect FE</span>
            <span className="text-[var(--color-border)]">·</span>
            <span>India Remote / Delhi-NCR</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-12"
          >
            <a
              href="mailto:vivekdogra2012@gmail.com"
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Get in Touch
            </a>
            <a
              href="https://www.linkedin.com/in/vivek-dogra-8b6114b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-xs text-[var(--color-muted)] mb-3 uppercase tracking-wider">
              Trusted by
            </p>
            <div className="flex flex-wrap gap-4">
              {trustedBy.map((company) => (
                <span
                  key={company}
                  className="text-sm font-medium text-[var(--color-text)]/70"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
