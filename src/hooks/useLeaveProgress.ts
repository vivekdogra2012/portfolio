import { useEffect, type RefObject } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'

export function useLeaveProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (!el) return
      const total = Math.max(el.offsetHeight, 1)
      const next = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
      progress.set(next)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress, ref])

  return progress
}

export function usePageProgress(): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress])

  return progress
}
