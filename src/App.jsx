import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'
import Amenities from './pages/Amenities'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppShell() {
  const [bookingOpen, setBookingOpen]   = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingData, setBookingData]   = useState({})
  const loc = useLocation()
  const isAdmin = loc.pathname === '/admin'

  const openBooking = (roomIdOrData = null) => {
    if (roomIdOrData && typeof roomIdOrData === 'object') {
      // From BookingBar: { checkIn, checkOut, guests }
      setBookingData(roomIdOrData)
      setSelectedRoom(null)
    } else {
      // From room card: roomId string or null
      setBookingData({})
      setSelectedRoom(roomIdOrData)
    }
    setBookingOpen(true)
  }
  const closeBooking = () => {
    setBookingOpen(false)
    setSelectedRoom(null)
    setBookingData({})
  }

  if (isAdmin) return <Admin />

  return (
    <>
      <ScrollToTop />
      <Navbar onBook={() => openBooking()} />
      <main>
        <Routes>
          <Route path="/"          element={<Home     onBook={openBooking} />} />
          <Route path="/projects"  element={<Projects onBook={openBooking} />} />
          <Route path="/about"     element={<About />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/amenities" element={<Amenities />} />
        </Routes>
      </main>
      <Footer onBook={() => openBooking()} />
      {bookingOpen && (
        <BookingModal
          onClose={closeBooking}
          initialRoom={selectedRoom}
          initialCheckIn={bookingData.checkIn || ''}
          initialCheckOut={bookingData.checkOut || ''}
          initialGuests={bookingData.guests || ''}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*"     element={<AppShell />} />
      </Routes>
    </Router>
  )
}
