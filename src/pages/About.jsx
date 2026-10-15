import s from './About.module.css'
import aboutImg from '../assets/slide-20.jpg'

const milestones = [
  { year:'2026', event:'Founded in Giza, Cairo — combining Egyptian heritage with modern hospitality.' },
  { year:'2026', event:'Opened Bafana Pyramids Hotel & Spa, welcoming international travellers to Giza.' },
  { year:'2027', event:'Expanded dining with Asian, Egyptian and Continental cuisine options.' },
  { year:'2027', event:'Launched the Rooftop Lounge Restaurant with panoramic views.' },
  { year:'2028', event:'Welcomed guests from across the world — FITs, families, couples and tour groups.' },
]

const highlights = [
  { num:'01', title:'Location', desc:'Princes Street, Al Remaya, Giza — steps from the Great Pyramids and the Grand Egyptian Museum.' },
  { num:'02', title:'Accommodation', desc:'Seven room and suite categories for couples, families, leisure travellers and organised tour groups.' },
  { num:'03', title:'Dining', desc:'Asian, authentic Egyptian and Continental cuisine, plus a Rooftop Lounge Restaurant.' },
  { num:'04', title:'Connectivity', desc:'Close to the Great Pyramids, The Sphinx, Grand Egyptian Museum and Cairo City attractions.' },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · About</p>
          <h1 className={s.heroTitle}>Your Gateway to<br /><em>Egypt's Timeless Wonders</em></h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>Experience Egyptian Hospitality, Comfort & Convenience.</p>
        </div>
      </div>

      {/* Intro split */}
      <section className={s.intro}>
        <div className={s.introGrid}>
          <div className={s.introText}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Welcome to Bafana Pyramids</p>
            <h2 className={s.secTitle}>Egyptian Hospitality<br /><em>At Its Finest</em></h2>
            <div className={s.ruleShort}/>
            <p className={s.body}>
              Discover the beauty of Egypt with a comfortable and welcoming stay at Bafana Pyramids Hotel & Spa,
              located in the historic destination of Giza, Cairo.
            </p>
            <p className={s.body}>
              Combining elegant interiors, modern accommodation and warm hospitality, the hotel provides a
              relaxing retreat for travellers exploring Egypt's remarkable heritage. With a selection of guest
              rooms and suites, diverse dining options and convenient access to Giza's renowned attractions,
              Bafana Pyramids offers an inviting experience for couples, families, leisure travellers and
              organised tour groups.
            </p>
            <div className={s.certBadge}>
              <span className={s.certN}>GIZ</span>
              <span className={s.certT}>Cairo, Egypt</span>
            </div>
          </div>
          <div className={s.introImgWrap}>
            <img src={aboutImg} alt="Bafana Pyramids Hotel & Spa" className={s.introImg} />
            <div className={s.introBadge}>
              <span className={s.introBadgeN}>7</span>
              <span className={s.introBadgeT}>Room Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className={s.timeline}>
        <div className={s.container}>
          <div className={s.timeHead}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Location & Connectivity</p>
            <h2 className={s.secTitle}>Stay Close to History</h2>
            <p style={{ textAlign:'center', maxWidth:620, margin:'0 auto 16px', fontSize:'1rem', lineHeight:1.7, color:'var(--brown)', opacity:.75 }}>
              Situated in the Al Remaya area of Giza, Bafana Pyramids offers a convenient base for
              discovering Egypt's most celebrated historical landmarks. Address: Princes Street, Al Remaya, Giza, Egypt.
            </p>
          </div>
          <div className={s.timeList}>
            {[
              { year:'01', event:'The Great Pyramids of Giza — one of the world\'s most extraordinary ancient wonders.' },
              { year:'02', event:'The Great Sphinx — the magnificent monument of Egypt\'s remarkable civilization.' },
              { year:'03', event:'Grand Egyptian Museum — Egypt\'s extraordinary archaeological treasures and cultural heritage.' },
              { year:'04', event:'Giza Plateau — the historical landscape surrounding the pyramids.' },
              { year:'05', event:'Cairo City — museums, markets, architecture and vibrant cultural experiences.' },
            ].map((m,i) => (
              <div key={i} className={s.timeItem}>
                <span className={s.timeYear}>{m.year}</span>
                <span className={s.timeDot}/>
                <p className={s.timeEvent}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel highlights */}
      <section className={s.teamSec}>
        <div className={s.container}>
          <div className={s.timeHead}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Why Choose Us</p>
            <h2 className={s.secTitle}>Hotel Highlights</h2>
          </div>
          <div className={s.teamGrid}>
            {highlights.map((h,i) => (
              <div key={i} className={s.teamCard}>
                <div className={s.teamAvatar}>{h.num}</div>
                <h4 className={s.teamName}>{h.title}</h4>
                <p className={s.teamRole}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suitable for */}
      <section className={s.timeline} style={{ background:'var(--navy)', padding:'80px 0' }}>
        <div className={s.container}>
          <div className={s.timeHead}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow} style={{ color:'var(--gold)' }}>Who We Welcome</p>
            <h2 className={s.secTitle} style={{ color:'var(--cream)' }}>Welcoming Travellers from Around the World</h2>
          </div>
          <div className={s.timeList}>
            {[
              { year:'✦', event:'FIT – Free Independent Travellers' },
              { year:'✦', event:'Couples and family holiday bookings' },
              { year:'✦', event:'Small-group accommodation' },
              { year:'✦', event:'Organised sightseeing and cultural tours' },
              { year:'✦', event:'International leisure travel bookings' },
            ].map((m,i) => (
              <div key={i} className={s.timeItem}>
                <span className={s.timeYear} style={{ color:'var(--gold)' }}>{m.year}</span>
                <span className={s.timeDot}/>
                <p className={s.timeEvent} style={{ color:'rgba(250,242,231,.75)' }}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
