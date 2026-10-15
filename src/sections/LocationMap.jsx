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
              title="Bafana Pyramids Hotel Location"
              className={s.map}
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDgOe4Hu1blqBK1QgII7LIWzdScL0m3OwA&q=Bafana+Pyramids+Hotel+%26+Spa,Princes+Street,Al+Remaya,Giza,Egypt&zoom=16"
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
                href="https://maps.app.goo.gl/1WhFW9w8gx1xs7dL6"
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
