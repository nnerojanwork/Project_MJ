// Leitner-style spaced repetition. Box 0 = learning/lapsed, boxes 1–5 = increasing intervals.

export type Rating = 'again' | 'good' | 'easy'

export interface CardState {
  box: number
  due: number
  reps: number
  lapses: number
  last: number
}

export const MAX_BOX = 5
/** Days until next review after landing in each box (index = box). */
export const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35]
/** "Again" brings the card back after a short gap, so it can reappear in the next round. */
export const AGAIN_DELAY_MS = 5 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function review(prev: CardState | undefined, rating: Rating, now: number): CardState {
  const box = prev?.box ?? 0
  const reps = (prev?.reps ?? 0) + 1
  const lapses = (prev?.lapses ?? 0) + (rating === 'again' && box >= 2 ? 1 : 0)
  if (rating === 'again') return { box: 0, due: now + AGAIN_DELAY_MS, reps, lapses, last: now }
  const next = Math.min(MAX_BOX, box + (rating === 'easy' ? 2 : 1))
  return { box: next, due: now + INTERVAL_DAYS[next] * DAY_MS, reps, lapses, last: now }
}

export function isDue(state: CardState | undefined, now: number): boolean {
  return !!state && state.due <= now
}

/** Preview label for a rating button, e.g. "1d", "7d", "5m". */
export function intervalLabel(prev: CardState | undefined, rating: Rating): string {
  if (rating === 'again') return '5m'
  const box = Math.min(MAX_BOX, (prev?.box ?? 0) + (rating === 'easy' ? 2 : 1))
  return `${INTERVAL_DAYS[box]}d`
}

/** Local calendar day key, YYYY-MM-DD. */
export function dayKey(ts: number): string {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Consecutive days with activity, ending today (or yesterday if nothing yet today). */
export function streak(days: string[], now: number): number {
  const set = new Set(days)
  let cursor = now
  if (!set.has(dayKey(cursor))) cursor -= DAY_MS
  let n = 0
  while (set.has(dayKey(cursor))) {
    n++
    cursor -= DAY_MS
  }
  return n
}
