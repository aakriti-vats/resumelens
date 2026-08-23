import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Compare from './pages/Compare'
import History from './pages/History'
import Home from './pages/Home'
import Results from './pages/Results'
import styles from './App.module.css'

const PAGE_TITLES = {
  '/': 'ResumeLens — Analyze Resume',
  '/results': 'ResumeLens — Analysis Results',
  '/compare': 'ResumeLens — Compare Versions',
  '/history': 'ResumeLens — Analysis History',
}

function DocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'ResumeLens — ATS Resume Analyzer'
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <DocumentTitle />
      <div className={styles.shell}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
