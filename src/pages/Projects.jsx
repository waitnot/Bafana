import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import s from './Projects.module.css'

import img01 from '../assets/slide-03.jpg'
import img02 from '../assets/slide-07.jpg'
import img03 from '../assets/slide-10.jpg'
import img04 from '../assets/slide-15.jpg'
import img05 from '../assets/slide-19.jpg'
import img06 from '../assets/slide-23.jpg'

const filters = ['All', 'Ready to Move', 'Under Construction', 'New Launch']

const projects = [
  { num:'01', name:'The Meridian',   loc:'Cairo', type:'3 & 4 BHK Luxury Residences',   status:'Ready to Move',      price:'EGP 2.4M – 4.8M',  img: img01 },
  { num:'02', name:'Amber Heights',  loc:'Alexandria', type:'2 & 3 BHK Premium Apartments',   status:'Under Construction',  price:'EGP 1.8M – 3.2M',  img: img02 },
  { num:'03', name:'Heritage Court', loc:'Giza',   type:'4 & 5 BHK Boutique Villas',       status:'New Launch',          price:'EGP 5.5M – 9.0M',  img: img03 },
  { num:'04', name:'Teal Crest',     loc:'Sharm El-Sheikh',      type:'2 & 3 BHK Luxury Apartments',     status:'Ready to Move',      price:'EGP 1.6M – 2.8M',  img: img04 },
  { num:'05', name:'Ivory Spire',    loc:'Hurghada',    type:'3, 4 & 5 BHK Ultra Luxury',       status:'Under Construction',  price:'EGP 8.0M – 15M',   img: img05 },
  { num:'06', name:'The Courtyard',  loc:'Luxor',type:'3 BHK Row Houses',                status:'New Launch',          price:'EGP 900K – 1.4M',  img: img06 },
]

const statusCls = { 'Ready to Move':'ready', 'Under Construction':'under', 'New Launch':'newl' }

export default function Projects() {
  const [active, setActive] = useState('All')
  const list = active === 'All' ? projects : projects.filter(p => p.status === active)

  return (
    <>
      {/* Page hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · Residences</p>
          <h1 className={s.heroTitle}>Our Collection</h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>Landmark residences across Egypt's premier addresses.</p>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.container}>
          {/* Filters */}
          <div className={s.filters}>
            {filters.map(f => (
              <button key={f} onClick={() => setActive(f)}
                className={[s.filter, active === f ? s.filterOn : ''].join(' ')}>
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className={s.grid}>
            {list.map((p, i) => (
              <div key={i} className={s.card}>
                <div className={s.cardImg}>
                  <img src={p.img} alt={p.name} className={s.cardPhoto} />
                  <span className={[s.statusBadge, s[statusCls[p.status]]].join(' ')}>{p.status}</span>
                  <span className={s.cardNum}>{p.num}</span>
                </div>
                <div className={s.cardBody}>
                  <p className={s.cardType}>{p.type}</p>
                  <h3 className={s.cardName}>{p.name}</h3>
                  <p className={s.cardLoc}>{p.loc}</p>
                  <div className={s.cardRule}/>
                  <div className={s.cardFoot}>
                    <span className={s.cardPrice}>{p.price}</span>
                    <button className={s.cardBtn}>Details <ArrowRight size={13}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
