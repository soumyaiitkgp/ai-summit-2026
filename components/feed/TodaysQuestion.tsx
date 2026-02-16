'use client'
import { useState, useEffect } from 'react'

interface Question {
  id: string
  question: string
  yes_count: number
  no_count: number
  outcome?: 'yes' | 'no' | null
}

export default function TodaysQuestion() {
  const [q, setQ] = useState<Question | null>(null)
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)

  useEffect(() => {
    // Check localStorage for prior vote
    fetch('/api/question')
      .then((r) => r.json())
      .then((d) => {
        if (d.question) {
          setQ(d.question)
          const prior = localStorage.getItem(`vote_${d.question.id}`) as 'yes' | 'no' | null
          setVoted(prior)
        }
      })
      .catch(() => null)
  }, [])

  async function vote(choice: 'yes' | 'no') {
    if (!q || voted) return
    setVoted(choice)
    localStorage.setItem(`vote_${q.id}`, choice)
    // Optimistic update
    setQ((prev) => prev ? {
      ...prev,
      yes_count: choice === 'yes' ? prev.yes_count + 1 : prev.yes_count,
      no_count: choice === 'no' ? prev.no_count + 1 : prev.no_count,
    } : null)
    await fetch('/api/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: q.id, vote: choice }),
    }).catch(() => null)
  }

  if (!q) return null

  const total = q.yes_count + q.no_count
  const yesPct = total > 0 ? Math.round((q.yes_count / total) * 100) : 50
  const noPct = 100 - yesPct

  return (
    <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-950/30 to-slate-950 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">🗳 Today's Question</span>
      </div>
      <p className="text-white font-semibold text-sm mb-4">{q.question}</p>

      {voted ? (
        <div>
          {/* Results bar */}
          <div className="flex rounded-xl overflow-hidden h-8 mb-2 text-xs font-bold">
            <div
              className="bg-green-600 flex items-center justify-center text-white transition-all"
              style={{ width: `${yesPct}%` }}
            >
              {yesPct > 15 && `${yesPct}%`}
            </div>
            <div
              className="bg-slate-700 flex items-center justify-center text-slate-300 transition-all"
              style={{ width: `${noPct}%` }}
            >
              {noPct > 15 && `${noPct}%`}
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>✅ Yes · {q.yes_count}</span>
            <span className="text-slate-600">{total} votes</span>
            <span>❌ No · {q.no_count}</span>
          </div>
          {q.outcome && (
            <p className="text-center mt-2 text-sm font-medium text-orange-400">
              Result: {q.outcome === 'yes' ? '✅ Yes' : '❌ No'}
              {voted === q.outcome ? ' · You got it right! 🎉' : ' · You were off this time'}
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => vote('yes')}
            className="flex-1 py-2.5 rounded-xl bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 font-semibold text-sm transition-all hover:scale-[1.02]"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => vote('no')}
            className="flex-1 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-600/30 text-slate-300 font-semibold text-sm transition-all hover:scale-[1.02]"
          >
            ❌ No
          </button>
        </div>
      )}
    </div>
  )
}
