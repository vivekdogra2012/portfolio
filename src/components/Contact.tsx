import { motion } from 'framer-motion'
import { profile } from '../content'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ease = [0.22, 1, 0.36, 1] as const

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'vivek-dogra', href: profile.linkedin },
  { label: 'GitHub', value: 'vivekdogra2012', href: profile.github },
]

export function Contact() {
  const reduced = useReducedMotion()

  return (
    <section id="contact" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">07 / Contact</p>
          <h2 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl md:leading-[0.95]">
            {['Let’s build', 'something', 'that scales.'].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.14em] pt-[0.04em]">
                <motion.span
                  className={`block ${index === 2 ? 'text-outline' : ''}`}
                  initial={reduced ? false : { y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.9, delay: index * 0.08, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 border-t border-[var(--color-line)] pt-10 md:grid-cols-12">
          <p className="text-[var(--color-muted)] md:col-span-5">{profile.availability}</p>
          <ul className="md:col-span-7">
            {channels.map((channel, index) => (
              <motion.li
                key={channel.label}
                className="border-b border-[var(--color-line)]"
                initial={reduced ? false : { opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.55, delay: index * 0.08, ease }}
              >
                <a
                  href={channel.href}
                  className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-[var(--color-accent)]"
                  {...(channel.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span>
                    <span className="block font-mono text-[0.65rem] tracking-[0.18em] text-[var(--color-faint)] uppercase">
                      {channel.label}
                    </span>
                    <span className="mt-1 block text-xl tracking-tight md:text-2xl">{channel.value}</span>
                  </span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden>
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        <a className="btn-solid mt-12" href={`mailto:${profile.email}`}>
          Get in touch
        </a>
      </div>
    </section>
  )
}
