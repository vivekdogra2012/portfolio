import { useReducedMotion } from '../hooks/useReducedMotion'

export function GrainOverlay() {
  const reducedMotion = useReducedMotion()
  
  if (reducedMotion) return null

  return (
    <>
      <div 
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div 
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(11, 15, 20, 0.4) 100%)',
        }}
      />
    </>
  )
}
