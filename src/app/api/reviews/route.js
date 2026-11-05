import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

async function getDb() {
  const sql = neon(process.env.DATABASE_URL)
  await sql`CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    name TEXT, rating INT, text TEXT,
    status TEXT DEFAULT 'Published',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
  )`
  return sql
}

export async function GET() {
  try {
    const sql = await getDb()
    const rows = await sql`SELECT * FROM reviews ORDER BY submitted_at DESC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, rating, text } = await req.json()
    const sql = await getDb()
    const rows = await sql`
      INSERT INTO reviews (name, rating, text)
      VALUES (${name}, ${rating}, ${text})
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    const sql = await getDb()
    await sql`DELETE FROM reviews WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
