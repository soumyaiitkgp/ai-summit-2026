import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticatedFromRequest } from '@/lib/auth'
import { getCuratorDispatch, setCuratorDispatch } from '@/lib/supabase'

export async function GET() {
  const dispatch = await getCuratorDispatch()
  return NextResponse.json({ dispatch })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { text } = await req.json()
    await setCuratorDispatch(text)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
