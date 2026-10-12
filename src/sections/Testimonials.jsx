import { useEffect } from 'react'
import s from './Testimonials.module.css'

export default function Testimonials() {
  useEffect(() => {
    // Load Elfsight platform script if not already loaded
    if (!document.querySelector('script[src*="elfsightcdn.com/platform.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://elfsightcdn.com/platform.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.orn}>
          <span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/>
        </div>
        <p className={s.eyebrow}>Guest Reviews</p>
        <h2 className={s.heading}>What Our Guests Say</h2>

        {/* Elfsight Google Reviews Widget */}
        <div className={s.widgetWrap}>
          <div
            className="elfsight-app-aa6ee7e8-e217-428e-99bd-2745e54d97d1"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  )
}
