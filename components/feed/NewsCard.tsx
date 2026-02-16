'use client'
import { relativeTime, truncate } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

interface Props {
  item: NewsItem
  onShare?: (item: NewsItem) => void
}

const TOPIC_COLORS: Record<string, string> = {
  policy: 'bg-purple-500/20 text-purple-300',
  startups: 'bg-green-500/20 text-green-300',
  research: 'bg-cyan-500/20 text-cyan-300',
  keynotes: 'bg-orange-500/20 text-orange-300',
  funding: 'bg-emerald-500/20 text-emerald-300',
  ethics: 'bg-rose-500/20 text-rose-300',
  infrastructure: 'bg-blue-500/20 text-blue-300',
  general: 'bg-slate-500/20 text-slate-300',
}

export default function NewsCard({ item, onShare }: Props) {
  const tagColor = TOPIC_COLORS[item.topicTag] || TOPIC_COLORS.general

  const handleShare = () => {
    if (onShare) {
      onShare(item)
    } else {
      const text = `${item.title} — via AI Summit 2026 Delhi Coverage #AISummitDelhi`
      const url = encodeURIComponent(item.link || window.location.href)
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank')
    }
  }

  return (
    <article
      className={`rounded-xl border transition-all hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-950/30 group ${
        item.featured
          ? 'border-orange-500/40 bg-gradient-to-br from-slate-900 to-orange-950/20 col-span-full'
          : 'border-slate-700/50 bg-slate-900/50'
      }`}
    >
      {item.breaking && (
        <div className="bg-red-600 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-t-xl uppercase">
          ⚡ Breaking
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-blue-400">{item.source}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor}`}>
              {item.topicTag}
            </span>
          </div>
          <span className="text-xs text-slate-500 shrink-0">{relativeTime(item.publishedAt)}</span>
        </div>

        <h3 className={`font-semibold text-white leading-snug mb-2 ${item.featured ? 'text-lg' : 'text-sm'}`}>
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition-colors"
            >
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>

        {item.summary && (
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            {truncate(item.summary, item.featured ? 300 : 150)}
          </p>
        )}

        {item.curatorNote && (
          <div className="border-l-2 border-orange-500 pl-3 my-3">
            <p className="text-orange-300 text-xs italic">"{item.curatorNote}"</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          {item.sessionTag && (
            <span className="text-xs text-slate-500">📍 {item.sessionTag}</span>
          )}
          <button
            onClick={handleShare}
            className="ml-auto text-slate-500 hover:text-blue-400 transition-colors text-xs flex items-center gap-1"
            title="Share"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </article>
  )
}
