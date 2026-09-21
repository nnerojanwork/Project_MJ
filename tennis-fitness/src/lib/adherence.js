import { getWeekKey, startOfWeek, addDays, toDateKey, monthKey } from './date.js'

const DAYS_PER_WEEK = 4

// A session "counts" toward adherence if at least one exercise was checked off.
function isAttended(session) {
  return session.completedExerciseIds && session.completedExerciseIds.length > 0
}

// Map of weekKey -> Set of dayIds attended that week
export function buildWeekMap(sessions) {
  const map = new Map()
  for (const s of sessions) {
    if (!isAttended(s)) continue
    const wk = getWeekKey(s.date)
    if (!map.has(wk)) map.set(wk, new Set())
    map.get(wk).add(s.dayId)
  }
  return map
}

export function weeklyAdherence(sessions, weekKey) {
  const map = buildWeekMap(sessions)
  const completed = map.get(weekKey)?.size ?? 0
  return { completed, scheduled: DAYS_PER_WEEK, percent: Math.round((completed / DAYS_PER_WEEK) * 100) }
}

// Series of the last `count` weeks (oldest first), ending at the current week.
export function weeklyAdherenceSeries(sessions, count = 8) {
  const map = buildWeekMap(sessions)
  const weeks = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const weekStart = addDays(startOfWeek(now), -7 * i)
    const wk = getWeekKey(weekStart)
    const completed = map.get(wk)?.size ?? 0
    weeks.push({ weekKey: wk, weekStart, completed, scheduled: DAYS_PER_WEEK, percent: Math.round((completed / DAYS_PER_WEEK) * 100) })
  }
  return weeks
}

export function currentStreak(sessions) {
  const map = buildWeekMap(sessions)
  const now = new Date()
  let streak = 0
  let cursor = startOfWeek(now)
  const currentWeekKey = getWeekKey(cursor)
  const currentCompleted = map.get(currentWeekKey)?.size ?? 0

  // Don't let an in-progress current week break the streak; just skip it
  // unless it's already fully complete, in which case it kicks the streak off.
  if (currentCompleted >= DAYS_PER_WEEK) {
    streak += 1
  }
  cursor = addDays(cursor, -7)

  while (true) {
    const wk = getWeekKey(cursor)
    const completed = map.get(wk)?.size ?? 0
    if (completed >= DAYS_PER_WEEK) {
      streak += 1
      cursor = addDays(cursor, -7)
    } else {
      break
    }
  }
  return streak
}

export function monthlyAdherence(sessions, refDate = new Date()) {
  const mKey = monthKey(refDate)
  const map = buildWeekMap(sessions)

  // Find every ISO week that has at least one day falling in this month.
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)
  const weekKeysInMonth = new Set()
  for (let d = new Date(firstOfMonth); d <= lastOfMonth; d = addDays(d, 1)) {
    weekKeysInMonth.add(getWeekKey(d))
  }

  const scheduled = weekKeysInMonth.size * DAYS_PER_WEEK

  // Count attended sessions whose date actually falls within the month
  // (a week can straddle two months — only count days inside this one).
  let completed = 0
  const sessionsInMonth = sessions.filter((s) => isAttended(s) && monthKey(s.date) === mKey)
  const seen = new Set()
  for (const s of sessionsInMonth) {
    const key = `${toDateKey(s.date)}-${s.dayId}`
    if (seen.has(key)) continue
    seen.add(key)
    completed += 1
  }

  return { completed, scheduled, percent: scheduled ? Math.round((completed / scheduled) * 100) : 0 }
}
