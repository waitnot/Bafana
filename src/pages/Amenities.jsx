import s from './Amenities.module.css'
import amenitiesImg from '../assets/slide-08.jpg'

const amenities = [
  { num:'01', title:'Air-Conditioned Rooms',     desc:'All guest rooms and suites feature full air-conditioning for a comfortable stay throughout the year.' },
  { num:'02', title:'Private Bathrooms',          desc:'Each room includes a private en-suite bathroom with guest toiletries and fresh towels.' },
  { num:'03', title:'In-Room Television',         desc:'Flat-screen television in every room for entertainment and relaxation after a day of sightseeing.' },
  { num:'04', title:'Wi-Fi Connectivity',         desc:'Complimentary Wi-Fi throughout the hotel to keep guests connected during their stay.' },
  { num:'05', title:'Rooftop Lounge Restaurant',  desc:'Dine, relax and unwind at our rooftop lounge — a welcoming setting with a relaxed atmosphere for meals and refreshments.' },
  { num:'06', title:'Asian Cuisine',              desc:'A selection of Asian-inspired dishes offering familiar flavours for guests who enjoy Asian culinary traditions.' },
  { num:'07', title:'Egyptian Cuisine',           desc:'Traditional Egyptian flavours and regional dishes introducing visitors to Egypt\'s rich culinary heritage.' },
  { num:'08', title:'Continental Cuisine',        desc:'A selection of Continental-style food options suited to international travellers who prefer familiar dining choices.' },
  { num:'09', title:'Guest Reception & Assistance', desc:'Friendly reception team available to assist with guest enquiries, local sightseeing and tour arrangements.' },
  { num:'10', title:'Housekeeping Services',      desc:'Daily housekeeping to ensure a clean and comfortable environment throughout your stay.' },
  { num:'11', title:'Tour & Sightseeing Assistance', desc:'Help with local sightseeing enquiries, tour bookings and itinerary guidance for exploring Cairo and Giza.' },
  { num:'12', title:'Group & Family Accommodation', desc:'Flexible accommodation options for couples, families and organised tour groups visiting Egypt.' },
]

export default function Amenities() {
  return (
    <>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · Amenities</p>
          <h1 className={s.heroTitle}>Everything for a<br/>Comfortable Stay</h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>Bafana Pyramids combines guest accommodation with essential hospitality services to support a pleasant and convenient travel experience.</p>
        </div>
      </div>

      {/* Intro */}
      <section className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introText}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Hotel Facilities & Guest Services</p>
            <h2 className={s.secTitle}>Comfort, Dining<br /><em>& Hospitality</em></h2>
            <div className={s.rule}/>
            <p className={s.body}>
              At Bafana Pyramids Hotel & Spa, dining brings together familiar international favourites
              and regional culinary traditions, offering guests a selection of flavours during their stay.
            </p>
            <p className={s.body}>
              The hotel's food offering includes Asian, authentic Egyptian local and Continental cuisine
              options, catering to the preferences of international visitors, families and tour groups.
            </p>
          </div>
          <div className={s.introVisual}>
            <img src={amenitiesImg} alt="Bafana Pyramids Hotel Amenities" className={s.introImg} />
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
