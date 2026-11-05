/**
 * useAdminStore
 * Simple localStorage-backed store for admin submissions.
 * Keys:
 *   bp_bookings      — from BookingModal
 *   bp_consultations — from Contact page form
 *   bp_reviews       — from Testimonials write-a-review form
 */

export function saveBooking(data) {
  const existing = getBookings()
  const entry = {
    ...data,
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'New',
  }
  localStorage.setItem('bp_bookings', JSON.stringify([entry, ...existing]))
}

export function saveConsultation(data) {
  const existing = getConsultations()
  const entry = {
    ...data,
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'New',
  }
  localStorage.setItem('bp_consultations', JSON.stringify([entry, ...existing]))
}

export function saveReview(data) {
  const existing = getReviews()
  const entry = {
    ...data,
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'Published',
  }
  localStorage.setItem('bp_reviews', JSON.stringify([entry, ...existing]))
}

export function getBookings() {
  try { return JSON.parse(localStorage.getItem('bp_bookings')) || [] } catch { return [] }
}

export function getConsultations() {
  try { return JSON.parse(localStorage.getItem('bp_consultations')) || [] } catch { return [] }
}

export function getReviews() {
  try { return JSON.parse(localStorage.getItem('bp_reviews')) || [] } catch { return [] }
}

export function updateBookingStatus(id, status) {
  const items = getBookings().map(b => b.id === id ? { ...b, status } : b)
  localStorage.setItem('bp_bookings', JSON.stringify(items))
}

export function updateConsultationStatus(id, status) {
  const items = getConsultations().map(b => b.id === id ? { ...b, status } : b)
  localStorage.setItem('bp_consultations', JSON.stringify(items))
}

export function deleteBooking(id) {
  localStorage.setItem('bp_bookings', JSON.stringify(getBookings().filter(b => b.id !== id)))
}

export function deleteConsultation(id) {
  localStorage.setItem('bp_consultations', JSON.stringify(getConsultations().filter(b => b.id !== id)))
}

export function deleteReview(id) {
  localStorage.setItem('bp_reviews', JSON.stringify(getReviews().filter(b => b.id !== id)))
}
