import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import s from './DateRangePicker.module.css'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function toStr(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function fromStr(str) {
  if (!str) return null
  const [y,m,d] = str.split('-').map(Number)
  return new Date(y, m-1, d)
}
function addMonths(year, month, delta) {
  let m = month + delta, y = year
  while (m > 11) { m -= 12; y++ }
  while (m < 0)  { m += 12; y-- }
  return { year: y, month: m }
}
function fmtDate(str) {
  if (!str) return null
  return fromStr(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function nights(ci, co) {
  if (!ci || !co) return 0
  return Math.round((fromStr(co) - fromStr(ci)) / 86400000)
}

export default function DateRangePicker({ checkIn, checkOut, onChange, onClose }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [view,  setView]  = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [hover, setHover] = useState(null)
  // phase: 'in' = picking check-in, 'out' = picking check-out, 'done' = both picked
  const [phase, setPhase] = useState(checkIn ? (checkOut ? 'done' : 'out') : 'in')

  const prev = () => setView(v => addMonths(v.year, v.month, -1))
  const next = () => setView(v => addMonths(v.year, v.month,  1))

  const inDate  = fromStr(checkIn)
  const outDate = fromStr(checkOut)
  const hovDate = fromStr(hover)

  const handleDay = (str) => {
    const d = fromStr(str)
    if (d < today) return

    if (phase === 'in') {
      // Picking check-in: set it, clear check-out, move to pick check-out
      onChange({ checkIn: str, checkOut: '' })
      setPhase('out')
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      if (d.getDate() === lastDay) setView(addMonths(d.getFullYear(), d.getMonth(), 1))
    } else if (phase === 'out') {
      if (inDate && d <= inDate) {
        // Clicked same or before check-in — restart from this date as new check-in
        onChange({ checkIn: str, checkOut: '' })
        setPhase('out')
        const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
        if (d.getDate() === lastDay) setView(addMonths(d.getFullYear(), d.getMonth(), 1))
      } else {
        // Valid check-out selected
        onChange({ checkIn, checkOut: str })
        setPhase('done')
      }
    } else {
      // phase === 'done': user clicks a date to start over
      onChange({ checkIn: str, checkOut: '' })
      setPhase('out')
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      if (d.getDate() === lastDay) setView(addMonths(d.getFullYear(), d.getMonth(), 1))
    }
  }

  // NO auto-close — user must click "Done" or the ✕ button

  const isInRange = (str) => {
    const d = fromStr(str)
    if (!inDate) return false
    const end = (phase === 'out' && hovDate && hovDate > inDate) ? hovDate : outDate
    return end ? d > inDate && d < end : false
  }

  const todayStr = toStr(today.getFullYear(), today.getMonth(), today.getDate())
  const { year, month } = view
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const n = nights(checkIn, checkOut)

  return (
    <div className={s.card}>

      {/* ── Tabs: click to re-edit each date ── */}
      <div className={s.tabs}>
        <div
          className={[s.tab, phase === 'in' ? s.tabActive : checkIn ? s.tabFilled : ''].join(' ')}
          onClick={() => setPhase('in')}
          style={{ cursor: 'pointer' }}
          title="Click to change check-in date"
        >
          <span className={s.tabLabel}>Check-in</span>
          <span className={checkIn ? s.tabValue : s.tabPlaceholder}>
            {checkIn ? fmtDate(checkIn) : 'Select date'}
          </span>
        </div>

        <div className={s.tabSep}>
          {n > 0
            ? <span className={s.nightsBadge}>{n}N</span>
            : <span className={s.tabArrow}>→</span>
          }
        </div>

        <div
          className={[s.tab, phase === 'out' ? s.tabActive : checkOut ? s.tabFilled : ''].join(' ')}
          onClick={() => { if (checkIn) setPhase('out') }}
          style={{ cursor: checkIn ? 'pointer' : 'default' }}
          title={checkIn ? 'Click to change check-out date' : 'Select check-in first'}
        >
          <span className={s.tabLabel}>Check-out</span>
          <span className={checkOut ? s.tabValue : s.tabPlaceholder}>
            {checkOut ? fmtDate(checkOut) : 'Select date'}
          </span>
        </div>
      </div>

      {/* ── Instruction strip ── */}
      <div className={s.instruction}>
        {phase === 'in'   && 'Select your check-in date'}
        {phase === 'out'  && 'Now select your check-out date'}
        {phase === 'done' && (
          <span className={s.doneMsg}>
            <Check size={13}/> {n} night{n !== 1 ? 's' : ''} selected — tap a date to change, or click Done
          </span>
        )}
      </div>

      {/* ── Month navigation ── */}
      <div className={s.nav}>
        <button className={s.navBtn} onClick={prev} aria-label="Previous month">
          <ChevronLeft size={17} strokeWidth={1.5} />
        </button>
        <h3 className={s.monthTitle}>{MONTHS[month]} {year}</h3>
        <button className={s.navBtn} onClick={next} aria-label="Next month">
          <ChevronRight size={17} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div className={s.dayHeaders}>
        {DAYS.map(d => <span key={d} className={s.dayHead}>{d}</span>)}
      </div>

      {/* ── Calendar grid ── */}
      <div className={s.grid}>
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const str     = toStr(year, month, d)
          const dis     = fromStr(str) < today
          const isStart = str === checkIn
          const isEnd   = str === checkOut
          const inRange = isInRange(str)
          const isTod   = str === todayStr

          return (
            <button
              key={str}
              disabled={dis}
              className={[
                s.day,
                dis                         ? s.dis   : '',
                isTod && !isStart && !isEnd ? s.tod   : '',
                isStart                     ? s.start : '',
                isEnd                       ? s.end   : '',
                inRange                     ? s.range : '',
              ].filter(Boolean).join(' ')}
              onClick={() => !dis && handleDay(str)}
              onMouseEnter={() => !dis && setHover(str)}
              onMouseLeave={() => setHover(null)}
              aria-label={`${d} ${MONTHS[month]} ${year}${isStart ? ' (check-in)' : ''}${isEnd ? ' (check-out)' : ''}`}
            >
              {d}
            </button>
          )
        })}
      </div>

      {/* ── Footer ── */}
      <div className={s.footer}>
        <button
          className={s.clearBtn}
          onClick={() => { onChange({ checkIn: '', checkOut: '' }); setPhase('in') }}
        >
          Clear
        </button>
        <button
          className={[s.doneBtn, (!checkIn || !checkOut) ? s.doneBtnDisabled : ''].join(' ')}
          disabled={!checkIn || !checkOut}
          onClick={onClose}
        >
          {checkIn && checkOut
            ? <><Check size={13}/> Done — {n} Night{n !== 1 ? 's' : ''}</>
            : 'Confirm Dates'
          }
        </button>
      </div>
    </div>
  )
}
