import config from '@/public/data/config.json'

export default function StatsTicker() {
  const { stats, hashtags } = config
  const items = [
    `${stats.attendees.toLocaleString()} Attendees`,
    `${stats.speakers} Speakers`,
    `${stats.sessions} Sessions`,
    `${stats.countries} Countries`,
    `5 Days`,
    ...hashtags,
  ]
  const ticker = [...items, ...items]

  return (
    <div className="bg-orange-500/10 border-b border-orange-500/20 overflow-hidden py-1.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {ticker.map((item, i) => (
          <span key={i} className="mx-6 text-xs text-orange-300 font-medium">
            {item}
            <span className="mx-4 text-orange-500/40">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
