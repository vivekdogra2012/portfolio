import { FadeUp } from './FadeUp'

interface SkillGroup {
  lens: string
  description: string
  chips: string[]
}

const skillGroups: SkillGroup[] = [
  {
    lens: 'Core',
    description: 'The foundation — TypeScript-first, performance-aware, pixel-polished.',
    chips: ['TypeScript', 'JavaScript', 'React.js', 'Next.js', 'React Native', 'HTML5', 'CSS3'],
  },
  {
    lens: 'UI Systems',
    description: 'Component libraries, design tokens, and consistent engineering bars.',
    chips: ['Design Systems', 'Component Libraries', 'Tailwind CSS', 'Material UI', 'Framer Motion'],
  },
  {
    lens: 'State & Data',
    description: 'Clean data flow from API to UI, with predictable state management.',
    chips: ['Redux', 'Context API', 'REST APIs', 'Data Fetching', 'Caching Strategies'],
  },
  {
    lens: 'Architecture',
    description: 'Platform decisions, migrations, and systems that scale with the team.',
    chips: ['Frontend Architecture', 'Monorepo', 'Micro-frontends', 'Performance Optimization', 'Code Splitting'],
  },
  {
    lens: 'Delivery',
    description: 'Shipping reliably with mentoring, reviews, and cross-functional partnerships.',
    chips: ['Technical Leadership', 'Mentoring', 'Code Reviews', 'Technical Hiring', 'Agile/Scrum'],
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container-narrow">
        <FadeUp>
          <span className="eyebrow mb-4 block">What I Do</span>
          <h2 className="section-title mb-12 md:mb-16">
            Skills Through an Architect Lens
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:gap-8">
          {skillGroups.map((group, index) => (
            <FadeUp key={group.lens} delay={index * 0.08}>
              <div className="card group">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {group.lens}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                  <div className="md:w-2/3 flex flex-wrap gap-2">
                    {group.chips.map((chip) => (
                      <span key={chip} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
