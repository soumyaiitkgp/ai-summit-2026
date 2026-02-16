'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Feed', icon: '📰' },
  { href: '/schedule', label: 'Schedule', icon: '🗓️' },
  { href: '/play', label: 'Play', icon: '🎯' },
  { href: '/insights', label: 'Insights', icon: '📊' },
  { href: '/live', label: 'Social', icon: '💬' },
]

export default function BottomNav() {
  const pathname = usePathname()
  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800">
      <div className="flex">
        {TABS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
              pathname === href ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
