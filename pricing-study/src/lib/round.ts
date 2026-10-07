// Quick rounds: up to 5 tap-only items. Due cards first, then new cards, then one quiz question or concept card.
import { conceptById, quizEntries, srsCards, weekOfConcept, weeks, type QuizEntry, type SrsCard } from '../content'
import type { Rating } from './srs'
import { dayKey, isDue } from './srs'
import type { Round, RoundItem, State } from './store'
import { applyCardReview, applyQuizAnswer, getState, markActive, update } from './store'

export const QUICK_SIZE = 5
export const SESSION_SIZE = 12
export const NEW_PER_DAY = 15
/** Quick rounds never drop below this many items, even when no cards are due. */
export const MIN_QUICK_ITEMS = 3
/** A finished round's summary stays on screen this long before reopening starts a fresh round. */
export const SUMMARY_TTL_MS = 30 * 60 * 1000

export interface RoundContent {
  cards: SrsCard[]
  quiz: QuizEntry[]
  conceptIds: string[]
}

const defaultContent: RoundContent = {
  cards: srsCards,
  quiz: quizEntries,
  conceptIds: weeks.flatMap((w) => w.coreConcepts.map((c) => c.id)),
}

export function newCardAllowance(s: State, now: number): number {
  const used = s.newCards.day === dayKey(now) ? s.newCards.count : 0
  return Math.max(0, NEW_PER_DAY - used)
}

export function dueCards(s: State, now: number, cards: SrsCard[] = srsCards): SrsCard[] {
  return cards
    .filter((c) => c.week <= s.currentWeek && isDue(s.srs[c.id], now))
    .sort((a, b) => s.srs[a.id].due - s.srs[b.id].due)
}

export function newCards(s: State, cards: SrsCard[] = srsCards): SrsCard[] {
  return cards.filter((c) => c.week <= s.currentWeek && !s.srs[c.id])
}

function accuracy(stat: { a: number; c: number } | undefined): number {
  return stat && stat.a > 0 ? stat.c / stat.a : 1
}

/** Lower score = asked sooner. Unseen current-week questions first, then weak topics, then stale ones. */
export function quizPriority(s: State, e: QuizEntry, now: number): number {
  const stat = s.quizStats.byQuestion[e.q.id]
  if (!stat) return e.week === s.currentWeek ? -2 : -1
  const weakest = Math.min(...e.q.conceptIds.map((c) => accuracy(s.quizStats.byConcept[c])))
  const daysSince = (now - stat.last) / 86_400_000
  return accuracy(stat) + weakest - Math.min(daysSince, 30) / 30
}

export function pickQuiz(s: State, now: number, exclude: Set<string>, quiz: QuizEntry[], rand: () => number) {
  const pool = quiz.filter((e) => e.week <= s.currentWeek && !exclude.has(e.q.id))
  if (!pool.length) return undefined
  return pool
    .map((e) => ({ e, p: quizPriority(s, e, now) + rand() * 0.05 }))
    .sort((a, b) => a.p - b.p)[0].e
}

export function pickConcept(s: State, exclude: Set<string>, conceptIds: string[]) {
  const pool = conceptIds.filter((id) => weekOfConcept(id) <= s.currentWeek && !exclude.has(id))
  const unseen = pool.filter((id) => !s.conceptsSeen[id])
  if (unseen.length) {
    // Current week's concepts first, then earliest weeks.
    return unseen.find((id) => weekOfConcept(id) === s.currentWeek) ?? unseen[0]
  }
  return pool.sort((a, b) => s.conceptsSeen[a] - s.conceptsSeen[b])[0]
}

