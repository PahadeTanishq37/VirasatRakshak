import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'

import { RegionalStatesPage } from './pages/RegionalStatesPage'
import { StoryPage } from './pages/StoryPage'
import { GamesPage } from './pages/GamesPage'
import { ARPage } from './pages/ARPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { PackagesPage } from './pages/PackagesPage'
import { PackageDestinationPage } from './pages/PackageDestinationPage'
import { CommunityPage } from './pages/CommunityPage'
import { ArtifactsPage } from './pages/ArtifactsPage'

import { OfflineTourPage } from './pages/OfflineTourPage'

function PageTransitions() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches

  const initial = prefersReducedMotion || isMobile ? { opacity: 0 } : { opacity: 0, x: 20 }
  const animate = { opacity: 1, x: 0 }
  const exit = prefersReducedMotion || isMobile ? { opacity: 0 } : { opacity: 0, x: -10 }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ height: '100%' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />

          <Route path="/region/:region" element={<RegionalStatesPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/ar" element={<ARPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path="/artifacts/:artifactId" element={<ArtifactsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:destination" element={<PackageDestinationPage />} />
          <Route path="/offline" element={<OfflineTourPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageTransitions />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
