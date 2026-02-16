'use client'
import { useEffect, useState } from 'react'
import type { SocialPost } from '@/lib/types'
import { relativeTime } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Platform = 'bluesky' | 'mastodon' | 'x'

export default function LivePage() {
  const [platform, setPlatform] = useState<Platform>('bluesky')
  const [bskyPosts, setBskyPosts] = useState<SocialPost[]>([])
  const [mastodonPosts, setMastodonPosts] = useState<SocialPost[]>([])

  useEffect(() => {
    fetcher('/api/social/bluesky').then((d) => setBskyPosts(d.posts || []))
    fetcher('/api/social/mastodon').then((d) => setMastodonPosts(d.posts || []))
  }, [])

  const posts = platform === 'bluesky' ? bskyPosts : platform === 'mastodon' ? mastodonPosts : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">The Conversation</h1>
        <p className="text-slate-400 text-sm mt-1">
          Live social coverage across platforms · #AISummitDelhi #AISummit2026
        </p>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {(['bluesky', 'mastodon', 'x'] as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              platform === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {p === 'bluesky' && '🦋'}
            {p === 'mastodon' && '🐘'}
            {p === 'x' && '𝕏'}
            <span className="capitalize">{p === 'x' ? 'X (Curated)' : p}</span>
          </button>
        ))}
      </div>

      {platform === 'x' ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-center">
          <p className="text-2xl mb-3">𝕏</p>
          <p className="text-white font-semibold mb-2">Curated from X (Twitter)</p>
          <p className="text-slate-400 text-sm mb-4">
            Our editors hand-pick the best X posts about the summit. Add curated tweet URLs from the admin panel.
          </p>
          <a
            href="https://twitter.com/search?q=%23AISummitDelhi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
          >
            Search #AISummitDelhi on X →
          </a>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-3xl mb-3">💬</p>
          <p className="font-medium">Loading {platform} posts…</p>
          <p className="text-sm mt-1">Posts will appear as people discuss the summit</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{post.author}</p>
                  <p className="text-slate-500 text-xs">{post.authorHandle}</p>
                </div>
                <span className="ml-auto text-slate-500 text-xs">{relativeTime(post.publishedAt)}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{post.text}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-400 hover:underline"
              >
                View on {post.platform === 'bluesky' ? 'Bluesky' : 'Mastodon'} →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
