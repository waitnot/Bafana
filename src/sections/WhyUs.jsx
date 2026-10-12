import { Shield, Award, Home, Wrench } from 'lucide-react'
import s from './WhyUs.module.css'
import whyImg from '../assets/reception-lobby-2.jpg'

const features = [
  { icon: <Shield size={22}/>, title: 'Trust & Transparency',  desc: 'RERA registered. Clear pricing. Complete documentation. Zero hidden charges.' },
  { icon: <Award  size={22}/>, title: 'Award-Winning Design',  desc: 'Internationally acclaimed architecture blending aesthetic beauty with functional mastery.' },
  { icon: <Home   size={22}/>, title: 'Premium Locations',     desc: 'Strategically positioned in Egypt\'s finest micro-markets for enduring value appreciation.' },
  { icon: <Wrench size={22}/>, title: 'Superior Construction', desc: 'Grade-A materials with stringent quality checks at every milestone of the build process.' },
]

export default function WhyUs() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.eyebrow}>Why Bafana Pyramids</p>
          <h2 className={s.title}>A Legacy Built on<br /><span className={s.script}>Unwavering Standards</span></h2>
          <div className={s.divLine}/>
          <p className={s.desc}>
            For four decades, we have set the benchmark for premium residential development —
            guided by a philosophy that every home must be a masterpiece.
          </p>
          <div className={s.whyImgWrap}>
            <img src={whyImg} alt="Bafana Pyramids Legacy" className={s.whyImg} />
          </div>
        </div>
        {/* Feature grid */}
        <div className={s.grid}>
          {features.map((f, i) => (
            <div key={i} className={s.card}>
              <span className={s.icon}>{f.icon}</span>
              <div className={s.cLine}/>
              <h4 className={s.cTitle}>{f.title}</h4>
              <p className={s.cDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
