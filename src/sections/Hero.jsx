import desktopImg from '../assets/sunset.png'
import mobileImg from '../assets/hero-mobile.png'
import mobileLogo from '../assets/hero-mobile-logo.png'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>
      {/* Desktop image — full viewport */}
      <img src={desktopImg} alt="Bafana Pyramids Hotel & Spa" className={s.bgDesktop} />

      {/* Mobile — logo as background + booking bar overlaid on top */}
      <div className={s.mobileHero}>
        <img src={mobileLogo} alt="Bafana Pyramids Hotel & Spa" className={s.mobileLogo} />
        <div className={s.mobileBooking}>
          <BookingBar onBook={onBook} />
        </div>
      </div>

      {/* Desktop booking bar */}
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>
    </section>
  )
}
