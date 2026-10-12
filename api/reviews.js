import sql, { initDB } from './db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  await initDB()

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM reviews ORDER BY submitted_at DESC`
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { name, rating, text } = req.body
    const rows = await sql`
      INSERT INTO reviews (name, rating, text)
      VALUES (${name}, ${rating}, ${text})
      RETURNING *
    `
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await sql`DELETE FROM reviews WHERE id=${id}`
    return res.json({ ok: true })
  }

  res.status(405).end()
}
