'use client'
import { useState, useEffect } from 'react'
import sessionsData from '@/public/data/sessions.json'
import type { Session } from '@/lib/types'
import { istTime } from '@/lib/utils'
import { toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'

const sessions = sessionsData as Session[]

const TYPE_ICONS: Record<string, string> = {
  keynote: '🎤', panel: '👥', fireside: '🔥', workshop: '🛠️', break: '☕',
}

function getTodayDayNumber(): number {
  const ist = toZonedTime(new Date(), 'Asia/Kolkata')
  const today = format(ist, 'yyyy-MM-dd')
  const map: Record<string, number> = {
    '2026-02-16': 1, '2026-02-17': 2, '2026-02-18': 3,
    '2026-02-19': 4, '2026-02-20': 5,
  }
  return map[today] ?? 0
}

function getCurrentSessionId(): string | null {
  const ist = toZonedTime(new Date(), 'Asia/Kolkata')
  const today = format(ist, 'yyyy-MM-dd')
  const nowMin = ist.getHours() * 60 + ist.getMinutes()
  const dayNum = getTodayDayNumber()
  if (!dayNum) return null
  const todaySessions = sessions.filter((s) => s.day === dayNum && s.date === today)
  for (const s of todaySessions) {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    if (nowMin >= sh * 60 + sm && nowMin <= eh * 60 + em) return s.id
  }
  return null
}

export default function SchedulePage() {
  const todayDay = getTodayDayNumber()
  const [activeDay, setActiveDay] = useState(todayDay || 1)
  const [currentId, setCurrentId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentId(getCurrentSessionId())
    const interval = setInterval(() => setCurrentId(getCurrentSessionId()), 60000)
    return () => clearInterval(interval)
  }, [])

  const daySessions = sessions.filter((s) => s.day === activeDay)

  const DAY_LABELS: Record<number, string> = {
    1: 'Feb 16', 2: 'Feb 17', 3: 'Feb 18', 4: 'Feb 19', 5: 'Feb 20',
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Schedule</h1>
        <p className="text-slate-500 text-sm">Bharat Mandapam, New Delhi</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
        {[1, 2, 3, 4, 5].map((day) => (
          <button key={day} onClick={() => setActiveDay(day)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeDay === day
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className="font-semibold">Day {day}</div>
            <div className="text-xs opacity-70">{DAY_LABELS[day]}</div>
            {day === todayDay && <div className="text-[10px] text-orange-400 font-bold">TODAY</div>}
          </button>
        ))}
      </div>

      {/* Sessions */}
      <div className="space-y-2">
        {daySessions.map((session) => {
          const isLive = session.id === currentId
          const isPast = session.status === 'concluded'
          return (
            <div key={session.id}
              className={`rounded-2xl border p-4 transition-all ${
                isLive
                  ? 'border-orange-500/60 bg-gradient-to-r from-orange-950/30 to-slate-950 shadow-lg shadow-orange-950/20'
                  : isPast
                  ? 'border-slate-800/40 bg-slate-900/20 opacity-50'
                  : 'border-slate-800/60 bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Time */}
                <div className="shrink-0 w-14 text-right">
                  <div className={`font-mono text-sm font-bold ${isLive ? 'text-orange-400' : 'text-slate-500'}`}>
                    {session.startTime}
                  </div>
                  <div className="text-slate-700 text-xs">{session.endTime}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-base">{TYPE_ICONS[session.type] || '📌'}</span>
                    <h3 className={`font-semibold text-sm leading-snug ${isLive ? 'text-white' : 'text-slate-200'}`}>
                      {session.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs">
                    {session.speaker}
                    {session.speakerTitle && <span className="text-slate-600"> · {session.speakerTitle}</span>}
                  </p>
                  {session.venue && (
                    <p className="text-slate-700 text-xs mt-0.5">📍 {session.venue}</p>
                  )}
                </div>

                {/* Status chip */}
                <div className="shrink-0">
                  {isLive ? (
                    <span className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
                      </span>
                      Live
                    </span>
                  ) : isPast ? (
                    <span className="text-xs text-slate-600 px-2">Done</span>
                  ) : (
                    <span className="text-xs text-slate-600 px-2">Soon</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
