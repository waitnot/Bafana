'use client'

import desktopImg from '../assets/sunset.png'
import mobileImg from '../assets/hero-mobile.png'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>
      {/* Desktop image */}
      <img src={desktopImg} alt="Bafana Pyramids Hotel & Spa" className={s.bgDesktop} />
      {/* Mobile image */}
      <img src={mobileImg} alt="Bafana Pyramids Hotel & Spa" className={s.bgMobile} />

      {/* Booking bar at bottom */}
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>
    </section>
  )
}




