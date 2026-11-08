import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BedDouble, Maximize2, Star, Award, X, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './Collection.module.css'

// â”€â”€ Static fallback images (used when a room has no CMS images uploaded) â”€â”€â”€â”€
import sqImg1  from '../assets/rooms/standard-queen/bedroom-1.jpeg'
import sqImg2  from '../assets/rooms/standard-queen/bedroom-2.jpeg'
import sqImg3  from '../assets/rooms/standard-queen/bedroom-3.jpeg'
import dkImg1  from '../assets/rooms/deluxe-king/deluxe-king-1.jpg'
import dkImg2  from '../assets/rooms/deluxe-king/deluxe-king-2.jpg'
import dkImg3  from '../assets/rooms/deluxe-king/deluxe-king-3.jpg'
import dtImg1  from '../assets/rooms/deluxe-twin/deluxe-twin-1.jpg'
import dtImg2  from '../assets/rooms/deluxe-twin/deluxe-twin-2.jpg'
import dtImg3  from '../assets/rooms/deluxe-twin/deluxe-twin-3.jpg'
import stImg1  from '../assets/rooms/standard-triple/triple-1.jpg'
import stImg2  from '../assets/rooms/standard-triple/triple-2.jpg'
import stImg3  from '../assets/rooms/standard-triple/triple-3.jpg'
import efImg1  from '../assets/rooms/executive-family-suite/exec-family-1.jpg'
import reImg1  from '../assets/rooms/regal-executive-suite/regal-1.jpg'
import reImg2  from '../assets/rooms/regal-executive-suite/regal-2.jpg'

// Static fallback image sets indexed by sort_order (1â€“7)
const STATIC_IMAGES = {
  1: [sqImg1, sqImg2, sqImg3],
  2: [dkImg1, dkImg2, dkImg3],
  3: [dtImg1, dtImg2, dtImg3],
  4: [stImg1, stImg2, stImg3],
  5: [efImg1, '/rooms/executive-family-suite/exec-family-2.jpg?v=2026', '/rooms/executive-family-suite/exec-family-3.jpg?v=2026'],
  6: [reImg1, reImg2, '/rooms/regal-executive-suite/regal-3.jpg?v=2026', '/rooms/regal-executive-suite/regal-4.jpg?v=2026', '/rooms/regal-executive-suite/regal-5.jpg?v=2026', '/rooms/regal-executive-suite/regal-6.jpg?v=2026', '/rooms/regal-executive-suite/regal-7.jpg?v=2026'],
  7: Array.from({length:11}, (_,i) => `/rooms/premium-pyramid-suite/pyramid-${i+1}.jpg?v=2026`),
}

// Build residences from DB room + static fallback
function buildResidence(r, idx) {
  const dbImages = (r.images || []).map(i => i.url)
  const fallbackIdx = r.sort_order >= 1 && r.sort_order <= 7 ? r.sort_order : (idx + 1)
  const images = dbImages.length > 0 ? dbImages : (STATIC_IMAGES[fallbackIdx] || [sqImg1])
  return {
    id:         r.id,
    num:        String(idx + 1).padStart(2, '0'),
    name:       r.name,
    roomId:     `room-${r.id}`,
    type:       r.type        || '',
    img:        images[0]     || sqImg1,
    images,
    beds:       r.beds        || '',
    area:       r.area        || '',
    desc:       r.description || '',
    longDesc:   r.long_description || r.description || '',
    highlights: [],
    perfectFor: r.perfect_for || '',
    filter:     'All',
  }
}

const FILTERS = ['All']

