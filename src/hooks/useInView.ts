import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react'

function getReducedMotionSnapshot(): boolean {
  return typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  )

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setIsInView(true)
        if (triggerOnce && ref.current) {
          observer.unobserve(ref.current)
        }
      } else if (!triggerOnce) {
        setIsInView(false)
      }
    },
    [triggerOnce]
  )

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, handleIntersection, prefersReducedMotion])

  return [ref, prefersReducedMotion || isInView]
}
