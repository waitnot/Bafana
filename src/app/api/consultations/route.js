import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

async function getDb() {
  const sql = neon(process.env.DATABASE_URL)
  await sql`CREATE TABLE IF NOT EXISTS consultations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT,
    project TEXT, message TEXT, visit_date TEXT,
    status TEXT DEFAULT 'New',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
  )`
  return sql
}

export async function GET() {
  try {
    const sql = await getDb()
    const rows = await sql`SELECT * FROM consultations ORDER BY submitted_at DESC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, email, phone, project, message, visitDate } = await req.json()
    const sql = await getDb()
    const rows = await sql`
      INSERT INTO consultations (name, email, phone, project, message, visit_date)
      VALUES (${name}, ${email}, ${phone}, ${project}, ${message}, ${visitDate})
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, status } = await req.json()
    const sql = await getDb()
    await sql`UPDATE consultations SET status=${status} WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    const sql = await getDb()
    await sql`DELETE FROM consultations WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
