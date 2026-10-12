import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id BIGSERIAL PRIMARY KEY,
      name TEXT, email TEXT, phone TEXT,
      check_in TEXT, check_out TEXT,
      guests TEXT, room TEXT, message TEXT,
      status TEXT DEFAULT 'New',
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id BIGSERIAL PRIMARY KEY,
      name TEXT, email TEXT, phone TEXT,
      project TEXT, message TEXT, visit_date TEXT,
      status TEXT DEFAULT 'New',
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id BIGSERIAL PRIMARY KEY,
      name TEXT, rating INT, text TEXT,
      status TEXT DEFAULT 'Published',
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export default sql
