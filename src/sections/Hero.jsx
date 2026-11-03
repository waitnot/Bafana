import coverImg from '../assets/sunset.png'
import BookingBar from '../components/BookingBar'
import s from './Hero.module.css'

export default function Hero({ onBook }) {
  return (
    <section className={s.hero}>
      {/* Full image — text and logo are part of the image itself */}
      <img src={coverImg} alt="Bafana Pyramids Hotel & Spa — Your Gateway to Egypt's Timeless Wonders" className={s.bg} />

      {/* Booking bar at bottom */}
      <div className={s.bookingBar}>
        <BookingBar onBook={onBook} />
      </div>
    </section>
  )
}
