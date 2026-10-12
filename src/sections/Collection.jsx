import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BedDouble, Maximize2, Star, Award, X, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './Collection.module.css'

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

// Executive Family Suite extra images — HEIC converted to JPEG in public/
const execFamilyImgs = [
  efImg1,
  '/rooms/executive-family-suite/exec-family-2.jpg',
  '/rooms/executive-family-suite/exec-family-3.jpg',
]

// Regal Executive Suite — 2 JPGs importable, rest served as public/ static URLs
import reImg1  from '../assets/rooms/regal-executive-suite/regal-1.jpg'
import reImg2  from '../assets/rooms/regal-executive-suite/regal-2.jpg'

// Regal HEICs converted to JPEG and served from public/
const regalHEIC = [
  '/rooms/regal-executive-suite/regal-3.jpg',
  '/rooms/regal-executive-suite/regal-4.jpg',
  '/rooms/regal-executive-suite/regal-5.jpg',
  '/rooms/regal-executive-suite/regal-6.jpg',
  '/rooms/regal-executive-suite/regal-7.jpg',
]
// Premium Pyramid Suite — all converted to JPEG in public/
const pyramidImgs = [
  '/rooms/premium-pyramid-suite/pyramid-1.jpg',
  '/rooms/premium-pyramid-suite/pyramid-2.jpg',
  '/rooms/premium-pyramid-suite/pyramid-3.jpg',
  '/rooms/premium-pyramid-suite/pyramid-4.jpg',
  '/rooms/premium-pyramid-suite/pyramid-5.jpg',
  '/rooms/premium-pyramid-suite/pyramid-6.jpg',
  '/rooms/premium-pyramid-suite/pyramid-7.jpg',
  '/rooms/premium-pyramid-suite/pyramid-8.jpg',
  '/rooms/premium-pyramid-suite/pyramid-9.jpg',
  '/rooms/premium-pyramid-suite/pyramid-10.jpg',
  '/rooms/premium-pyramid-suite/pyramid-11.jpg',
]

