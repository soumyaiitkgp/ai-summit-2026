import Parser from 'rss-parser'
import { format, parseISO, isAfter, subDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import {
  RSS_SOURCES,
  PRIMARY_KEYWORDS,
  AI_KEYWORDS,
  INDIA_KEYWORDS,
  type RSSSource,
} from './sources'
import type { NewsItem, TopicTag } from './types'

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 AISummit2026/1.0',
  },
})

// Config — summit dates
const SUMMIT_START = new Date('2026-02-16T00:00:00+05:30')
const SUMMIT_END = new Date('2026-02-20T23:59:59+05:30')
const SUMMIT_DAYS: Record<string, number> = {
  '2026-02-16': 1,
  '2026-02-17': 2,
  '2026-02-18': 3,
  '2026-02-19': 4,
  '2026-02-20': 5,
}

function getSummitDay(dateStr: string): number {
  try {
    const ist = toZonedTime(new Date(dateStr), 'Asia/Kolkata')
    const key = format(ist, 'yyyy-MM-dd')
    return SUMMIT_DAYS[key] ?? 0
  } catch {
    return 0
  }
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some((k) => lower.includes(k.toLowerCase()))
}

function shouldInclude(title: string, summary: string, source: RSSSource): boolean {
  const text = `${title} ${summary}`

  // Always include if direct summit keyword found (highest priority)
  if (matchesKeywords(text, PRIMARY_KEYWORDS)) return true

  // For ALL sources: require BOTH an AI keyword AND an India keyword
  // This ensures we only show AI news with India/summit relevance
  const hasAI = matchesKeywords(text, AI_KEYWORDS)
  const hasIndia = matchesKeywords(text, INDIA_KEYWORDS)

  if (source.filterStrict) {
    // Global outlets: strict — must have both AI + India signal
    return hasAI && hasIndia
  } else {
    // India outlets: also require AI + India (no generic Indian startup/business news)
    return hasAI && hasIndia
  }
}

function detectTopic(text: string): TopicTag {
  const lower = text.toLowerCase()
  if (lower.match(/polic|regulat|govern|law|ministry|minister|government|meity/)) return 'policy'
  if (lower.match(/startup|funding|investment|venture|seed|series [a-z]|raise/)) return 'startups'
  if (lower.match(/research|paper|study|lab|model|benchmark|dataset/)) return 'research'
  if (lower.match(/keynote|opening|closing|inaugural|plenary/)) return 'keynotes'
  if (lower.match(/fund|invest|capital|valuation|ipo/)) return 'funding'
  if (lower.match(/ethic|bias|fair|safe|harm|responsib|trust/)) return 'ethics'
  if (lower.match(/infrastructure|data center|chip|hardware|cloud|compute/)) return 'infrastructure'
  return 'general'
}

function generateId(source: string, link: string, title: string): string {
  const str = `${source}-${link || title}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `rss-${Math.abs(hash).toString(36)}`
}

async function fetchFeed(source: RSSSource): Promise<NewsItem[]> {
  const feed = await parser.parseURL(source.url)
  const cutoff = subDays(new Date(), 10) // items from last 10 days

  const items: NewsItem[] = []

  for (const item of feed.items || []) {
    const title = item.title?.trim() || ''
    const summary = (item.contentSnippet || item.content || item.summary || '').trim().slice(0, 400)
    const link = item.link || item.guid || ''
    const pubDate = item.pubDate || item.isoDate || new Date().toISOString()

    // Skip old items
    try {
      if (isAfter(cutoff, new Date(pubDate))) continue
    } catch {
      // keep if date parse fails
    }

    if (!title) continue
    if (!shouldInclude(title, summary, source)) continue

    const day = getSummitDay(pubDate)

    items.push({
      id: generateId(source.id, link, title),
      type: 'news',
      source: source.name,
      sourceUrl: source.url,
      title,
      summary: summary || title,
      link,
      publishedAt: pubDate,
      day: day || 1, // default to day 1 if not in summit range
      topicTag: detectTopic(`${title} ${summary}`),
      featured: false,
      pinned: false,
      breaking: false,
      manual: false,
      imageUrl: item.enclosure?.url || undefined,
    })
  }

  return items
}

export async function aggregateRSSFeeds(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(RSS_SOURCES.map((src) => fetchFeed(src)))

  const allItems: NewsItem[] = []
  const seenUrls = new Set<string>()
  const seenIds = new Set<string>()

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        // Deduplicate by URL
        if (item.link && seenUrls.has(item.link)) continue
        if (seenIds.has(item.id)) continue

        if (item.link) seenUrls.add(item.link)
        seenIds.add(item.id)
        allItems.push(item)
      }
    }
  }

  // Sort newest first
  allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return allItems.slice(0, 150)
}