/* â”€â”€ scroll-reveal hook â”€â”€ */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* â”€â”€ Property Detail Modal â”€â”€ */
function PropertyModal({ residence, onClose, onBook }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const r = residence
  return (
    <div className={s.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label={r.name}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className={s.modalClose} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Image strip */}
        <div className={s.modalImg}>
          <img src={r.img} alt={r.name} className={s.modalImgEl} />
          <div className={s.modalImgOverlay} />
        </div>

        {/* Content */}
        <div className={s.modalBody}>

          {/* Top row: desc left, actions right */}
          <div className={s.modalTopRow}>
            <div className={s.modalLeft}>
              <p className={s.modalType}>{r.type}</p>
              <h2 className={s.modalName}>{r.name}</h2>
              <p className={s.modalNum}>No. {r.num}</p>
              <div className={s.modalRule} />
              <p className={s.modalDesc}>{r.longDesc}</p>
            </div>
              <div className={s.modalRight}>
                <div className={s.modalPriceCard}>
                  <div className={s.modalPriceActions}>
                    <button
                      className={s.modalBtnPrimary}
                      onClick={() => { onClose(); onBook(r.roomId) }}
                    >
                      Book Now <ArrowRight size={14} />
                    </button>
                    <a href="https://wa.me/201034962229" target="_blank" rel="noopener noreferrer" className={s.modalBtnSecondary}>
                      <Phone size={13} /> WhatsApp Us
                    </a>
                  </div>
                  <div className={s.modalContact}>
                    <Mail size={11} />
                    <span>info@bafanapyramidshotel.com</span>
                  </div>
                </div>
              </div>
          </div>

          {/* Specs row */}
          <div className={s.modalSpecs}>
            <div className={s.modalSpec}>
              <BedDouble size={16} className={s.modalSpecIcon} />
              <div>
                <p className={s.modalSpecLabel}>Bedrooms</p>
                <p className={s.modalSpecVal}>{r.beds} Beds</p>
              </div>
            </div>
            <div className={s.modalSpec}>
              <Maximize2 size={16} className={s.modalSpecIcon} />
              <div>
                <p className={s.modalSpecLabel}>Room Type</p>
                <p className={s.modalSpecVal}>{r.area}</p>
              </div>
            </div>
            <div className={s.modalSpec}>
              <Star size={16} className={s.modalSpecIcon} />
              <div>
                <p className={s.modalSpecLabel}>Grade</p>
                <p className={s.modalSpecVal}>5-Star</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* â”€â”€ Card Image Slider â”€â”€ */
function CardSlider({ images, name }) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(null) // 'left' | 'right'
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)
  const animatingRef = useRef(false)
  const idxRef = useRef(0)

  // Keep refs in sync so the interval always has fresh values
  useEffect(() => { idxRef.current = idx }, [idx])
  useEffect(() => { animatingRef.current = animating }, [animating])

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!images || images.length <= 1) return
    const tick = () => {
      if (paused || animatingRef.current) return
      const next = (idxRef.current + 1) % images.length
      setDir('left')
      setAnimating(true)
      animatingRef.current = true
      setTimeout(() => {
        setIdx(next)
        idxRef.current = next
        setAnimating(false)
        animatingRef.current = false
        setDir(null)
      }, 380)
    }
    const id = setInterval(tick, 3000)
    return () => clearInterval(id)
  }, [images, paused])

  const go = (newIdx, direction, e) => {
    e.stopPropagation()
    if (animating || newIdx === idx) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setIdx(newIdx)
      setAnimating(false)
      setDir(null)
    }, 380)
  }

  const prev = (e) => go((idx - 1 + images.length) % images.length, 'right', e)
  const next = (e) => go((idx + 1) % images.length, 'left', e)
  const goTo = (i, e) => go(i, i > idx ? 'left' : 'right', e)

  if (!images || images.length <= 1) {
    return (
      <div className={s.imgWrap}>
        <img src={images?.[0]} alt={name} className={s.img} loading="lazy" />
        <div className={s.imgOverlay} />
      </div>
    )
  }

  return (
    <div className={s.imgWrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className={s.sliderTrack}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${name} â€” ${i + 1}`}
            className={[
              s.slide,
              i === idx ? s.slideCurrent : '',
              animating && i === idx
                ? (dir === 'left' ? s.slideExitLeft : s.slideExitRight)
                : '',
              animating && i === (dir === 'left'
                ? (idx + 1) % images.length
                : (idx - 1 + images.length) % images.length)
                ? (dir === 'left' ? s.slideEnterLeft : s.slideEnterRight)
                : '',
            ].join(' ')}
            loading="lazy"
          />
        ))}
      </div>
      <div className={s.imgOverlay} />

      {/* Arrows */}
      <button
        className={[s.sliderArrow, s.sliderArrowL].join(' ')}
        onClick={prev}
        aria-label="Previous image"
      >&#8249;</button>
      <button
        className={[s.sliderArrow, s.sliderArrowR].join(' ')}
        onClick={next}
        aria-label="Next image"
      >&#8250;</button>

      {/* Dots */}
      <div className={s.sliderDots}>
        {images.map((_, i) => (
          <button
            key={i}
            className={[s.sliderDot, i === idx ? s.sliderDotOn : ''].join(' ')}
            onClick={(e) => goTo(i, e)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <span className={s.sliderCounter}>{idx + 1} / {images.length}</span>
    </div>
  )
}

export default function Collection({ onBook }) {
  const [filter, setFilter]       = useState('All')
  const [selected, setSelected]   = useState(null)
  const [headRef, headVisible]    = useReveal()
  const [gridRef, gridVisible]    = useReveal()
  const [residences, setResidences] = useState([])
  const [dbLoaded, setDbLoaded]   = useState(false)

  // Fetch rooms from CMS DB on mount — timestamp bypasses CDN cache
  useEffect(() => {
    fetch(`/admin-api/rooms?_=${Date.now()}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setResidences(data.map((r, i) => buildResidence(r, i)))
        }
        setDbLoaded(true)
      })
      .catch(() => setDbLoaded(true))
  }, [])

  const shown = residences.filter(r => filter === 'All' || r.filter === filter)

  return (
    <section id="collection" className={s.section}>

      {/* â”€â”€ Section Header â”€â”€ */}
      <div ref={headRef} className={[s.head, headVisible ? s.headIn : ''].join(' ')}>
        <div className={s.orn}>
          <span className={s.oLine} /><span className={s.oDot} /><span className={s.oLine} />
        </div>
        <p className={s.eyebrow}>The Collection</p>
        <h2 className={s.title}>Signature <span className={s.script}>Residences</span></h2>
        <p className={s.sub}>Each property â€” a statement of rarity, limited in number, infinite in elegance.</p>

        {/* Filter Tabs â€” hidden when only one category */}
        {FILTERS.length > 1 && (
          <div className={s.filters} role="tablist" aria-label="Filter residences">
            {FILTERS.map(f => (
              <button
                key={f} role="tab" aria-selected={filter === f}
                className={[s.filterBtn, filter === f ? s.filterActive : ''].join(' ')}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€ Feature Ribbon â”€â”€ */}
      <div className={s.ribbon}>
        <div className={s.ribbonInner}>
          {[...Array(2)].flatMap(() =>
            ['Private Concierge', 'Five-Star Amenities', 'Egyptian Craftsmanship', 'Limited Inventory', 'Curated Addresses', 'Lifetime Membership'].map((item, i) => (
              <span key={item + i} className={s.ribbonItem}>
                <Award size={11} className={s.ribbonIcon} />{item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* â”€â”€ Grid â”€â”€ */}
      <div
        ref={gridRef}
        className={[s.grid, gridVisible ? s.gridIn : ''].join(' ')}
      >
        {!dbLoaded ? (
          // Skeleton placeholders while fetching from DB
          Array.from({length: 7}).map((_, i) => (
            <div key={i} className={s.card} style={{ '--i': i, opacity: 0.5 }}>
              <div className={s.imgWrap} style={{ background: '#F3F4F6' }} />
              <div className={s.body}>
                <div style={{ height: 12, background: '#E5E7EB', borderRadius: 4, marginBottom: 8, width: '60%' }} />
                <div style={{ height: 20, background: '#E5E7EB', borderRadius: 4, marginBottom: 12, width: '80%' }} />
              </div>
            </div>
          ))
        ) : shown.map((r, i) => (
          <div
            key={r.id || r.num}
            className={s.card}
            style={{ '--i': i }}
            onClick={() => setSelected(r)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${r.name}`}
            onKeyDown={e => e.key === 'Enter' && setSelected(r)}
          >
            {/* Image Slider */}
            <CardSlider images={r.images} name={r.name} />

            {/* Body */}
            <div className={s.body}>
              <p className={s.type}>{r.type}</p>
              <h3 className={s.name}>{r.name}</h3>

              {/* Specs */}
              <div className={s.specs}>
                <div className={s.spec}>
                  <BedDouble size={13} className={s.specIcon} />
                  <span>{r.beds}</span>
                </div>
                <div className={s.specDivider} />
                <div className={s.spec}>
                  <Maximize2 size={13} className={s.specIcon} />
                  <span>{r.area}</span>
                </div>
              </div>

              {/* Footer */}
              <div className={s.footer}>
                <div className={s.cardActions}>
                  <button
                    className={s.bookNowBtn}
                    onClick={e => { e.stopPropagation(); onBook && onBook(r.roomId) }}
                    aria-label={`Book ${r.name}`}
                  >
                    Book Now
                  </button>
                  <button className={s.detailBtn}>
                    Details <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={s.cta}>
        <Link to="/contact" className={s.ctaBtn}>
          Book Your Stay <ArrowRight size={14} />
        </Link>
        <p className={s.ctaSub}>All room types Â· Special packages Â· Private enquiries</p>
      </div>

      {/* Modal */}
      {selected && (
        <PropertyModal residence={selected} onClose={() => setSelected(null)} onBook={onBook} />
      )}
    </section>
  )
}

