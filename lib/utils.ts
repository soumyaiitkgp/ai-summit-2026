import { formatDistanceToNow, parseISO, format, isValid } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function relativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (!isValid(date)) return ''
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ''
  }
}

export function istTime(dateStr: string): string {
  try {
    const ist = toZonedTime(new Date(dateStr), 'Asia/Kolkata')
    return format(ist, 'HH:mm IST')
  } catch {
    return ''
  }
}

export function istDate(dateStr: string): string {
  try {
    const ist = toZonedTime(new Date(dateStr), 'Asia/Kolkata')
    return format(ist, 'dd MMM yyyy')
  } catch {
    return ''
  }
}

export function isLiveNow(): boolean {
  const now = toZonedTime(new Date(), 'Asia/Kolkata')
  const hour = now.getHours()
  const dateStr = format(now, 'yyyy-MM-dd')
  const summitDays = ['2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20']
  return summitDays.includes(dateStr) && hour >= 9 && hour < 19
}

export function getCurrentSummitDay(): number {
  const now = toZonedTime(new Date(), 'Asia/Kolkata')
  const dateStr = format(now, 'yyyy-MM-dd')
  const dayMap: Record<string, number> = {
    '2026-02-16': 1,
    '2026-02-17': 2,
    '2026-02-18': 3,
    '2026-02-19': 4,
    '2026-02-20': 5,
  }
  return dayMap[dateStr] ?? 0
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trim() + '…'
}
