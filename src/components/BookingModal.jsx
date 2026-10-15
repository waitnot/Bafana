import { useState, useEffect } from 'react'
import { X, Calendar, Users, BedDouble, ChevronRight, Check, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'
import s from './BookingModal.module.css'
import { saveBooking } from '../hooks/useAdminStore'
import { postBooking } from '../hooks/useApi'

const roomTypes = [
  { id: 'sq',  label: 'Standard Double Room',     sub: 'Comfortable & Convenient' },
  { id: 'dk',  label: 'Deluxe Twin Room',           sub: 'Individual Comfort, Shared Experience' },
  { id: 'dt',  label: 'Deluxe Double Room',          sub: 'An Elevated Stay Experience' },
  { id: 'str', label: 'Standard Triple Room',        sub: 'More Room for Shared Memories' },
  { id: 'efs', label: 'Executive Family Suite',      sub: 'Togetherness Meets Comfort' },
  { id: 'res', label: 'Regal Executive Suite',       sub: 'Refined Comfort & Elegance' },
  { id: 'pps', label: 'Premium Pyramid Suite',       sub: 'An Experience Inspired by Egypt\'s Heritage' },
]

const STEPS = ['Your Details', 'Select Room', 'Confirm']

const STORAGE_KEY = 'bp_my_bookings'

function parseGuests(str) {
  if (!str) return '2'
  if (str.startsWith('5+')) return '5+'
  const match = str.match(/^(\d+)/)
  return match ? match[1] : '2'
}

function getMyBookings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

function saveMyBooking(booking) {
  const existing = getMyBookings()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...existing]))
}

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ── Confirm Dialog ── */
function ConfirmDialog({ form, selectedRoom, onConfirm, onCancel, loading }) {
  return (
    <div className={s.dialogBackdrop} onClick={onCancel}>
      <div className={s.dialog} onClick={e => e.stopPropagation()}>
        <div className={s.dialogIcon}><AlertCircle size={28}/></div>
        <h3 className={s.dialogTitle}>Confirm Your Booking</h3>
        <p className={s.dialogSub}>Are you sure you want to submit this booking request?</p>

        <div className={s.dialogCard}>
          <div className={s.dialogRow}><span>Name</span><strong>{form.name}</strong></div>
          <div className={s.dialogRow}><span>Room</span><strong>{selectedRoom?.label}</strong></div>
          <div className={s.dialogRow}><span>Check-in</span><strong>{fmtDate(form.checkIn)}</strong></div>
          <div className={s.dialogRow}><span>Check-out</span><strong>{fmtDate(form.checkOut)}</strong></div>
          <div className={s.dialogRow}><span>Guests</span><strong>{form.guests}</strong></div>
        </div>

        <div className={s.dialogActions}>
          <button className={s.dialogCancel} onClick={onCancel} disabled={loading}>
            Go Back
          </button>
          <button className={s.dialogConfirm} onClick={onConfirm} disabled={loading}>
            {loading ? 'Submitting…' : <><Check size={14}/> Yes, Confirm</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── My Bookings panel ── */
function MyBookings({ onClose }) {
  const [bookings, setBookings] = useState(getMyBookings())
  const [cancelId, setCancelId] = useState(null)

  const handleCancel = async (idx) => {
    const updated = bookings.map((b, i) =>
      i === idx ? { ...b, status: 'Cancelled', cancelledAt: new Date().toISOString() } : b
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setBookings(updated)
    setCancelId(null)

    // Update admin localStorage
    const adminBookings = JSON.parse(localStorage.getItem('bp_bookings') || '[]')
    const updatedAdmin = adminBookings.map(b =>
      b.name === bookings[idx].name && b.checkIn === bookings[idx].checkIn
        ? { ...b, status: 'Cancelled' }
        : b
    )
    localStorage.setItem('bp_bookings', JSON.stringify(updatedAdmin))

    // Update Neon DB via API
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookings[idx].name,
          checkIn: bookings[idx].checkIn,
          status: 'Cancelled',
        }),
      })
    } catch (e) { console.warn('API cancel failed:', e) }
  }

  return (
    <div className={s.myBookingsWrap}>
      <div className={s.myBookingsHeader}>
        <h3 className={s.myBookingsTitle}>My Bookings</h3>
        <button className={s.closeBtn} onClick={onClose} aria-label="Close"><X size={18}/></button>
      </div>
      {bookings.length === 0 ? (
        <div className={s.myBookingsEmpty}>
          <p>No bookings yet.</p>
          <span>Your confirmed bookings will appear here.</span>
        </div>
      ) : (
        <div className={s.myBookingsList}>
          {bookings.map((b, i) => (
            <div key={i} className={s.myBookingCard}>
              <div className={s.myBookingStatus}>
                <span className={[
                  s.myBookingBadge,
                  b.status === 'Cancelled' ? s.myBookingBadgeCancelled : ''
                ].join(' ')}>
                  {b.status || 'Submitted'}
                </span>
                <span className={s.myBookingDate}>{fmtDate(b.submittedAt)}</span>
              </div>
              <p className={s.myBookingRoom}>{b.room}</p>
              <div className={s.myBookingDates}>
                <span>{fmtDate(b.checkIn)}</span>
                <span className={s.myBookingArrow}>→</span>
                <span>{fmtDate(b.checkOut)}</span>
              </div>
              <div className={s.myBookingMeta}>
                <span>{b.guests} guest{b.guests !== '1' ? 's' : ''}</span>
                <span>·</span>
                <span>{b.name}</span>
              </div>

              {/* Cancel button — only for non-cancelled bookings */}
              {b.status !== 'Cancelled' && (
                cancelId === i ? (
                  <div className={s.cancelConfirm}>
                    <p className={s.cancelConfirmText}>Are you sure you want to cancel this booking?</p>
                    <div className={s.cancelConfirmActions}>
                      <button className={s.cancelNo} onClick={() => setCancelId(null)}>Keep Booking</button>
                      <button className={s.cancelYes} onClick={() => handleCancel(i)}>Yes, Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className={s.cancelBtn} onClick={() => setCancelId(i)}>
                    Cancel Booking
                  </button>
                )
              )}

              {b.status === 'Cancelled' && b.cancelledAt && (
                <p className={s.cancelledNote}>Cancelled on {fmtDate(b.cancelledAt)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BookingModal({ onClose, initialRoom = null, initialCheckIn = '', initialCheckOut = '', initialGuests = '' }) {
  const [step, setStep]             = useState(0)
  const [done, setDone]             = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [showMyBookings, setShowMyBookings] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    checkIn:  initialCheckIn,
    checkOut: initialCheckOut,
    guests:   parseGuests(initialGuests),
    room:     initialRoom || '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') { if (showConfirm) setShowConfirm(false); else onClose() } }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose, showConfirm])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.name.trim())    e.name     = 'Full name is required'
      if (!form.email.trim())   e.email    = 'Email address is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
      if (!form.phone.trim())   e.phone    = 'Phone number is required'
      if (!form.checkIn)        e.checkIn  = 'Check-in date is required'
      if (!form.checkOut)       e.checkOut = 'Check-out date is required'
      if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn)
        e.checkOut = 'Check-out must be after check-in'
    }
    if (step === 1) {
      if (!form.room) e.room = 'Please select a room type to continue'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  // Step 2 "Confirm Booking" → show confirm dialog first
  const handleSubmitClick = () => setShowConfirm(true)

  const handleConfirmed = async () => {
    setLoading(true)
    const payload = {
      name:       form.name,
      email:      form.email,
      phone:      form.phone,
      checkIn:    form.checkIn,
      checkOut:   form.checkOut,
      guests:     form.guests,
      room:       selectedRoom?.label || form.room,
      message:    form.message,
      submittedAt: new Date().toISOString(),
    }
    // 1. Save to user's localStorage (persists across refreshes)
    saveMyBooking(payload)
    // 2. Save to admin localStorage
    saveBooking(payload)
    // 3. Save to Neon DB
    try { await postBooking(payload) } catch (e) { console.warn('API save failed:', e) }
    setLoading(false)
    setShowConfirm(false)
    setDone(true)
  }

  const selectedRoom = roomTypes.find(r => r.id === form.room)
  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = form.checkIn
    ? new Date(new Date(form.checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  const myBookingsCount = getMyBookings().length

  return (
    <>
      <div className={s.backdrop} onClick={onClose}>
        <div className={s.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

          {/* ── Header ── */}
          <div className={s.header}>
            <div className={s.headerLeft}>
              <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
              <p className={s.eyebrow}>Bafana Pyramids Hotel</p>
              <h2 className={s.title}>{done ? 'Booking Received' : showMyBookings ? 'My Bookings' : 'Reserve Your Stay'}</h2>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {/* My Bookings toggle */}
              {!done && (
                <button
                  className={s.myBookingsBtn}
                  onClick={() => setShowMyBookings(v => !v)}
                  title="View my bookings"
                >
                  My Bookings {myBookingsCount > 0 && <span className={s.myBookingsBadge}>{myBookingsCount}</span>}
                </button>
              )}
              <button className={s.closeBtn} onClick={onClose} aria-label="Close"><X size={18}/></button>
            </div>
          </div>

          {/* ── My Bookings Panel ── */}
          {showMyBookings ? (
            <MyBookings onClose={() => setShowMyBookings(false)} />
          ) : (
            <>
              {/* ── Step indicator ── */}
              {!done && (
                <div className={s.steps}>
                  {STEPS.map((label, i) => (
                    <div key={i} className={[s.stepItem, i === step ? s.stepActive : i < step ? s.stepDone : ''].join(' ')}>
                      <span className={s.stepNum}>{i < step ? <Check size={12}/> : i + 1}</span>
                      <span className={s.stepLabel}>{label}</span>
                      {i < STEPS.length - 1 && <span className={s.stepLine}/>}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Success ── */}
              {done ? (
                <div className={s.success}>
                  <div className={s.successIcon}><Check size={28}/></div>
                  <h3 className={s.successTitle}>Your booking is confirmed.</h3>
                  <p className={s.successSub}>
                    Thank you, <strong>{form.name}</strong>. Our team will contact you at{' '}
                    <strong>{form.email}</strong> within 24 hours to finalise your reservation.
                  </p>
                  <div className={s.successCard}>
                    <div className={s.successRow}><span>Room</span><span>{selectedRoom?.label}</span></div>
                    <div className={s.successRow}><span>Check-in</span><span>{fmtDate(form.checkIn)}</span></div>
                    <div className={s.successRow}><span>Check-out</span><span>{fmtDate(form.checkOut)}</span></div>
                    <div className={s.successRow}><span>Guests</span><span>{form.guests}</span></div>
                  </div>
                  <div className={s.successContact}>
                    <a href="tel:+201034962229" className={s.successContactLink}><Phone size={13}/> +20 1034 962 229</a>
                    <a href="mailto:info@bafanapyramidshotel.com" className={s.successContactLink}><Mail size={13}/> info@bafanapyramidshotel.com</a>
                  </div>
                  <div style={{ display:'flex', gap:12, marginTop:8 }}>
                    <button className={s.myBookingsBtn} onClick={() => setShowMyBookings(true)}>View My Bookings</button>
                    <button className={s.doneBtn} onClick={onClose}>Close</button>
                  </div>
                </div>
              ) : (
                <div className={s.body}>

                  {/* Step 0 */}
                  {step === 0 && (
                    <div className={s.stepContent}>
                      <p className={s.stepHeading}>Your Details</p>
                      <p className={s.stepSub}>Tell us about yourself and your stay dates.</p>
                      <div className={s.grid2}>
                        <label className={s.field}>
                          <span className={s.lbl}>Full Name *</span>
                          <input className={[s.input, errors.name ? s.inputErr : ''].join(' ')}
                            type="text" placeholder="e.g. Ahmed Hassan"
                            value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name"/>
                          {errors.name && <span className={s.err}>{errors.name}</span>}
                        </label>
                        <label className={s.field}>
                          <span className={s.lbl}>Email Address *</span>
                          <input className={[s.input, errors.email ? s.inputErr : ''].join(' ')}
                            type="email" placeholder="your@email.com"
                            value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email"/>
                          {errors.email && <span className={s.err}>{errors.email}</span>}
                        </label>
                        <label className={s.field}>
                          <span className={s.lbl}>Phone Number *</span>
                          <input className={[s.input, errors.phone ? s.inputErr : ''].join(' ')}
                            type="tel" placeholder="+20 1034 962 229"
                            value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel"/>
                          {errors.phone && <span className={s.err}>{errors.phone}</span>}
                        </label>
                        <label className={s.field}>
                          <span className={s.lbl}>Number of Guests</span>
                          <div className={s.guestRow}>
                            {['1','2','3','4','5+'].map(g => (
                              <button key={g} type="button"
                                className={[s.guestBtn, form.guests === g ? s.guestBtnOn : ''].join(' ')}
                                onClick={() => set('guests', g)}>
                                <Users size={12}/> {g}
                              </button>
                            ))}
                          </div>
                        </label>
                      </div>
                      <div className={s.grid2}>
                        <label className={s.field}>
                          <span className={s.lbl}>Check-in Date *</span>
                          <div className={s.inputIcon}>
                            <Calendar size={15} className={s.fieldIcon}/>
                            <input className={[s.input, s.inputPadIcon, errors.checkIn ? s.inputErr : ''].join(' ')}
                              type="date" min={today} value={form.checkIn}
                              onChange={e => { set('checkIn', e.target.value); if (form.checkOut && e.target.value >= form.checkOut) set('checkOut', '') }}/>
                          </div>
                          {errors.checkIn && <span className={s.err}>{errors.checkIn}</span>}
                        </label>
                        <label className={s.field}>
                          <span className={s.lbl}>Check-out Date *</span>
                          <div className={s.inputIcon}>
                            <Calendar size={15} className={s.fieldIcon}/>
                            <input className={[s.input, s.inputPadIcon, errors.checkOut ? s.inputErr : ''].join(' ')}
                              type="date" min={minCheckOut} value={form.checkOut}
                              onChange={e => set('checkOut', e.target.value)}/>
                          </div>
                          {errors.checkOut && <span className={s.err}>{errors.checkOut}</span>}
                        </label>
                      </div>
                      <label className={s.field}>
                        <span className={s.lbl}>Special Requests</span>
                        <textarea className={s.textarea} rows={3}
                          placeholder="Early check-in, dietary requirements, special occasions..."
                          value={form.message} onChange={e => set('message', e.target.value)}/>
                      </label>
                    </div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <div className={s.stepContent}>
                      <p className={s.stepHeading}>Select Your Room</p>
                      <p className={s.stepSub}>Choose the room type for your stay.</p>
                      {form.room && (
                        <div className={s.preSelectedBanner}>
                          <Check size={14}/> <strong>{roomTypes.find(r => r.id === form.room)?.label}</strong> is selected — you can change it below
                        </div>
                      )}
                      {errors.room && <div className={s.roomError}>{errors.room}</div>}
                      <div className={s.roomGrid}>
                        {roomTypes.map(r => (
                          <button key={r.id} type="button"
                            className={[s.roomCard, form.room === r.id ? s.roomCardOn : ''].join(' ')}
                            onClick={() => set('room', r.id)} aria-pressed={form.room === r.id}>
                            <div className={s.roomCardLeft}><BedDouble size={18} className={s.roomIcon}/></div>
                            <div className={s.roomCardBody}>
                              <span className={s.roomLabel}>{r.label}</span>
                              <span className={s.roomSub}>{r.sub}</span>
                            </div>
                            {form.room === r.id && <span className={s.roomCheck}><Check size={14}/></span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className={s.stepContent}>
                      <p className={s.stepHeading}>Confirm Your Booking</p>
                      <p className={s.stepSub}>Please review your details before submitting.</p>
                      <div className={s.confirmCard}>
                        <div className={s.confirmSection}>
                          <p className={s.confirmSectionLabel}>Guest Information</p>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Name</span><span className={s.confirmVal}>{form.name}</span></div>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Email</span><span className={s.confirmVal}>{form.email}</span></div>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Phone</span><span className={s.confirmVal}>{form.phone}</span></div>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Guests</span><span className={s.confirmVal}>{form.guests}</span></div>
                        </div>
                        <div className={s.confirmDivider}/>
                        <div className={s.confirmSection}>
                          <p className={s.confirmSectionLabel}>Stay Details</p>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Room</span><span className={s.confirmVal}>{selectedRoom?.label}</span></div>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Check-in</span><span className={s.confirmVal}>{fmtDate(form.checkIn)}</span></div>
                          <div className={s.confirmRow}><span className={s.confirmLbl}>Check-out</span><span className={s.confirmVal}>{fmtDate(form.checkOut)}</span></div>
                        </div>
                        {form.message && (
                          <>
                            <div className={s.confirmDivider}/>
                            <div className={s.confirmSection}>
                              <p className={s.confirmSectionLabel}>Special Requests</p>
                              <p className={s.confirmNote} style={{marginTop:0}}>{form.message}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className={s.confirmContactBar}>
                        <MapPin size={13}/> Princess Street, Giza Governorate, Egypt
                        <span className={s.confirmContactSep}>·</span>
                        <Phone size={13}/> +20 1034 962 229
                        <span className={s.confirmContactSep}>·</span>
                        <Mail size={13}/> info@bafanapyramidshotel.com
                      </div>
                      <p className={s.confirmNote}>
                        Our team will contact you within 24 hours to confirm your reservation.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Footer ── */}
              {!done && (
                <div className={s.footer}>
                  {step > 0
                    ? <button className={s.backBtn} onClick={back}>← Back</button>
                    : <span/>
                  }
                  {step < STEPS.length - 1
                    ? <button className={s.nextBtn} onClick={next}>Continue <ChevronRight size={15}/></button>
                    : <button className={s.submitBtn} onClick={handleSubmitClick}>
                        Confirm Booking <Check size={15}/>
                      </button>
                  }
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      {showConfirm && (
        <ConfirmDialog
          form={form}
          selectedRoom={selectedRoom}
          onConfirm={handleConfirmed}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
    </>
  )
}
