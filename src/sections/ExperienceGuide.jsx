'use client'

import { FileText, MapPin, Compass, Camera, Star, Clock, Users, Globe } from 'lucide-react'
import s from './ExperienceGuide.module.css'

const highlights = [
  { icon: <MapPin size={20}/>,   text: 'The Great Pyramids of Giza' },
  { icon: <Compass size={20}/>,  text: 'The Great Sphinx & Giza Plateau' },
  { icon: <Star size={20}/>,     text: 'Grand Egyptian Museum' },
  { icon: <Camera size={20}/>,   text: 'Cairo City Attractions & Markets' },
]

const facts = [
  { icon: <Clock size={22}/>,  label: 'Open Daily',      value: '9:00 AM – 5:00 PM' },
  { icon: <Globe size={22}/>,  label: 'Location',         value: 'Giza, Cairo, Egypt' },
  { icon: <Users size={22}/>,  label: 'Perfect For',      value: 'Families, Couples & Groups' },
  { icon: <Star size={22}/>,   label: 'UNESCO Heritage',  value: 'World Heritage Site' },
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
              target="_blank"
              rel="noopener noreferrer"
              className={s.downloadBtn}
            >
              <FileText size={18} />
              View Experience Guide
            </a>
            <p className={s.hint}>Free PDF · Opens in new tab</p>
          </div>

          {/* Right — attraction info cards */}
          <div className={s.right}>
            <div className={s.factsGrid}>
              {facts.map((f, i) => (
                <div key={i} className={s.factCard}>
                  <div className={s.factIcon}>{f.icon}</div>
                  <div className={s.factBody}>
                    <p className={s.factLabel}>{f.label}</p>
                    <p className={s.factValue}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.quoteBox}>
              <p className={s.quoteText}>
                "Giza is home to one of the seven wonders of the ancient world.
                Stay at Bafana Pyramids and wake up moments from history."
              </p>
              <span className={s.quoteAuthor}>— Bafana Pyramids Hotel & Spa</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
