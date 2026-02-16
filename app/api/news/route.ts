import { NextResponse } from 'next/server'
import { aggregateRSSFeeds } from '@/lib/rss'
import { getManualStories } from '@/lib/supabase'
import type { NewsItem } from '@/lib/types'

export const revalidate = 600 // cache 10 minutes at edge

export async function GET() {
  try {
    // Fetch RSS and manual items in parallel
    const [rssItems, manualRaw] = await Promise.all([
      aggregateRSSFeeds(),
      getManualStories(),
    ])

    // Normalize manual items to NewsItem shape
    const manualItems: NewsItem[] = (manualRaw as Record<string, unknown>[]).map((s) => ({
      id: String(s.id),
      type: (s.type as 'news' | 'quote' | 'update') || 'news',
      source: String(s.source || 'Editorial'),
      title: String(s.title || ''),
      summary: String(s.summary || ''),
      link: s.link ? String(s.link) : undefined,
      publishedAt: String(s.created_at || new Date().toISOString()),
      day: Number(s.day || 1),
      topicTag: (s.topic_tag as NewsItem['topicTag']) || 'general',
      featured: Boolean(s.featured),
      pinned: Boolean(s.pinned),
      breaking: Boolean(s.breaking),
      manual: true,
      curatorNote: s.curator_note ? String(s.curator_note) : undefined,
      speaker: s.speaker ? String(s.speaker) : undefined,
      speakerTitle: s.speaker_title ? String(s.speaker_title) : undefined,
      sessionTag: s.session_tag ? String(s.session_tag) : undefined,
    }))

    // Merge: pinned manual items first, then rest sorted by date
    const pinnedItems = manualItems.filter((i) => i.pinned)
    const breakingItems = manualItems.filter((i) => i.breaking && !i.pinned)
    const otherManual = manualItems.filter((i) => !i.pinned && !i.breaking)

    const merged = [
      ...pinnedItems,
      ...breakingItems,
      ...otherManual,
      ...rssItems,
    ]

    // Final dedup by id
    const seen = new Set<string>()
    const deduped = merged.filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })

    return NextResponse.json({ items: deduped, total: deduped.length })
  } catch (err) {
    console.error('News API error:', err)
    return NextResponse.json({ items: [], total: 0, error: 'Failed to fetch news' }, { status: 500 })
  }
}
