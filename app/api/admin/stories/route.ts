import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticatedFromRequest } from '@/lib/auth'
import { getManualStories, createManualStory, updateManualStory, deleteManualStory } from '@/lib/supabase'

function auth(req: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET(req: NextRequest) {
  const unauth = auth(req)
  if (unauth) return unauth
  const stories = await getManualStories()
  return NextResponse.json({ stories })
}

export async function POST(req: NextRequest) {
  const unauth = auth(req)
  if (unauth) return unauth
  try {
    const body = await req.json()
    const story = await createManualStory({
      type: body.type || 'news',
      source: body.source || 'Editorial',
      title: body.title,
      summary: body.summary,
      link: body.link || null,
      day: body.day || 1,
      topic_tag: body.topicTag || 'general',
      featured: body.featured || false,
      pinned: body.pinned || false,
      breaking: body.breaking || false,
      curator_note: body.curatorNote || null,
      speaker: body.speaker || null,
      speaker_title: body.speakerTitle || null,
      session_tag: body.sessionTag || null,
    })
    return NextResponse.json({ story })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const unauth = auth(req)
  if (unauth) return unauth
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const story = await updateManualStory(id, updates)
    return NextResponse.json({ story })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = auth(req)
  if (unauth) return unauth
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await deleteManualStory(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
