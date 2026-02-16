import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticatedFromRequest } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    // Fall back to static JSON
    return NextResponse.json({ sessions: [] })
  }
  const { data } = await supabase.from('sessions').select('*').order('day').order('start_time')
  return NextResponse.json({ sessions: data || [] })
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }
  const { id, status } = await req.json()
  const { error } = await supabase.from('sessions').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
