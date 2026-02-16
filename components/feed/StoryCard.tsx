'use client'
import { useState } from 'react'
import { relativeTime, truncate } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

interface Props {
  item: NewsItem
}

const REACTIONS = [
  { emoji: '🔥', label: 'fire' },
  { emoji: '🤯', label: 'mindblown' },
  { emoji: '👏', label: 'clap' },
]

const TOPIC_DOT: Record<string, string> = {
  policy: 'bg-purple-500',
  startups: 'bg-green-500',
  research: 'bg-cyan-500',
  keynotes: 'bg-orange-500',
  funding: 'bg-emerald-500',
  ethics: 'bg-rose-500',
  infrastructure: 'bg-blue-500',
  general: 'bg-slate-500',
}

function getStoredReaction(id: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`reaction_${id}`)
}

function setStoredReaction(id: string, label: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`reaction_${id}`, label)
}

export default function StoryCard({ item }: Props) {
  const [myReaction, setMyReaction] = useState<string | null>(() => getStoredReaction(item.id))
  const [counts, setCounts] = useState<Record<string, number>>({ fire: 0, mindblown: 0, clap: 0 })
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  function react(label: string) {
    if (myReaction) return // already reacted
    setMyReaction(label)
    setStoredReaction(item.id, label)
    setCounts((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }))
    // Fire-and-forget to server (no login needed)
    fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, reaction: label }),
    }).catch(() => null)
  }

  function share() {
    const text = `${item.title}\n\nvia AI Summit 2026 Delhi Coverage\n#AISummitDelhi`
    const url = item.link || window.location.href
    if (navigator.share) {
      navigator.share({ title: item.title, text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const summary = item.summary || ''
  const isLong = summary.length > 180
  const displaySummary = expanded || !isLong ? summary : truncate(summary, 180)

  return (
    <article
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        item.breaking
          ? 'border-red-500/50 bg-gradient-to-b from-red-950/20 to-slate-950'
          : item.featured || item.pinned
          ? 'border-orange-500/30 bg-gradient-to-b from-orange-950/10 to-slate-950'
          : 'border-slate-800/80 bg-slate-950 hover:border-slate-700'
      }`}
    >
      {/* Breaking banner */}
      {item.breaking && (
        <div className="bg-red-600 px-4 py-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-white text-xs font-bold tracking-widest uppercase">Breaking</span>
        </div>
      )}

      <div className="p-5">
        {/* Source + time row */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full shrink-0 ${TOPIC_DOT[item.topicTag] || 'bg-slate-500'}`} />
          <span className="text-xs font-semibold text-slate-400">{item.source}</span>
          <span className="text-slate-700 text-xs">·</span>
          <span className="text-xs text-slate-600">{relativeTime(item.publishedAt)}</span>
          {item.topicTag !== 'general' && (
            <>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-xs text-slate-500 capitalize">{item.topicTag}</span>
            </>
          )}
        </div>

        {/* Title */}
        {item.type === 'quote' ? (
          <blockquote className="text-white text-lg font-semibold leading-snug mb-1 italic">
            "{item.title}"
            {item.speaker && (
              <p className="text-orange-400 text-sm font-normal not-italic mt-2">
                — {item.speaker}{item.speakerTitle && <span className="text-slate-500">, {item.speakerTitle}</span>}
              </p>
            )}
          </blockquote>
        ) : (
          <h2 className="text-white font-bold text-base leading-snug mb-3">
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                {item.title}
              </a>
            ) : item.title}
          </h2>
        )}

        {/* Summary */}
        {summary && item.type !== 'quote' && (
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            {displaySummary}
            {isLong && !expanded && (
              <button onClick={() => setExpanded(true)} className="text-blue-400 ml-1 hover:underline text-xs">
                read more
              </button>
            )}
          </p>
        )}

        {/* Curator note */}
        {item.curatorNote && (
          <div className="flex gap-2 mb-3 bg-orange-950/20 rounded-xl p-3 border border-orange-500/15">
            <span className="text-orange-400 text-xs shrink-0 mt-0.5">✍️</span>
            <p className="text-orange-200/80 text-xs italic leading-relaxed">{item.curatorNote}</p>
          </div>
        )}

        {/* Bottom row: reactions + share */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60">
          {/* Reactions */}
          <div className="flex gap-1.5">
            {REACTIONS.map(({ emoji, label }) => (
              <button
                key={label}
                onClick={() => react(label)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all ${
                  myReaction === label
                    ? 'bg-orange-500/20 border border-orange-500/40 text-white scale-105'
                    : myReaction
                    ? 'opacity-30 cursor-not-allowed bg-slate-800/50 text-slate-500'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent hover:border-slate-600'
                }`}
                disabled={!!myReaction}
                title={myReaction ? 'Already reacted' : `React with ${emoji}`}
              >
                <span>{emoji}</span>
                {counts[label] > 0 && <span className="text-xs">{counts[label]}</span>}
              </button>
            ))}
          </div>

          {/* Share */}
          <button
            onClick={share}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/60"
          >
            {copied ? (
              <span className="text-green-400">✓ Copied</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
