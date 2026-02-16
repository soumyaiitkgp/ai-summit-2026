import NewsFeed from '@/components/feed/NewsFeed'

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Live Feed</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time coverage from 16+ sources · Updated every 5 minutes
        </p>
      </div>
      <NewsFeed />
    </div>
  )
}
