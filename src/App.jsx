import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Compare from './pages/Compare'
import History from './pages/History'
import Home from './pages/Home'
import Results from './pages/Results'
import styles from './App.module.css'

export default function App() {
  return (
    <BrowserRouter>
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
