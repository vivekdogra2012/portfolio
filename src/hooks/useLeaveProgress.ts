import { useCallback, useRef, type RefObject } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type Lenis from 'lenis'

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function onLenisScroll(lenis: Lenis, el: HTMLElement | null, progress: MotionValue<number>) {
  if (!el) return
  const total = Math.max(el.offsetHeight, 1)
  const distance = lenis.animatedScroll - (el.getBoundingClientRect().top + lenis.animatedScroll)
  progress.set(clamp01(distance / total))
}

export function useLeaveProgress<T extends HTMLElement>(ref: RefObject<T | null>): MotionValue<number> {
  const progress = useMotionValue(0)
  const refStore = useRef(ref)
  refStore.current = ref

  const update = useCallback(
    (lenis: Lenis) => {
      onLenisScroll(lenis, refStore.current.current, progress)
    },
    [progress],
  )

  useLenis(update, [progress])

  return progress
}

export function usePageProgress(): MotionValue<number> {
  const progress = useMotionValue(0)

  const update = useCallback(
    (lenis: Lenis) => {
      progress.set(lenis.progress)
    },
    [progress],
  )

  useLenis(update, [progress])

  return progress
}
