import desktopImg from '../assets/sunset.png'
import mobileImg from '../assets/hero-mobile-logo.png'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>

      {/* ── Desktop: full viewport image + booking bar at bottom ── */}
      <img src={desktopImg} alt="Bafana Pyramids Hotel & Spa" className={s.bgDesktop} />
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>

      {/* ── Mobile: portrait image with booking bar overlaid at bottom ── */}
      <div className={s.mobileHero}>
        <img src={mobileImg} alt="Bafana Pyramids Hotel & Spa" className={s.mobileLogo} />
        {/* Booking bar sits ON TOP of the image at the bottom */}
        <div className={s.mobileBooking}>
          <BookingBar onBook={onBook} />
        </div>
      </div>

    </section>
  )
}
