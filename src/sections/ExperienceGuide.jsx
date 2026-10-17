import { Download, MapPin, Compass, Camera, Star } from 'lucide-react'
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
          {/* Left — text */}
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

            <a
              href="/Bafana-Experience.pdf"
              download="Bafana-Experience-Guide.pdf"
              className={s.downloadBtn}
            >
              <Download size={18} />
              Download Experience Guide
            </a>
            <p className={s.hint}>Free PDF · Instant download</p>
          </div>

          {/* Right — PDF preview card */}
          <div className={s.right}>
            <div className={s.pdfCard}>
              <div className={s.pdfIcon}>
                <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="70">
                  <rect width="64" height="80" rx="6" fill="rgba(185,137,65,.15)"/>
                  <rect x="8" y="8" width="48" height="64" rx="4" fill="rgba(185,137,65,.08)" stroke="rgba(185,137,65,.3)" strokeWidth="1"/>
                  <text x="32" y="38" textAnchor="middle" fontFamily="serif" fontSize="14" fontWeight="700" fill="rgba(185,137,65,.9)">PDF</text>
                  <rect x="16" y="46" width="32" height="2" rx="1" fill="rgba(185,137,65,.4)"/>
                  <rect x="16" y="52" width="24" height="2" rx="1" fill="rgba(185,137,65,.25)"/>
                  <rect x="16" y="58" width="28" height="2" rx="1" fill="rgba(185,137,65,.2)"/>
                </svg>
              </div>
              <p className={s.pdfTitle}>Bafana Experience Guide</p>
              <p className={s.pdfSub}>Tourist & Attractions Guide<br/>Giza · Cairo · Egypt</p>
              <a
                href="/Bafana-Experience.pdf"
                download="Bafana-Experience-Guide.pdf"
                className={s.pdfDownload}
              >
                <Download size={15}/> Download PDF
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
