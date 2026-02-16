import { NextRequest, NextResponse } from 'next/server'
import { getPredictions, votePrediction } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get('day')
  const predictions = await getPredictions(day ? Number(day) : undefined)
  return NextResponse.json({ predictions })
}

export async function POST(req: NextRequest) {
  try {
    const { id, vote } = await req.json()
    if (!id || !['yes', 'no'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    await votePrediction(id, vote)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
