import { useRef, useEffect, type ReactNode } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
}

export function TextReveal({ children, className = '', delay = 0, as = 'div' }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const controls = useAnimation()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  if (reducedMotion) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  const Component = motion[as]

  return (
    <div ref={ref} className="overflow-hidden">
      <Component
        className={className}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { y: '100%', opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        {children}
      </Component>
    </div>
  )
}

interface SplitTextRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

export function SplitTextReveal({ text, className = '', delay = 0, stagger = 0.02 }: SplitTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const reducedMotion = useReducedMotion()

  const words = text.split(' ')

  if (reducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
