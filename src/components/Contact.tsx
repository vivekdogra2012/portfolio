import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { MagneticButton } from './MagneticButton'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const reducedMotion = useReducedMotion()

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="py-24 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
            opacity: 0.05,
          }}
          animate={reducedMotion ? {} : {
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <span className="eyebrow mb-4 block">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Let's{' '}
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
                Connect
              </span>
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p className="text-lg md:text-xl text-[var(--color-muted)] mb-12 leading-relaxed">
              Open to Staff Frontend Engineer, Frontend Architect, and FE Lead opportunities. 
              Based in Delhi NCR, available for remote roles across India.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <MagneticButton
                as="a"
                href="mailto:vivekdogra2012@gmail.com"
                className="btn-primary w-full sm:w-auto justify-center group text-lg px-8 py-4"
                strength={0.25}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-12 transition-transform duration-300">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>vivekdogra2012@gmail.com</span>
              </MagneticButton>
              
              <MagneticButton
                as="a"
                href="https://www.linkedin.com/in/vivek-dogra-8b6114b1/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto justify-center group text-lg px-8 py-4"
                strength={0.25}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn Profile</span>
              </MagneticButton>
            </div>
          </SectionReveal>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-border)]/50 to-transparent h-px top-0" />
            
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Location', value: 'Delhi NCR, India' },
                { label: 'Availability', value: 'Remote / Hybrid' },
                { label: 'Role Focus', value: 'Staff / Architect' },
                { label: 'Response Time', value: '< 24 hours' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <p className="text-xs font-mono text-[var(--color-muted)]/60 uppercase tracking-wider mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
