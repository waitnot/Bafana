import s from './Amenities.module.css'
import amenitiesImg from '../assets/slide-08.jpg'

const amenities = [
  { num:'01', title:'Grand Arrival Lobby',   desc:'Soaring double-height lobbies adorned with hand-laid marble and bespoke artisan furnishings.' },
  { num:'02', title:'Resort-Style Pools',    desc:'Mosaic-tiled lagoon pools surrounded by curated palm gardens and serene reflection ponds.' },
  { num:'03', title:'Wellness Sanctum',      desc:'A world-class spa, hammam, and fitness centre designed with the finest wellness equipment.' },
  { num:'04', title:'Private Dining Rooms',  desc:'Exclusive resident dining rooms and al fresco terraces with curated culinary experiences.' },
  { num:'05', title:'Concierge Services',    desc:'Around-the-clock personalised concierge — travel, dining, events, and every request handled.' },
  { num:'06', title:'Children\'s Atelier',   desc:'A beautifully designed safe space where children learn, play, and discover the world.' },
  { num:'07', title:'Sky Lounge',            desc:'A rooftop residents\' lounge with panoramic city views and curated social spaces.' },
  { num:'08', title:'Secure Valet Parking',  desc:'Multi-level covered parking with EV charging stations and valet services on demand.' },
]

export default function Amenities() {
  return (
    <>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · Amenities</p>
          <h1 className={s.heroTitle}>The Art of Living Well</h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>Every amenity is conceived to elevate the daily ritual into an extraordinary experience.</p>
        </div>
      </div>

      {/* Intro */}
      <section className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introText}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Unparalleled Facilities</p>
            <h2 className={s.secTitle}>A World Unto<br /><em>Itself</em></h2>
            <div className={s.rule}/>
            <p className={s.body}>The amenities within our residences are not merely functional — they are expressions of the same philosophy that governs every Bafana Pyramids creation: that life should be lived beautifully.</p>
          </div>
          <div className={s.introVisual}>
            <img src={amenitiesImg} alt="Amenities" className={s.introImg} />
          </div>
        </div>
      </section>

      {/* Amenities list */}
      <section className={s.listSec}>
        <div className={s.container}>
          <div className={s.grid}>
            {amenities.map((a,i) => (
              <div key={i} className={s.card}>
                <span className={s.cardNum}>{a.num}</span>
                <div className={s.cardLine}/>
                <h3 className={s.cardTitle}>{a.title}</h3>
                <p className={s.cardDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
