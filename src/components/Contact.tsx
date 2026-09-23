import { profile } from '../content'
import { Reveal } from './Reveal'

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'vivek-dogra', href: profile.linkedin },
  { label: 'GitHub', value: 'vivekdogra2012', href: profile.github },
]

export function Contact() {
  return (
    <section id="contact" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">07 / Contact</p>
          <h2 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl md:leading-[0.95]">
            Let’s build
            <span className="block">something</span>
            <span className="block text-outline">that scales.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 border-t border-[var(--color-line)] pt-10 md:grid-cols-12">
          <p className="text-[var(--color-muted)] md:col-span-5">{profile.availability}</p>
          <ul className="md:col-span-7">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-[var(--color-line)]">
                <a
                  href={channel.href}
                  className="group flex items-center justify-between gap-6 py-5"
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
              </li>
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
