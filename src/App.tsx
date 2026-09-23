import { About } from './components/About'
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
  return (
    <>
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
