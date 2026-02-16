import { NextResponse } from 'next/server'

export const revalidate = 120

const MASTODON_INSTANCE = 'https://mastodon.social'
const HASHTAGS = ['AISummit2026', 'AISummitDelhi']

export async function GET() {
  try {
    const results = await Promise.allSettled(
      HASHTAGS.map(async (tag) => {
        const res = await fetch(
          `${MASTODON_INSTANCE}/api/v1/timelines/tag/${tag}?limit=20`,
          { next: { revalidate: 120 } }
        )
        if (!res.ok) return []
        const data = await res.json()
        return (data as Record<string, unknown>[]).map((post) => {
          const account = post.account as Record<string, string> | undefined
          return {
            id: String(post.id || ''),
            platform: 'mastodon',
            author: account?.display_name || account?.username || 'Unknown',
            authorHandle: `@${account?.username || ''}@mastodon.social`,
            text: String(post.content || '').replace(/<[^>]+>/g, ''),
            publishedAt: String(post.created_at || new Date().toISOString()),
            url: String(post.url || ''),
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
    console.error('Mastodon API error:', err)
    return NextResponse.json({ posts: [] })
  }
}
