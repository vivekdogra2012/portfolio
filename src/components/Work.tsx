import { useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useLeaveProgress } from '../hooks/useLeaveProgress'
import { roles, type Role } from '../content'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { easeOut } from '../motion'

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
  const reduced = useReducedMotion()
  const flipped = index === 1
  const wide = index === 2

  return (
    <motion.article
      className="group border-t border-[var(--color-line)] py-12 md:py-20"
      data-cursor="view"
      initial={reduced ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay: 0.05, ease: easeOut }}
    >
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
    </motion.article>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
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
  const reduced = useReducedMotion()
  const [viewRef, seen] = useInView<HTMLDivElement>({ threshold: 0.28 })
  const play = seen && !reduced
  const travel = useLeaveProgress(viewRef)
  const drift = useTransform(travel, [0, 1], [36, -36])
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 18 })
  const sy = useSpring(py, { stiffness: 140, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const shiftX = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const shiftY = useTransform(sy, [-0.5, 0.5], [-8, 8])
  const shineX = useTransform(sx, (value) => `${(value + 0.5) * 100}%`)
  const shineY = useTransform(sy, (value) => `${(value + 0.5) * 100}%`)
  const shine = useMotionTemplate`radial-gradient(420px circle at ${shineX} ${shineY}, rgba(139,92,246,0.22), transparent 60%)`

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={viewRef}
      className={`relative overflow-hidden border border-[var(--color-line)] bg-[#0c0c10] ${className}`}
      style={{ perspective: 900 }}
      onPointerMove={tilt}
      onPointerLeave={reset}
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: drift }}
        initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={play || reduced ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.05, ease: easeOut }}
      >
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { rotateX, rotateY, x: shiftX, y: shiftY }}
        >
          {kind === 0 && <Planes play={play} />}
          {kind === 1 && <Bars play={play} />}
          {kind === 2 && <Tiles play={play} />}
          {!reduced && <motion.div className="absolute inset-0" style={{ background: shine }} />}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function Planes({ play }: { play: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.28),transparent_46%)]" />
      <motion.div
        className="absolute top-[16%] left-[10%] h-[62%] w-[58%] border border-white/30"
        animate={play ? { x: [0, 16, 0], y: [0, -12, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[8%] bottom-[14%] h-[48%] w-[46%] border border-white/25 bg-white/[0.03]"
        animate={play ? { x: [0, -18, 0], y: [0, 14, 0] } : undefined}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[28%] left-[16%] h-1.5 origin-left bg-[var(--color-accent)]"
        initial={{ width: play ? 112 : 0 }}
        animate={{ width: play ? 112 : 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
      />
      <motion.div
        className="absolute top-[36%] left-[16%] h-px origin-left bg-white/40"
        initial={{ width: play ? 160 : 0 }}
        animate={{ width: play ? 160 : 0 }}
        transition={{ duration: 1.05, delay: 0.4, ease: easeOut }}
      />
    </div>
  )
}

function Bars({ play }: { play: boolean }) {
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
      {rows.map((row, index) => (
        <motion.div
          key={row.width}
          className={`relative h-[3px] origin-left ${row.tone}`}
          style={{ width: row.width }}
          initial={{ scaleX: play ? 1 : 0 }}
          animate={{ scaleX: play ? 1 : 0 }}
          transition={{ duration: 0.85, delay: 0.12 + index * 0.08, ease: easeOut }}
        />
      ))}
    </div>
  )
}

function Tiles({ play }: { play: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.2),transparent_55%)]" />
      <div className="absolute inset-[12%] grid grid-cols-8 gap-2">
        {Array.from({ length: 32 }, (_, index) => {
          const accent = [0, 6, 17, 23].includes(index)
          return (
            <motion.div
              key={index}
              className="border border-white/20"
              style={{ background: accent ? 'rgba(139,92,246,0.55)' : 'transparent' }}
              initial={{ opacity: play ? 1 : 0, scale: play ? 1 : 0.7 }}
              animate={
                play
                  ? { opacity: accent ? [0.45, 1, 0.45] : 1, scale: 1 }
                  : { opacity: 0, scale: 0.7 }
              }
              transition={
                accent
                  ? { opacity: { duration: 2.8, repeat: Infinity, delay: index * 0.05 }, scale: { duration: 0.45, delay: index * 0.02 } }
                  : { duration: 0.4, delay: (index % 8) * 0.03 + Math.floor(index / 8) * 0.04, ease: easeOut }
              }
            />
          )
        })}
      </div>
    </div>
  )
}