const residences = [
  {
    num: '01', name: 'Standard Queen', roomId: 'sq',
    type: 'Queen Bed · Classic Comfort',
    img: sqImg1, images: [sqImg1, sqImg2, sqImg3],
    beds: '1 Queen', area: 'Standard Room',
    desc: 'A well-appointed queen room with elegant interiors, modern furnishings, complimentary Wi-Fi, and a peaceful atmosphere for restful stays.',
    longDesc: 'A well-appointed queen room crafted for comfort and style. Features a plush queen bed, elegant interiors, modern furnishings, complimentary Wi-Fi, air conditioning, and a serene atmosphere ideal for solo travellers and couples.',
    highlights: ['Queen Bed', 'Free Wi-Fi', 'Air Conditioning', 'Attached Bathroom', 'Smart TV', 'Room Service'],
    perfectFor: 'Solo travellers & couples',
    filter: 'Ready to Move',
  },
  {
    num: '02', name: 'Deluxe King Room', roomId: 'dk',
    type: 'King Bed · Premium Furnishings',
    img: dkImg1, images: [dkImg1, dkImg2, dkImg3],
    beds: '1 King', area: 'Deluxe Room',
    desc: 'Extra comfort and generous space in our beautifully designed Deluxe King Room, featuring a plush king bed and a warm relaxing ambiance.',
    longDesc: 'Extra comfort and generous space in our beautifully designed Deluxe King Room. A plush king bed, premium furnishings, complimentary breakfast, smart TV, and a luxurious attached bathroom combine for an elevated stay.',
    highlights: ['King Bed', 'Free Wi-Fi', 'Air Conditioning', 'Attached Bathroom', 'Smart TV', 'Complimentary Breakfast'],
    perfectFor: 'Couples & business travellers',
    filter: 'Ready to Move',
  },
  {
    num: '03', name: 'Deluxe Twin Room', roomId: 'dt',
    type: 'Twin Beds · Premium Furnishings',
    img: dtImg1, images: [dtImg1, dtImg2, dtImg3],
    beds: '2 Twin', area: 'Deluxe Room',
    desc: 'Two plush twin beds in a beautifully appointed room — perfect for friends or colleagues seeking premium comfort and a relaxing stay.',
    longDesc: 'Two plush twin beds in a beautifully appointed deluxe room. Premium furnishings, smart TV, complimentary breakfast, and a refined atmosphere make this the ideal choice for friends or business colleagues.',
    highlights: ['Twin Beds', 'Free Wi-Fi', 'Air Conditioning', 'Attached Bathroom', 'Smart TV', 'Complimentary Breakfast'],
    perfectFor: 'Friends & colleagues',
    filter: 'Ready to Move',
  },
  {
    num: '04', name: 'Standard Triple Room', roomId: 'str',
    type: 'Triple Occupancy · Spacious Layout',
    img: stImg1, images: [stImg1, stImg2, stImg3],
    beds: '3 Single', area: 'Triple Room',
    desc: 'A spacious and thoughtfully arranged triple room accommodating three guests, blending comfort, practicality, and refined hotel style.',
    longDesc: 'A spacious and thoughtfully arranged triple room accommodating three guests in comfort. Three well-appointed beds, refined interiors, smart TV, complimentary Wi-Fi, and attentive room service ensure a seamless stay.',
    highlights: ['3 Single Beds', 'Free Wi-Fi', 'Air Conditioning', 'Attached Bathroom', 'Smart TV', 'Room Service'],
    perfectFor: 'Families & small groups',
    filter: 'Ready to Move',
  },
  {
    num: '05', name: 'Executive Family Suite', roomId: 'efs',
    type: 'Family Suite · Expansive Living Space',
    img: efImg1, images: execFamilyImgs,
    beds: '2–3 Beds', area: 'Family Suite',
    desc: 'A generous family suite with a separate living area, multiple sleeping arrangements, and curated amenities designed for an exceptional family stay.',
    longDesc: 'A generous family suite offering a separate living area, multiple sleeping arrangements, and curated luxury amenities. Designed for families who expect space, privacy, and exceptional service throughout their stay.',
    highlights: ['Multiple Beds', 'Separate Living Area', 'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Premium Bathroom', 'Room Service'],
    perfectFor: 'Families & extended stays',
    filter: 'Ready to Move',
  },
  {
    num: '06', name: 'Regal Executive Suite', roomId: 'res',
    type: 'Executive Suite · Refined Luxury',
    img: reImg1, images: [reImg1, reImg2, ...regalHEIC],
    beds: '1 King', area: 'Executive Suite',
    desc: 'A refined executive suite with sophisticated decor, a dedicated workspace, premium amenities, and an ambiance befitting discerning guests.',
    longDesc: 'A refined executive suite blending sophisticated decor with practical luxury. Featuring a dedicated workspace, premium amenities, a plush king bed, and personalized concierge service — an elevated retreat for business and leisure alike.',
    highlights: ['King Bed', 'Dedicated Workspace', 'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Premium Bathroom', 'Concierge Service'],
    perfectFor: 'Business travellers & discerning guests',
    filter: 'Ready to Move',
  },
  {
    num: '07', name: 'Premium Pyramid Suite', roomId: 'pps',
    type: 'Signature Suite · Iconic Views',
    img: pyramidImgs[0], images: pyramidImgs,
    beds: '1 King', area: 'Premium Suite',
    desc: 'Our most exclusive offering — a signature suite of unmatched grandeur with iconic views, bespoke interiors, and the ultimate in luxury hospitality.',
    longDesc: 'Our most exclusive offering — a signature suite of unmatched grandeur. Iconic views, bespoke interiors, butler service, premium amenities, and every detail meticulously curated for an unforgettable stay at Bafana Pyramids.',
    highlights: ['King Bed', 'Iconic Views', 'Butler Service', 'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Premium Bathroom', 'Private Dining'],
    perfectFor: 'Luxury connoisseurs & special occasions',
    filter: 'Ready to Move',
  },
]

const FILTERS = ['All']

/* ── scroll-reveal hook ── */
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

/* ── Property Detail Modal ── */
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
                    <a href="tel:+201034962229" className={s.modalBtnSecondary}>
                      <Phone size={13} /> Call to Enquire
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

/* ── Card Image Slider ── */
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
            alt={`${name} — ${i + 1}`}
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
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [headRef, headVisible] = useReveal()
  const [gridRef, gridVisible] = useReveal()

  const shown = residences.filter(r => filter === 'All' || r.filter === filter)

  return (
    <section className={s.section}>

      {/* ── Section Header ── */}
      <div ref={headRef} className={[s.head, headVisible ? s.headIn : ''].join(' ')}>
        <div className={s.orn}>
          <span className={s.oLine} /><span className={s.oDot} /><span className={s.oLine} />
        </div>
        <p className={s.eyebrow}>The Collection</p>
        <h2 className={s.title}>Signature <span className={s.script}>Residences</span></h2>
        <p className={s.sub}>Each property — a statement of rarity, limited in number, infinite in elegance.</p>

        {/* Filter Tabs — hidden when only one category */}
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

      {/* ── Feature Ribbon ── */}
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

      {/* ── Grid ── */}
      <div
        ref={gridRef}
        className={[s.grid, gridVisible ? s.gridIn : ''].join(' ')}
      >
        {shown.map((r, i) => (
          <div
            key={r.num}
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
        <p className={s.ctaSub}>All room types · Special packages · Private enquiries</p>
      </div>

      {/* Modal */}
      {selected && (
        <PropertyModal residence={selected} onClose={() => setSelected(null)} onBook={onBook} />
      )}
    </section>
  )
}
