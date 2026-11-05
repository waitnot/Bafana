import { FileText, MapPin, Compass, Camera, Star } from 'lucide-react'
import s from './ExperienceGuide.module.css'

const highlights = [
  { icon: <MapPin size={20}/>,   text: 'The Great Pyramids of Giza' },
  { icon: <Compass size={20}/>,  text: 'The Great Sphinx & Giza Plateau' },
  { icon: <Star size={20}/>,     text: 'Grand Egyptian Museum' },
  { icon: <Camera size={20}/>,   text: 'Cairo City Attractions & Markets' },
]

export default function ExperienceGuide() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.content}>
          {/* Left — text only, no right card */}
          <div className={s.left}>
            <div className={s.orn}>
              <span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/>
            </div>
            <p className={s.eyebrow}>Discover Egypt</p>
            <h2 className={s.heading}>
              The Bafana<br />
              <span className={s.script}>Experience Guide</span>
            </h2>
            <p className={s.body}>
              Plan your Egyptian adventure with our exclusive guest guide. From the iconic
              Pyramids of Giza to the treasures of the Grand Egyptian Museum — everything
              you need to explore Cairo & Giza, curated by our team.
            </p>

            <ul className={s.highlights}>
              {highlights.map((h, i) => (
                <li key={i} className={s.highlight}>
                  <span className={s.highlightIcon}>{h.icon}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>

            {/* Opens PDF in new tab — no download */}
            <a
              href="/Bafana-Experience.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={s.downloadBtn}
            >
              <FileText size={18} />
              View Experience Guide
            </a>
            <p className={s.hint}>Free PDF · Opens in new tab</p>
          </div>
        </div>
      </div>
    </section>
  )
}
