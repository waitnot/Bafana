import { useState, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import s from './Gallery.module.css'

const slides = Array.from({ length: 39 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return new URL(`../assets/slide-${n}.jpg`, import.meta.url).href
})

const coverUrl = new URL('../assets/cover.jpg', import.meta.url).href
const allSlides = [coverUrl, ...slides]

const row1 = allSlides.slice(0, 20)
const row2 = allSlides.slice(19, 40)

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  const open  = useCallback(i => setLightbox(i), [])
  const close = useCallback(() => setLightbox(null), [])
  const prev  = useCallback(() => setLightbox(v => (v - 1 + allSlides.length) % allSlides.length), [])
  const next  = useCallback(() => setLightbox(v => (v + 1) % allSlides.length), [])

  useEffect(() => {
    if (lightbox === null) return
    const fn = e => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox, next, prev, close])

  return (
    <section className={s.section}>
      <div className={s.head}>
        <div className={s.orn}>
          <span className={s.oLine} /><span className={s.oDot} /><span className={s.oLine} />
        </div>
        <p className={s.eyebrow}>Visual Journey</p>
        <h2 className={s.title}>The Bafana Pyramids Gallery</h2>
        <p className={s.sub}>A curated glimpse into our architecture, interiors, and way of life.</p>
      </div>

      {/* Row 1 scrolls left */}
      <div className={s.track}>
        <div className={s.belt}>
          {[...row1, ...row1].map((src, i) => (
            <button key={i} className={s.card} onClick={() => open(i % row1.length)}>
              <img src={src} alt="" className={s.cardImg} loading="lazy" />
              <div className={s.cardOverlay} />
            </button>
          ))}
        </div>
      </div>

      {/* Row 2 scrolls right */}
      <div className={s.track}>
        <div className={[s.belt, s.beltReverse].join(' ')}>
          {[...row2, ...row2].map((src, i) => (
            <button key={i} className={s.card} onClick={() => open(19 + (i % row2.length))}>
              <img src={src} alt="" className={s.cardImg} loading="lazy" />
              <div className={s.cardOverlay} />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className={s.lb} onClick={close}>
          <button className={s.lbClose} onClick={close}><X size={20} /></button>
          <button className={[s.lbArrow, s.lbLeft].join(' ')} onClick={e => { e.stopPropagation(); prev() }}>
            <ChevronLeft size={24} />
          </button>
          <div className={s.lbContent} onClick={e => e.stopPropagation()}>
            <img key={lightbox} src={allSlides[lightbox]} alt="" className={s.lbImg} />
          </div>
          <button className={[s.lbArrow, s.lbRight].join(' ')} onClick={e => { e.stopPropagation(); next() }}>
            <ChevronRight size={24} />
          </button>
          <div className={s.lbCounter}>
            {String(lightbox + 1).padStart(2, '0')} / {String(allSlides.length).padStart(2, '0')}
          </div>
          <div className={s.thumbs} onClick={e => e.stopPropagation()}>
            {allSlides.map((src, i) => (
              <button key={i} className={[s.thumb, i === lightbox ? s.thumbOn : ''].join(' ')} onClick={() => setLightbox(i)}>
                <img src={src} alt="" className={s.thumbImg} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
