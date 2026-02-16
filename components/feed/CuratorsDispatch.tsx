'use client'
import { useEffect, useState } from 'react'
import { relativeTime } from '@/lib/utils'

interface Dispatch {
  text: string
  updated_at: string
}

export default function CuratorsDispatch() {
  const [dispatch, setDispatch] = useState<Dispatch | null>(null)

  useEffect(() => {
    fetch('/api/admin/dispatch')
      .then((r) => r.json())
      .then((d) => d.dispatch && setDispatch(d.dispatch))
      .catch(() => null)
  }, [])

  if (!dispatch?.text) return null

  return (
    <div className="rounded-xl border border-orange-500/40 bg-gradient-to-br from-orange-950/40 to-slate-900 p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">✍️ Editor's Dispatch</span>
        <span className="ml-auto text-xs text-slate-500">{relativeTime(dispatch.updated_at)}</span>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{dispatch.text}</p>
    </div>
  )
}
