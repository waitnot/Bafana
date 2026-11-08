import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import s from './Contact.module.css'
import Calendar from '../components/Calendar'
import { saveConsultation } from '../hooks/useAdminStore'
import { postConsultation } from '../hooks/useApi'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', project:'', message:'', visitDate:'' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const onChange = e => setForm({...form, [e.target.name]: e.target.value})
  const onDateConfirm = (date) => {
    if (!date) { setForm(f => ({...f, visitDate:''})); return }
    const d = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    setForm(f => ({...f, visitDate: d}))
  }

  return (
    <>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
          <p className={s.breadcrumb}>Home · Contact</p>
          <h1 className={s.heroTitle}>Get In Touch</h1>
          <div className={s.heroRule}/>
          <p className={s.heroSub}>Our private consultants are ready to guide you.</p>
        </div>
      </div>

      <section className={s.section}>
        <div className={s.grid}>
          {/* Form */}
          <div className={s.formCol}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Send a Message</p>
            <h2 className={s.title}>Book a Consultation</h2>
            <div className={s.rule}/>

            {sent ? (
              <div className={s.success}>
                <p className={s.successTitle}>Thank you.</p>
                <p className={s.successBody}>Our team will be in touch within 24 hours.</p>
              </div>
            ) : (
              <form className={s.form} onSubmit={async e => {
                e.preventDefault()
                setSubmitting(true)
                setFormError('')
                try {
                  await postConsultation({ ...form })
                  saveConsultation({ ...form })
                  setSent(true)
                } catch (err) {
                  console.error('Consultation submit failed:', err)
                  setFormError('Something went wrong. Please try again or contact us directly by phone.')
                } finally {
                  setSubmitting(false)
                }
              }}>
                <div className={s.row2}>
                  <label className={s.field}>
                    <span className={s.lbl}>Full Name *</span>
                    <input name="name" type="text" required className={s.input} placeholder="Your name" value={form.name} onChange={onChange}/>
                  </label>
                  <label className={s.field}>
                    <span className={s.lbl}>Email Address *</span>
                    <input name="email" type="email" required className={s.input} placeholder="your@email.com" value={form.email} onChange={onChange}/>
                  </label>
                </div>
                <div className={s.row2}>
                  <label className={s.field}>
                    <span className={s.lbl}>Phone *</span>
                    <input name="phone" type="tel" required className={s.input} placeholder="+20 100 000 0000" value={form.phone} onChange={onChange}/>
                  </label>
                  <label className={s.field}>
                    <span className={s.lbl}>Room Type</span>
                    <select name="project" className={s.input} value={form.project} onChange={onChange}>
                      <option value="">Select a room type</option>
                      {['Standard Queen','Deluxe King Room','Deluxe Twin Room','Standard Triple Room','Executive Family Suite','Regal Executive Suite','Premium Pyramid Suite'].map(n=>(
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className={s.field}>
                  <span className={s.lbl}>Message</span>
                  <textarea name="message" rows={5} className={s.textarea} placeholder="Tell us about your requirements..." value={form.message} onChange={onChange}/>
                </label>

                {/* Visit Date Picker */}
                <div className={s.calWrap}>
                  <span className={s.lbl} style={{marginBottom:'14px',display:'block'}}>Preferred Visit Date</span>
                  <Calendar onConfirm={onDateConfirm} />
                </div>

                <button type="submit" className={s.submitBtn} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
                {formError && <p style={{ color:'#B91C1C', fontSize:13, marginTop:12, padding:'10px 14px', background:'#FEF2F2', borderRadius:6, border:'1px solid #FECACA' }}>{formError}</p>}
              </form>
            )}
          </div>

          {/* Info */}
          <div className={s.infoCol}>
            <div className={s.orn}><span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/></div>
            <p className={s.eyebrow}>Our Details</p>
            <h2 className={s.title}>Visit Us</h2>
            <div className={s.rule}/>
            <div className={s.infoList}>
              {[
                { icon:<MapPin size={16}/>, lbl:'Address', val:'Princess Street, Al Remaya,\nKafr Nassar, Al Haram,\nGiza Governorate 3515001', href: null },
                { icon:<Phone  size={16}/>, lbl:'Phone & WhatsApp', val:'+20 1034 962 229', href: 'https://wa.me/201034962229', isWA: true },
                { icon:<Mail   size={16}/>, lbl:'Email',        val:'info@bafanapyramidshotel.com',              href: 'mailto:info@bafanapyramidshotel.com' },
                { icon:<Clock  size={16}/>, lbl:'Hours', val:'Hotel Open 24/7\nOffice: 8:00 AM – 10:00 PM',               href: null },
              ].map((it,i) => (
                <div key={i} className={s.infoItem}>
                  <span className={s.infoIcon}>{it.icon}</span>
                  <div>
                    <p className={s.infoLbl}>{it.lbl}</p>
                    {it.href
                      ? <a href={it.href} target={it.isWA ? '_blank' : undefined} rel={it.isWA ? 'noopener noreferrer' : undefined} className={s.infoLink} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                          {it.isWA && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" style={{flexShrink:0}}>
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          )}
                          {it.val}
                          {it.isWA && <span style={{ fontSize:10, background:'#25D366', color:'#fff', padding:'2px 7px', borderRadius:20, fontWeight:600 }}>Chat</span>}
                        </a>
                      : <p className={s.infoVal} style={{ whiteSpace:'pre-line' }}>{it.val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
