'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isLiveNow } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Feed' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/live', label: 'Social' },
]

export default function Header() {
  const pathname = usePathname()
  const [live, setLive] = useState(false)

  useEffect(() => {
    setLive(isLiveNow())
    const interval = setInterval(() => setLive(isLiveNow()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-slate-950/98 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-xs font-black shadow-lg">
            AI
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm leading-tight">AI Summit 2026</div>
            <div className="text-slate-500 text-xs leading-tight">New Delhi · Feb 16–20</div>
          </div>
        </Link>

        {/* Live badge — inline, right after logo */}
        {live ? (
          <span className="flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-2 py-1 rounded-full shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-red-400 font-semibold text-xs">LIVE</span>
          </span>
        ) : (
          <span className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/40 px-2 py-1 rounded-full shrink-0">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-slate-400 text-xs">Pre-event</span>
          </span>
        )}

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-0.5 mx-auto">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hashtag pill — right side */}
        <span className="hidden lg:block ml-auto text-xs text-orange-400 bg-orange-950/40 border border-orange-500/20 px-2.5 py-1 rounded-full shrink-0 font-medium">
          #AISummitDelhi
        </span>
      </div>
    </header>
  )
}
