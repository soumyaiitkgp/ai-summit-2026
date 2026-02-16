import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'AI Summit 2026 Delhi — Live Coverage',
  description:
    'Live news aggregator for AI Summit 2026, New Delhi. Real-time coverage from 16+ sources, expert curation, session tracking, and interactive features.',
  keywords: ['AI Summit 2026', 'Delhi', 'AI news', 'AISummitDelhi', 'artificial intelligence India'],
  openGraph: {
    title: 'AI Summit 2026 Delhi — Live Coverage',
    description: 'Your one-stop live coverage hub for AI Summit 2026, New Delhi.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Summit 2026 Delhi — Live Coverage',
    description: 'Your one-stop live coverage hub for AI Summit 2026, New Delhi.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-5 pb-20 md:pb-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
