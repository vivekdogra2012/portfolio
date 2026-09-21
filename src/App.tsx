import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { Work } from './components/Work'
import { Architecture } from './components/Architecture'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Work />
        <Architecture />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
