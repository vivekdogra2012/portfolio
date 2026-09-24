import { useEffect } from 'react'
import { getLenis, useLenis } from './hooks/useLenis'
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

export default function App() {
  useLenis()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      const lenis = getLenis()
      if (!(target instanceof HTMLElement) || !lenis) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -8 })
      history.pushState(null, '', hash)
      window.dispatchEvent(new Event('anchor-scroll'))
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

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
