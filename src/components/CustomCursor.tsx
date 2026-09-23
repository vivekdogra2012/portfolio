import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return fine
}

export function CustomCursor() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const [active, setActive] = useState(false)
  const [mode, setMode] = useState<'default' | 'link' | 'view'>('default')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const spring = { damping: 28, stiffness: 380, mass: 0.4 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  useEffect(() => {
    if (reduced || !fine) return

    const move = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setActive(true)
      const target = event.target as HTMLElement | null
      if (target?.closest('[data-cursor="view"]')) setMode('view')
      else if (target?.closest('a, button, [data-cursor="link"]')) setMode('link')
      else setMode('default')
    }

    const leave = () => setActive(false)
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [fine, reduced, x, y])

  if (reduced || !fine) return null

  const viewing = mode === 'view'

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[70]"
        style={{ x: sx, y: sy }}
        animate={{ opacity: active ? 1 : 0 }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[var(--color-accent)] text-[10px] font-semibold tracking-[0.16em] text-white"
          animate={{
            width: viewing ? 64 : mode === 'link' ? 18 : 10,
            height: viewing ? 64 : mode === 'link' ? 18 : 10,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          {viewing ? 'VIEW' : ''}
        </motion.div>
      </motion.div>
      {active && (
        <style>{`
          @media (hover: hover) and (pointer: fine) {
            * { cursor: none !important; }
          }
        `}</style>
      )}
    </>
  )
}
