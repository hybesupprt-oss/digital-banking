import { NextResponse } from 'next/server'
import { OpenBankingService } from '@/lib/open-banking'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const country = url.searchParams.get('country') || 'US'
    const service = OpenBankingService.getInstance()
    const providers = await service.getSupportedProviders(country)
    return NextResponse.json({ providers })
  } catch (err) {
    console.error('Providers API error', err)
    return NextResponse.json({ error: 'Failed to load providers' }, { status: 500 })
  }
}
