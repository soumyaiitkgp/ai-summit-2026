'use client'
import type { TopicTag } from '@/lib/types'

const TOPICS: { id: TopicTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'keynotes', label: '🎤 Keynotes' },
  { id: 'policy', label: '⚖️ Policy' },
  { id: 'startups', label: '🚀 Startups' },
  { id: 'research', label: '🔬 Research' },
  { id: 'funding', label: '💰 Funding' },
  { id: 'ethics', label: '🤝 Ethics' },
  { id: 'infrastructure', label: '🏗️ Infrastructure' },
]

interface Props {
  activeTopic: string
  onTopicChange: (topic: string) => void
}

export default function TopicFilterChips({ activeTopic, onTopicChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {TOPICS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTopicChange(id)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeTopic === id
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
