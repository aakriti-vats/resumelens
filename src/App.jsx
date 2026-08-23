import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Compare from './pages/Compare'
import History from './pages/History'
import Home from './pages/Home'
import Results from './pages/Results'
import SignIn from './pages/SignIn'
import NotFound from './pages/NotFound'
import FetchDemo from './pages/FetchDemo'
import ProfileLayout from './pages/ProfileLayout'
import Profile from './pages/Profile'
import ProfileMe from './pages/ProfileMe'
import ProtectedRoute from './components/ProtectedRoute'
import styles from './App.module.css'

const PAGE_TITLES = {
  '/': 'ResumeLens — Analyze Resume',
  '/results': 'ResumeLens — Analysis Results',
  '/compare': 'ResumeLens — Compare Versions',
  '/history': 'ResumeLens — Analysis History',
  '/profile': 'ResumeLens — Profile',
  '/profile/me': 'ResumeLens — My Profile',
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
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <Compare />
              </ProtectedRoute>
            }
          />
          <Route path="/history" element={<History />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/fetch-demo" element={<FetchDemo />} />

          <Route path="/profile" element={<ProfileMe />} />
          <Route path="/profile/me" element={<ProfileMe />} />
          <Route path="/profile/:id" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
