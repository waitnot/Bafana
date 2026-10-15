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
          Bafana Pyramids<br />
          <em className={s.scriptLine}>Hotel & Spa</em>
        </h1>
        <p className={s.sub}>
          Your Gateway to Egypt's Timeless Wonders — Giza, Cairo.
        </p>
        <div className={s.actions}>
          <a href="#collection" className={s.primaryBtn}>
            Explore Rooms <ArrowRight size={14} />
          </a>
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
