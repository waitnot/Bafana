import { Link } from 'react-router-dom'
import slide05 from '../assets/reception-lobby-3.jpg'
import slide12 from '../assets/longue3.jpeg'
import s from './Editorial.module.css'

export default function Editorial() {
  return (
    <section className={s.section}>
      {/* ── Row 1: image left / text right ── */}
      <div className={s.row}>
        <div className={s.imgPane}>
          <img src={slide05} alt="The Meridian Cairo" className={s.img1} />
          <span className={s.imgLabel}>The Meridian · Cairo</span>
        </div>
        <div className={s.textPane}>
          <div className={s.orn}>
            <span className={s.ornLine} /><span className={s.ornDot} /><span className={s.ornLine} />
          </div>
          <p className={s.eyebrow}>The Bafana Philosophy</p>
          <h2 className={s.title}>
            Crafted for Those<br />
            <span className={s.script}>Who Demand More</span>
          </h2>
          <p className={s.body}>
            Every Bafana Pyramids residence is conceived as a work of art — where Italian-inspired
            neoclassical grandeur meets the warmth of Egyptn heritage craftsmanship. From hand-selected
            stone facades to bespoke interior millwork, nothing is left to chance.
          </p>
          <p className={s.body}>
            Our architects and designers collaborate with global artisans to deliver spaces that
            transcend the ordinary and become enduring masterpieces.
          </p>
          <Link to="/about" className={s.textLink}>
            Discover Our Story
            <span className={s.textLinkLine} />
          </Link>
        </div>
      </div>

      {/* ── Row 2: text left / image right ── */}
      <div className={[s.row, s.rowRev].join(' ')}>
        <div className={s.textPaneAlt}>
          <div className={s.orn}>
            <span className={s.ornLine} /><span className={s.ornDot} /><span className={s.ornLine} />
          </div>
          <p className={s.eyebrow}>Prime Addresses</p>
          <h2 className={s.titleLight}>
            Where You Live<br />
            <span className={s.script}>Defines Who You Are</span>
          </h2>
          <p className={s.body}>
            Situated in Egypt's most coveted micro-markets, each Bafana Pyramids address commands
            unmatched prestige, connectivity, and long-term value appreciation.
          </p>
          <Link to="/projects" className={s.textLink}>
            View All Residences
            <span className={s.textLinkLine} />
          </Link>
        </div>
        <div className={s.imgPane}>
          <img src={slide12} alt="Heritage Court Giza" className={s.img2} />
          <span className={s.imgLabel}>Heritage Court · Giza</span>
        </div>
      </div>
    </section>
  )
}
