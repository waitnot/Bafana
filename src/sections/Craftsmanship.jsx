import s from './Craftsmanship.module.css'
import craftImg from '../assets/reception-lobby-4.jpg'

const pillars = [
  { num: '01', title: 'Neoclassical Architecture',  desc: 'Facades inspired by 16th-century Italian palazzi, rendered in premium stone with handcrafted detailing.' },
  { num: '02', title: 'Bespoke Interiors',           desc: 'Every finish, material, and fitting is custom-designed and exclusively created for each property.' },
  { num: '03', title: 'Landscape Mastery',           desc: 'Landscaped gardens, reflection pools, and courtyard gardens that mirror the grandeur of the architecture.' },
  { num: '04', title: 'Enduring Legacy',             desc: 'Grade-A materials under stringent quality protocols — built to appreciate across generations.' },
]

export default function Craftsmanship() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.eyebrow}>The Art of Living</p>
          <h2 className={s.title}>
            Where Every Detail<br />
            <span className={s.script}>Tells a Story</span>
          </h2>
          <div className={s.divLine} />
          <p className={s.desc}>
            Four decades of mastery, manifested in spaces where every surface,
            every curve, every material is a deliberate act of beauty.
          </p>
          <div className={s.imgWrap}>
            <img src={craftImg} alt="Craftsmanship" className={s.craftImg} />
          </div>
        </div>
        <div className={s.right}>
          {pillars.map((p, i) => (
            <div key={i} className={s.pillar}>
              <span className={s.pNum}>{p.num}</span>
              <div>
                <h4 className={s.pTitle}>{p.title}</h4>
                <p className={s.pDesc}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
