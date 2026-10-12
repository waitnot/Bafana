import sql, { initDB } from './db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  await initDB()

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM consultations ORDER BY submitted_at DESC`
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { name, email, phone, project, message, visitDate } = req.body
    const rows = await sql`
      INSERT INTO consultations (name, email, phone, project, message, visit_date)
      VALUES (${name}, ${email}, ${phone}, ${project}, ${message}, ${visitDate})
      RETURNING *
    `
    return res.json(rows[0])
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body
    await sql`UPDATE consultations SET status=${status} WHERE id=${id}`
    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await sql`DELETE FROM consultations WHERE id=${id}`
    return res.json({ ok: true })
  }

  res.status(405).end()
}
