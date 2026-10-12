import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './HeroSlider.module.css'

// Cover image (first slide)
import coverImg from '../assets/cover.jpg'

// Import all 39 slides
import slide01 from '../assets/slide-01.jpg'
import slide02 from '../assets/slide-02.jpg'
import slide03 from '../assets/slide-03.jpg'
import slide04 from '../assets/slide-04.jpg'
import slide05 from '../assets/slide-05.jpg'
import slide06 from '../assets/slide-06.jpg'
import slide07 from '../assets/slide-07.jpg'
import slide08 from '../assets/slide-08.jpg'
import slide09 from '../assets/slide-09.jpg'
import slide10 from '../assets/slide-10.jpg'
import slide11 from '../assets/slide-11.jpg'
import slide12 from '../assets/slide-12.jpg'
import slide13 from '../assets/slide-13.jpg'
import slide14 from '../assets/slide-14.jpg'
import slide15 from '../assets/slide-15.jpg'
import slide16 from '../assets/slide-16.jpg'
import slide17 from '../assets/slide-17.jpg'
import slide18 from '../assets/slide-18.jpg'
import slide19 from '../assets/slide-19.jpg'
import slide20 from '../assets/slide-20.jpg'
import slide21 from '../assets/slide-21.jpg'
import slide22 from '../assets/slide-22.jpg'
import slide23 from '../assets/slide-23.jpg'
import slide24 from '../assets/slide-24.jpg'
import slide25 from '../assets/slide-25.jpg'
import slide26 from '../assets/slide-26.jpg'
import slide27 from '../assets/slide-27.jpg'
import slide28 from '../assets/slide-28.jpg'
import slide29 from '../assets/slide-29.jpg'
import slide30 from '../assets/slide-30.jpg'
import slide31 from '../assets/slide-31.jpg'
import slide32 from '../assets/slide-32.jpg'
import slide33 from '../assets/slide-33.jpg'
import slide34 from '../assets/slide-34.jpg'
import slide35 from '../assets/slide-35.jpg'
import slide36 from '../assets/slide-36.jpg'
import slide37 from '../assets/slide-37.jpg'
import slide38 from '../assets/slide-38.jpg'
import slide39 from '../assets/slide-39.jpg'

const slides = [
  coverImg,
  slide01, slide02, slide03, slide04, slide05,
  slide06, slide07, slide08, slide09, slide10,
  slide11, slide12, slide13, slide14, slide15,
  slide16, slide17, slide18, slide19, slide20,
  slide21, slide22, slide23, slide24, slide25,
  slide26, slide27, slide28, slide29, slide30,
  slide31, slide32, slide33, slide34, slide35,
  slide36, slide37, slide38, slide39,
]

const INTERVAL = 4500

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState(null)
  const [dir, setDir]         = useState('next') // 'next' | 'prev'
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const go = useCallback((idx, direction = 'next') => {
    if (animating) return
    setDir(direction)
    setPrev(current)
    setCurrent(idx)
    setAnimating(true)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 700)
  }, [animating, current])

  const next = useCallback(() => go((current + 1) % slides.length, 'next'), [go, current])
  const goTo = useCallback((idx) => go(idx, idx > current ? 'next' : 'prev'), [go, current])

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(next, INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [next])

  const pause = () => clearInterval(timerRef.current)
  const resume = () => { timerRef.current = setInterval(next, INTERVAL) }

  return (
    <section
      className={s.slider}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slides */}
      {prev !== null && (
        <div className={[s.slide, s.slideExit, dir === 'next' ? s.exitLeft : s.exitRight].join(' ')}>
          <img src={slides[prev]} alt={`Slide ${prev + 1}`} className={s.img} />
          <div className={s.vignette} />
        </div>
      )}

      <div className={[s.slide, s.slideEnter, dir === 'next' ? s.enterRight : s.enterLeft, animating ? s.entering : s.entered].join(' ')}>
        <img src={slides[current]} alt={`Slide ${current + 1}`} className={s.img} />
        <div className={s.vignette} />
      </div>

      {/* Overlay content — bottom-left anchor */}
      <div className={s.overlay}>
        <div className={s.content}>
          <div className={s.topBadge}>
            <span className={s.badgeLine} />
            <span className={s.badgeText}>Est. 2026 · Cairo, Egypt</span>
            <span className={s.badgeLine} />
          </div>
          <p className={s.overline}>Premium Residential Collection</p>
          <h1 className={s.headline}>
            A Residence<br />
            <em>Beyond Compare</em>
          </h1>
          <p className={s.sub}>
            Where neoclassical grandeur meets the warmth of Egyptian heritage craftsmanship.
          </p>
          <div className={s.actions}>
            <Link to="/projects" className={s.primaryBtn}>Explore Residences</Link>
            <Link to="/contact" className={s.ghostBtn}>Private Consultation</Link>
          </div>
        </div>
      </div>

      {/* Arrow navigation */}
      <button
        className={[s.arrow, s.arrowLeft].join(' ')}
        onClick={() => go((current - 1 + slides.length) % slides.length, 'prev')}
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        className={[s.arrow, s.arrowRight].join(' ')}
        onClick={() => go((current + 1) % slides.length, 'next')}
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Progress bar */}
      <div className={s.progressBar}>
        <div className={s.progressFill} key={current} />
      </div>

      {/* Slide counter */}
      <div className={s.counter}>
        <span className={s.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={s.counterSep}>/</span>
        <span className={s.counterTotal}>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Dot indicators — show every 5th for compactness */}
      <div className={s.dots}>
        {slides.filter((_, i) => i % 5 === 0).map((_, i) => {
          const idx = i * 5
          return (
            <button
              key={idx}
              className={[s.dot, current >= idx && current < idx + 5 ? s.dotActive : ''].join(' ')}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide group ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Scroll cue */}
      <div className={s.scrollCue}>
        <span className={s.scrollLine} />
        <span className={s.scrollTxt}>Scroll</span>
      </div>

      {/* Bottom stats bar */}
      <div className={s.statsBar}>
        {[
          { n: '40+',    l: 'Years of Legacy' },
          { n: '215',    l: 'Exclusive Residences' },
          { n: '8,500+', l: 'Families Served' },
          { n: '12',     l: 'Prime Cities' },
        ].map((st, i) => (
          <div key={i} className={s.stat}>
            <span className={s.statN}>{st.n}</span>
            <span className={s.statL}>{st.l}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
