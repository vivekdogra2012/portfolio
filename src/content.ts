export const profile = {
  name: 'Vivek Dogra',
  title: 'Frontend Architect',
  location: 'Gurgaon / Delhi NCR',
  email: 'vivekdogra2012@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vivek-dogra-8b6114b1/',
  github: 'https://github.com/vivekdogra2012',
  availability: 'Open to Staff Frontend, Frontend Architect, and FE Lead roles — remote within India or Delhi NCR.',
}

export const about = {
  statement:
    'I’m a frontend architect with 8+ years building consumer-scale web and mobile UI.',
  paragraphs: [
    'My work sits at the intersection of platform thinking and hands-on delivery. I led the migration from AngularJS + Kotlin to React + React Native — not as a big-bang rewrite, but as a phased modernization where product kept shipping throughout.',
    'Before Infinity Learn, I built engagement-focused UI at FanCraze and progressed from SDE-1 to SDE-2 at Junglee Games, working on high-traffic products like Junglee Rummy and Howzat.',
    'Beyond the interface, I care about raising the engineering bar — mentoring SDE-1 and SDE-2 engineers, improving code-review quality, and building systems that help teams ship reliably.',
  ],
}

export interface Role {
  company: string
  role: string
  period: string
  headline: string
  description: string
  highlights: string[]
  stack: string[]
}

export const roles: Role[] = [
  {
    company: 'Infinity Learn',
    role: 'Architect-1, Frontend',
    period: 'Jul 2026 – Present',
    headline: 'Unified web + mobile frontend platform',
    description:
      'Revamped student.infinitylearn.com and led React Native architecture for Android and iOS. Drove the AngularJS + Kotlin migration to React.js + React Native.',
    highlights: [
      'Own frontend architecture across React and React Native surfaces',
      'Led a phased platform migration with dual-stack support',
      'Established engineering standards and scalable delivery practices',
      'Mentor senior engineers and raise code-review quality',
    ],
    stack: ['React.js', 'Next.js', 'React Native', 'TypeScript'],
  },
  {
    company: 'FanCraze',
    role: 'Senior Frontend Engineer',
    period: 'Jul 2024 – Sep 2025',
    headline: 'Product frontend at scale',
    description:
      'Built consumer-facing UI for FanCraze.com and FC5 — Team Packs, leaderboards, and motion-rich engagement surfaces.',
    highlights: [
      'Delivered high-traffic product features with React and TypeScript',
      'Implemented Framer Motion while preserving performance',
      'Worked with product and design for rapid iteration',
      'Built reusable component patterns with Material UI',
    ],
    stack: ['React', 'TypeScript', 'Context API', 'Material UI', 'Framer Motion'],
  },
  {
    company: 'Junglee Games',
    role: 'SDE-1 → SDE-2',
    period: 'Feb 2018 – Jun 2024',
    headline: 'Ownership ladder on consumer gaming',
    description:
      'Progressed from SDE-1 to SDE-2 building analytics dashboards and gaming site revamps across Junglee Rummy, Howzat, and more.',
    highlights: [
      'Built analytics dashboards with React, Node.js, and Express',
      'Led gaming site revamps for engagement-focused products',
      'Developed reusable UI with Tailwind CSS and Redux',
      'Mentored junior engineers and raised review consistency',
    ],
    stack: ['React', 'Redux', 'AngularJS', 'Node.js', 'Tailwind CSS'],
  },
]

export const expertise = [
  {
    index: '01',
    title: 'Frontend architecture',
    detail: 'Platform decisions, migrations, and systems that scale with the team — not just the next screen.',
  },
  {
    index: '02',
    title: 'React & Next.js',
    detail: 'TypeScript-first product UI, from consumer web surfaces to the structure underneath them.',
  },
  {
    index: '03',
    title: 'Design systems',
    detail: 'Component libraries, tokens, and an engineering bar that keeps product UI consistent.',
  },
  {
    index: '04',
    title: 'React Native',
    detail: 'Shared frontend architecture across Android and iOS, not a separate mobile rewrite.',
  },
  {
    index: '05',
    title: 'Platform migrations',
    detail: 'Strangler-style moves off AngularJS and Kotlin while the product keeps shipping.',
  },
  {
    index: '06',
    title: 'Performance',
    detail: 'Code splitting, predictable data flow, and motion that doesn’t tax the main thread.',
  },
  {
    index: '07',
    title: 'Micro-frontends',
    detail: 'Boundaries that let teams ship independently without fracturing the user experience.',
  },
  {
    index: '08',
    title: 'Engineering leadership',
    detail: 'Mentorship, code review, and delivery practices that raise the people around the code.',
  },
]

export const stack = [
  { name: 'TypeScript', group: 'Language' },
  { name: 'JavaScript', group: 'Language' },
  { name: 'React', group: 'UI' },
  { name: 'Next.js', group: 'UI' },
  { name: 'React Native', group: 'Mobile' },
  { name: 'Redux', group: 'State' },
  { name: 'Context API', group: 'State' },
  { name: 'REST', group: 'Data' },
  { name: 'Tailwind CSS', group: 'UI' },
  { name: 'Material UI', group: 'UI' },
  { name: 'Framer Motion', group: 'Motion' },
  { name: 'Node.js', group: 'Platform' },
  { name: 'AngularJS', group: 'Legacy' },
  { name: 'HTML & CSS', group: 'Foundation' },
]

export const beliefs = [
  {
    title: 'BFF for frontend independence',
    body: 'A Backend-for-Frontend layer lets the UI team move without waiting on backend contracts. It shapes data for the client, handles aggregation, and keeps the frontend clear of server-side concerns.',
  },
  {
    title: 'Strangler fig migrations',
    body: 'Big-bang rewrites fail. Wrap the legacy system, route traffic incrementally, and ship value while modernizing. Teams keep shipping. Risk stays contained.',
  },
  {
    title: 'Design systems as product infra',
    body: 'A design system isn’t a side project. It compounds velocity, enforces consistency, and reduces QA surface. Treat it like a platform — versioned, documented, owned.',
  },
]

export const thinking = ['Product', 'Design', 'Frontend', 'API / BFF', 'Platform', 'Observability']
