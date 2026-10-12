import s from './About.module.css'
import aboutImg from '../assets/slide-20.jpg'
import team1 from '../assets/slide-25.jpg'
import team2 from '../assets/slide-28.jpg'
import team3 from '../assets/slide-32.jpg'
import team4 from '../assets/slide-35.jpg'

const milestones = [
  { year:'2026', event:'Founded in Cairo, Egypt — a vision of neoclassical grandeur and modern luxury.' },
  { year:'2027', event:'Expanded to Alexandria and Sharm El-Sheikh. First 50 residences delivered.' },
  { year:'2028', event:'Launched the ultra-luxury villa segment. Received the Regional Design Award.' },
  { year:'2029', event:'Presence across 5 Egyptian cities. 500 homes delivered to discerning families.' },
  { year:'2030', event:'1,200+ happy families. International design collaborations across three continents.' },
]

const team = [
  { name:'Rajesh Bafana',  role:'Chairman & Founder', init:'R', img: null },
  { name:'Anjali Bafana',  role:'Managing Director',  init:'A', img: null },
  { name:'Vikram Mehta',  role:'Chief Architect',    init:'V', img: null },
  { name:'Kavitha Rao',   role:'Head of Design',     init:'K', img: null },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · Our Story</p>
          <h1 className={s.heroTitle}>Four Decades of<br /><em>Uncompromising Excellence</em></h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>One landmark at a time, we have redefined what it means to live beautifully in Egypt.</p>
        </div>
      </div>

      {/* Intro split */}
      <section className={s.intro}>
        <div className={s.introGrid}>
          <div className={s.introText}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Our Philosophy</p>
            <h2 className={s.secTitle}>Heritage Meets<br /><em>Modern Luxury</em></h2>
            <div className={s.ruleShort}/>
            <p className={s.body}>
              At Bafana Pyramids, we believe that a home is more than architecture — it is
              the canvas on which life's finest moments are painted. Since 2026, we have
              combined Egyptian heritage craftsmanship with contemporary design to create residences
              that endure generations.
            </p>
            <p className={s.body}>
              Our commitment is not merely to square footage, but to the quality of life
              within every space we create.
            </p>
            <div className={s.certBadge}>
              <span className={s.certN}>RERA</span>
              <span className={s.certT}>Registered & Certified</span>
            </div>
          </div>
          <div className={s.introImgWrap}>
            <img src={aboutImg} alt="Bafana Pyramids" className={s.introImg} />
            <div className={s.introBadge}>
              <span className={s.introBadgeN}>40+</span>
              <span className={s.introBadgeT}>Years of Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={s.timeline}>
        <div className={s.container}>
          <div className={s.timeHead}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Our Journey</p>
            <h2 className={s.secTitle}>Milestones</h2>
          </div>
          <div className={s.timeList}>
            {milestones.map((m,i) => (
              <div key={i} className={s.timeItem}>
                <span className={s.timeYear}>{m.year}</span>
                <span className={s.timeDot}/>
                <p className={s.timeEvent}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={s.teamSec}>
        <div className={s.container}>
          <div className={s.timeHead}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Leadership</p>
            <h2 className={s.secTitle}>The Team</h2>
          </div>
          <div className={s.teamGrid}>
            {team.map((t,i) => (
              <div key={i} className={s.teamCard}>
                <div className={s.teamAvatar}>{t.init}</div>
                <h4 className={s.teamName}>{t.name}</h4>
                <p className={s.teamRole}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
