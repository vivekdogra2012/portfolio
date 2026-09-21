import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading')
  const reducedMotion = useReducedMotion()
  const skipped = useRef(false)

  useEffect(() => {
    if (reducedMotion) {
      onComplete()
      return
    }

    const duration = 2000
    const interval = 30
    const steps = duration / interval
    let step = 0

    const timer = setInterval(() => {
      if (skipped.current) return
      
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setProgress(Math.min(100, eased * 100))

      if (step >= steps) {
        clearInterval(timer)
        setPhase('revealing')
        setTimeout(() => {
          setPhase('done')
          onComplete()
        }, 800)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete, reducedMotion])

  const handleSkip = () => {
    if (skipped.current) return
    skipped.current = true
    setProgress(100)
    setPhase('revealing')
    setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 400)
  }

  if (reducedMotion || phase === 'done') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex items-center justify-center"
        onClick={handleSkip}
        onKeyDown={(e) => e.key === 'Enter' && handleSkip()}
        tabIndex={0}
        role="button"
        aria-label="Skip loading animation"
      >
        <div className="relative flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div 
              className="text-6xl md:text-8xl font-bold tracking-tighter"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VD
            </motion.div>
            
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, var(--color-accent), var(--color-accent-2), var(--color-accent))',
                opacity: 0.15,
                filter: 'blur(20px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          <div className="w-48 h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm text-[var(--color-muted)] font-mono"
          >
            {phase === 'loading' ? 'Initializing...' : 'Welcome'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="absolute bottom-[-60px] text-xs text-[var(--color-muted)]"
          >
            Click or press Enter to skip
          </motion.p>
        </div>

        {phase === 'revealing' && (
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute inset-0 bg-[var(--color-bg)]"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
