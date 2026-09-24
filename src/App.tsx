import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { About } from './components/About'
import { Intro } from './components/Intro'
import { Contact } from './components/Contact'
import { CustomCursor } from './components/CustomCursor'
import { Experience } from './components/Experience'
import { Expertise } from './components/Expertise'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { SiteBackground } from './components/SiteBackground'
import { Stack } from './components/Stack'
import { Thinking } from './components/Thinking'
import { Work } from './components/Work'

const lenisOptions = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  touchMultiplier: 1.4,
}

export default function App() {
  return (
    <ReactLenis root options={lenisOptions}>
      <Shell />
    </ReactLenis>
  )
}

function Shell() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      if (!(target instanceof HTMLElement)) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -8 })
      history.pushState(null, '', hash)
      window.dispatchEvent(new Event('anchor-scroll'))
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return (
    <>
      <Intro />
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <SiteBackground />
      <div className="relative z-10">
        <CustomCursor />
        <Nav />
        <main>
          <Hero />
          <About />
          <Work />
          <Experience />
          <Expertise />
          <Stack />
          <Thinking />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
