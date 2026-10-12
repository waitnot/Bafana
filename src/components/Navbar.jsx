import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoImg from '../assets/bp-logo.png'
import brandText from '../assets/brand-text.png'
import s from './Navbar.module.css'

const links = [
  { label: 'Amenities',  path: '/amenities' },
  { label: 'Our Story',  path: '/about' },
  { label: 'Contact',    path: '/contact' },
]

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const isHome = loc.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [loc])

  return (
    <header className={[s.nav, isHome && !scrolled ? s.glass : s.solid, scrolled ? s.shadow : ''].join(' ')}>
      <div className={s.bar}>
        {/* Left nav */}
        <nav className={s.group}>
          {links.slice(0, 2).map(l => (
            <Link key={l.path} to={l.path} className={[s.link, loc.pathname === l.path ? s.active : ''].join(' ')}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link to="/" className={s.logo}>
          <img src={logoImg} alt="Bafana Pyramids" className={s.logoImg} />
          <img src={brandText} alt="Bafana Pyramids" className={s.brandText} />
        </Link>

        {/* Right nav */}
        <nav className={s.group}>
          {links.slice(2).map(l => (
            <Link key={l.path} to={l.path} className={[s.link, loc.pathname === l.path ? s.active : ''].join(' ')}>
              {l.label}
            </Link>
          ))}
          <button className={s.reserveBtn} onClick={onBook}>Reserve</button>
        </nav>

        {/* Mobile toggle */}
        <button className={s.toggle} onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={[s.drawer, open ? s.drawerOpen : ''].join(' ')}>
        {links.map(l => (
          <Link key={l.path} to={l.path} className={[s.drawerLink, loc.pathname === l.path ? s.drawerActive : ''].join(' ')}>
            {l.label}
          </Link>
        ))}
        <button className={s.drawerCta} onClick={() => { setOpen(false); onBook() }}>Reserve a Consultation</button>
      </div>
    </header>
  )
}
