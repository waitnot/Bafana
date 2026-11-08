import { useState, useEffect, useCallback, useRef } from 'react'
import logoImg from '../assets/bp-logo.png'

// Static fallback images — same assets shown on the public site
// Keyed by sort_order (1-7) so each room shows its existing photos in the CMS
import sq1 from '../assets/rooms/standard-queen/bedroom-1.jpeg'
import sq2 from '../assets/rooms/standard-queen/bedroom-2.jpeg'
import sq3 from '../assets/rooms/standard-queen/bedroom-3.jpeg'
import dk1 from '../assets/rooms/deluxe-king/deluxe-king-1.jpg'
import dk2 from '../assets/rooms/deluxe-king/deluxe-king-2.jpg'
import dk3 from '../assets/rooms/deluxe-king/deluxe-king-3.jpg'
import dt1 from '../assets/rooms/deluxe-twin/deluxe-twin-1.jpg'
import dt2 from '../assets/rooms/deluxe-twin/deluxe-twin-2.jpg'
import dt3 from '../assets/rooms/deluxe-twin/deluxe-twin-3.jpg'
import st1 from '../assets/rooms/standard-triple/triple-1.jpg'
import st2 from '../assets/rooms/standard-triple/triple-2.jpg'
import st3 from '../assets/rooms/standard-triple/triple-3.jpg'
import ef1 from '../assets/rooms/executive-family-suite/exec-family-1.jpg'
import re1 from '../assets/rooms/regal-executive-suite/regal-1.jpg'
import re2 from '../assets/rooms/regal-executive-suite/regal-2.jpg'

const STATIC_ROOM_IMAGES = {
  1: [sq1, sq2, sq3],
  2: [dk1, dk2, dk3],
  3: [dt1, dt2, dt3],
  4: [st1, st2, st3],
  5: [ef1, '/rooms/executive-family-suite/exec-family-2.jpg?v=2026', '/rooms/executive-family-suite/exec-family-3.jpg?v=2026'],
  6: [re1, re2, '/rooms/regal-executive-suite/regal-3.jpg?v=2026', '/rooms/regal-executive-suite/regal-4.jpg?v=2026', '/rooms/regal-executive-suite/regal-5.jpg?v=2026'],
  7: ['/rooms/premium-pyramid-suite/pyramid-1.jpg?v=2026', '/rooms/premium-pyramid-suite/pyramid-2.jpg?v=2026', '/rooms/premium-pyramid-suite/pyramid-3.jpg?v=2026', '/rooms/premium-pyramid-suite/pyramid-4.jpg?v=2026', '/rooms/premium-pyramid-suite/pyramid-5.jpg?v=2026'],
}

const API = '/admin-api'

/* ── helpers ── */
function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
}
function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

