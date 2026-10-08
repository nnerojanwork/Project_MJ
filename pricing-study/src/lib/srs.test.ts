import { describe, expect, it } from 'vitest'
import { AGAIN_DELAY_MS, dayKey, intervalLabel, isDue, review, streak } from './srs'

const DAY = 86_400_000
const now = new Date(2026, 9, 7, 12).getTime()

describe('review', () => {
  it('new card rated good → box 1, due in 1 day', () => {
    const s = review(undefined, 'good', now)
    expect(s).toMatchObject({ box: 1, reps: 1, lapses: 0, due: now + DAY })
  })
  it('easy skips a box', () => expect(review(undefined, 'easy', now)).toMatchObject({ box: 2, due: now + 3 * DAY }))
  it('again returns in 5 minutes and counts a lapse only once learned', () => {
    expect(review(undefined, 'again', now)).toMatchObject({ box: 0, lapses: 0, due: now + AGAIN_DELAY_MS })
    expect(review({ box: 3, due: 0, reps: 3, lapses: 0, last: 0 }, 'again', now).lapses).toBe(1)
  })
  it('box caps at 5 (35 days)', () => {
    expect(review({ box: 5, due: 0, reps: 9, lapses: 0, last: 0 }, 'easy', now)).toMatchObject({ box: 5, due: now + 35 * DAY })
  })
  it('isDue and labels', () => {
    expect(isDue(undefined, now)).toBe(false)
    expect(isDue({ box: 1, due: now, reps: 1, lapses: 0, last: 0 }, now)).toBe(true)
    expect(intervalLabel(undefined, 'good')).toBe('1d')
    expect(intervalLabel({ box: 2, due: 0, reps: 2, lapses: 0, last: 0 }, 'easy')).toBe('16d')
  })
})

describe('streak', () => {
  it('counts consecutive days ending today', () => {
    expect(streak([dayKey(now - 2 * DAY), dayKey(now - DAY), dayKey(now)], now)).toBe(3)
  })
  it('still counts if today is not done yet', () => {
    expect(streak([dayKey(now - 2 * DAY), dayKey(now - DAY)], now)).toBe(2)
  })
  it('breaks on a gap', () => expect(streak([dayKey(now - 3 * DAY), dayKey(now)], now)).toBe(1))
  it('zero with no activity', () => expect(streak([], now)).toBe(0))
})
