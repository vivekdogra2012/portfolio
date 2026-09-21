import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface MarqueeProps {
  items: string[]
  speed?: number
  className?: string
  separator?: string
}

export function Marquee({ items, speed = 30, className = '', separator = '·' }: MarqueeProps) {
  const reducedMotion = useReducedMotion()
  
  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-8 mx-8">
      <span className="whitespace-nowrap">{item}</span>
      <span className="text-[var(--color-accent)] opacity-50">{separator}</span>
    </span>
  ))

  if (reducedMotion) {
    return (
      <div className={`flex flex-wrap justify-center gap-4 py-4 ${className}`}>
        {items.map((item, i) => (
          <span key={i} className="text-[var(--color-muted)]">
            {item}
            {i < items.length - 1 && <span className="ml-4 text-[var(--color-accent)]/50">{separator}</span>}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden py-4 ${className}`}>
      <motion.div
        className="flex"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  )
}
