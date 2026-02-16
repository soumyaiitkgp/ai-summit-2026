import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminAuthenticatedFromRequest } from '@/lib/auth'

export async function GET() {
  if (!supabase) return NextResponse.json({ question: null })
  const { data } = await supabase
    .from('daily_questions')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return NextResponse.json({ question: data || null })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // Admin posting a new question
  if (body.question !== undefined && isAdminAuthenticatedFromRequest(req)) {
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
    // Deactivate old questions
    await supabase.from('daily_questions').update({ active: false }).eq('active', true)
    const { data } = await supabase
      .from('daily_questions')
      .insert([{ question: body.question, yes_count: 0, no_count: 0, active: true }])
      .select().single()
    return NextResponse.json({ question: data })
  }
  // User voting
  const { id, vote } = body
  if (!id || !['yes', 'no'].includes(vote)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  if (supabase) {
    const col = vote === 'yes' ? 'yes_count' : 'no_count'
    try {
      await supabase.rpc('increment_question_vote', { row_id: id, col_name: col })
    } catch {
      // ignore
    }
  }
  return NextResponse.json({ ok: true })
}
