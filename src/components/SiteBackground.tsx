import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function SiteBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const reduced = useReducedMotion()

  const placeGlow = useCallback(() => {
    const glow = glowRef.current
    if (!glow || reduced) return
    const y = pointer.current.y - scroll.current * 0.06
    glow.style.transform = `translate3d(${pointer.current.x}px, ${y}px, 0)`
  }, [reduced])

  useLenis(
    useCallback(
      (lenis: Lenis) => {
        scroll.current = lenis.animatedScroll
        placeGlow()
      },
      [placeGlow],
    ),
    [placeGlow],
  )

  useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 28
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 20
      placeGlow()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [placeGlow, reduced])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-[var(--color-bg)]" />
      <div
        ref={glowRef}
        className="absolute -inset-16"
        style={{
          background:
            'radial-gradient(ellipse 42% 36% at 72% 18%, rgba(139,92,246,0.18), transparent 68%), radial-gradient(ellipse 36% 32% at 18% 86%, rgba(70,70,110,0.16), transparent 70%)',
        }}
      />
      <div className="orb-drift pointer-events-none absolute top-[18%] right-[8%] h-[42vh] w-[42vh] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_68%)]" />
      <div className="orb-drift-alt pointer-events-none absolute bottom-[8%] left-[6%] h-[34vh] w-[34vh] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]" />
      <div
        className="grid-drift absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 10%, transparent 72%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 0.6px, transparent 0.6px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  )
}
