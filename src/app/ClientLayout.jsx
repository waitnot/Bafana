'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const BOOKING_URL = 'https://letsbook.me/booking/bafanapyramidshotel'

function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function ClientLayout({ children }) {
  const openBooking = () => {
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <ScrollToTop />
      <Navbar onBook={openBooking} />
      <main>{children}</main>
      <Footer onBook={openBooking} />
    </>
  )
}




