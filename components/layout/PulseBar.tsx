'use client'
import { useEffect, useState } from 'react'
import { isLiveNow } from '@/lib/utils'

interface PulseBarProps {
  activeSession?: string
  itemsToday?: number
}

export default function PulseBar({ activeSession, itemsToday = 0 }: PulseBarProps) {
  const [live, setLive] = useState(false)

  useEffect(() => {
    setLive(isLiveNow())
    const interval = setInterval(() => setLive(isLiveNow()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-900/40 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm overflow-hidden">
        {live ? (
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-400 font-semibold tracking-wide text-xs uppercase">Live</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            <span className="text-slate-400 font-semibold tracking-wide text-xs uppercase">Pre-event</span>
          </span>
        )}

        <span className="text-slate-400 shrink-0">|</span>

        {activeSession ? (
          <span className="text-blue-300 truncate">
            <span className="text-slate-400 mr-1">Now:</span>
            {activeSession}
          </span>
        ) : (
          <span className="text-slate-400 truncate">AI Summit 2026 · New Delhi, India · Feb 16–20</span>
        )}

        <span className="ml-auto shrink-0 text-orange-400 font-medium text-xs">
          {itemsToday > 0 ? `${itemsToday} items today` : 'Coverage loading…'}
        </span>
      </div>
    </div>
  )
}
