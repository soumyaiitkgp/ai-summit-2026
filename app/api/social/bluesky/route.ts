import { NextResponse } from 'next/server'

export const revalidate = 120 // 2 min cache

const HASHTAGS = ['AISummit2026', 'AISummitDelhi', 'AIIndia2026']

export async function GET() {
  try {
    const results = await Promise.allSettled(
      HASHTAGS.map(async (tag) => {
        const res = await fetch(
          `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=%23${tag}&limit=20`,
          { next: { revalidate: 120 } }
        )
        if (!res.ok) return []
        const data = await res.json()
        return (data.posts || []).map((post: Record<string, unknown>) => {
          const author = post.author as Record<string, string> | undefined
          const record = post.record as Record<string, string> | undefined
          return {
            id: String(post.uri || ''),
            platform: 'bluesky',
            author: author?.displayName || author?.handle || 'Unknown',
            authorHandle: String(author?.handle || ''),
            text: String(record?.text || ''),
            publishedAt: String(record?.createdAt || new Date().toISOString()),
            url: `https://bsky.app/profile/${author?.handle}/post/${String(post.uri || '').split('/').pop()}`,
          }
        })
      })
    )

    const all: unknown[] = []
    const seen = new Set<string>()
    for (const r of results) {
      if (r.status === 'fulfilled') {
        for (const post of r.value) {
          if (!seen.has(post.id)) {
            seen.add(post.id)
            all.push(post)
          }
        }
      }
    }

    all.sort((a: unknown, b: unknown) => {
      const aPost = a as { publishedAt: string }
      const bPost = b as { publishedAt: string }
      return new Date(bPost.publishedAt).getTime() - new Date(aPost.publishedAt).getTime()
    })

    return NextResponse.json({ posts: all.slice(0, 30) })
  } catch (err) {
    console.error('Bluesky API error:', err)
    return NextResponse.json({ posts: [] })
  }
}
