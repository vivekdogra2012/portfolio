import { FadeUp } from './FadeUp'

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-[var(--color-surface)]/30">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <span className="eyebrow mb-4 block">About</span>
            <h2 className="section-title mb-8">A Bit More</h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-2xl p-0.5 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/50">
                  <img
                    src={import.meta.env.BASE_URL + 'vivek-dogra.jpg'}
                    alt="Vivek Dogra, Frontend Architect"
                    width={128}
                    height={128}
                    loading="lazy"
                    className="w-full h-full rounded-2xl object-cover bg-[var(--color-surface)]"
                  />
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-6">
                  I'm Vivek Dogra — a Frontend Architect with 8+ years building consumer-scale 
                  web and mobile UI. I'm currently Architect-1 at Infinity Learn, where I own 
                  frontend architecture across our React and React Native surfaces.
                </p>

                <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                  My work sits at the intersection of platform thinking and hands-on delivery. 
                  I led the migration from AngularJS + Kotlin to React + React Native — not as 
                  a big-bang rewrite, but as a phased modernization where product kept shipping 
                  throughout. That's the kind of challenge I enjoy: balancing technical ambition 
                  with real-world constraints.
                </p>

                <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                  Before Infinity Learn, I built engagement-focused UI at FanCraze (Team Packs, 
                  leaderboards, Framer Motion interfaces) and progressed through SDE-1 to SDE-2 
                  at Junglee Games, working on high-traffic gaming products like Junglee Rummy 
                  and Howzat.
                </p>

                <p className="text-[var(--color-muted)] leading-relaxed">
                  Beyond code, I care about raising the engineering bar — mentoring SDE-1/SDE-2 
                  engineers, improving code-review quality, and building systems that help teams 
                  ship reliably. I'm based in Gurgaon/Delhi NCR and open to Staff Frontend 
                  Engineer, Frontend Architect, and FE Lead roles — remote within India or 
                  Delhi-NCR.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
