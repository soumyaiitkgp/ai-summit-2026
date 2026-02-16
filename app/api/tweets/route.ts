import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminAuthenticatedFromRequest } from '@/lib/auth'

export async function GET() {
  if (!supabase) return NextResponse.json({ tweets: [] })
  const { data } = await supabase
    .from('curated_tweets')
    .select('*')
    .order('added_at', { ascending: false })
  return NextResponse.json({ tweets: data || [] })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  const { tweetUrl, label } = await req.json()
  // Extract tweet ID from URL
  const match = tweetUrl.match(/status\/(\d+)/)
  if (!match) return NextResponse.json({ error: 'Invalid tweet URL' }, { status: 400 })
  const tweetId = match[1]
  const { data, error } = await supabase
    .from('curated_tweets')
    .insert([{ tweet_id: tweetId, label: label || null, added_at: new Date().toISOString() }])
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tweet: data })
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await supabase.from('curated_tweets').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
