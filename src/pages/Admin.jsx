import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getBookings, getConsultations, getReviews,
  updateBookingStatus, updateConsultationStatus,
  deleteBooking, deleteConsultation, deleteReview,
} from '../hooks/useAdminStore'
import logoImg from '../assets/bp-logo.png'

const PASS = 'bafana2026'

/* ── Real-time sync: listens to localStorage changes from any tab/window
      and also polls every 3s so same-tab writes are caught immediately ── */
function useRealtimeData(getFn, key) {
  const [data, setData] = useState(() => getFn())
  const prev = useRef(JSON.stringify(getFn()))

  const refresh = useCallback(() => {
    const fresh = getFn()
    const freshStr = JSON.stringify(fresh)
    if (freshStr !== prev.current) {
      prev.current = freshStr
      setData(fresh)
    }
  }, [getFn])

  useEffect(() => {
    // Poll every 2 seconds to catch same-tab writes
    const interval = setInterval(refresh, 2000)
    // Also listen for cross-tab storage events
    const onStorage = (e) => { if (!key || e.key === key) refresh() }
    window.addEventListener('storage', onStorage)
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh, key])

  return [data, refresh]
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_COLORS = {
  New:        { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Contacted:  { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  Confirmed:  { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  Cancelled:  { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
  Published:  { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  Hidden:     { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
}

function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.New
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      padding: '2px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{status}</span>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: '#F3F4F6', border: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', fontSize: 20, color: '#D1D5DB',
      }}>—</div>
      <p style={{ fontSize: 15 }}>No {label} yet.</p>
      <p style={{ fontSize: 13, marginTop: 4 }}>They'll appear here once users submit.</p>
    </div>
  )
}

/* ── Bookings Tab ── */
function BookingsTab() {
  const [items, refresh] = useRealtimeData(getBookings, 'bp_bookings')
  const [expanded, setExpanded] = useState(null)

  const setStatus = (id, status) => { updateBookingStatus(id, status); refresh() }
  const remove = (id) => {
    if (!confirm('Delete this booking?')) return
    deleteBooking(id); refresh()
  }

  if (!items.length) return <EmptyState label="bookings" />

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>{items.length} booking{items.length !== 1 ? 's' : ''}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(b => (
          <div key={b.id} style={{
            background: '#fff', border: '1px solid #E5E7EB',
            borderRadius: 8, overflow: 'hidden',
          }}>
            {/* Row */}
            <div
              onClick={() => setExpanded(expanded === b.id ? null : b.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto auto',
                gap: 12, alignItems: 'center',
                padding: '14px 18px', cursor: 'pointer',
                background: expanded === b.id ? '#F9FAFB' : '#fff',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{b.name}</p>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{b.email}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#374151' }}>{b.room || '—'}</p>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{b.guests} guest{b.guests !== '1' ? 's' : ''}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#6B7280' }}>{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{fmt(b.submittedAt)}</p>
              </div>
              <Badge status={b.status} />
              <span style={{ fontSize: 18, color: '#9CA3AF', userSelect: 'none' }}>
                {expanded === b.id ? '▲' : '▼'}
              </span>
            </div>

            {/* Expanded */}
            {expanded === b.id && (
              <div style={{ padding: '14px 18px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[
                    ['Phone', b.phone],
                    ['Guests', b.guests],
                    ['Check-in', fmtDate(b.checkIn)],
                    ['Check-out', fmtDate(b.checkOut)],
                    ['Room', b.room],
                    ['Submitted', fmt(b.submittedAt)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em' }}>{k}</p>
                      <p style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{v || '—'}</p>
                    </div>
                  ))}
                </div>
                {b.message && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em' }}>Special Requests</p>
                    <p style={{ fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 1.6 }}>{b.message}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6B7280', marginRight: 4 }}>Status:</span>
                  {['New','Contacted','Confirmed','Cancelled'].map(s => (
                    <button key={s} onClick={() => setStatus(b.id, s)} style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: b.status === s ? '#1D4ED8' : '#F3F4F6',
                      color: b.status === s ? '#fff' : '#374151',
                      border: '1px solid ' + (b.status === s ? '#1D4ED8' : '#E5E7EB'),
                    }}>{s}</button>
                  ))}
                  <button onClick={() => remove(b.id)} style={{
                    marginLeft: 'auto', padding: '4px 12px', borderRadius: 6,
                    background: '#FEF2F2', color: '#B91C1C',
                    border: '1px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Consultations Tab ── */
function ConsultationsTab() {
  const [items, refresh] = useRealtimeData(getConsultations, 'bp_consultations')
  const [expanded, setExpanded] = useState(null)

  const setStatus = (id, status) => { updateConsultationStatus(id, status); refresh() }
  const remove = (id) => { if (!confirm('Delete this consultation?')) return; deleteConsultation(id); refresh() }

  if (!items.length) return <EmptyState label="consultations" />

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>{items.length} consultation{items.length !== 1 ? 's' : ''}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(b => (
          <div key={b.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <div
              onClick={() => setExpanded(expanded === b.id ? null : b.id)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto',
                gap: 12, alignItems: 'center',
                padding: '14px 18px', cursor: 'pointer',
                background: expanded === b.id ? '#F9FAFB' : '#fff',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{b.name}</p>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{b.email}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#374151' }}>{b.project || 'No room selected'}</p>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{b.phone}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#6B7280' }}>Visit: {fmtDate(b.visitDate)}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{fmt(b.submittedAt)}</p>
              </div>
              <Badge status={b.status} />
              <span style={{ fontSize: 18, color: '#9CA3AF', userSelect: 'none' }}>
                {expanded === b.id ? '▲' : '▼'}
              </span>
            </div>

            {expanded === b.id && (
              <div style={{ padding: '14px 18px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[
                    ['Phone', b.phone],
                    ['Room Type', b.project],
                    ['Visit Date', fmtDate(b.visitDate)],
                    ['Submitted', fmt(b.submittedAt)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em' }}>{k}</p>
                      <p style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{v || '—'}</p>
                    </div>
                  ))}
                </div>
                {b.message && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em' }}>Message</p>
                    <p style={{ fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 1.6 }}>{b.message}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6B7280', marginRight: 4 }}>Status:</span>
                  {['New','Contacted','Confirmed','Cancelled'].map(st => (
                    <button key={st} onClick={() => setStatus(b.id, st)} style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: b.status === st ? '#1D4ED8' : '#F3F4F6',
                      color: b.status === st ? '#fff' : '#374151',
                      border: '1px solid ' + (b.status === st ? '#1D4ED8' : '#E5E7EB'),
                    }}>{st}</button>
                  ))}
                  <button onClick={() => remove(b.id)} style={{
                    marginLeft: 'auto', padding: '4px 12px', borderRadius: 6,
                    background: '#FEF2F2', color: '#B91C1C',
                    border: '1px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Reviews Tab ── */
function ReviewsTab() {
  const [items, refresh] = useRealtimeData(getReviews, 'bp_reviews')
  const remove = (id) => { if (!confirm('Delete this review?')) return; deleteReview(id); refresh() }

  if (!items.length) return <EmptyState label="reviews" />

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>{items.length} review{items.length !== 1 ? 's' : ''}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(r => (
          <div key={r.id} style={{
            background: '#fff', border: '1px solid #E5E7EB',
            borderRadius: 8, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#1D4ED8', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{r.name}</p>
                    <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{ color: n <= r.rating ? '#F59E0B' : '#E5E7EB', fontSize: 14, lineHeight: 1 }}>&#9733;</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{r.text}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Submitted: {fmt(r.submittedAt)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <Badge status={r.status || 'Published'} />
                <button onClick={() => remove(r.id)} style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: '#FEF2F2', color: '#B91C1C',
                  border: '1px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main Admin Page ── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bp_admin') === '1')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('bookings')

  const [bookings]      = useRealtimeData(getBookings,      'bp_bookings')
  const [consultations] = useRealtimeData(getConsultations, 'bp_consultations')
  const [reviews]       = useRealtimeData(getReviews,       'bp_reviews')

  const counts = {
    bookings:      bookings.length,
    consultations: consultations.length,
    reviews:       reviews.length,
  }

  const login = (e) => {
    e.preventDefault()
    if (pass === PASS) { sessionStorage.setItem('bp_admin', '1'); setAuthed(true) }
    else { setErr('Incorrect password.'); setPass('') }
  }

  const logout = () => { sessionStorage.removeItem('bp_admin'); setAuthed(false) }

  /* ── Login Screen ── */
  if (!authed) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F9FAFB', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
        padding: '40px 36px', width: '100%', maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logoImg} alt="Bafana Pyramids" style={{ height: 72, width: 'auto', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Bafana Pyramids</h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Admin Dashboard</p>
        </div>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password" autoFocus required
              value={pass} onChange={e => { setPass(e.target.value); setErr('') }}
              placeholder="Enter admin password"
              style={{
                width: '100%', padding: '10px 14px', border: '1px solid ' + (err ? '#FCA5A5' : '#D1D5DB'),
                borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                background: err ? '#FEF2F2' : '#fff',
              }}
            />
            {err && <p style={{ fontSize: 12, color: '#B91C1C', marginTop: 6 }}>{err}</p>}
          </div>
          <button type="submit" style={{
            background: '#111827', color: '#fff', padding: '11px 0',
            borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>Sign In</button>
        </form>
        <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 20 }}>
          Bafana Pyramids Hotel · Private Access
        </p>
      </div>
    </div>
  )

  const TABS = [
    { key: 'bookings',      label: 'Bookings',      count: counts.bookings },
    { key: 'consultations', label: 'Consultations',  count: counts.consultations },
    { key: 'reviews',       label: 'Reviews',        count: counts.reviews },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoImg} alt="Bafana Pyramids" style={{ height: 40, width: 'auto' }} />
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Bafana Pyramids</span>
            <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#22C55E', display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(34,197,94,.25)',
            }}/>
            <span style={{ fontSize: 11, color: '#6B7280' }}>Live</span>
          </div>
        </div>
        <button onClick={logout} style={{
          fontSize: 13, color: '#6B7280', background: '#F3F4F6',
          border: '1px solid #E5E7EB', borderRadius: 6,
          padding: '6px 14px', cursor: 'pointer', fontWeight: 500,
        }}>Sign out</button>
      </div>

      {/* ── Summary cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        padding: '24px 24px 0', maxWidth: 960, margin: '0 auto',
      }}>
        {[
          { label: 'Total Bookings',  value: counts.bookings,      color: '#EFF6FF', border: '#BFDBFE', abbr: 'BK' },
          { label: 'Consultations',   value: counts.consultations,  color: '#F0FDF4', border: '#BBF7D0', abbr: 'CS' },
          { label: 'Guest Reviews',   value: counts.reviews,        color: '#FFFBEB', border: '#FDE68A', abbr: 'RV' },
        ].map(c => (
          <div key={c.label} style={{
            background: c.color, border: `1px solid ${c.border}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#fff', border: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11, color: '#6B7280',
              letterSpacing: '.04em', marginBottom: 10,
            }}>{c.abbr}</div>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>{c.value}</p>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs + Content ── */}
      <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 24px 48px' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #E5E7EB',
          marginBottom: 20, gap: 0,
        }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: 'none', border: 'none',
              borderBottom: tab === t.key ? '2px solid #111827' : '2px solid transparent',
              color: tab === t.key ? '#111827' : '#6B7280',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'color .15s',
            }}>
              {t.label}
              {t.count > 0 && (
                <span style={{
                  background: tab === t.key ? '#111827' : '#E5E7EB',
                  color: tab === t.key ? '#fff' : '#374151',
                  borderRadius: 20, fontSize: 11, fontWeight: 700,
                  padding: '1px 7px',
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === 'bookings'      && <BookingsTab />}
        {tab === 'consultations' && <ConsultationsTab />}
        {tab === 'reviews'       && <ReviewsTab />}
      </div>
    </div>
  )
}
