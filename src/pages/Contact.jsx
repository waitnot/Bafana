import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import s from './Contact.module.css'
import Calendar from '../components/Calendar'
import { saveConsultation } from '../hooks/useAdminStore'
import { postConsultation } from '../hooks/useApi'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', project:'', message:'', visitDate:'' })
  const [sent, setSent] = useState(false)
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
                saveConsultation({ ...form })
                try { await postConsultation({ ...form }) } catch (err) { console.warn('API save failed:', err) }
                setSent(true)
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

                <button type="submit" className={s.submitBtn}>Send Message</button>
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
                { icon:<MapPin size={16}/>, lbl:'Address',      val:'Princess Street,\nGiza Governorate, Egypt', href: null },
                { icon:<Phone  size={16}/>, lbl:'Phone',        val:'+20 1034 962 229',                          href: 'tel:+201034962229' },
                { icon:<Mail   size={16}/>, lbl:'Email',        val:'info@bafanapyramidshotel.com',              href: 'mailto:info@bafanapyramidshotel.com' },
                { icon:<Clock  size={16}/>, lbl:'Office Hours', val:'Mon–Sat: 9:00 AM – 7:00 PM',               href: null },
              ].map((it,i) => (
                <div key={i} className={s.infoItem}>
                  <span className={s.infoIcon}>{it.icon}</span>
                  <div>
                    <p className={s.infoLbl}>{it.lbl}</p>
                    {it.href
                      ? <a href={it.href} className={s.infoLink}>{it.val}</a>
                      : <p className={s.infoVal}>{it.val}</p>
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
