// All progress lives in one localStorage record, saved synchronously on every change
// so closing the app mid-round loses nothing.
import { useSyncExternalStore } from 'react'
import type { CardState, Rating } from './srs'
import { dayKey, review } from './srs'

export const STORAGE_KEY = 'pricing-study:v1'
export const SCHEMA_VERSION = 1

export type RoundItem =
  | { kind: 'card'; id: string }
  | { kind: 'quiz'; id: string }
  | { kind: 'concept'; id: string }

export type RoundPhase = 'front' | 'revealed' | 'answered'

export interface Round {
  items: RoundItem[]
  index: number
  phase: RoundPhase
  /** Option picked for the current quiz item. */
  choice: number | null
  size: number
  correct: number
  answered: number
  startedAt: number
  finishedAt: number | null
}

export interface ResearchLogEntry {
  id: string
  week: number | null
  source: string
  claim: string
  evidence: string
  limitations: string
  decisionImpact: string
  createdAt: number
  updatedAt: number
}

export interface Stat {
  a: number
  c: number
  last: number
}

export interface State {
  version: number
  currentWeek: number
  selfCheck: Record<string, boolean>
  srs: Record<string, CardState>
  newCards: { day: string; count: number }
  quizStats: { byConcept: Record<string, Stat>; byQuestion: Record<string, Stat> }
  conceptsSeen: Record<string, number>
  round: Round | null
  roundsCompleted: number
  activeDays: string[]
  lastRoute: string | null
  journal: {
    reflections: Record<string, Record<string, string>>
    researchLog: ResearchLogEntry[]
  }
}

export function initialState(): State {
  return {
    version: SCHEMA_VERSION,
    currentWeek: 1,
    selfCheck: {},
    srs: {},
    newCards: { day: '', count: 0 },
    quizStats: { byConcept: {}, byQuestion: {} },
    conceptsSeen: {},
    round: null,
    roundsCompleted: 0,
    activeDays: [],
    lastRoute: null,
    journal: { reflections: {}, researchLog: [] },
  }
}

/** Fill gaps from older or partial saves so new fields never crash the UI. */
export function normalise(raw: unknown): State {
  const base = initialState()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<State>
  return {
    ...base,
    ...r,
    version: SCHEMA_VERSION,
    quizStats: { ...base.quizStats, ...(r.quizStats ?? {}) },
    journal: { ...base.journal, ...(r.journal ?? {}) },
    newCards: r.newCards ?? base.newCards,
  }
}

function load(): State {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? normalise(JSON.parse(s)) : initialState()
  } catch {
    return initialState()
  }
}

let state: State = typeof localStorage === 'undefined' ? initialState() : load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: keep working in memory.
  }
}

export function getState(): State {
  return state
}

export function setState(next: State) {
  state = next
  persist()
  listeners.forEach((l) => l())
}

export function update(fn: (s: State) => State) {
  setState(fn(state))
}

export function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Subscribe to the whole state (a stable reference) and derive in render, so selectors may build new objects. */
export function useStore<T>(selector: (s: State) => T): T {
  const snapshot = useSyncExternalStore(subscribe, getState, getState)
  return selector(snapshot)
}

// ---- Domain actions (pure helpers + store wrappers) ----

export function applyCardReview(s: State, cardId: string, rating: Rating, now: number): State {
  const prev = s.srs[cardId]
  const today = dayKey(now)
  const newCards =
    prev === undefined
      ? { day: today, count: (s.newCards.day === today ? s.newCards.count : 0) + 1 }
      : s.newCards
  return { ...s, srs: { ...s.srs, [cardId]: review(prev, rating, now) }, newCards }
}

function bump(stat: Stat | undefined, correct: boolean, now: number): Stat {
  return { a: (stat?.a ?? 0) + 1, c: (stat?.c ?? 0) + (correct ? 1 : 0), last: now }
}

export function applyQuizAnswer(s: State, questionId: string, conceptIds: string[], correct: boolean, now: number): State {
  const byConcept = { ...s.quizStats.byConcept }
  for (const c of conceptIds) byConcept[c] = bump(byConcept[c], correct, now)
  return {
    ...s,
    quizStats: {
      byConcept,
      byQuestion: { ...s.quizStats.byQuestion, [questionId]: bump(s.quizStats.byQuestion[questionId], correct, now) },
    },
  }
}

export function markActive(s: State, now: number): State {
  const today = dayKey(now)
  if (s.activeDays.includes(today)) return s
  return { ...s, activeDays: [...s.activeDays, today].slice(-400) }
}

export function toggleSelfCheck(id: string) {
  update((s) => ({ ...s, selfCheck: { ...s.selfCheck, [id]: !s.selfCheck[id] } }))
}

export function setCurrentWeek(week: number) {
  update((s) => ({ ...s, currentWeek: week }))
}

export function setLastRoute(route: string) {
  if (state.lastRoute !== route) update((s) => ({ ...s, lastRoute: route }))
}

// ---- Export / import ----

export function exportJson(): string {
  return JSON.stringify({ app: 'pricing-study', exportedAt: new Date().toISOString(), state }, null, 2)
}

/** Parse an export file. Throws with a readable message when the file is not ours. */
export function parseImport(text: string): State {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  const p = parsed as { app?: string; state?: unknown }
  if (p?.app !== 'pricing-study' || !p.state || typeof p.state !== 'object') {
    throw new Error('That file is not a Pricing Study export.')
  }
  const s = p.state as Partial<State>
  if (typeof s.version !== 'number' || s.version > SCHEMA_VERSION) {
    throw new Error('This export comes from a newer version of the app.')
  }
  return normalise(s)
}

export function resetAll() {
  setState(initialState())
}
