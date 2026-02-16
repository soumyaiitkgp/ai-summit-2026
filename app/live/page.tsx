'use client'
import { useEffect, useState } from 'react'
import { Tweet } from 'react-tweet'

interface CuratedTweet {
  id: string
  tweetId: string
  label?: string
  addedAt: string
}

export default function SocialPage() {
  const [tweets, setTweets] = useState<CuratedTweet[]>([])

  useEffect(() => {
    fetch('/api/tweets')
      .then((r) => r.json())
      .then((d) => setTweets(d.tweets || []))
      .catch(() => null)
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Social</h1>
        <p className="text-slate-500 text-sm">Best posts from the summit — curated by editors</p>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <a
          href="https://twitter.com/search?q=%23AISummitDelhi&src=typed_query&f=live"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-colors"
        >
          <span>𝕏</span> Live on X: #AISummitDelhi
        </a>
        <a
          href="https://twitter.com/search?q=%23AISummit2026&src=typed_query&f=live"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-colors"
        >
          #AISummit2026
        </a>
      </div>

      {tweets.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
          <p className="text-3xl mb-3">𝕏</p>
          <p className="text-white font-semibold mb-2">Curated tweets will appear here</p>
          <p className="text-slate-500 text-sm">
            Editors hand-pick the most interesting X posts during the summit.
            Check back once the event starts.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tweets.map((t) => (
            <div key={t.id} className="rounded-2xl overflow-hidden">
              {t.label && (
                <div className="bg-slate-800/60 px-4 py-2 border-b border-slate-700/50">
                  <span className="text-xs text-orange-400 font-semibold">{t.label}</span>
                </div>
              )}
              <div className="[&>div]:!m-0 [&_.react-tweet-theme]:!bg-slate-900 [&_.react-tweet-theme]:!border-slate-700">
                <Tweet id={t.tweetId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
