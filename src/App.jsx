import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'
import Amenities from './pages/Amenities'
import Admin from './pages/Admin'
import AdminCMS from './pages/AdminCMS'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppShell() {
  const loc = useLocation()
  const isAdmin = loc.pathname === '/admin'

  const BOOKING_URL = 'https://letsbook.me/booking/bafanapyramidshotel'
  const openBooking = () => {
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer')
  }

  if (isAdmin) return <Admin />

  return (
    <>
      <ScrollToTop />
      <Navbar onBook={openBooking} />
      <main>
        <Routes>
          <Route path="/"          element={<Home     onBook={openBooking} />} />
          <Route path="/projects"  element={<Projects onBook={openBooking} />} />
          <Route path="/about"     element={<About />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/amenities" element={<Amenities />} />
        </Routes>
      </main>
      <Footer onBook={openBooking} />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/cms"   element={<AdminCMS />} />
        <Route path="/*"     element={<AppShell />} />
      </Routes>
    </Router>
  )
}
