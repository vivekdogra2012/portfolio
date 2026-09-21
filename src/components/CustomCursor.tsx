import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CustomCursor() {
  const reducedMotion = useReducedMotion()
  const [isHovering, setIsHovering] = useState(false)
  const [isMagnetic, setIsMagnetic] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (reducedMotion) return
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
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
  }, [cursorX, cursorY, reducedMotion])

  if (reducedMotion) return null

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
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
            className="w-3 h-3 rounded-full bg-white"
            style={{
              boxShadow: isHovering ? '0 0 20px rgba(255,255,255,0.5)' : 'none',
            }}
          />
          
          {isMagnetic && (
            <motion.div
              className="absolute inset-0 -m-2 rounded-full border border-white/30"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 2, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </motion.div>

      <style>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  )
}
