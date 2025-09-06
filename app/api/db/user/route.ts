import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!process.env.DB_TEST_TOKEN) {
    return NextResponse.json({ error: 'DB test token not configured' }, { status: 500 })
  }
  if (!token || token !== process.env.DB_TEST_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await sql`SELECT id, email, first_name, last_name, role FROM users LIMIT 5`
    return NextResponse.json({ ok: true, users })
  } catch (err) {
    console.error('DB user query failed', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
