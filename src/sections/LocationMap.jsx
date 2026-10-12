import s from './LocationMap.module.css'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function LocationMap() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.orn}>
          <span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/>
        </div>
        <p className={s.eyebrow}>Find Us</p>
        <h2 className={s.heading}>Our Location</h2>

        <div className={s.layout}>
          {/* Map embed */}
          <div className={s.mapWrap}>
            <iframe
              title="Bafana Pyramids Location"
              className={s.map}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.5!2d31.1342!3d29.9765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584587a5b1a7a5%3A0x0!2sPrincess+Street%2C+Giza+Governorate%2C+Egypt!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info panel */}
          <div className={s.info}>
            <div className={s.infoCard}>
              <div className={s.infoRow}>
                <div className={s.iconWrap}><MapPin size={18} /></div>
                <div>
                  <p className={s.infoLabel}>Address</p>
                  <p className={s.infoValue}>Princess Street<br/>Giza Governorate, Egypt</p>
                </div>
              </div>

              <div className={s.divider}/>

              <div className={s.infoRow}>
                <div className={s.iconWrap}><Phone size={18} /></div>
                <div>
                  <p className={s.infoLabel}>Phone</p>
                  <a href="tel:+201034962229" className={s.infoLink}>+20 1034 962 229</a>
                </div>
              </div>

              <div className={s.divider}/>

              <div className={s.infoRow}>
                <div className={s.iconWrap}><Mail size={18} /></div>
                <div>
                  <p className={s.infoLabel}>Email</p>
                  <a href="mailto:info@bafanapyramidshotel.com" className={s.infoLink}>
                    info@bafanapyramidshotel.com
                  </a>
                </div>
              </div>

              <div className={s.divider}/>

              <div className={s.infoRow}>
                <div className={s.iconWrap}><Clock size={18} /></div>
                <div>
                  <p className={s.infoLabel}>Office Hours</p>
                  <p className={s.infoValue}>Monday – Saturday<br/>9:00 AM – 7:00 PM</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Princess+Street,+Giza+Governorate,+Egypt"
                target="_blank"
                rel="noopener noreferrer"
                className={s.directionsBtn}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
