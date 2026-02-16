import { getCoverageGaps } from '@/lib/supabase'

export default async function InsightsPage() {
  const gaps = await getCoverageGaps()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Insights</h1>
        <p className="text-slate-400 text-sm mt-1">
          What's the gap between Indian and global coverage? Editor's analysis.
        </p>
      </div>

      {/* Signal / Noise placeholder */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          📡 Signal vs. Noise
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">Updated daily</span>
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <span className="text-orange-400 font-bold">65% Signal</span>
        </div>
        <p className="text-slate-500 text-sm mt-3">
          Editor analysis will appear here after each day of the summit.
        </p>
      </div>

      {/* Coverage Gap Map */}
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg mb-1">Coverage Gap Map</h2>
        <p className="text-slate-500 text-sm">The same story, seen differently.</p>
      </div>

      {gaps.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-8 text-center text-slate-500">
          <p className="text-3xl mb-3">🗺️</p>
          <p className="font-medium">Coverage gap analysis coming during the summit</p>
          <p className="text-sm mt-1">
            Our editors will compare how Indian and global media cover the same stories differently.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(gaps as Record<string, unknown>[]).map((gap) => (
            <div key={String(gap.id)} className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">{String(gap.story_title || '')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                <div className="p-4">
                  <div className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wide">🇮🇳 Indian Media</div>
                  <p className="text-slate-300 text-sm">{String(gap.indian_framing || '')}</p>
                  <p className="text-slate-500 text-xs mt-1">Source: {String(gap.indian_source || '')}</p>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">🌍 Global Media</div>
                  <p className="text-slate-300 text-sm">{String(gap.global_framing || '')}</p>
                  <p className="text-slate-500 text-xs mt-1">Source: {String(gap.global_source || '')}</p>
                </div>
              </div>
              {gap.curator_summary ? (
                <div className="p-4 bg-orange-950/20 border-t border-orange-500/20">
                  <p className="text-xs font-bold text-orange-400 mb-1">✍️ Editor&apos;s Take</p>
                  <p className="text-slate-300 text-sm">{String(gap.curator_summary)}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
