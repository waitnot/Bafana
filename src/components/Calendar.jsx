import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Check, CalendarDays, X } from 'lucide-react'
import s from './Calendar.module.css'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function sameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
}

function fmt(d) {
  if (!d) return ''
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default function Calendar({ onConfirm }) {
  const today = new Date()
  const [year,      setYear]      = useState(today.getFullYear())
  const [month,     setMonth]     = useState(today.getMonth())
  const [pending,   setPending]   = useState(null)  // clicked, awaiting confirm
  const [confirmed, setConfirmed] = useState(null)  // confirmed
  const [hovered,   setHovered]   = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const popupRef = useRef(null)

  /* close popup on outside click */
  useEffect(() => {
    if (!showPopup) return
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false)
        setPending(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPopup])

  /* close popup on Escape */
  useEffect(() => {
    if (!showPopup) return
    const handler = (e) => {
      if (e.key === 'Escape') { setShowPopup(false); setPending(null) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showPopup])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isPast = (d) => {
    const date = new Date(year, month, d)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < t
  }

  const isToday     = (d) => sameDay(new Date(year, month, d), today)
  const isPending   = (d) => sameDay(new Date(year, month, d), pending)
  const isConfirmed = (d) => sameDay(new Date(year, month, d), confirmed)

  const handleDayClick = (d) => {
    if (isPast(d)) return
    setPending(new Date(year, month, d))
    setShowPopup(true)
  }

  const handleConfirm = () => {
    if (!pending) return
    setConfirmed(pending)
    setShowPopup(false)
    if (onConfirm) onConfirm(pending)
  }

  const handleCancel = () => {
    setShowPopup(false)
    setPending(null)
  }

  const handleChange = () => {
    setConfirmed(null)
    setPending(null)
    if (onConfirm) onConfirm(null)
  }

  return (
    <div className={s.card}>

      {/* ── Nav ── */}
      <div className={s.nav}>
        <button className={s.navBtn} onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <div className={s.navCenter}>
          <CalendarDays size={14} className={s.navIcon} />
          <h2 className={s.monthTitle}>{MONTHS[month]} {year}</h2>
        </div>
        <button className={s.navBtn} onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div className={s.dayHeaders}>
        {DAYS.map(d => (
          <span key={d} className={[
            s.dayHead,
            d === 'Sun' ? s.sunHead : d === 'Sat' ? s.satHead : ''
          ].join(' ')}>
            {d}
          </span>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className={s.grid}>
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} className={s.empty} />
          const past   = isPast(d)
          const today_ = isToday(d)
          const pend   = isPending(d)
          const conf   = isConfirmed(d)
          const hov    = hovered === d && !past

          return (
            <button
              key={d}
              disabled={past}
              className={[
                s.cell,
                past             ? s.past      : '',
                today_           ? s.today     : '',
                pend             ? s.pending   : '',
                conf             ? s.confirmed : '',
                hov && !pend && !conf ? s.hov  : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleDayClick(d)}
              onMouseEnter={() => !past && setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${MONTHS[month]} ${d} ${year}`}
            >
              {d}
              {today_ && <span className={s.todayDot} />}
            </button>
          )
        })}
      </div>

      {/* ── Confirm Popup ── */}
      {showPopup && pending && (
        <div className={s.popupOverlay}>
          <div className={s.popup} ref={popupRef} role="dialog" aria-modal="true">

            <button className={s.popupClose} onClick={handleCancel} aria-label="Cancel">
              <X size={14} />
            </button>

            <div className={s.popupIcon}>
              <CalendarDays size={22} />
            </div>

            <p className={s.popupTitle}>Confirm Visit Date</p>
            <p className={s.popupDate}>{fmt(pending)}</p>
            <p className={s.popupSub}>Would you like to confirm this as your preferred visit date?</p>

            <div className={s.popupActions}>
              <button className={s.popupCancel} onClick={handleCancel}>Cancel</button>
              <button className={s.popupConfirm} onClick={handleConfirm}>
                <Check size={13} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer status ── */}
      <div className={s.footer}>
        {!confirmed && !showPopup && (
          <p className={s.hint}>
            <CalendarDays size={13} className={s.hintIcon} />
            Click any date to confirm your visit
          </p>
        )}
        {!confirmed && showPopup && (
          <p className={s.hint}>
            <CalendarDays size={13} className={s.hintIcon} />
            Confirm or cancel your selection above
          </p>
        )}
        {confirmed && (
          <div className={s.confirmedRow}>
            <div className={s.confirmedInfo}>
              <Check size={14} className={s.confirmedIcon} />
              <div>
                <span className={s.confirmedLabel}>Visit date confirmed</span>
                <span className={s.confirmedDate}>{fmt(confirmed)}</span>
              </div>
            </div>
            <button className={s.changeBtn} onClick={handleChange}>Change</button>
          </div>
        )}
      </div>
    </div>
  )
}
