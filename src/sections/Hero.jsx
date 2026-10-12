import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import coverImg from '../assets/cover.jpg'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>
      {/* Background image */}
      <img src={coverImg} alt="Bafana Pyramids Hotels" className={s.bg} />
      <div className={s.vignette} />

      {/* Top badge */}
      <div className={s.topBadge}>
        <span className={s.badgeLine} />
        <span className={s.badgeText}>Est. 2026 · Egypt</span>
        <span className={s.badgeLine} />
      </div>

      {/* Spacer — pushes content down */}
      <div className={s.spacer} />

      {/* Content */}
      <div className={s.content}>
        <h1 className={s.headline}>
          A Residence<br />
          <em className={s.scriptLine}>Beyond Compare</em>
        </h1>
        <p className={s.sub}>
          Where neoclassical grandeur meets the warmth of Egyptian heritage craftsmanship.
        </p>
        <div className={s.actions}>
          <Link to="/projects" className={s.primaryBtn}>
            Explore Residences <ArrowRight size={14} />
          </Link>
          <button className={s.ghostBtn} onClick={onBook}>Book a Consultation</button>
        </div>
      </div>

      {/* Scroll cue — desktop only */}
      <div className={s.scrollCue}>
        <span className={s.scrollLine} />
        <span className={s.scrollTxt}>Scroll</span>
      </div>

      {/* Booking bar — always inside hero, positioned at bottom */}
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>
    </section>
  )
}
