export type CardType = 'news' | 'quote' | 'update'
export type TopicTag = 'policy' | 'startups' | 'research' | 'keynotes' | 'funding' | 'ethics' | 'infrastructure' | 'general'
export type SessionStatus = 'upcoming' | 'live' | 'concluded'

export interface NewsItem {
  id: string
  type: CardType
  source: string
  sourceUrl?: string
  title: string
  summary: string
  link?: string
  publishedAt: string // ISO string
  day: number // 1-5
  sessionTag?: string
  topicTag: TopicTag
  featured: boolean
  pinned: boolean
  breaking: boolean
  manual: boolean
  curatorNote?: string
  // For quote cards
  speaker?: string
  speakerTitle?: string
  // For image
  imageUrl?: string
}

export interface Session {
  id: string
  day: number
  date: string
  startTime: string // HH:MM IST
  endTime: string
  title: string
  speaker: string
  speakerTitle: string
  speakerPhoto?: string
  type: 'keynote' | 'panel' | 'workshop' | 'fireside' | 'break'
  description: string
  status: SessionStatus
  venue?: string
}

export interface SiteConfig {
  summitName: string
  city: string
  venue: string
  startDate: string // YYYY-MM-DD
  endDate: string
  days: number
  stats: {
    attendees: number
    speakers: number
    sessions: number
    countries: number
  }
  hashtags: string[]
  archiveMode: boolean
  curatorDispatch?: {
    text: string
    updatedAt: string
  }
}

export interface Prediction {
  id: string
  day: number
  question: string
  yesCount: number
  noCount: number
  outcome?: 'yes' | 'no' | null
  closedAt?: string
}

export interface SocialPost {
  id: string
  platform: 'bluesky' | 'mastodon'
  author: string
  authorHandle: string
  text: string
  publishedAt: string
  url: string
}

export interface CoverageGapItem {
  id: string
  day: number
  storyTitle: string
  indianFraming: string
  indianSource: string
  globalFraming: string
  globalSource: string
  curatorSummary: string
  publishedAt: string
}
