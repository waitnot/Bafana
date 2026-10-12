import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'
import logoImg from '../assets/bp-logo.png'
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
            <div className={s.logoText}>
              <span className={s.logoA}>BAFANA</span>
              <span className={s.logoB}>PYRAMIDS</span>
            </div>
          </Link>
          <p className={s.tagline}>Crafting landmark residences since 2026.<br/>Egypt · Elegance · Permanence.</p>
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
            {[['Home','/'],['Amenities','/amenities'],['Our Story','/about'],['Contact','/contact']].map(([l,p])=>(
              <Link key={p} to={p} className={s.colLink}>{l}</Link>
            ))}
          </nav>
        </div>

        <div className={s.col}>
          <p className={s.colHead}>Find Us</p>
          <div className={s.colRule}/>
          <div className={s.contacts}>
            <div className={s.ci}><MapPin size={13} className={s.ci_icon}/><span>Princess Street,<br/>Giza Governorate, Egypt</span></div>
            <div className={s.ci}><Phone  size={13} className={s.ci_icon}/><a href="tel:+201034962229" className={s.ciLink}>+20 1034 962 229</a></div>
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
