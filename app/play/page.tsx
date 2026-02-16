'use client'
import { useState, useEffect } from 'react'
import bingoSquaresData from '@/public/data/bingo-squares.json'

const ALL_SQUARES: string[] = bingoSquaresData

function seededShuffle(arr: string[], seed: number): string[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getOrCreateSeed(): number {
  if (typeof window === 'undefined') return 42
  let seed = parseInt(localStorage.getItem('bingo_seed') || '0')
  if (!seed) {
    seed = Math.floor(Math.random() * 1000000)
    localStorage.setItem('bingo_seed', String(seed))
  }
  return seed
}

function getStoredChecked(): boolean[] {
  if (typeof window === 'undefined') return Array(25).fill(false)
  try {
    const stored = localStorage.getItem('bingo_checked')
    if (stored) return JSON.parse(stored)
  } catch {}
  return Array(25).fill(false)
}

export default function PlayPage() {
  const [squares, setSquares] = useState<string[]>([])
  const [checked, setChecked] = useState<boolean[]>(Array(25).fill(false))
  const [hasBingo, setHasBingo] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [stampDays, setStampDays] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)
    const seed = getOrCreateSeed()
    const shuffled = seededShuffle(ALL_SQUARES, seed).slice(0, 25)
    // Free space in center (index 12)
    shuffled[12] = 'FREE SPACE'
    setSquares(shuffled)

    const storedChecked = getStoredChecked()
    // Free space always checked
    storedChecked[12] = true
    setChecked(storedChecked)

    // Passport stamps
    const today = new Date().toISOString().slice(0, 10)
    const visitedDays = JSON.parse(localStorage.getItem('visited_days') || '[]') as string[]
    if (!visitedDays.includes(today)) {
      visitedDays.push(today)
      localStorage.setItem('visited_days', JSON.stringify(visitedDays))
    }
    // Convert to day numbers
    const dayMap: Record<string, number> = {
      '2026-02-16': 1,
      '2026-02-17': 2,
      '2026-02-18': 3,
      '2026-02-19': 4,
      '2026-02-20': 5,
    }
    setStampDays(visitedDays.map((d) => dayMap[d]).filter(Boolean))
  }, [])

  useEffect(() => {
    if (checked.length === 25) {
      localStorage.setItem('bingo_checked', JSON.stringify(checked))
      checkBingo()
    }
  }, [checked])

  function toggleSquare(i: number) {
    if (i === 12) return // Free space always on
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  function checkBingo() {
    const c = checked
    // Rows
    for (let r = 0; r < 5; r++) {
      if ([0, 1, 2, 3, 4].every((col) => c[r * 5 + col])) { setHasBingo(true); return }
    }
    // Cols
    for (let col = 0; col < 5; col++) {
      if ([0, 1, 2, 3, 4].every((r) => c[r * 5 + col])) { setHasBingo(true); return }
    }
    // Diagonals
    if ([0, 6, 12, 18, 24].every((i) => c[i])) { setHasBingo(true); return }
    if ([4, 8, 12, 16, 20].every((i) => c[i])) { setHasBingo(true); return }
  }

  function shareCard() {
    const state = checked.map((v) => (v ? '1' : '0')).join('')
    const url = `${window.location.origin}/play?bingo=${state}`
    navigator.clipboard.writeText(url).then(() => alert('Link copied! Share your bingo card.'))
  }

  if (!mounted) return null

  const SUMMIT_DAYS = [1, 2, 3, 4, 5]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Play</h1>
        <p className="text-slate-400 text-sm mt-1">Games and collectibles for summit followers</p>
      </div>

      {/* Bingo Card */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-lg">AI Summit Bingo</h2>
            <p className="text-slate-400 text-xs">Check off squares as things happen at the summit</p>
          </div>
          <button
            onClick={shareCard}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Share Card
          </button>
        </div>

        {hasBingo && (
          <div className="mb-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center text-white font-bold text-lg animate-bounce">
            🎉 BINGO! You got it!
          </div>
        )}

        <div className="grid grid-cols-5 gap-1.5">
          {squares.map((square, i) => (
            <button
              key={i}
              onClick={() => toggleSquare(i)}
              className={`aspect-square rounded-lg p-1 text-xs font-medium text-center flex items-center justify-center leading-tight transition-all ${
                i === 12
                  ? 'bg-orange-500 text-white cursor-default'
                  : checked[i]
                  ? 'bg-blue-600 text-white scale-95'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {square}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-2 text-center">
          {checked.filter(Boolean).length - 1} / 24 squares checked
        </p>
      </section>

      {/* Digital Passport */}
      <section className="mb-10">
        <h2 className="text-white font-bold text-lg mb-1">Your Summit Passport</h2>
        <p className="text-slate-400 text-xs mb-4">Collect a stamp for each day you follow the summit</p>
        <div className="grid grid-cols-5 gap-3">
          {SUMMIT_DAYS.map((day) => {
            const collected = stampDays.includes(day)
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  collected
                    ? 'border-orange-500 bg-orange-950/30'
                    : 'border-slate-700 bg-slate-900/50 opacity-40'
                }`}
              >
                <span className="text-2xl">{collected ? '🏆' : '🔒'}</span>
                <span className={`text-xs font-bold ${collected ? 'text-orange-400' : 'text-slate-600'}`}>
                  Day {day}
                </span>
              </div>
            )
          })}
        </div>
        {stampDays.length === 5 && (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/40 p-4 text-center">
            <p className="text-orange-300 font-bold">🏅 Full Summit Follower!</p>
            <p className="text-slate-400 text-xs mt-1">You followed all 5 days of AI Summit 2026</p>
          </div>
        )}
      </section>

      {/* Predictions */}
      <section>
        <h2 className="text-white font-bold text-lg mb-1">Daily Predictions</h2>
        <p className="text-slate-400 text-xs mb-4">Vote before the day starts. Results revealed at end of day.</p>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 text-center text-slate-500">
          <p className="text-3xl mb-3">🔮</p>
          <p className="font-medium">Predictions for each day will appear here</p>
          <p className="text-sm mt-1">Added by editors before each summit day begins</p>
        </div>
      </section>
    </div>
  )
}
