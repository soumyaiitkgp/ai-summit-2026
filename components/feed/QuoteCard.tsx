import { relativeTime } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

export default function QuoteCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-950/30 to-slate-900/80 p-5 col-span-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-orange-400 text-lg">"</span>
        <span className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Quote</span>
        <span className="ml-auto text-xs text-slate-500">{relativeTime(item.publishedAt)}</span>
      </div>
      <blockquote className="text-white text-xl font-medium leading-relaxed mb-4 italic">
        "{item.title}"
      </blockquote>
      {(item.speaker || item.summary) && (
        <div className="mt-3 border-t border-orange-500/20 pt-3">
          {item.speaker && (
            <p className="text-orange-300 font-semibold text-sm">{item.speaker}</p>
          )}
          {item.speakerTitle && (
            <p className="text-slate-400 text-xs">{item.speakerTitle}</p>
          )}
          {item.summary && !item.speaker && (
            <p className="text-slate-400 text-sm">{item.summary}</p>
          )}
        </div>
      )}
      {item.sessionTag && (
        <p className="text-slate-500 text-xs mt-2">📍 {item.sessionTag}</p>
      )}
    </article>
  )
}
