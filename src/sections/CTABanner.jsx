import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import s from './CTABanner.module.css'

export default function CTABanner() {
  return (
    <section className={s.section}>
      {/* Decorative frame corners */}
      <span className={s.cTL}/><span className={s.cBR}/>
      <div className={s.inner}>
        <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
        <p className={s.eyebrow}>Begin Your Journey</p>
        <h2 className={s.title}>
          Reserve Your Residence<br />
          <span className={s.script}>Today</span>
        </h2>
        <p className={s.sub}>
          Our private consultants are available to guide you through<br />
          the finest residences in the Bafana Pyramids collection.
        </p>
        <div className={s.actions}>
          <Link to="/contact" className={s.primary}>Book a Private Consultation <ArrowRight size={14}/></Link>
          <Link to="/projects" className={s.ghost}>Explore the Collection</Link>
        </div>
      </div>
    </section>
  )
}
