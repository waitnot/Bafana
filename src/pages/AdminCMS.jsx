import { useState, useEffect, useCallback, useRef } from 'react'
import logoImg from '../assets/bp-logo.png'

// ── API base — update this to your cPanel domain ──
const API = 'https://www.bafanapyramidshotel.com/admin-api'
// For local testing: const API = 'http://localhost/admin-api'

const PASS = 'bafana2026' // local fallback admin

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

/* ── Login ── */
function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
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
        // fallback local auth
        if (user === 'admin' && pass === PASS) { onLogin('local'); return; }
        setErr(data.error || 'Invalid credentials')
      }
    } catch {
      // API not available — use local auth
      if (user === 'admin' && pass === PASS) { onLogin('local'); return; }
      setErr('Cannot connect to API. Using local mode.')
    } finally { setLoading(false) }
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
          {err && <p style={{ fontSize:12, color:'#B91C1C', margin:0 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ background:'#111827', color:'#fff', padding:'11px 0', borderRadius:8, fontSize:14, fontWeight:600, border:'none', cursor:'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Rooms Tab ── */
function RoomsTab({ token }) {
  const [rooms, setRooms]       = useState([])
  const [editing, setEditing]   = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [apiError, setApiError]   = useState('')
  const fileRef = useRef()

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  const load = useCallback(async () => {
    setApiError('')
    try {
      const r = await fetch(`${API}/rooms`, { headers })
      const text = await r.text()
      let d
      try { d = JSON.parse(text) } catch { setApiError(`API error: ${text.slice(0,200)}`); setRooms([]); return }
      if (!r.ok) { setApiError(`API error ${r.status}: ${d?.error||text.slice(0,100)}`); setRooms([]); return }
      setRooms(Array.isArray(d) ? d : [])
    } catch (e) { setApiError(`Cannot reach API: ${e.message}`); setRooms([]) }
  }, [token])

  const installDB = async () => {
    try {
      const r = await fetch(`${API}/install`, { headers })
      const d = await r.json()
      alert(d.message || d.error || 'Done')
      load()
    } catch (e) { alert('Install failed: ' + e.message) }
  }

  useEffect(() => { load() }, [load])

  const save = async () => {
    const method = editing.id ? 'PUT' : 'POST'
    const url    = editing.id ? `${API}/rooms?id=${editing.id}` : `${API}/rooms`
    await fetch(url, { method, headers, body: JSON.stringify(editing) })
    setEditing(null); load()
  }

  const deleteRoom = async (id) => {
    if (!confirm('Delete this room?')) return
    await fetch(`${API}/rooms?id=${id}`, { method:'DELETE', headers })
    load()
  }

  const uploadImage = async (roomId, file, isPrimary) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    fd.append('room_id', roomId)
    fd.append('is_primary', isPrimary ? 1 : 0)
    await fetch(`${API}/rooms?action=upload_image`, { method:'POST', headers:{ 'Authorization':`Bearer ${token}` }, body: fd })
    setUploading(false); load()
  }

  const deleteImage = async (imageId) => {
    if (!confirm('Delete image?')) return
    await fetch(`${API}/rooms?action=image&image_id=${imageId}`, { method:'DELETE', headers })
    load()
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:13, color:'#6B7280' }}>{rooms.length} rooms</p>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={installDB}
            style={{ background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE', padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
            ⚙ Setup DB
          </button>
          <button onClick={() => setEditing({ name:'', type:'', description:'', beds:'', area:'', perfect_for:'', sort_order:0 })}
            style={{ background:'#111827', color:'#fff', padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            + Add Room
          </button>
        </div>
      </div>

      {apiError && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#B91C1C' }}>
          <strong>Error:</strong> {apiError}
          <br/><span style={{ fontSize:11, marginTop:4, display:'block', color:'#9CA3AF' }}>Make sure admin-api/ is uploaded to cPanel and DB is installed. Click "⚙ Setup DB" above.</span>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:24, marginBottom:20 }}>
          <h3 style={{ margin:'0 0 16px', fontSize:16, color:'#111827' }}>{editing.id ? 'Edit Room' : 'New Room'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            {[['name','Room Name'],['type','Type/Tagline'],['beds','Beds'],['area','Area/Category'],['perfect_for','Perfect For'],['sort_order','Sort Order']].map(([k,l]) => (
              <label key={k} style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, fontWeight:600, color:'#6B7280' }}>
                {l}
                <input value={editing[k]||''} onChange={e=>setEditing({...editing,[k]:e.target.value})}
                  style={{ padding:'8px 12px', border:'1px solid #D1D5DB', borderRadius:6, fontSize:13, outline:'none' }} />
              </label>
            ))}
          </div>
          <label style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, fontWeight:600, color:'#6B7280', marginBottom:12 }}>
            Short Description
            <textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} rows={2}
              style={{ padding:'8px 12px', border:'1px solid #D1D5DB', borderRadius:6, fontSize:13, outline:'none', resize:'vertical' }} />
          </label>
          <label style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, fontWeight:600, color:'#6B7280', marginBottom:16 }}>
            Full Description
            <textarea value={editing.long_description||''} onChange={e=>setEditing({...editing,long_description:e.target.value})} rows={3}
              style={{ padding:'8px 12px', border:'1px solid #D1D5DB', borderRadius:6, fontSize:13, outline:'none', resize:'vertical' }} />
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={save} style={{ background:'#111827', color:'#fff', padding:'9px 24px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>Save</button>
            <button onClick={()=>setEditing(null)} style={{ background:'#F3F4F6', color:'#374151', padding:'9px 24px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Rooms list */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {rooms.map(r => (
          <div key={r.id} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, overflow:'hidden' }}>
            <div onClick={() => setExpanded(expanded===r.id?null:r.id)}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', cursor:'pointer', background: expanded===r.id?'#F9FAFB':'#fff' }}>
              {/* Primary image thumbnail */}
              {r.images?.find(i=>i.is_primary)
                ? <img src={r.images.find(i=>i.is_primary).url} alt={r.name} style={{ width:60, height:50, objectFit:'cover', borderRadius:4, flexShrink:0 }} />
                : <div style={{ width:60, height:50, background:'#F3F4F6', borderRadius:4, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#9CA3AF' }}>No img</div>
              }
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:14, color:'#111827', margin:0 }}>{r.name}</p>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{r.type} · {r.beds} · {r.images?.length||0} images</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={e=>{e.stopPropagation();setEditing(r)}} style={{ padding:'5px 12px', borderRadius:5, background:'#F3F4F6', border:'1px solid #E5E7EB', fontSize:12, cursor:'pointer' }}>Edit</button>
                <button onClick={e=>{e.stopPropagation();deleteRoom(r.id)}} style={{ padding:'5px 12px', borderRadius:5, background:'#FEF2F2', border:'1px solid #FECACA', color:'#B91C1C', fontSize:12, cursor:'pointer' }}>Delete</button>
              </div>
              <span style={{ fontSize:18, color:'#9CA3AF' }}>{expanded===r.id?'▲':'▼'}</span>
            </div>

            {expanded===r.id && (
              <div style={{ padding:'16px 18px', borderTop:'1px solid #F3F4F6', background:'#FAFAFA' }}>
                <p style={{ fontSize:12, fontWeight:700, color:'#6B7280', marginBottom:10, textTransform:'uppercase', letterSpacing:'.06em' }}>Images</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:14 }}>
                  {r.images?.map(img => (
                    <div key={img.id} style={{ position:'relative' }}>
                      <img src={img.url} alt="" style={{ width:100, height:80, objectFit:'cover', borderRadius:6, border: img.is_primary?'2px solid #B98941':'1px solid #E5E7EB' }} />
                      {img.is_primary && <span style={{ position:'absolute', top:4, left:4, background:'#B98941', color:'#fff', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:3 }}>PRIMARY</span>}
                      <button onClick={()=>deleteImage(img.id)}
                        style={{ position:'absolute', top:4, right:4, background:'rgba(185,28,28,.85)', color:'#fff', border:'none', borderRadius:'50%', width:18, height:18, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <input type="file" ref={fileRef} accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files[0]) uploadImage(r.id, e.target.files[0], r.images?.length===0) }} />
                  <button onClick={()=>fileRef.current.click()} disabled={uploading}
                    style={{ padding:'7px 16px', background:'#111827', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {uploading ? 'Uploading…' : '+ Upload Image'}
                  </button>
                  <span style={{ fontSize:11, color:'#9CA3AF' }}>First image uploaded becomes primary</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Gallery Tab ── */
function GalleryTab({ token }) {
  const [images, setImages]   = useState([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const headers = { 'Authorization': `Bearer ${token}` }

  const load = useCallback(async () => {
    try { const r = await fetch(`${API}/gallery`, { headers }); setImages(await r.json()) } catch { setImages([]) }
  }, [token])

  useEffect(() => { load() }, [load])

  const upload = async (file) => {
    setUploading(true)
    const fd = new FormData(); fd.append('image', file)
    await fetch(`${API}/gallery`, { method:'POST', headers, body: fd })
    setUploading(false); load()
  }

  const del = async (id) => {
    if (!confirm('Delete image?')) return
    await fetch(`${API}/gallery?id=${id}`, { method:'DELETE', headers: { ...headers, 'Content-Type':'application/json' } })
    load()
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <p style={{ fontSize:13, color:'#6B7280' }}>{images.length} gallery images</p>
        <div>
          <input type="file" ref={fileRef} accept="image/*" multiple style={{ display:'none' }} onChange={e => { [...e.target.files].forEach(f=>upload(f)) }} />
          <button onClick={()=>fileRef.current.click()} disabled={uploading}
            style={{ background:'#111827', color:'#fff', padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            {uploading ? 'Uploading…' : '+ Upload Images'}
          </button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:12 }}>
        {images.map(img => (
          <div key={img.id} style={{ position:'relative', borderRadius:8, overflow:'hidden', border:'1px solid #E5E7EB' }}>
            <img src={img.url} alt="" style={{ width:'100%', height:120, objectFit:'cover', display:'block' }} />
            <button onClick={()=>del(img.id)}
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
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  const heroFileRef = useRef()
  const heroMobileRef = useRef()

  const load = useCallback(async () => {
    try { const r = await fetch(`${API}/content`, { headers }); setContent(await r.json()) } catch {}
  }, [token])

  useEffect(() => { load() }, [load])

  const set = (section, key, val) => setContent(c => ({ ...c, [section]: { ...c[section], [key]: val } }))

  const saveAll = async () => {
    const updates = []
    Object.entries(content).forEach(([section, keys]) => {
      Object.entries(keys).forEach(([key, value]) => updates.push({ section, key, value }))
    })
    await fetch(`${API}/content`, { method:'PUT', headers, body: JSON.stringify({ updates }) })
    setSaved(true); setTimeout(()=>setSaved(false), 2000)
  }

  const uploadHero = async (file, type) => {
    const fd = new FormData(); fd.append('image', file); fd.append('type', type)
    await fetch(`${API}/content`, { method:'POST', headers:{ 'Authorization':`Bearer ${token}` }, body: fd })
    load()
  }

  const fields = [
    { section:'hero',    key:'desktop_title', label:'Hero Title' },
    { section:'hero',    key:'mobile_text',   label:'Mobile Hero Text' },
    { section:'about',   key:'tagline',        label:'About Tagline' },
    { section:'contact', key:'address',        label:'Address' },
    { section:'contact', key:'phone',          label:'Phone' },
    { section:'contact', key:'email',          label:'Email' },
    { section:'contact', key:'hours',          label:'Office Hours' },
    { section:'footer',  key:'tagline',        label:'Footer Tagline' },
  ]

  return (
    <div>
      {/* Hero images */}
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:20, marginBottom:20 }}>
        <p style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:16 }}>Hero Images</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {['desktop','mobile'].map(type => (
            <div key={type}>
              <p style={{ fontSize:12, fontWeight:600, color:'#6B7280', marginBottom:8, textTransform:'uppercase' }}>{type} Image</p>
              {content.hero?.[`${type}_image`] && <img src={content.hero[`${type}_image`]} alt="" style={{ width:'100%', height:100, objectFit:'cover', borderRadius:6, marginBottom:8 }} />}
              <input type="file" ref={type==='desktop'?heroFileRef:heroMobileRef} accept="image/*" style={{ display:'none' }}
                onChange={e=>{ if(e.target.files[0]) uploadHero(e.target.files[0], type) }} />
              <button onClick={()=>(type==='desktop'?heroFileRef:heroMobileRef).current.click()}
                style={{ padding:'7px 14px', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Change Image
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Text content */}
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
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  const load = useCallback(async () => {
    try { const r = await fetch(`${API}/bookings?type=${type}`, { headers }); const d = await r.json(); setItems(Array.isArray(d)?d:[]) } catch { setItems([]) }
  }, [token, type])

  useEffect(() => { load() }, [load])

  const setStatus = async (id, status) => {
    await fetch(`${API}/bookings?type=${type}&id=${id}`, { method:'PATCH', headers, body: JSON.stringify({ status }) })
    load()
  }
  const del = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`${API}/bookings?type=${type}&id=${id}`, { method:'DELETE', headers })
    load()
  }

  if (!items.length) return <div style={{ textAlign:'center', padding:'60px 20px', color:'#9CA3AF' }}><p>No {type} yet.</p></div>

  return (
    <div>
      <p style={{ fontSize:13, color:'#6B7280', marginBottom:16 }}>{items.length} {type}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map(b => (
          <div key={b.id} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, overflow:'hidden' }}>
            <div onClick={()=>setExpanded(expanded===b.id?null:b.id)}
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
                    <button key={s} onClick={()=>setStatus(b.id,s)} style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', background:b.status===s?'#1D4ED8':'#F3F4F6', color:b.status===s?'#fff':'#374151', border:`1px solid ${b.status===s?'#1D4ED8':'#E5E7EB'}` }}>{s}</button>
                  ))}
                  <button onClick={()=>del(b.id)} style={{ marginLeft:'auto', padding:'4px 12px', borderRadius:6, background:'#FEF2F2', color:'#B91C1C', border:'1px solid #FECACA', fontSize:12, fontWeight:600, cursor:'pointer' }}>Delete</button>
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
  const headers = { 'Authorization': `Bearer ${token}` }

  const install = async () => {
    setStatus('Installing...')
    try {
      const r = await fetch(`${API}/install`, { headers })
      const d = await r.json()
      setStatus(d.message || d.error || 'Done')
    } catch { setStatus('Error: Cannot connect to API') }
  }

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:24, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 12px', fontSize:16 }}>Database Setup</h3>
        <p style={{ fontSize:14, color:'#6B7280', marginBottom:16 }}>Run this once after uploading the admin-api folder to your cPanel hosting. It creates all required tables.</p>
        <button onClick={install} style={{ background:'#111827', color:'#fff', padding:'10px 24px', borderRadius:6, fontSize:14, fontWeight:600, border:'none', cursor:'pointer' }}>
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
        <p style={{ fontSize:12, color:'#9A3412', marginTop:12 }}>
          API URL: <code>{API}</code>
        </p>
      </div>
    </div>
  )
}

/* ── Main Admin CMS ── */
export default function AdminCMS() {
  const [token, setToken]   = useState(() => sessionStorage.getItem('cms_token') || '')
  const [tab, setTab]       = useState('rooms')

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
    { key:'rooms',         label:'Rooms' },
    { key:'gallery',       label:'Gallery' },
    { key:'content',       label:'Content' },
    { key:'bookings',      label:'Bookings' },
    { key:'consultations', label:'Consultations' },
    { key:'reviews',       label:'Reviews' },
    { key:'setup',         label:'Setup' },
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
        <button onClick={logout} style={{ fontSize:13, color:'#6B7280', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:6, padding:'6px 14px', cursor:'pointer' }}>Sign out</button>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid #E5E7EB', marginBottom:24, gap:0, overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              padding:'10px 18px', fontSize:14, fontWeight:600, cursor:'pointer', background:'none', border:'none', whiteSpace:'nowrap',
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
