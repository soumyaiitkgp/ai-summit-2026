import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPassword, setAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    await setAdminSession()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const { clearAdminSession } = await import('@/lib/auth')
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
