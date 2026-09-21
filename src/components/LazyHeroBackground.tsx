import { lazy, Suspense } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HeroBackground = lazy(() => 
  import('./HeroBackground').then(mod => ({ default: mod.HeroBackground }))
)

function FallbackBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(91, 140, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(61, 220, 151, 0.1) 0%, transparent 50%), var(--color-bg)',
        }}
      />
    </div>
  )
}

export function LazyHeroBackground() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <FallbackBackground />
  }

  return (
    <Suspense fallback={<FallbackBackground />}>
      <HeroBackground />
    </Suspense>
  )
}
