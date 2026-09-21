export function toDateKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey() {
  return toDateKey(new Date())
}

// Monday-start week
export function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay() // 0 = Sun
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d
}

export function endOfWeek(date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

export function getWeekKey(date) {
  const d = new Date(date)
  const week = isoWeekNumber(d)
  // Use the Thursday-anchored year (matches ISO week numbering) for the label.
  const anchor = new Date(d)
  anchor.setDate(anchor.getDate() + (4 - (anchor.getDay() || 7)))
  return `${anchor.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatShort(date) {
  return new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatWeekRange(weekKey) {
  // weekKey like 2026-W01; reconstruct a date within that ISO week for display
  const [yearStr, wStr] = weekKey.split('-W')
  const year = Number(yearStr)
  const week = Number(wStr)
  const jan4 = new Date(year, 0, 4)
  const start = startOfWeek(jan4)
  start.setDate(start.getDate() + (week - 1) * 7)
  const end = addDays(start, 6)
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
}

export function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