const STATUS_COLORS = {
  New:       { bg:'#EFF6FF', color:'#1D4ED8', border:'#BFDBFE' },
  Contacted: { bg:'#F0FDF4', color:'#15803D', border:'#BBF7D0' },
  Confirmed: { bg:'#F0FDF4', color:'#15803D', border:'#BBF7D0' },
  Cancelled: { bg:'#FEF2F2', color:'#B91C1C', border:'#FECACA' },
  Published: { bg:'#F0FDF4', color:'#15803D', border:'#BBF7D0' },
  Hidden:    { bg:'#F9FAFB', color:'#6B7280', border:'#E5E7EB' },
}
function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.New
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.border}`, padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>{status}</span>
}

/* ── API call helper: always includes token in URL + Authorization header ── */
async function apiFetch(url, options = {}, token = '') {
  // Always add token to URL as fallback (handles Apache CGI stripping Authorization header)
  const sep = url.includes('?') ? '&' : '?'
  const fullUrl = `${url}${sep}token=${encodeURIComponent(token)}`
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  }
  const res = await fetch(fullUrl, { ...options, headers })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = { raw: text.slice(0, 300) } }
  return { ok: res.ok, status: res.status, data }
}

/* ── Login ── */
function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`${API}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      })
      const data = await res.json()
      if (data.token) {
        onLogin(data.token)
      } else {
        setErr(data.error || 'Invalid credentials')
      }
    } catch (e) {
      setErr(`Network error: ${e.message}. Check your connection.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F9FAFB', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'40px 36px', width:'100%', maxWidth:380, boxShadow:'0 4px 24px rgba(0,0,0,.08)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <img src={logoImg} alt="Bafana Pyramids" style={{ height:72, width:'auto', display:'block', margin:'0 auto 12px' }} />
          <h1 style={{ fontSize:20, fontWeight:700, color:'#111827', margin:0 }}>Bafana Pyramids</h1>
          <p style={{ fontSize:13, color:'#6B7280', marginTop:4 }}>Admin CMS</p>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <input type="text" placeholder="Username" value={user} onChange={e=>setUser(e.target.value)} required
            style={{ padding:'10px 14px', border:'1px solid #D1D5DB', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box', width:'100%' }} />
          <input type="password" placeholder="Password" value={pass} onChange={e=>{setPass(e.target.value);setErr('')}} required
            style={{ padding:'10px 14px', border:`1px solid ${err?'#FCA5A5':'#D1D5DB'}`, borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box', width:'100%' }} />
          {err && <p style={{ fontSize:12, color:'#B91C1C', margin:0, background:'#FEF2F2', padding:'8px 12px', borderRadius:6 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ background:'#111827', color:'#fff', padding:'11px 0', borderRadius:8, fontSize:14, fontWeight:600, border:'none', cursor:'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Toast notification ── */
function Toast({ msg, type }) {
  if (!msg) return null
  const bg = type === 'error' ? '#FEF2F2' : '#F0FDF4'
  const color = type === 'error' ? '#B91C1C' : '#15803D'
  const border = type === 'error' ? '#FECACA' : '#BBF7D0'
  return (
    <div style={{ position:'fixed', top:68, right:20, zIndex:9999, background:bg, border:`1px solid ${border}`, color, padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:600, boxShadow:'0 4px 12px rgba(0,0,0,.1)', maxWidth:400 }}>
      {msg}
    </div>
  )
}

/* ── Rooms Tab ── */
function RoomsTab({ token }) {
  const [rooms, setRooms]         = useState([])
  // openId: the room currently open for editing/image management (null = none)
  const [openId, setOpenId]       = useState(null)
  // editData: local copy of the room being edited
  const [editData, setEditData]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [toast, setToast]         = useState({ msg:'', type:'ok' })
  // Each room gets its own hidden file input via a ref callback map
  const fileInputRef = useRef(null)

  const jsonHeaders = { 'Content-Type': 'application/json' }

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg:'', type:'ok' }), 4000)
  }

  // Use a ref to track openId inside callbacks without re-creating load
  const openIdRef = useRef(openId)
  useEffect(() => { openIdRef.current = openId }, [openId])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { ok, status, data } = await apiFetch(`${API}/rooms`, {}, token)
      if (!ok) { showToast(`Load failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); setRooms([]); return }
      if (Array.isArray(data)) {
        setRooms(data)
        // Refresh editData images for currently open room
        const currentOpenId = openIdRef.current
        if (currentOpenId && currentOpenId !== 'new') {
          const fresh = data.find(r => r.id === currentOpenId)
          if (fresh) setEditData(prev => prev ? { ...prev, images: fresh.images || [] } : prev)
        }
      } else {
        setRooms([])
      }
    } catch (e) {
      showToast(`Cannot reach API: ${e.message}`, 'error')
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  // Open a room for editing
  const openRoom = (r) => {
    setOpenId(r.id)
    setEditData({ ...r, images: r.images || [] })
  }

  // Open "Add new room" form
  const openNew = () => {
    setOpenId('new')
    setEditData({ name:'', type:'', description:'', long_description:'', beds:'', area:'', perfect_for:'', highlights:'', sort_order:0, images:[] })
  }

  const closePanel = () => { setOpenId(null); setEditData(null) }

  const saveRoom = async () => {
    const isEdit = !!editData.id
    const url = isEdit ? `${API}/rooms?id=${editData.id}&_method=PUT` : `${API}/rooms`
    try {
      const { ok, status, data } = await apiFetch(url, { method:'POST', headers:jsonHeaders, body: JSON.stringify(editData) }, token)
      if (!ok) { showToast(`Save failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); return }
      showToast(isEdit ? '✓ Room updated!' : '✓ Room created!')
      if (!isEdit) closePanel()
      load()
    } catch (e) { showToast(`Save error: ${e.message}`, 'error') }
  }

  const deleteRoom = async (id, name) => {
    if (!confirm(`Delete "${name}"?\nThis will also delete all its images. Cannot be undone.`)) return
    try {
      const { ok, status, data } = await apiFetch(`${API}/rooms?id=${id}&_method=DELETE`, { method:'POST', headers:jsonHeaders }, token)
      if (!ok) { showToast(`Delete failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); return }
      showToast('Room deleted')
      if (openId === id) closePanel()
      load()
    } catch (e) { showToast(`Delete error: ${e.message}`, 'error') }
  }

  const uploadImage = async (roomId, file) => {
    if (!roomId || roomId === 'new') { showToast('Save the room first before uploading images.', 'error'); return }
    setUploading(true)
    try {
      const currentImages = editData?.images || []
      const isPrimary = currentImages.length === 0 ? 1 : 0

      // Convert file to base64 to bypass Cloudflare WAF which blocks multipart uploads
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result) // data URL: "data:image/jpeg;base64,..."
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const { ok, status, data } = await apiFetch(
        `${API}/rooms?action=upload_image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_id: roomId,
            is_primary: isPrimary,
            image_base64: base64,   // full data URL — PHP strips prefix
            mime: file.type,
          })
        },
        token
      )
      if (!ok) { showToast(`Upload failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); return }
      showToast('✓ Image uploaded!')
      load()
    } catch (e) { showToast(`Upload error: ${e.message}`, 'error') }
    finally { setUploading(false) }
  }

  const deleteImage = async (imageId) => {
    if (!confirm('Remove this image?')) return
    try {
      const { ok, status, data } = await apiFetch(
        `${API}/rooms?action=image&image_id=${imageId}&_method=DELETE`,
        { method:'POST', headers:jsonHeaders },
        token
      )
      if (!ok) { showToast(`Image delete failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); return }
      showToast('Image removed')
      load()
    } catch (e) { showToast(`Delete error: ${e.message}`, 'error') }
  }

  const makePrimary = async (imageId) => {
    try {
      const { ok, status, data } = await apiFetch(
        `${API}/rooms?action=set_primary&image_id=${imageId}`,
        { method:'POST', headers:jsonHeaders },
        token
      )
      if (!ok) { showToast(`Failed (${status}): ${data?.error || JSON.stringify(data)}`, 'error'); return }
      showToast('Primary image updated!')
      load()
    } catch (e) { showToast(`Error: ${e.message}`, 'error') }
  }

  const installDB = async () => {
    try {
      const { ok, data } = await apiFetch(`${API}/install`, {}, token)
      showToast(data.message || data.error || 'Done', ok ? 'ok' : 'error')
      load()
    } catch (e) { showToast('Install failed: ' + e.message, 'error') }
  }

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />

      {/* Header bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>{loading ? 'Loading…' : `${rooms.length} rooms`}</p>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={installDB}
            style={{ background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE', padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
            ⚙ Setup DB
          </button>
          <button onClick={openNew}
            style={{ background:'#111827', color:'#fff', padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            + Add Room
          </button>
        </div>
      </div>

      {/* ── Rooms list ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {rooms.map((r, idx) => {
          const isOpen = openId === r.id
          const primaryImg = (r.images||[]).find(i => i.is_primary) || (r.images||[])[0]

          return (
            <div key={r.id} style={{ border:'1px solid #E5E7EB', borderRadius:8, marginBottom:8, overflow:'hidden', background:'#fff' }}>

              {/* ── Collapsed row ── */}
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background: isOpen ? '#F9FAFB' : '#fff' }}>
                {/* Thumbnail */}
                {primaryImg
                  ? <img src={primaryImg.url} alt={r.name}
                      style={{ width:56, height:46, objectFit:'cover', borderRadius:4, flexShrink:0, border:'1px solid #E5E7EB' }} />
                  : <div style={{ width:56, height:46, background:'#F3F4F6', borderRadius:4, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#9CA3AF', textAlign:'center', lineHeight:1.3 }}>No<br/>image</div>
                }

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:14, color:'#111827', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</p>
                  <p style={{ fontSize:12, color:'#9CA3AF', margin:'2px 0 0' }}>
                    {r.type} · {r.beds}
                    <span style={{ marginLeft:8, padding:'1px 7px', borderRadius:10, fontSize:11, fontWeight:600,
                      background: (r.images||[]).length > 0 ? '#F0FDF4' : '#F9FAFB',
                      color: (r.images||[]).length > 0 ? '#15803D' : '#9CA3AF',
                      border: `1px solid ${(r.images||[]).length > 0 ? '#BBF7D0' : '#E5E7EB'}` }}>
                      {(r.images||[]).length} {(r.images||[]).length === 1 ? 'image' : 'images'}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button
                    onClick={() => isOpen ? closePanel() : openRoom(r)}
                    style={{ padding:'6px 14px', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer',
                      background: isOpen ? '#111827' : '#F3F4F6',
                      color: isOpen ? '#fff' : '#374151',
                      border: isOpen ? 'none' : '1px solid #E5E7EB' }}>
                    {isOpen ? '✕ Close' : '✏ Edit'}
                  </button>
                  <button
                    onClick={() => deleteRoom(r.id, r.name)}
                    style={{ padding:'6px 14px', borderRadius:6, background:'#FEF2F2', border:'1px solid #FECACA', color:'#B91C1C', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>

              {/* ── Expanded edit + image panel ── */}
              {isOpen && editData && (
                <div style={{ borderTop:'2px solid #111827', padding:'20px 20px 24px', background:'#FAFAFA' }}>

                  {/* SECTION: Details */}
                  <p style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 12px' }}>Room Details</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    {[['name','Room Name'],['type','Type/Tagline'],['beds','Beds'],['area','Category'],['perfect_for','Perfect For'],['sort_order','Sort Order']].map(([k,l]) => (
                      <label key={k} style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280' }}>
                        {l}
                        <input value={editData[k]||''} onChange={e => setEditData({...editData,[k]:e.target.value})}
                          style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none', background:'#fff' }} />
                      </label>
                    ))}
                  </div>
                  <label style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280', marginBottom:10 }}>
                    Short Description
                    <textarea value={editData.description||''} onChange={e => setEditData({...editData,description:e.target.value})} rows={2}
                      style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none', resize:'vertical', background:'#fff' }} />
                  </label>
                  <label style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280', marginBottom:16 }}>
                    Full Description
                    <textarea value={editData.long_description||''} onChange={e => setEditData({...editData,long_description:e.target.value})} rows={3}
                      style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none', resize:'vertical', background:'#fff' }} />
                  </label>
                  <div style={{ display:'flex', gap:8, marginBottom:24 }}>
                    <button onClick={saveRoom}
                      style={{ background:'#111827', color:'#fff', padding:'9px 22px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
                      ✓ Save Details
                    </button>
                    <button onClick={closePanel}
                      style={{ background:'#fff', color:'#6B7280', padding:'9px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'1px solid #E5E7EB', cursor:'pointer' }}>
                      Cancel
                    </button>
                  </div>

                  {/* SECTION: Images */}
                  {editData.id && (
                    <div style={{ borderTop:'1px solid #E5E7EB', paddingTop:20 }}>
                      <p style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 14px' }}>
                        Room Images
                        <span style={{ fontWeight:400, fontSize:11, textTransform:'none', letterSpacing:0, marginLeft:6 }}>
                          {(editData.images||[]).length > 0 ? `— ${(editData.images||[]).length} uploaded` : '— showing current website photos'}
                        </span>
                      </p>

                      {/* Static fallback: show current website photos when no DB images uploaded */}
                      {(editData.images||[]).length === 0 && (STATIC_ROOM_IMAGES[editData.sort_order]||[]).length > 0 && (
                        <div style={{ marginBottom:16 }}>
                          <p style={{ fontSize:11, color:'#B98941', fontWeight:600, margin:'0 0 10px', background:'#FFFBF5', padding:'8px 12px', borderRadius:6, border:'1px solid #F5E6C8' }}>
                            These are the current photos shown on your website. Upload new images below to replace them for this room.
                          </p>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                            {(STATIC_ROOM_IMAGES[editData.sort_order]||[]).map((src, ii) => (
                              <div key={ii} style={{ position:'relative', flexShrink:0 }}>
                                <img src={src} alt={`Website photo ${ii+1}`}
                                  style={{ width:130, height:100, objectFit:'cover', borderRadius:6, display:'block', border:'2px dashed #B98941' }} />
                                {ii === 0 && (
                                  <span style={{ position:'absolute', bottom:4, left:4, background:'#B98941', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:3 }}>
                                    WEBSITE
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DB-uploaded images */}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:14 }}>
                        {(editData.images||[]).map((img, ii) => (
                          <div key={img.id} style={{ position:'relative', flexShrink:0 }}>
                            <img src={img.url} alt={`Room image ${ii+1}`}
                              onError={e => { e.target.style.background='#F3F4F6' }}
                              style={{ width:130, height:100, objectFit:'cover', borderRadius:6, display:'block',
                                border: img.is_primary ? '3px solid #B98941' : '2px solid #E5E7EB', background:'#F3F4F6' }} />
                            {img.is_primary && (
                              <span style={{ position:'absolute', bottom:4, left:4, background:'#B98941', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:3 }}>PRIMARY</span>
                            )}
                            <div style={{ position:'absolute', top:4, right:4, display:'flex', gap:3 }}>
                              {!img.is_primary && (
                                <button title="Set as primary" onClick={() => makePrimary(img.id)}
                                  style={{ background:'rgba(185,133,65,.9)', color:'#fff', border:'none', borderRadius:4, width:22, height:22, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  &#9733;
                                </button>
                              )}
                              <button title="Remove" onClick={() => deleteImage(img.id)}
                                style={{ background:'rgba(0,0,0,.7)', color:'#fff', border:'none', borderRadius:4, width:22, height:22, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                &#x2715;
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Upload slot */}
                        <label style={{ width:130, height:100, borderRadius:6,
                          border: uploading ? '2px dashed #9CA3AF' : '2px dashed #B98941',
                          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                          cursor: uploading ? 'wait' : 'pointer', background:'#FFFBF5',
                          color: uploading ? '#9CA3AF' : '#B98941', flexShrink:0, userSelect:'none' }}>
                          <span style={{ fontSize:28, fontWeight:300, lineHeight:1 }}>{uploading ? '...' : '+'}</span>
                          <span style={{ fontSize:10, marginTop:4, textAlign:'center', lineHeight:1.4, fontWeight:600 }}>
                            {uploading ? 'Uploading' : 'Upload Image'}
                          </span>
                          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                            style={{ display:'none' }} disabled={uploading}
                            onChange={e => { if (e.target.files[0]) { uploadImage(editData.id, e.target.files[0]); e.target.value='' } }} />
                        </label>
                      </div>
                      <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>JPG / PNG / WEBP &nbsp;|&nbsp; Once uploaded, these images replace the static photos on the website.</p>
                    </div>
                  )}
                  {!editData.id && (
                    <p style={{ fontSize:12, color:'#9CA3AF', borderTop:'1px solid #E5E7EB', paddingTop:16 }}>Save the room first, then you can upload images.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Add New Room form (appears at bottom) ── */}
      {openId === 'new' && editData && (
        <div style={{ border:'2px dashed #111827', borderRadius:8, padding:'20px', background:'#fff', marginTop:8 }}>
          <p style={{ fontSize:13, fontWeight:700, color:'#111827', margin:'0 0 16px' }}>+ New Room</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            {[['name','Room Name'],['type','Type/Tagline'],['beds','Beds'],['area','Category'],['perfect_for','Perfect For'],['sort_order','Sort Order']].map(([k,l]) => (
              <label key={k} style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280' }}>
                {l}
                <input value={editData[k]||''} onChange={e => setEditData({...editData,[k]:e.target.value})}
                  style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none' }} />
              </label>
            ))}
          </div>
          <label style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280', marginBottom:10 }}>
            Short Description
            <textarea value={editData.description||''} onChange={e => setEditData({...editData,description:e.target.value})} rows={2}
              style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none', resize:'vertical' }} />
          </label>
          <label style={{ display:'flex', flexDirection:'column', gap:3, fontSize:11, fontWeight:600, color:'#6B7280', marginBottom:16 }}>
            Full Description
            <textarea value={editData.long_description||''} onChange={e => setEditData({...editData,long_description:e.target.value})} rows={3}
              style={{ padding:'7px 10px', border:'1px solid #D1D5DB', borderRadius:5, fontSize:13, outline:'none', resize:'vertical' }} />
          </label>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={saveRoom}
              style={{ background:'#111827', color:'#fff', padding:'9px 22px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
              ✓ Create Room
            </button>
            <button onClick={closePanel}
              style={{ background:'#fff', color:'#6B7280', padding:'9px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'1px solid #E5E7EB', cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Gallery Tab ── */
function GalleryTab({ token }) {
  const [images, setImages]       = useState([])
  const [uploading, setUploading] = useState(false)
  const [toast, setToast]         = useState({ msg:'', type:'ok' })
  const fileRef = useRef()

  const showToast = (msg, type='ok') => { setToast({msg,type}); setTimeout(()=>setToast({msg:'',type:'ok'}),4000) }

  const load = useCallback(async () => {
    try {
      const { ok, data } = await apiFetch(`${API}/gallery`, {}, token)
      setImages(Array.isArray(data) ? data : [])
    } catch { setImages([]) }
  }, [token])

  useEffect(() => { load() }, [load])

  const upload = async (file) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('image', file)
      const { ok, status, data } = await apiFetch(`${API}/gallery`, { method:'POST', body: fd }, token)
      if (!ok) { showToast(`Upload failed (${status}): ${data?.error || ''}`, 'error'); return }
      showToast('Image uploaded!')
      load()
    } catch (e) { showToast('Upload error: ' + e.message, 'error') }
    finally { setUploading(false) }
  }

  const del = async (id) => {
    if (!confirm('Delete image?')) return
    try {
      const { ok, status, data } = await apiFetch(`${API}/gallery?id=${id}&_method=DELETE`, { method:'POST', headers:{'Content-Type':'application/json'} }, token)
      if (!ok) { showToast(`Delete failed (${status}): ${data?.error || ''}`, 'error'); return }
      showToast('Image deleted')
      load()
    } catch (e) { showToast('Delete error: ' + e.message, 'error') }
  }

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:13, color:'#6B7280' }}>{images.length} gallery images</p>
        <div>
          <input type="file" ref={fileRef} accept="image/*" multiple style={{ display:'none' }}
            onChange={e => { [...e.target.files].forEach(f=>upload(f)); e.target.value='' }} />
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            style={{ background:'#111827', color:'#fff', padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            {uploading ? '⏳ Uploading…' : '+ Upload Images'}
          </button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:12 }}>
        {images.map(img => (
          <div key={img.id} style={{ position:'relative', borderRadius:8, overflow:'hidden', border:'1px solid #E5E7EB' }}>
            <img src={img.url} alt="" style={{ width:'100%', height:120, objectFit:'cover', display:'block' }} />
            <button onClick={() => del(img.id)}
              style={{ position:'absolute', top:6, right:6, background:'rgba(185,28,28,.85)', color:'#fff', border:'none', borderRadius:'50%', width:22, height:22, fontSize:12, cursor:'pointer' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Content Tab ── */
function ContentTab({ token }) {
  const [content, setContent] = useState({})
  const [saved, setSaved]     = useState(false)
  const [toast, setToast]     = useState({ msg:'', type:'ok' })
  const heroFileRef  = useRef()
  const heroMobileRef = useRef()

  const showToast = (msg, type='ok') => { setToast({msg,type}); setTimeout(()=>setToast({msg:'',type:'ok'}),4000) }

  const load = useCallback(async () => {
    try {
      const { ok, data } = await apiFetch(`${API}/content`, {}, token)
      if (ok && typeof data === 'object') setContent(data)
    } catch {}
  }, [token])

  useEffect(() => { load() }, [load])

  const set = (section, key, val) => setContent(c => ({ ...c, [section]: { ...c[section], [key]: val } }))

  const saveAll = async () => {
    const updates = []
    Object.entries(content).forEach(([section, keys]) => {
      if (typeof keys === 'object') {
        Object.entries(keys).forEach(([key, value]) => updates.push({ section, key, value }))
      }
    })
    try {
      const { ok, status, data } = await apiFetch(
        `${API}/content?_method=PUT`,
        { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ updates }) },
        token
      )
      if (!ok) { showToast(`Save failed (${status}): ${data?.error || ''}`, 'error'); return }
      setSaved(true); setTimeout(()=>setSaved(false), 2000)
    } catch (e) { showToast('Save error: ' + e.message, 'error') }
  }

  const uploadHero = async (file, type) => {
    try {
      const fd = new FormData(); fd.append('image', file); fd.append('type', type)
      const { ok, status, data } = await apiFetch(`${API}/content`, { method:'POST', body: fd }, token)
      if (!ok) { showToast(`Upload failed (${status}): ${data?.error || ''}`, 'error'); return }
      showToast('Hero image updated!')
      load()
    } catch (e) { showToast('Upload error: ' + e.message, 'error') }
  }

  const fields = [
    { section:'hero',    key:'desktop_title', label:'Hero Title' },
    { section:'hero',    key:'mobile_text',   label:'Mobile Hero Text' },
    { section:'about',   key:'tagline',       label:'About Tagline' },
    { section:'contact', key:'address',       label:'Address' },
    { section:'contact', key:'phone',         label:'Phone' },
    { section:'contact', key:'email',         label:'Email' },
    { section:'contact', key:'hours',         label:'Office Hours' },
    { section:'footer',  key:'tagline',       label:'Footer Tagline' },
  ]

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:20, marginBottom:20 }}>
        <p style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:16 }}>Hero Images</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {['desktop','mobile'].map(type => (
            <div key={type}>
              <p style={{ fontSize:12, fontWeight:600, color:'#6B7280', marginBottom:8, textTransform:'uppercase' }}>{type} Image</p>
              {content.hero?.[`${type}_image`] && <img src={content.hero[`${type}_image`]} alt="" style={{ width:'100%', height:100, objectFit:'cover', borderRadius:6, marginBottom:8 }} />}
              <input type="file" ref={type==='desktop'?heroFileRef:heroMobileRef} accept="image/*" style={{ display:'none' }}
                onChange={e=>{ if(e.target.files[0]) uploadHero(e.target.files[0], type) }} />
              <button onClick={() => (type==='desktop'?heroFileRef:heroMobileRef).current.click()}
                style={{ padding:'7px 14px', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Change Image
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:20, marginBottom:20 }}>
        <p style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:16 }}>Site Content</p>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {fields.map(({ section, key, label }) => (
            <label key={`${section}-${key}`} style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, fontWeight:600, color:'#6B7280' }}>
              {label}
              <textarea value={content[section]?.[key]||''} onChange={e=>set(section,key,e.target.value)} rows={2}
                style={{ padding:'8px 12px', border:'1px solid #D1D5DB', borderRadius:6, fontSize:13, outline:'none', resize:'vertical' }} />
            </label>
          ))}
        </div>
      </div>
      <button onClick={saveAll}
        style={{ background: saved?'#15803D':'#111827', color:'#fff', padding:'11px 32px', borderRadius:8, fontSize:14, fontWeight:600, border:'none', cursor:'pointer', transition:'background .3s' }}>
        {saved ? '✓ Saved!' : 'Save All Changes'}
      </button>
    </div>
  )
}

/* ── Bookings Tab ── */
function BookingsTab({ token, type }) {
  const [items, setItems]       = useState([])
  const [expanded, setExpanded] = useState(null)
  const [toast, setToast]       = useState({ msg:'', type:'ok' })

  const showToast = (msg, t='ok') => { setToast({msg,type:t}); setTimeout(()=>setToast({msg:'',type:'ok'}),4000) }

  const load = useCallback(async () => {
    try {
      const { ok, data } = await apiFetch(`${API}/bookings?type=${type}`, {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch { setItems([]) }
  }, [token, type])

  useEffect(() => { load() }, [load])

  const setStatus = async (id, status) => {
    try {
      const { ok, data } = await apiFetch(
        `${API}/bookings?type=${type}&id=${id}&_method=PATCH`,
        { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) },
        token
      )
      if (!ok) { showToast('Status update failed: ' + (data?.error||''), 'error'); return }
      showToast('Status updated')
      load()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return
    try {
      const { ok, data } = await apiFetch(
        `${API}/bookings?type=${type}&id=${id}&_method=DELETE`,
        { method:'POST', headers:{'Content-Type':'application/json'} },
        token
      )
      if (!ok) { showToast('Delete failed: ' + (data?.error||''), 'error'); return }
      showToast('Deleted')
      load()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  if (!items.length) return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'#9CA3AF' }}>
      <Toast msg={toast.msg} type={toast.type} />
      <p>No {type} yet.</p>
    </div>
  )

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />
      <p style={{ fontSize:13, color:'#6B7280', marginBottom:16 }}>{items.length} {type}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map(b => (
          <div key={b.id} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, overflow:'hidden' }}>
            <div onClick={() => setExpanded(expanded===b.id?null:b.id)}
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto auto', gap:12, alignItems:'center', padding:'14px 18px', cursor:'pointer', background:expanded===b.id?'#F9FAFB':'#fff' }}>
              <div>
                <p style={{ fontWeight:600, fontSize:14, color:'#111827', margin:0 }}>{b.name}</p>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{b.email}</p>
              </div>
              <div>
                <p style={{ fontSize:13, color:'#374151', margin:0 }}>{b.room || b.project || '—'}</p>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{b.phone}</p>
              </div>
              <div>
                <p style={{ fontSize:12, color:'#6B7280', margin:0 }}>{fmtDate(b.check_in||b.visit_date)} {b.check_out?`→ ${fmtDate(b.check_out)}`:''}</p>
                <p style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{fmt(b.submitted_at)}</p>
              </div>
              <Badge status={b.status} />
              <span style={{ fontSize:18, color:'#9CA3AF', userSelect:'none' }}>{expanded===b.id?'▲':'▼'}</span>
            </div>
            {expanded===b.id && (
              <div style={{ padding:'14px 18px', borderTop:'1px solid #F3F4F6', background:'#FAFAFA' }}>
                {b.message && <p style={{ fontSize:13, color:'#374151', marginBottom:14, lineHeight:1.6 }}>{b.message}</p>}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#6B7280' }}>Status:</span>
                  {['New','Contacted','Confirmed','Cancelled'].map(s => (
                    <button key={s} onClick={() => setStatus(b.id, s)}
                      style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', background:b.status===s?'#1D4ED8':'#F3F4F6', color:b.status===s?'#fff':'#374151', border:`1px solid ${b.status===s?'#1D4ED8':'#E5E7EB'}` }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => del(b.id)}
                    style={{ marginLeft:'auto', padding:'4px 12px', borderRadius:6, background:'#FEF2F2', color:'#B91C1C', border:'1px solid #FECACA', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Setup Tab ── */
function SetupTab({ token }) {
  const [status, setStatus] = useState('')

  const install = async () => {
    setStatus('Installing…')
    try {
      const { ok, data } = await apiFetch(`${API}/install`, {}, token)
      setStatus(data.message || data.error || 'Done')
    } catch (e) { setStatus('Error: ' + e.message) }
  }

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:24, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 12px', fontSize:16 }}>Database Setup</h3>
        <p style={{ fontSize:14, color:'#6B7280', marginBottom:16 }}>Run this once to create all required tables and seed default rooms.</p>
        <button onClick={install}
          style={{ background:'#111827', color:'#fff', padding:'10px 24px', borderRadius:6, fontSize:14, fontWeight:600, border:'none', cursor:'pointer' }}>
          Run Database Install
        </button>
        {status && <p style={{ marginTop:12, fontSize:13, color: status.includes('Error')?'#B91C1C':'#15803D' }}>{status}</p>}
      </div>
      <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:10, padding:24 }}>
        <h3 style={{ margin:'0 0 12px', fontSize:16, color:'#C2410C' }}>Setup Instructions</h3>
        <ol style={{ fontSize:13, color:'#374151', lineHeight:2, paddingLeft:20 }}>
          <li>Upload the <code>admin-api/</code> folder to your cPanel <code>public_html/</code></li>
          <li>Edit <code>admin-api/config.php</code> — fill in your MySQL credentials</li>
          <li>Visit this Setup tab and click <strong>Run Database Install</strong></li>
          <li>Your admin is ready — manage rooms, gallery and content here</li>
        </ol>
        <p style={{ fontSize:12, color:'#9A3412', marginTop:12 }}>API URL: <code>{API}</code></p>
      </div>
    </div>
  )
}

/* ── Main Admin CMS ── */
export default function AdminCMS() {
  const [token, setToken] = useState(() => {
    const t = sessionStorage.getItem('cms_token') || ''
    // Clear stale 'local' tokens — they bypass API and cause 401 on all operations
    if (t === 'local') { sessionStorage.removeItem('cms_token'); return '' }
    return t
  })
  const [tab, setTab] = useState('rooms')

  const login = (t) => {
    sessionStorage.setItem('cms_token', t)
    setToken(t)
  }
  const logout = () => {
    sessionStorage.removeItem('cms_token')
    setToken('')
  }

  if (!token) return <Login onLogin={login} />

  const TABS = [
    { key:'rooms',         label:'🛏 Rooms' },
    { key:'gallery',       label:'🖼 Gallery' },
    { key:'content',       label:'📝 Content' },
    { key:'bookings',      label:'📅 Bookings' },
    { key:'consultations', label:'📞 Consultations' },
    { key:'reviews',       label:'⭐ Reviews' },
    { key:'setup',         label:'⚙ Setup' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB', fontFamily:'system-ui,sans-serif' }}>
      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src={logoImg} alt="Bafana Pyramids" style={{ height:38, width:'auto' }} />
          <div>
            <span style={{ fontSize:15, fontWeight:700, color:'#111827' }}>Bafana Pyramids</span>
            <span style={{ fontSize:12, color:'#9CA3AF', marginLeft:8 }}>CMS</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginLeft:8 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E', display:'inline-block' }}/>
            <span style={{ fontSize:11, color:'#6B7280' }}>Live</span>
          </div>
        </div>
        <button onClick={logout}
          style={{ fontSize:13, color:'#6B7280', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:6, padding:'6px 14px', cursor:'pointer' }}>
          Sign out
        </button>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid #E5E7EB', marginBottom:24, overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:'10px 16px', fontSize:13, fontWeight:600, cursor:'pointer', background:'none', border:'none', whiteSpace:'nowrap',
              borderBottom: tab===t.key?'2px solid #111827':'2px solid transparent',
              color: tab===t.key?'#111827':'#6B7280',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'rooms'         && <RoomsTab token={token} />}
        {tab === 'gallery'       && <GalleryTab token={token} />}
        {tab === 'content'       && <ContentTab token={token} />}
        {tab === 'bookings'      && <BookingsTab token={token} type="bookings" />}
        {tab === 'consultations' && <BookingsTab token={token} type="consultations" />}
        {tab === 'reviews'       && <BookingsTab token={token} type="reviews" />}
        {tab === 'setup'         && <SetupTab token={token} />}
      </div>
    </div>
  )
}