export function buildRound(
  s: State,
  now: number,
  size: number = QUICK_SIZE,
  content: RoundContent = defaultContent,
  rand: () => number = Math.random,
): Round {
  const otherSlots = size <= QUICK_SIZE ? 1 : Math.round(size / 4)
  const cardSlots = size - otherSlots
  const quick = size <= QUICK_SIZE
  const newPerRound = quick ? cardSlots : 5

  const cards = dueCards(s, now, content.cards).slice(0, cardSlots)
  const room = Math.min(cardSlots - cards.length, newCardAllowance(s, now), newPerRound)
  if (room > 0) cards.push(...newCards(s, content.cards).slice(0, room))

  const items: RoundItem[] = cards.map((c) => ({ kind: 'card', id: c.id }))
  const usedQuiz = new Set<string>()
  const usedConcepts = new Set<string>()
  // Quick rounds: the cards plus one quiz-or-concept item. Sessions fill every slot.
  const target = quick ? Math.min(size, Math.max(items.length + 1, MIN_QUICK_ITEMS)) : size
  // Alternate quiz / concept between rounds and within longer sessions.
  let wantQuiz = s.roundsCompleted % 2 === 0
  while (items.length < target) {
    const q = wantQuiz ? undefined : pickConcept(s, usedConcepts, content.conceptIds)
    if (q) {
      usedConcepts.add(q)
      items.push({ kind: 'concept', id: q })
    } else {
      const e = pickQuiz(s, now, usedQuiz, content.quiz, rand)
      if (e) {
        usedQuiz.add(e.q.id)
        items.push({ kind: 'quiz', id: e.q.id })
      } else {
        const c = pickConcept(s, usedConcepts, content.conceptIds)
        if (!c) break
        usedConcepts.add(c)
        items.push({ kind: 'concept', id: c })
      }
    }
    wantQuiz = !wantQuiz
  }

  return { items, index: 0, phase: 'front', choice: null, size, correct: 0, answered: 0, startedAt: now, finishedAt: null }
}

// ---- Round state transitions (pure) ----

export function advanceRound(r: Round, now: number): Round {
  const index = r.index + 1
  return { ...r, index, phase: 'front', choice: null, finishedAt: index >= r.items.length ? now : null }
}

/** Should opening the round screen start a new round? */
export function needsNewRound(r: Round | null, now: number): boolean {
  if (!r || !r.items.length) return true
  return r.finishedAt !== null && now - r.finishedAt > SUMMARY_TTL_MS
}

function finishIfDone(s: State, r: Round, now: number): State {
  const next = { ...s, round: r }
  return r.finishedAt !== null ? markActive({ ...next, roundsCompleted: s.roundsCompleted + 1 }, now) : next
}

// ---- Store actions: each tap saves immediately ----

export function startRound(size: number = QUICK_SIZE) {
  const now = Date.now()
  update((s) => ({ ...s, round: buildRound(s, now, size) }))
}

export function ensureRound() {
  if (needsNewRound(getState().round, Date.now())) startRound(QUICK_SIZE)
}

export function revealCurrent() {
  update((s) => (s.round && s.round.phase === 'front' ? { ...s, round: { ...s.round, phase: 'revealed' } } : s))
}

export function rateCurrentCard(rating: Rating) {
  const now = Date.now()
  update((s) => {
    const r = s.round
    const item = r?.items[r.index]
    if (!r || item?.kind !== 'card') return s
    const reviewed = markActive(applyCardReview(s, item.id, rating, now), now)
    return finishIfDone(reviewed, advanceRound(r, now), now)
  })
}

export function answerCurrentQuiz(choice: number) {
  const now = Date.now()
  update((s) => {
    const r = s.round
    const item = r?.items[r.index]
    if (!r || item?.kind !== 'quiz' || r.phase === 'answered') return s
    const entry = quizEntries.find((e) => e.q.id === item.id)
    if (!entry) return s
    const correct = choice === entry.q.answerIndex
    const answered = markActive(applyQuizAnswer(s, item.id, entry.q.conceptIds, correct, now), now)
    return {
      ...answered,
      round: { ...r, phase: 'answered', choice, answered: r.answered + 1, correct: r.correct + (correct ? 1 : 0) },
    }
  })
}

/** Advance past a quiz (after answering) or a concept card. Cards advance via rating. */
export function advanceCurrent() {
  const now = Date.now()
  update((s) => {
    const r = s.round
    const item = r?.items[r.index]
    if (!r || !item || r.finishedAt !== null) return s
    if (item.kind === 'card') return s
    if (item.kind === 'quiz' && r.phase !== 'answered') return s
    const seen = item.kind === 'concept' ? { ...s.conceptsSeen, [item.id]: now } : s.conceptsSeen
    return finishIfDone(markActive({ ...s, conceptsSeen: seen }, now), advanceRound(r, now), now)
  })
}

/** Skip an item whose content no longer exists (e.g. after editing the JSON). */
export function skipCurrent() {
  const now = Date.now()
  update((s) => (s.round ? finishIfDone(s, advanceRound(s.round, now), now) : s))
}

export function itemExists(item: RoundItem): boolean {
  if (item.kind === 'card') return srsCards.some((c) => c.id === item.id)
  if (item.kind === 'quiz') return quizEntries.some((e) => e.q.id === item.id)
  return conceptById.has(item.id)
}
