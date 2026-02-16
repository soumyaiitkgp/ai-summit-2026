import NewsFeed from '@/components/feed/NewsFeed'
import config from '@/public/data/config.json'

export default function Home() {
  const { stats, hashtags, venue, startDate, endDate } = config

  return (
    <div>
      {/* Compact hero strip */}
      <div className="mb-5 pb-5 border-b border-slate-800">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">Live Coverage</h1>
            <p className="text-slate-500 text-sm mt-0.5">{venue} · {startDate} → {endDate}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {hashtags.map((tag: string) => (
              <span key={tag} className="text-xs text-orange-400 bg-orange-950/30 border border-orange-500/20 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {[
            { label: 'Attendees', value: stats.attendees.toLocaleString() },
            { label: 'Speakers', value: stats.speakers },
            { label: 'Sessions', value: stats.sessions },
            { label: 'Countries', value: stats.countries },
            { label: 'Days', value: 5 },
          ].map(({ label, value }) => (
            <div key={label} className="shrink-0 text-center">
              <div className="text-white font-bold text-lg leading-tight">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <NewsFeed />
    </div>
  )
}
