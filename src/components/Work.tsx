import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { roles, type Role } from '../content'
import { Reveal } from './Reveal'

export function Work() {
  return (
    <section id="work" className="section-space scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">02 / Selected work</p>
          <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Systems that shipped.
          </h2>
        </Reveal>

        <div className="mt-16 md:mt-24">
          {roles.map((role, index) => (
            <Case key={role.company} role={role} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Case({ role, index }: { role: Role; index: number }) {
  const [open, setOpen] = useState(false)
  const flipped = index === 1
  const wide = index === 2

  return (
    <article className="group border-t border-[var(--color-line)] py-12 md:py-20" data-cursor="view">
      {wide ? (
        <div>
          <Frame kind={index} className="aspect-[16/8] md:aspect-[16/7]" />
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Meta role={role} index={index} />
              <h3 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{role.company}</h3>
            </div>
            <Copy role={role} open={open} onToggle={() => setOpen((value) => !value)} className="md:col-span-5" />
          </div>
        </div>
      ) : (
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <Frame kind={index} className={`aspect-[4/3] md:col-span-7 ${flipped ? 'md:order-2' : ''}`} />
          <div className="md:col-span-5">
            <Meta role={role} index={index} />
            <h3 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{role.company}</h3>
            <Copy role={role} open={open} onToggle={() => setOpen((value) => !value)} className="mt-6" />
          </div>
        </div>
      )}
    </article>
  )
}

function Meta({ role, index }: { role: Role; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.68rem] tracking-[0.16em] text-[var(--color-faint)] uppercase">
      <span className="text-[var(--color-accent)]">0{index + 1}</span>
      <span>{role.role}</span>
      <span>{role.period}</span>
    </div>
  )
}

function Copy({
  role,
  open,
  onToggle,
  className = '',
}: {
  role: Role
  open: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-lg text-[var(--color-text)]">{role.headline}</p>
      <p className="mt-3 text-[var(--color-muted)]">{role.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {role.stack.map((item) => (
          <li key={item} className="border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.68rem] tracking-wide text-[var(--color-muted)]">
            {item}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-quiet mt-6" aria-expanded={open} onClick={onToggle}>
        {open ? 'Hide details' : 'Read the work'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className={open ? 'rotate-90' : ''}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden pt-5"
          >
            {role.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-[var(--color-muted)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function Frame({ kind, className }: { kind: number; className: string }) {
  return (
    <div className={`relative overflow-hidden border border-[var(--color-line)] bg-[#0c0c10] ${className}`}>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
        {kind === 0 && <Planes />}
        {kind === 1 && <Bars />}
        {kind === 2 && <Tiles />}
      </div>
    </div>
  )
}

function Planes() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.28),transparent_46%)]" />
      <div className="absolute top-[16%] left-[10%] h-[62%] w-[58%] border border-white/30" />
      <div className="absolute right-[8%] bottom-[14%] h-[48%] w-[46%] border border-white/25 bg-white/[0.03]" />
      <div className="absolute top-[28%] left-[16%] h-1.5 w-28 bg-[var(--color-accent)]" />
      <div className="absolute top-[36%] left-[16%] h-px w-40 bg-white/40" />
    </div>
  )
}

function Bars() {
  const rows = [
    { width: '78%', tone: 'bg-white/35' },
    { width: '52%', tone: 'bg-white/20' },
    { width: '88%', tone: 'bg-white/30' },
    { width: '26%', tone: 'bg-[var(--color-accent)]' },
    { width: '64%', tone: 'bg-white/25' },
  ]
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 px-[12%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.18),transparent_50%)]" />
      {rows.map((row) => (
        <div key={row.width} className={`relative h-[3px] ${row.tone}`} style={{ width: row.width }} />
      ))}
    </div>
  )
}

function Tiles() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.2),transparent_55%)]" />
      <div className="absolute inset-[12%] grid grid-cols-8 gap-2">
        {Array.from({ length: 32 }, (_, index) => (
          <div
            key={index}
            className="border border-white/20"
            style={{ background: [0, 6, 17, 23].includes(index) ? 'rgba(139,92,246,0.55)' : 'transparent' }}
          />
        ))}
      </div>
    </div>
  )
}
