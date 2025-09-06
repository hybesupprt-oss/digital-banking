import { NextResponse } from 'next/server'
import { OpenBankingService } from '@/lib/open-banking'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const service = OpenBankingService.getInstance()
    const overview = await service.getAggregatedAccountOverview(userId)
    return NextResponse.json(overview)
  } catch (err) {
    console.error('Overview API error', err)
    return NextResponse.json({ error: 'Failed to load overview' }, { status: 500 })
  }
}
