import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, Users, Tag, ArrowRight, X, Check } from 'lucide-react'
import DateRangePicker from './DateRangePicker'
import s from './BookingBar.module.css'

function fmt(str) {
  if (!str) return null
  const [y,m,d] = str.split('-')
  return `${d}/${m}/${y}`
}

/* ── Calendar Modal ── */
function CalendarModal({ checkIn, checkOut, onChange, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return createPortal(
    <div className={s.calModalBackdrop} onClick={onClose}>
      <div className={s.calModalBox} onClick={e => e.stopPropagation()}>
        <button className={s.calModalClose} onClick={onClose} aria-label="Close calendar">
          <X size={16}/>
        </button>
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={onChange}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  )
}

/* ── Guests Modal ── */
const GUEST_OPTIONS = [
  { label: '1 Guest',  sub: '1 Room',  value: '1 Guest, 1 Room' },
  { label: '2 Guests', sub: '1 Room',  value: '2 Guests, 1 Room' },
  { label: '3 Guests', sub: '1 Room',  value: '3 Guests, 1 Room' },
  { label: '4 Guests', sub: '2 Rooms', value: '4 Guests, 2 Rooms' },
  { label: '5+ Guests',sub: 'Contact us', value: '5+ Guests' },
]

function GuestsModal({ selected, onSelect, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return createPortal(
    <div className={s.calModalBackdrop} onClick={onClose}>
      <div className={s.guestModalBox} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={s.guestModalHeader}>
          <div>
            <p className={s.guestModalEyebrow}>Select</p>
            <h3 className={s.guestModalTitle}>Guests & Rooms</h3>
          </div>
          <button className={s.guestModalClose} onClick={onClose} aria-label="Close">
            <X size={16}/>
          </button>
        </div>

        {/* Options */}
        <div className={s.guestOptions}>
          {GUEST_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={[s.guestOption, selected === opt.value ? s.guestOptionOn : ''].join(' ')}
              onClick={() => { onSelect(opt.value); onClose() }}
            >
              <div className={s.guestOptionLeft}>
                <span className={s.guestOptionIcon}><Users size={16}/></span>
              </div>
              <div className={s.guestOptionBody}>
                <span className={s.guestOptionLabel}>{opt.label}</span>
                <span className={s.guestOptionSub}>{opt.sub}</span>
              </div>
              {selected === opt.value && (
                <span className={s.guestOptionCheck}><Check size={14}/></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function BookingBar({ onBook }) {
  const [checkIn,     setCheckIn]     = useState('')
  const [checkOut,    setCheckOut]    = useState('')
  const [guests,      setGuests]      = useState('')
  const [code,        setCode]        = useState('')
  const [calOpen,     setCalOpen]     = useState(false)
  const [guestOpen,   setGuestOpen]   = useState(false)

  const barRef = useRef(null)

  const dateLabel = checkIn && checkOut
    ? `${fmt(checkIn)}  –  ${fmt(checkOut)}`
    : checkIn ? `${fmt(checkIn)}  –  Check out` : null

  return (
    <>
      <div className={s.wrap} ref={barRef}>
        <div className={s.bar}>

          {/* ── CHECK IN / OUT ── */}
          <div
            className={[s.field, s.fieldDate, calOpen ? s.fieldActive : ''].join(' ')}
            onClick={() => setCalOpen(true)}
          >
            <Calendar size={14} className={s.icon} />
            <div className={s.fieldBody}>
              <span className={s.fieldLbl}>CHECK IN – CHECK OUT</span>
              <span className={dateLabel ? s.fieldVal : s.fieldPlaceholder}>
                {dateLabel || 'Select dates'}
              </span>
            </div>
          </div>

          <div className={s.divider} />

          {/* ── GUESTS & ROOMS ── */}
          <div
            className={[s.field, guestOpen ? s.fieldActive : ''].join(' ')}
            onClick={() => setGuestOpen(true)}
          >
            <Users size={14} className={s.icon} />
            <div className={s.fieldBody}>
              <span className={s.fieldLbl}>GUESTS & ROOMS</span>
              <span className={guests ? s.fieldVal : s.fieldPlaceholder}>
                {guests || '1 Guest, 1 Room'}
              </span>
            </div>
          </div>

          <div className={s.divider} />

          {/* ── BOOKING CODE ── */}
          <div className={`${s.field} ${s.fieldCode}`}>
            <Tag size={14} className={s.icon} />
            <div className={s.fieldBody}>
              <span className={s.fieldLbl}>BOOKING CODE</span>
              <input
                className={s.codeInput}
                placeholder="Enter code"
                value={code}
                onChange={e => setCode(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>

          {/* ── BOOK NOW ── */}
          <button className={s.bookBtn} onClick={() => onBook({ checkIn, checkOut, guests })}>BOOK NOW</button>

          {/* ── MODIFY ── */}
          <button className={s.modifyBtn} onClick={() => onBook({ checkIn, checkOut, guests })}>
            <span>MODIFY<br/>BOOKING</span>
            <ArrowRight size={13}/>
          </button>

        </div>
      </div>

      {/* ── Modals ── */}
      {calOpen && (
        <CalendarModal
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={({ checkIn: ci, checkOut: co }) => { setCheckIn(ci); setCheckOut(co) }}
          onClose={() => setCalOpen(false)}
        />
      )}
      {guestOpen && (
        <GuestsModal
          selected={guests}
          onSelect={setGuests}
          onClose={() => setGuestOpen(false)}
        />
      )}
    </>
  )
}
