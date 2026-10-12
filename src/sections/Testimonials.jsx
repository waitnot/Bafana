import { useState, useEffect } from 'react'
import { Star, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react'
import s from './Testimonials.module.css'
import { saveReview } from '../hooks/useAdminStore'
import { postReview, getGoogleReviews } from '../hooks/useApi'

const GOOGLE_LOGO = (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Ravi Sharma',
    initials: 'RS',
    color: '#4285F4',
    rating: 5,
    date: 'September 2026',
    text: 'Bafana Pyramids did not simply deliver a home — they delivered a way of life. Every surface, every detail speaks of a standard I have only encountered in the world\'s finest residences.',
    helpful: 12,
  },
  {
    id: 2,
    name: 'Priya Mehta',
    initials: 'PM',
    color: '#34A853',
    rating: 5,
    date: 'August 2026',
    text: 'From the first site visit to key handover, every step felt world-class. The quality of craftsmanship and the thoughtfulness of design is simply unmatched anywhere in Egypt.',
    helpful: 9,
  },
  {
    id: 3,
    name: 'Suresh Nair',
    initials: 'SN',
    color: '#EA4335',
    rating: 5,
    date: 'July 2026',
    text: 'An investment that has appreciated beautifully — and a home that our family cherishes more each year. Bafana Pyramids is the only name I trust.',
    helpful: 7,
  },
  {
    id: 4,
    name: 'Amira Hassan',
    initials: 'AH',
    color: '#FBBC05',
    rating: 5,
    date: 'June 2026',
    text: 'The attention to detail in every corner of the property is extraordinary. The lobby alone feels like a five-star hotel. Truly a landmark development for Egypt.',
    helpful: 14,
  },
]

function StarRating({ value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div className={s.stars} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={[s.starBtn, readOnly ? s.starReadOnly : ''].join(' ')}
          onClick={() => !readOnly && onChange && onChange(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          aria-label={`${n} star`}
          tabIndex={readOnly ? -1 : 0}
        >
          <Star
            size={readOnly ? 14 : 22}
            className={[
              s.star,
              (hover || value) >= n ? s.starFilled : s.starEmpty,
            ].join(' ')}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [voted, setVoted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const TRUNCATE = 160
  const long = review.text.length > TRUNCATE

  return (
    <div className={s.card}>
      <div className={s.cardTop}>
        {review.avatar
          ? <img src={review.avatar} alt={review.name} className={s.avatarImg} />
          : <div className={s.avatar} style={{ background: review.color }}>{review.initials}</div>
        }
        <div className={s.cardMeta}>
          <span className={s.reviewer}>{review.name}</span>
          <span className={s.reviewDate}>{review.date}</span>
        </div>
        <div className={s.gBadge} title="Google Review">
          {GOOGLE_LOGO}
        </div>
      </div>

      <StarRating value={review.rating} readOnly />

      <p className={s.reviewText}>
        {long && !expanded
          ? review.text.slice(0, TRUNCATE) + '…'
          : review.text}
        {long && (
          <button
            className={s.moreBtn}
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'Show less' : 'Show more'}
          >
            {expanded ? <><ChevronUp size={13}/> less</> : <><ChevronDown size={13}/> more</>}
          </button>
        )}
      </p>

      <div className={s.cardFooter}>
        <span className={s.helpfulLabel}>Helpful?</span>
        <button
          className={[s.helpfulBtn, voted ? s.helpfulVoted : ''].join(' ')}
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true) } }}
          aria-label="Mark as helpful"
          disabled={voted}
        >
          <ThumbsUp size={13} /> {helpful}
        </button>
      </div>
    </div>
  )
}

function WriteReviewForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) return setError('Please select a star rating.')
    if (!name.trim()) return setError('Please enter your name.')
    if (text.trim().length < 20) return setError('Please write at least 20 characters.')
    setError('')
    onSubmit({ name: name.trim(), rating, text: text.trim() })
    saveReview({ name: name.trim(), rating, text: text.trim() })
    try { await postReview({ name: name.trim(), rating, text: text.trim() }) } catch (e) { console.warn('API save failed:', e) }
    setDone(true)
    setTimeout(() => { setDone(false); setOpen(false); setRating(0); setName(''); setText('') }, 3000)
  }

  if (!open) {
    return (
      <button className={s.writeBtn} onClick={() => setOpen(true)}>
        {GOOGLE_LOGO}
        <span>Write a Review</span>
      </button>
    )
  }

  return (
    <div className={s.formWrap}>
      {done ? (
        <div className={s.formSuccess}>
          <Star size={28} className={s.starFilled} />
          <p>Thank you for your review!</p>
          <span>Your feedback helps future guests.</span>
        </div>
      ) : (
        <form className={s.form} onSubmit={handleSubmit} noValidate>
          <div className={s.formHeader}>
            <div className={s.gBadge}>{GOOGLE_LOGO}</div>
            <span className={s.formTitle}>Share your experience</span>
            <button type="button" className={s.closeForm} onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          <label className={s.label}>Your Rating *</label>
          <StarRating value={rating} onChange={setRating} />

          <label className={s.label} htmlFor="rev-name">Your Name *</label>
          <input
            id="rev-name"
            className={s.input}
            type="text"
            placeholder="e.g. Ahmed Hassan"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
          />

          <label className={s.label} htmlFor="rev-text">Your Review *</label>
          <textarea
            id="rev-text"
            className={s.textarea}
            placeholder="Tell us about your experience at Bafana Pyramids…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            maxLength={800}
          />
          <span className={s.charCount}>{text.length}/800</span>

          {error && <p className={s.formError}>{error}</p>}

          <div className={s.formActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className={s.submitBtn}>Post Review</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [googleAvg, setGoogleAvg] = useState(null)
  const [googleTotal, setGoogleTotal] = useState(null)

  // Fetch real Google reviews on mount
  useEffect(() => {
    getGoogleReviews()
      .then(data => {
        if (data?.reviews?.length) {
          const colors = ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#9C27B0', '#FF5722']
          const googleFormatted = data.reviews.map((r, i) => ({
            id:       `g_${r.id}`,
            name:     r.name,
            initials: r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2),
            color:    r.profilePhoto ? null : colors[i % colors.length],
            avatar:   r.profilePhoto || null,
            rating:   r.rating,
            date:     new Date(r.date).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            text:     r.text,
            helpful:  0,
            isGoogle: true,
          }))
          // Google reviews first, then local fallbacks
          setReviews(googleFormatted)
        }
        if (data?.summary) {
          setGoogleAvg(parseFloat(data.summary.averageRating).toFixed(1))
          setGoogleTotal(data.summary.totalReviews)
        }
      })
      .catch(() => {
        // API unavailable — keep initial reviews as fallback
      })
  }, [])

  const avg = googleAvg || (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
  const totalCount = googleTotal || reviews.length
  const dist = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100),
  }))

  function addReview({ name, rating, text }) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const colors = ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#9C27B0', '#FF5722']
    const color = colors[reviews.length % colors.length]
    const now = new Date()
    const date = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    setReviews(prev => [{ id: Date.now(), name, initials, color, rating, date, text, helpful: 0 }, ...prev])
  }

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.orn}>
          <span className={s.oLine}/><span className={s.oDot}/><span className={s.oLine}/>
        </div>
        <p className={s.eyebrow}>Guest Reviews</p>
        <h2 className={s.heading}>What Our Guests Say</h2>

        {/* Google-style summary bar */}
        <div className={s.summary}>
          <div className={s.summaryScore}>
            <span className={s.bigScore}>{avg}</span>
            <StarRating value={Math.round(avg)} readOnly />
            <span className={s.totalReviews}>{totalCount} reviews on Google</span>
            <div className={s.gPowered}>
              {GOOGLE_LOGO}
              <span>Powered by Google</span>
            </div>
          </div>
          <div className={s.summaryBars}>
            {dist.map(({ n, count, pct }) => (
              <div key={n} className={s.barRow}>
                <span className={s.barLabel}>{n} <Star size={11} className={s.starFilled}/></span>
                <div className={s.barTrack}>
                  <div className={s.barFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={s.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write review */}
        <div className={s.writeWrap}>
          <WriteReviewForm onSubmit={addReview} />
        </div>

        {/* Review cards grid */}
        <div className={s.grid}>
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      </div>
    </section>
  )
}
