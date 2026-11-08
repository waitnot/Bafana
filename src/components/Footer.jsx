import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'
import logoImg from '../assets/bp-logo.png'
import brandText from '../assets/brand-text.jpg'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      {/* Gold ornament top */}
      <div className={s.orn}>
        <span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/>
      </div>

      <div className={s.top}>
        {/* Brand */}
        <div className={s.brand}>
          <Link to="/" className={s.logoWrap}>
            <img src={logoImg} alt="Bafana Pyramids" className={s.logoImg} />
            <img src={brandText} alt="Bafana Pyramids Hotel & Spa" className={s.brandText} />
          </Link>
          <p className={s.tagline}>Comfort. Hospitality. Timeless Experiences.<br/>Giza, Cairo – Egypt.</p>
          <div className={s.socials}>
            <a href="#" className={s.soc} aria-label="Instagram"><Instagram size={15}/></a>
            <a href="#" className={s.soc} aria-label="Facebook"><Facebook size={15}/></a>
            <a href="#" className={s.soc} aria-label="YouTube"><Youtube size={15}/></a>
          </div>
        </div>

        {/* Links */}
        <div className={s.col}>
          <p className={s.colHead}>Navigate</p>
          <div className={s.colRule}/>
          <nav className={s.colLinks}>
            {[['Home','/'],['Amenities','/amenities'],['About','/about'],['Contact','/contact']].map(([l,p])=>(
              <Link key={p} to={p} className={s.colLink}>{l}</Link>
            ))}
          </nav>
        </div>

        <div className={s.col}>
          <p className={s.colHead}>Find Us</p>
          <div className={s.colRule}/>
          <div className={s.contacts}>
            <div className={s.ci}><MapPin size={13} className={s.ci_icon}/><span>Princess Street, Al Remaya,<br/>Kafr Nassar, Al Haram,<br/>Giza Governorate 3515001</span></div>
            <div className={s.ci}>
              <Phone size={13} className={s.ci_icon}/>
              <a href="https://wa.me/201034962229" target="_blank" rel="noopener noreferrer" className={s.ciLink}
                style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366" style={{flexShrink:0}}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +20 1034 962 229
                <span style={{ fontSize:9, background:'#25D366', color:'#fff', padding:'1px 5px', borderRadius:20, fontWeight:700 }}>WhatsApp</span>
              </a>
            </div>
            <div className={s.ci}><Mail   size={13} className={s.ci_icon}/><a href="mailto:info@bafanapyramidshotel.com" className={s.ciLink}>info@bafanapyramidshotel.com</a></div>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <p className={s.copy}>© 2025 Bafana Pyramids. All Rights Reserved.</p>
        <div className={s.legal}>
          {['Privacy Policy','Terms of Use','RERA Registered'].map((t,i,a)=>(
            <span key={t} className={s.legalGroup}>
              <a href="#" className={s.legalLink}>{t}</a>
              {i < a.length-1 && <span className={s.dot}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}


