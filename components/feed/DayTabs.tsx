'use client'

const DAYS = [
  { day: 0, label: 'All' },
  { day: 1, label: 'Day 1', date: 'Feb 16' },
  { day: 2, label: 'Day 2', date: 'Feb 17' },
  { day: 3, label: 'Day 3', date: 'Feb 18' },
  { day: 4, label: 'Day 4', date: 'Feb 19' },
  { day: 5, label: 'Day 5', date: 'Feb 20' },
]

interface Props {
  activeDay: number
  onDayChange: (day: number) => void
  dayCounts?: Record<number, number>
}

export default function DayTabs({ activeDay, onDayChange, dayCounts = {} }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {DAYS.map(({ day, label, date }) => (
        <button
          key={day}
          onClick={() => onDayChange(day)}
          className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeDay === day
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span>{label}</span>
          {date && <span className="text-[10px] opacity-70">{date}</span>}
          {dayCounts[day] > 0 && (
            <span className={`text-[10px] mt-0.5 ${activeDay === day ? 'text-blue-200' : 'text-slate-500'}`}>
              {dayCounts[day]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
