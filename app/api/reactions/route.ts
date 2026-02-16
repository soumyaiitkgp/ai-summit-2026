import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, reaction } = await req.json()
    if (!id || !reaction) return NextResponse.json({ ok: false })
    // If Supabase configured, persist reaction counts
    if (supabase) {
      try {
        await supabase.rpc('increment_reaction', { article_id: id, reaction_type: reaction })
      } catch {
        // ignore
      }
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
