import { lazy, Suspense, useState, useEffect } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ErrorBoundary } from './ErrorBoundary'

const HeroBackground = lazy(() => 
  import('./HeroBackground').then(mod => ({ default: mod.HeroBackground }))
)

function StaticBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(91, 140, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(61, 220, 151, 0.1) 0%, transparent 50%), var(--color-bg)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(91, 140, 255, 0.08) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(61, 220, 151, 0.06) 0%, transparent 40%)',
        }}
      />
    </div>
  )
}

export function LazyHeroBackground() {
  const reducedMotion = useReducedMotion()
  const [shouldLoadWebGL, setShouldLoadWebGL] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    
    const timer = setTimeout(() => {
      setShouldLoadWebGL(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [reducedMotion])

  if (reducedMotion || !shouldLoadWebGL) {
    return <StaticBackground />
  }

  return (
    <ErrorBoundary fallback={<StaticBackground />}>
      <Suspense fallback={<StaticBackground />}>
        <HeroBackground />
      </Suspense>
    </ErrorBoundary>
  )
}
