import desktopImg from '../assets/sunset.jpg'
import mobileImg from '../assets/hero-mobile-logo.jpg'
import mobileBrandLogo from '../assets/mobile-brand-logo.png'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>

      {/* â”€â”€ Desktop: full viewport image + booking bar at bottom â”€â”€ */}
      <img src={desktopImg} alt="Bafana Pyramids Hotel & Spa" className={s.bgDesktop} />
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>

      {/* â”€â”€ Mobile: portrait image with text + booking bar â”€â”€ */}
      <div className={s.mobileHero}>
        <img src={mobileImg} alt="Bafana Pyramids Hotel & Spa" className={s.mobileLogo} />
        {/* Text top-left over the image */}
        <p className={s.mobileText}>
          Your Gateway to<br />
          Egypt's Timeless<br />
          Wonders
        </p>
        {/* Booking bar at bottom */}
        <div className={s.mobileBooking}>
          {/* Logo + brand text above booking bar, right-aligned */}
          <div className={s.mobileBrand}>
            <img src={mobileBrandLogo} alt="Bafana Pyramids" className={s.mobileBrandLogo} />
            <div className={s.mobileBrandText}>
              <span className={s.mobileBrandName}>BAFANA PYRAMIDS</span>
              <span className={s.mobileBrandSub}>HOTEL & SPA</span>
            </div>
          </div>
          <BookingBar onBook={onBook} />
        </div>
      </div>

    </section>
  )
}


