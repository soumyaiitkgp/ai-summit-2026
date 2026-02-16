'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Feed' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/live', label: 'Social' },
  { href: '/play', label: 'Play' },
  { href: '/insights', label: 'Insights' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-xs font-black">
            AI
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm leading-tight">AI Summit 2026</div>
            <div className="text-slate-400 text-xs leading-tight">Delhi Live Coverage</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
            #AISummitDelhi
          </span>
        </div>
      </div>
    </header>
  )
}
