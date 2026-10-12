import sql, { initDB } from './db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  await initDB()

  // GET — list all
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM bookings ORDER BY submitted_at DESC`
    return res.json(rows)
  }

  // POST — create
  if (req.method === 'POST') {
    const { name, email, phone, checkIn, checkOut, guests, room, message } = req.body
    const rows = await sql`
      INSERT INTO bookings (name, email, phone, check_in, check_out, guests, room, message)
      VALUES (${name}, ${email}, ${phone}, ${checkIn}, ${checkOut}, ${guests}, ${room}, ${message})
      RETURNING *
    `
    return res.json(rows[0])
  }

  // PATCH — update status
  if (req.method === 'PATCH') {
    const { id, status } = req.body
    await sql`UPDATE bookings SET status=${status} WHERE id=${id}`
    return res.json({ ok: true })
  }

  // DELETE
  if (req.method === 'DELETE') {
    const { id } = req.body
    await sql`DELETE FROM bookings WHERE id=${id}`
    return res.json({ ok: true })
  }

  res.status(405).end()
}
