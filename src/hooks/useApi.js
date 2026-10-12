/**
 * API helper — posts to Vercel serverless functions
 * All endpoints live at /api/*
 */

const BASE = '/api'

export async function postBooking(data) {
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function postConsultation(data) {
  const res = await fetch(`${BASE}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function postReview(data) {
  const res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getBookings() {
  const res = await fetch(`${BASE}/bookings`)
  return res.json()
}

export async function getConsultations() {
  const res = await fetch(`${BASE}/consultations`)
  return res.json()
}

export async function getReviews() {
  const res = await fetch(`${BASE}/reviews`)
  return res.json()
}

export async function updateBookingStatus(id, status) {
  await fetch(`${BASE}/bookings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
}

export async function updateConsultationStatus(id, status) {
  await fetch(`${BASE}/consultations`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
}

export async function deleteBooking(id) {
  await fetch(`${BASE}/bookings`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

export async function deleteConsultation(id) {
  await fetch(`${BASE}/consultations`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

export async function deleteReview(id) {
  await fetch(`${BASE}/reviews`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}
