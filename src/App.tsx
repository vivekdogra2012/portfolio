import { useState, useCallback } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { Work } from './components/Work'
import { Architecture } from './components/Architecture'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Preloader } from './components/Preloader'
import { CustomCursor } from './components/CustomCursor'
import { GrainOverlay } from './components/GrainOverlay'
import { ScrollProgress } from './components/ScrollProgress'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  
  useLenis()
  
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      
      <div 
        className={`min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <CustomCursor />
        <GrainOverlay />
        <ScrollProgress />
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
    </>
  )
}
