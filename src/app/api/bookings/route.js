import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

async function getDb() {
  const sql = neon(process.env.DATABASE_URL)
  await sql`CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT,
    check_in TEXT, check_out TEXT,
    guests TEXT, room TEXT, message TEXT,
    status TEXT DEFAULT 'New',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
  )`
  return sql
}

export async function GET() {
  try {
    const sql = await getDb()
    const rows = await sql`SELECT * FROM bookings ORDER BY submitted_at DESC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, email, phone, checkIn, checkOut, guests, room, message } = await req.json()
    const sql = await getDb()
    const rows = await sql`
      INSERT INTO bookings (name, email, phone, check_in, check_out, guests, room, message)
      VALUES (${name}, ${email}, ${phone}, ${checkIn}, ${checkOut}, ${guests}, ${room}, ${message})
      RETURNING *`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, status, name, checkIn } = await req.json()
    const sql = await getDb()
    if (id) {
      await sql`UPDATE bookings SET status=${status} WHERE id=${id}`
    } else if (name && checkIn) {
      await sql`UPDATE bookings SET status=${status} WHERE name=${name} AND check_in=${checkIn}`
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    const sql = await getDb()
    await sql`DELETE FROM bookings WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
