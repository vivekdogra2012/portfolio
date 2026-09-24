import { useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { easeCurtain, easeOut, shouldPlayIntro } from '../motion'

export function Intro() {
  const [show, setShow] = useState(shouldPlayIntro)

  useLayoutEffect(() => {
    document.documentElement.classList.remove('booting')
  }, [])

  useLayoutEffect(() => {
    if (!show) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [show])

  if (!show) return null

  const finish = () => {
    try {
      sessionStorage.setItem('vd-intro', '1')
    } catch {
      /* private mode */
    }
    setShow(false)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end bg-[var(--color-bg)]"
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1.05, delay: 0.72, ease: easeCurtain }}
      onAnimationComplete={finish}
      onClick={finish}
      role="presentation"
    >
      <motion.p
        className="eyebrow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        Vivek Dogra
      </motion.p>
      <motion.span
        className="block h-px w-full origin-left bg-[var(--color-accent)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: easeOut }}
      />
    </motion.div>
  )
}
