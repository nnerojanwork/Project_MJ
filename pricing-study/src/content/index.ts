import syllabusJson from './syllabus.json'
import generatedJson from './generated.json'
import type { Flashcard, Generated, QuizQuestion, Syllabus, Week } from './types'

export const syllabus = syllabusJson as Syllabus
export const generated = generatedJson as Generated

export const weeks: Week[] = syllabus.weeks
export const weekCount = weeks.length

export function getWeek(n: number): Week | undefined {
  return weeks.find((w) => w.week === n)
}

/** Week number a concept ID belongs to, e.g. "w3-c2" → 3. */
export function weekOfConcept(conceptId: string): number {
  return Number(conceptId.match(/^w(\d+)-/)?.[1] ?? 0)
}

export const conceptById = new Map(weeks.flatMap((w) => w.coreConcepts.map((c) => [c.id, c] as const)))

export interface QuizEntry {
  week: number
  q: QuizQuestion
}

export const quizEntries: QuizEntry[] = weeks.flatMap((w) =>
  (generated.quiz[w.id] ?? []).map((q) => ({ week: w.week, q })),
)
export const quizById = new Map(quizEntries.map((e) => [e.q.id, e]))

/** Spaced-repetition cards. Week 0 cards (reference) are available from week 1 and queued after week-specific ones. */
export interface SrsCard {
  id: string
  week: number
  card: Flashcard
}

const order = (w: number) => (w === 0 ? Number.MAX_SAFE_INTEGER : w)
export const srsCards: SrsCard[] = generated.flashcards
  .map((card) => ({ id: card.id, week: card.week, card }))
  .sort((a, b) => order(a.week) - order(b.week))

export const srsCardById = new Map(srsCards.map((c) => [c.id, c]))

export const allSelfCheckIds = weeks.flatMap((w) => w.selfCheck.map((s) => s.id))
