import { istTime, relativeTime } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

export default function UpdateCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-900/80 p-4 col-span-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
          UPDATE
        </div>
        <span className="text-blue-300 text-xs font-mono">{istTime(item.publishedAt)}</span>
        <span className="text-slate-500 text-xs ml-auto">{relativeTime(item.publishedAt)}</span>
      </div>
      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
      {item.summary && <p className="text-slate-300 text-sm">{item.summary}</p>}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-xs mt-2 inline-block hover:underline"
        >
          Read more →
        </a>
      )}
    </article>
  )
}
