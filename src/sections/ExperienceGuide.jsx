'use client'

import { FileText, MapPin, Utensils, Sparkles, Star, BedDouble, Users, Waves } from 'lucide-react'
import s from './ExperienceGuide.module.css'

const highlights = [
  { icon: <BedDouble size={20}/>,  text: 'Deluxe King & Twin Rooms with Pyramid Views' },
  { icon: <Star size={20}/>,       text: 'Premium Pyramid Suite & Regal Executive Suite' },
  { icon: <Sparkles size={20}/>,   text: 'Egyptian-Inspired Spa & Wellness Retreat' },
  { icon: <Utensils size={20}/>,   text: 'Rooftop Dining Over the Pyramids' },
  { icon: <MapPin size={20}/>,     text: 'Steps from the Great Pyramids of Giza' },
]

const facts = [
  { icon: <BedDouble size={22}/>,  label: 'Room Types',    value: '4 Distinct Categories' },
  { icon: <Waves size={22}/>,      label: 'Spa & Wellness', value: 'Full Egyptian Spa' },
  { icon: <Utensils size={22}/>,   label: 'Dining',         value: 'Rooftop & In-Hotel' },
  { icon: <Users size={22}/>,      label: 'Perfect For',    value: 'Families, Couples & Groups' },
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
            <p className={s.eyebrow}>Discover Bafana Pyramids</p>
            <h2 className={s.heading}>
              The Bafana<br />
              <span className={s.script}>Hotel Brochure</span>
            </h2>
            <p className={s.body}>
              Immerse yourself in luxury steps from the Great Pyramids of Giza. Our brochure
              details every suite, spa treatment, rooftop dining experience, and curated
              Egyptian adventure awaiting you at Bafana Pyramids Hotel &amp; Spa.
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
              href="/BAFANA-PYRAMIDS-BROCHURE.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={s.downloadBtn}
            >
              <FileText size={18} />
              View Hotel Brochure
            </a>
            <p className={s.hint}>Full PDF · Opens in new tab</p>
          </div>

          {/* Right — hotel info cards */}
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
                "Wake up to the timeless silhouette of the Great Pyramids. At Bafana Pyramids,
                every detail — from our Egyptian spa to our rooftop terrace — is crafted
                to make your stay unforgettable."
              </p>
              <span className={s.quoteAuthor}>— Bafana Pyramids Hotel &amp; Spa</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
