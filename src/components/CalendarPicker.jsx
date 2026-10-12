import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import s from './CalendarPicker.module.css'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPicker({ value, onChange, minDate, label, onClose }) {
  const today = new Date()
  const initial = value ? new Date(value) : today
  const [viewYear,  setViewYear]  = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const selected = value ? new Date(value + 'T00:00:00') : null
  const min = minDate ? new Date(minDate + 'T00:00:00') : new Date(today.toDateString())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDay(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    const str = d.toISOString().split('T')[0]
    onChange(str)
    onClose()
  }

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    return d < min
  }

  const isSelected = (day) => {
    if (!selected) return false
    return selected.getFullYear() === viewYear &&
           selected.getMonth()    === viewMonth &&
           selected.getDate()     === day
  }

  const isToday = (day) => {
    return today.getFullYear() === viewYear &&
           today.getMonth()    === viewMonth &&
           today.getDate()     === day
  }

  // build calendar grid
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={s.cal}>
      <p className={s.calLabel}>{label}</p>

      {/* Month nav */}
      <div className={s.nav}>
        <button className={s.navBtn} onClick={prevMonth}><ChevronLeft size={15}/></button>
        <span className={s.navTitle}>{MONTHS[viewMonth]} {viewYear}</span>
        <button className={s.navBtn} onClick={nextMonth}><ChevronRight size={15}/></button>
      </div>

      {/* Day headers */}
      <div className={s.grid}>
        {DAYS.map(d => <span key={d} className={s.dayHead}>{d}</span>)}

        {/* Cells */}
        {cells.map((day, i) =>
          day === null
            ? <span key={`e-${i}`} />
            : (
              <button
                key={`d-${day}`}
                className={[
                  s.day,
                  isDisabled(day) ? s.dayDisabled : '',
                  isSelected(day) ? s.daySelected : '',
                  isToday(day) && !isSelected(day) ? s.dayToday : '',
                ].join(' ')}
                onClick={() => !isDisabled(day) && selectDay(day)}
                disabled={isDisabled(day)}
              >
                {day}
              </button>
            )
        )}
      </div>
    </div>
  )
}
