'use client'
import { useState } from 'react'
import sessionsData from '@/public/data/sessions.json'
import type { Session } from '@/lib/types'

const sessions = sessionsData as Session[]

const DAY_DATES: Record<number, string> = {
  1: 'Mon, Feb 16',
  2: 'Tue, Feb 17',
  3: 'Wed, Feb 18',
  4: 'Thu, Feb 19',
  5: 'Fri, Feb 20',
}

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-red-500 text-white',
  upcoming: 'bg-slate-700 text-slate-300',
  concluded: 'bg-green-900/50 text-green-400',
}

const TYPE_ICONS: Record<string, string> = {
  keynote: '🎤',
  panel: '👥',
  fireside: '🔥',
  workshop: '🛠️',
  break: '☕',
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(1)
  const daySessions = sessions.filter((s) => s.day === activeDay)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Summit Schedule</h1>
        <p className="text-slate-400 text-sm mt-1">5 days · 60+ sessions · Bharat Mandapam, New Delhi</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {[1, 2, 3, 4, 5].map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div>Day {day}</div>
            <div className="text-xs opacity-70">{DAY_DATES[day]}</div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {daySessions.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-3xl mb-2">📅</p>
            <p>Schedule for Day {activeDay} coming soon</p>
          </div>
        ) : (
          daySessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-xl border p-4 transition-all ${
                session.status === 'live'
                  ? 'border-red-500/60 bg-red-950/20 shadow-lg shadow-red-950/30'
                  : session.status === 'concluded'
                  ? 'border-slate-700/30 bg-slate-900/30 opacity-60'
                  : 'border-slate-700/50 bg-slate-900/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-center shrink-0 min-w-[60px]">
                  <div className="text-orange-400 font-mono text-sm font-bold">{session.startTime}</div>
                  <div className="text-slate-600 text-xs">{session.endTime}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <span>{TYPE_ICONS[session.type] || '📌'}</span>
                    <h3 className="text-white font-semibold text-sm leading-snug">{session.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs mb-1">
                    {session.speaker}
                    {session.speakerTitle && <span className="text-slate-500"> · {session.speakerTitle}</span>}
                  </p>
                  {session.description && (
                    <p className="text-slate-500 text-xs leading-relaxed">{session.description}</p>
                  )}
                  {session.venue && (
                    <p className="text-slate-600 text-xs mt-1">📍 {session.venue}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[session.status]}`}>
                    {session.status === 'live' ? '● Live' : session.status === 'concluded' ? '✓ Done' : 'Soon'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
