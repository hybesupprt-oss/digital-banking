import { NextResponse } from 'next/server'
import { OpenBankingService } from '@/lib/open-banking'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId = body.userId
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const service = OpenBankingService.getInstance()
    await service.syncAccountBalances(userId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Sync API error', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
