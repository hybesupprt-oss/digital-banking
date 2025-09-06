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
    // Run a minimal query to verify DB connectivity
    const result = await sql`SELECT 1 as ok`
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    console.error('DB ping failed', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
