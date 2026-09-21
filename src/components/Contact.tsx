import { FadeUp } from './FadeUp'

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <span className="eyebrow mb-4 block">Get in Touch</span>
            <h2 className="section-title mb-6">Let's Connect</h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-lg text-[var(--color-muted)] mb-10 leading-relaxed">
              Open to Staff Frontend Engineer, Frontend Architect, and FE Lead opportunities. 
              Based in Delhi NCR, available for remote roles across India.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:vivekdogra2012@gmail.com"
                className="btn-primary w-full sm:w-auto justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                vivekdogra2012@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/vivek-dogra-8b6114b1/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
