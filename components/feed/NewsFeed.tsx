'use client'
import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import type { NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'
import QuoteCard from './QuoteCard'
import UpdateCard from './UpdateCard'
import BreakingBanner from './BreakingBanner'
import DayTabs from './DayTabs'
import TopicFilterChips from './TopicFilterChips'
import CuratorsDispatch from './CuratorsDispatch'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NewsFeed() {
  const [activeDay, setActiveDay] = useState(0)
  const [activeTopic, setActiveTopic] = useState('all')
  const [newCount, setNewCount] = useState(0)
  const [items, setItems] = useState<NewsItem[]>([])
  const prevCountRef = useRef(0)

  const { data, isLoading } = useSWR<{ items: NewsItem[]; total: number }>(
    '/api/news',
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  )

  useEffect(() => {
    if (data?.items) {
      if (prevCountRef.current > 0 && data.items.length > prevCountRef.current) {
        setNewCount(data.items.length - prevCountRef.current)
      } else {
        setItems(data.items)
        prevCountRef.current = data.items.length
      }
    }
  }, [data])

  function loadNewItems() {
    if (data?.items) {
      setItems(data.items)
      prevCountRef.current = data.items.length
      setNewCount(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Build day counts
  const dayCounts: Record<number, number> = {}
  for (const item of items) {
    dayCounts[item.day] = (dayCounts[item.day] || 0) + 1
  }

  // Filter
  const filtered = items.filter((item) => {
    if (activeDay !== 0 && item.day !== activeDay) return false
    if (activeTopic !== 'all' && item.topicTag !== activeTopic) return false
    return true
  })

  const breakingItem = filtered.find((i) => i.breaking)

  return (
    <div>
      <CuratorsDispatch />

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <DayTabs activeDay={activeDay} onDayChange={setActiveDay} dayCounts={dayCounts} />
        <TopicFilterChips activeTopic={activeTopic} onTopicChange={setActiveTopic} />
      </div>

      {/* New items banner */}
      {newCount > 0 && (
        <button
          onClick={loadNewItems}
          className="w-full mb-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span className="animate-bounce">↑</span>
          {newCount} new {newCount === 1 ? 'item' : 'items'} — tap to load
        </button>
      )}

      {/* Breaking news */}
      {breakingItem && <BreakingBanner item={breakingItem} />}

      {/* Loading */}
      {isLoading && items.length === 0 && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 animate-pulse">
              <div className="h-3 bg-slate-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">📡</p>
          <p className="font-medium">No articles found</p>
          <p className="text-sm">Try a different day or topic filter</p>
        </div>
      )}

      {/* Feed grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          if (item.type === 'quote') return <QuoteCard key={item.id} item={item} />
          if (item.type === 'update') return <UpdateCard key={item.id} item={item} />
          return <NewsCard key={item.id} item={item} />
        })}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-slate-600 text-xs mt-8 pb-4">
          Showing {filtered.length} items · Updates every 5 minutes
        </p>
      )}
    </div>
  )
}
