import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  strength?: number
  as?: 'a' | 'button'
  target?: string
  rel?: string
}

export function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.3,
  as = 'button',
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent) => {
    if (reducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const Component = as === 'a' ? motion.a : motion.button
  const linkProps = as === 'a' ? { href, target, rel } : {}

  return (
    <motion.div
      ref={ref}
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: reducedMotion ? 0 : xSpring,
        y: reducedMotion ? 0 : ySpring,
      }}
      className="inline-block"
    >
      <Component
        {...linkProps}
        onClick={onClick}
        className={`relative overflow-hidden group ${className}`}
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
        
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(91, 140, 255, 0.15) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
        
        <motion.span
          className="absolute inset-0 pointer-events-none rounded-[inherit] border border-[var(--color-accent)]/0 group-hover:border-[var(--color-accent)]/30"
          style={{
            boxShadow: isHovered 
              ? '0 0 20px rgba(91, 140, 255, 0.2), inset 0 0 20px rgba(91, 140, 255, 0.05)' 
              : 'none',
            transition: 'all 0.3s',
          }}
        />
      </Component>
    </motion.div>
  )
}
