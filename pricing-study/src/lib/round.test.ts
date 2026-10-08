import { describe, expect, it } from 'vitest'
import { quizEntries, srsCards } from '../content'
import { advanceRound, buildRound, MIN_QUICK_ITEMS, needsNewRound, NEW_PER_DAY, QUICK_SIZE, SESSION_SIZE, SUMMARY_TTL_MS } from './round'
import { dayKey } from './srs'
import { applyCardReview, initialState, normalise, parseImport, type State } from './store'

const now = new Date(2026, 9, 7, 12).getTime()
const rand = () => 0.5

function withCards(s: State, ids: string[], dueOffset: number): State {
  const srs = { ...s.srs }
  ids.forEach((id, i) => (srs[id] = { box: 2, due: now + dueOffset + i, reps: 2, lapses: 0, last: now - 1e9 }))
  return { ...s, srs }
}

describe('buildRound', () => {
  it('fresh start: 4 new cards then 1 quiz-or-concept, all within week 1', () => {
    const r = buildRound(initialState(), now, QUICK_SIZE, undefined, rand)
    expect(r.items).toHaveLength(QUICK_SIZE)
    expect(r.items.filter((i) => i.kind === 'card')).toHaveLength(4)
    const weekOf = (id: string) => srsCards.find((c) => c.id === id)!.week
    for (const i of r.items) if (i.kind === 'card') expect(weekOf(i.id)).toBe(1)
    expect(r.items.at(-1)!.kind).not.toBe('card')
  })

  it('due cards come first, oldest due first, and fill up to 4 slots', () => {
    const week1 = srsCards.filter((c) => c.week === 1).map((c) => c.id)
    const s = withCards(initialState(), week1.slice(0, 6), -10_000)
    const r = buildRound(s, now, QUICK_SIZE, undefined, rand)
    expect(r.items.slice(0, 4).map((i) => i.id)).toEqual(week1.slice(0, 4))
    expect(r.items).toHaveLength(5)
    expect(['quiz', 'concept']).toContain(r.items[4].kind)
  })

  it('cards not yet due are not served as due', () => {
    const week1 = srsCards.filter((c) => c.week === 1).map((c) => c.id)
    const s = withCards({ ...initialState(), newCards: { day: dayKey(now), count: NEW_PER_DAY } }, week1, 60_000)
    const r = buildRound(s, now, QUICK_SIZE, undefined, rand)
    expect(r.items.some((i) => i.kind === 'card')).toBe(false)
    expect(r.items).toHaveLength(MIN_QUICK_ITEMS)
  })

  it('respects the daily new-card cap', () => {
    const s = { ...initialState(), newCards: { day: dayKey(now), count: NEW_PER_DAY - 1 } }
    const r = buildRound(s, now, QUICK_SIZE, undefined, rand)
    expect(r.items.filter((i) => i.kind === 'card')).toHaveLength(1)
    expect(r.items).toHaveLength(MIN_QUICK_ITEMS)
  })

  it('a quick round with cards has exactly one quiz-or-concept item', () => {
    const r = buildRound(initialState(), now, QUICK_SIZE, undefined, rand)
    expect(r.items.filter((i) => i.kind !== 'card')).toHaveLength(1)
  })

  it('never includes content beyond the current week', () => {
    const s = { ...initialState(), currentWeek: 2 }
    const r = buildRound(s, now, SESSION_SIZE, undefined, rand)
    for (const i of r.items) {
      if (i.kind === 'quiz') expect(quizEntries.find((e) => e.q.id === i.id)!.week).toBeLessThanOrEqual(2)
      if (i.kind === 'concept') expect(Number(i.id.match(/^w(\d+)/)![1])).toBeLessThanOrEqual(2)
    }
  })

  it('first round leads with a quiz; the next with a concept card', () => {
    expect(buildRound(initialState(), now, QUICK_SIZE, undefined, rand).items.at(-1)!.kind).toBe('quiz')
    expect(buildRound({ ...initialState(), roundsCompleted: 1 }, now, QUICK_SIZE, undefined, rand).items.at(-1)!.kind).toBe('concept')
  })

  it('5-minute session mixes more quiz items and has no duplicates', () => {
    const r = buildRound(initialState(), now, SESSION_SIZE, undefined, rand)
    expect(r.items.length).toBeLessThanOrEqual(SESSION_SIZE)
    expect(new Set(r.items.map((i) => i.kind + i.id)).size).toBe(r.items.length)
    expect(r.items.filter((i) => i.kind !== 'card').length).toBeGreaterThanOrEqual(3)
  })
})

describe('round lifecycle', () => {
  it('advancing past the last item marks it finished', () => {
    let r = buildRound(initialState(), now, QUICK_SIZE, undefined, rand)
    for (let i = 0; i < r.items.length; i++) r = advanceRound(r, now)
    expect(r.finishedAt).toBe(now)
  })
  it('resumes an unfinished round however old; replaces a stale finished one', () => {
    const r = buildRound(initialState(), now - 7 * 86_400_000, QUICK_SIZE, undefined, rand)
    expect(needsNewRound(r, now)).toBe(false)
    expect(needsNewRound({ ...r, finishedAt: now - 1000 }, now)).toBe(false)
    expect(needsNewRound({ ...r, finishedAt: now - SUMMARY_TTL_MS - 1 }, now)).toBe(true)
    expect(needsNewRound(null, now)).toBe(true)
  })
  it('reviewing a new card counts toward today’s new-card total', () => {
    const s = applyCardReview(initialState(), srsCards[0].id, 'good', now)
    expect(s.newCards).toEqual({ day: dayKey(now), count: 1 })
    expect(applyCardReview(s, srsCards[0].id, 'good', now).newCards.count).toBe(1)
  })
})

describe('export / import', () => {
  it('round-trips state', () => {
    const s = { ...initialState(), currentWeek: 4, selfCheck: { 'w1-sc1': true } }
    const text = JSON.stringify({ app: 'pricing-study', state: s })
    expect(parseImport(text)).toEqual(s)
  })
  it('rejects foreign or broken files', () => {
    expect(() => parseImport('nope')).toThrow(/not valid JSON/)
    expect(() => parseImport('{"foo":1}')).toThrow(/not a Pricing Study export/)
    expect(() => parseImport(JSON.stringify({ app: 'pricing-study', state: { version: 99 } }))).toThrow(/newer version/)
  })
  it('fills missing fields from older saves', () => {
    expect(normalise({ version: 1, currentWeek: 3 }).journal.researchLog).toEqual([])
  })
})

describe('typed-answer questions', () => {
  it('quick rounds and sessions never include numeric (typed) questions', () => {
    for (let wk = 1; wk <= 10; wk++) {
      for (let r = 0; r < 4; r++) {
        const s = { ...initialState(), currentWeek: wk, roundsCompleted: r * 2 }
        const round = buildRound(s, now, SESSION_SIZE, undefined, Math.random)
        for (const i of round.items) {
          if (i.kind === 'quiz') expect(quizEntries.find((e) => e.q.id === i.id)!.q.type).not.toBe('numeric')
        }
      }
    }
  })
})
