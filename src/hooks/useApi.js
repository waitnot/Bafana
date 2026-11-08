/**
 * API helper — posts to PHP/MySQL backend at /admin-api
 * Previously pointed at /api/* (Vercel/Neon) — now fixed to use the cPanel PHP backend
 * which is what the CMS reads from.
 */

const BASE = '/admin-api'

export async function postBooking(data) {
  const res = await fetch(`${BASE}/bookings?type=bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function postConsultation(data) {
  const res = await fetch(`${BASE}/bookings?type=consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function postReview(data) {
  const res = await fetch(`${BASE}/bookings?type=reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getBookings() {
  const res = await fetch(`${BASE}/bookings?type=bookings`)
  return res.json()
}

export async function getConsultations() {
  const res = await fetch(`${BASE}/bookings?type=consultations`)
  return res.json()
}

export async function getReviews() {
  const res = await fetch(`${BASE}/bookings?type=reviews`)
  return res.json()
}

export async function updateBookingStatus(id, status) {
  await fetch(`${BASE}/bookings?type=bookings&id=${id}&_method=PATCH`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export async function updateConsultationStatus(id, status) {
  await fetch(`${BASE}/bookings?type=consultations&id=${id}&_method=PATCH`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export async function deleteBooking(id) {
  await fetch(`${BASE}/bookings?type=bookings&id=${id}&_method=DELETE`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function deleteConsultation(id) {
  await fetch(`${BASE}/bookings?type=consultations&id=${id}&_method=DELETE`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function deleteReview(id) {
  await fetch(`${BASE}/bookings?type=reviews&id=${id}&_method=DELETE`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getGoogleReviews() {
  // Google Reviews via Elfsight widget — no API call needed
  return []
}
