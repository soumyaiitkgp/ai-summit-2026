import type { NewsItem } from '@/lib/types'

export default function BreakingBanner({ item }: { item: NewsItem }) {
  return (
    <div className="rounded-xl border-2 border-red-500 bg-red-950/30 p-4 animate-pulse-once mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded tracking-widest">⚡ BREAKING</span>
        <span className="text-slate-400 text-xs">{item.source}</span>
      </div>
      <h2 className="text-white text-base font-bold leading-snug">
        {item.link ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h2>
      {item.summary && <p className="text-slate-300 text-sm mt-1">{item.summary}</p>}
    </div>
  )
}
