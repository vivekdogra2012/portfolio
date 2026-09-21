import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

function useHasFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHasFinePointer(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setHasFinePointer(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return hasFinePointer
}

export function CustomCursor() {
  const reducedMotion = useReducedMotion()
  const hasFinePointer = useHasFinePointer()
  const [isHovering, setIsHovering] = useState(false)
  const [isMagnetic, setIsMagnetic] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorActive, setCursorActive] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (reducedMotion || !hasFinePointer) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
      setCursorActive(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      if (cursorActive) {
        setIsVisible(true)
      }
    }

    const checkHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
      const isMagneticEl = target.closest('[data-magnetic]')
      
      setIsHovering(!!isClickable)
      setIsMagnetic(!!isMagneticEl)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', checkHoverState)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', checkHoverState)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY, reducedMotion, hasFinePointer, cursorActive])

  if (reducedMotion || !hasFinePointer) return null

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isHovering ? 2.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div 
            className="w-3 h-3 rounded-full bg-[var(--color-accent)] ring-2 ring-white/80"
            style={{
              boxShadow: isHovering 
                ? '0 0 20px var(--color-accent), 0 0 40px rgba(255,255,255,0.3)' 
                : '0 0 10px rgba(0,0,0,0.5)',
            }}
          />
          
          {isMagnetic && (
            <motion.div
              className="absolute inset-0 -m-2 rounded-full border-2 border-[var(--color-accent)]/50"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 2, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </motion.div>

      {cursorActive && (
        <style>{`
          @media (hover: hover) and (pointer: fine) {
            * {
              cursor: none !important;
            }
          }
        `}</style>
      )}
    </>
  )
}
