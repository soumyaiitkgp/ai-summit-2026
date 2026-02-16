'use client'
import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import type { NewsItem } from '@/lib/types'
import StoryCard from './StoryCard'
import TodaysQuestion from './TodaysQuestion'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const TOPIC_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'keynotes', label: '🎤 Keynotes' },
  { id: 'policy', label: '⚖️ Policy' },
  { id: 'startups', label: '🚀 Startups' },
  { id: 'research', label: '🔬 Research' },
  { id: 'funding', label: '💰 Funding' },
  { id: 'ethics', label: '🤝 Ethics' },
]

export default function FeedPage() {
  const [topic, setTopic] = useState('all')
  const [newCount, setNewCount] = useState(0)
  const [items, setItems] = useState<NewsItem[]>([])
  const prevLen = useRef(0)

  const { data } = useSWR<{ items: NewsItem[] }>(
    '/api/news',
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  )

  useEffect(() => {
    if (!data?.items) return
    if (prevLen.current > 0 && data.items.length > prevLen.current) {
      setNewCount(data.items.length - prevLen.current)
    } else {
      setItems(data.items)
      prevLen.current = data.items.length
    }
  }, [data])

  function loadNew() {
    if (data?.items) {
      setItems(data.items)
      prevLen.current = data.items.length
      setNewCount(0)
    }
  }

  const filtered = topic === 'all'
    ? items
    : items.filter((i) => i.topicTag === topic)

  return (
    <div className="max-w-2xl mx-auto">

      {/* Today's question */}
      <TodaysQuestion />

      {/* Topic filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {TOPIC_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTopic(id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              topic === id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* New items banner */}
      {newCount > 0 && (
        <button
          onClick={loadNew}
          className="w-full mb-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          ↑ {newCount} new {newCount === 1 ? 'story' : 'stories'}
        </button>
      )}

      {/* Loading skeleton */}
      {items.length === 0 && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 animate-pulse">
              <div className="h-3 bg-slate-800 rounded w-1/4 mb-4" />
              <div className="h-5 bg-slate-800 rounded w-full mb-2" />
              <div className="h-5 bg-slate-800 rounded w-4/5 mb-4" />
              <div className="h-3 bg-slate-800/60 rounded w-full mb-1" />
              <div className="h-3 bg-slate-800/60 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {items.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">📡</p>
          <p className="font-medium text-slate-400">No stories in this category yet</p>
          <button onClick={() => setTopic('all')} className="mt-3 text-sm text-blue-400 hover:underline">
            See all stories
          </button>
        </div>
      )}

      {/* Story cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <StoryCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-slate-700 text-xs py-8">
          {filtered.length} stories · refreshes every 5 min
        </p>
      )}
    </div>
  )
}
