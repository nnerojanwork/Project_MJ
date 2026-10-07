import syllabusJson from './syllabus.json'
import generatedJson from './generated.json'
import type { ExplainCard, Flashcard, Generated, QuizQuestion, Syllabus, Week } from './types'

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

/** Spaced-repetition cards: flashcards plus "explain it" cards share one pool. */
export type SrsCard =
  | { type: 'flash'; id: string; week: number; card: Flashcard }
  | { type: 'explain'; id: string; week: number; card: ExplainCard }

const flash: SrsCard[] = generated.flashcards.map((card) => ({ type: 'flash' as const, id: card.id, week: card.week, card }))
const explain: SrsCard[] = generated.explainCards.map((card) => ({ type: 'explain' as const, id: card.id, week: card.week, card }))

/** Within each week, slot an "explain it" card after every two flashcards so new cards arrive mixed. */
export const srsCards: SrsCard[] = weeks.flatMap((w) => {
  const f = flash.filter((c) => c.week === w.week)
  const e = explain.filter((c) => c.week === w.week)
  const out: SrsCard[] = []
  while (f.length || e.length) {
    out.push(...f.splice(0, 2))
    if (e.length) out.push(e.shift()!)
  }
  return out
})

export const srsCardById = new Map(srsCards.map((c) => [c.id, c]))

export const allSelfCheckIds = weeks.flatMap((w) => w.selfCheck.map((s) => s.id))
