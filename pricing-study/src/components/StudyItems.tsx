// Shared item renderers used by quick rounds, the flashcard deck and the quiz.
import type { SrsCard } from '../content'
import { conceptById, generated, getWeek, weekOfConcept } from '../content'
import type { QuizQuestion } from '../content/types'
import type { CardState, Rating } from '../lib/srs'
import { intervalLabel } from '../lib/srs'
import { AiTag, muted } from './ui'

export function CardFace({ item, revealed }: { item: SrsCard; revealed: boolean }) {
  const isExplain = item.type === 'explain'
  const front = isExplain ? item.card.prompt : item.card.front
  const back = isExplain ? item.card.answer : item.card.back
  const kind = isExplain ? 'Explain it' : item.card.kind === 'formula' ? 'Formula' : 'Key term'
  return (
    <div className="flex flex-col gap-4">
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="font-semibold tracking-wide uppercase">{kind}</span>
        <span>· Week {item.week}</span>
        <span className="ml-auto">
          <AiTag />
        </span>
      </div>
      <p className={revealed ? 'text-lg font-semibold' : 'text-2xl leading-snug font-semibold'}>{front}</p>
      {isExplain && !revealed && <p className={muted}>Think of your answer, then tap to reveal.</p>}
      {revealed && <p className="text-lg whitespace-pre-line">{back}</p>}
    </div>
  )
}

export function RatingButtons({ state, onRate }: { state: CardState | undefined; onRate: (r: Rating) => void }) {
  const opts: { r: Rating; label: string; cls: string }[] = [
    { r: 'again', label: 'Again', cls: 'bg-rose-600 active:bg-rose-700' },
    { r: 'good', label: 'Good', cls: 'bg-teal-700 active:bg-teal-800 dark:bg-teal-600' },
    { r: 'easy', label: 'Easy', cls: 'bg-sky-700 active:bg-sky-800 dark:bg-sky-600' },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {opts.map((o) => (
        <button
          key={o.r}
          className={`flex min-h-16 flex-col items-center justify-center rounded-2xl font-semibold text-white ${o.cls}`}
          onClick={(e) => {
            e.stopPropagation()
            onRate(o.r)
          }}
        >
          <span className="text-lg">{o.label}</span>
          <span className="text-xs opacity-80">{intervalLabel(state, o.r)}</span>
        </button>
      ))}
    </div>
  )
}

export function QuizStem({ q, week, compact }: { q: QuizQuestion; week: number; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="font-semibold tracking-wide uppercase">{q.type === 'calc' ? 'Calculate' : 'Quiz'}</span>
        <span>· Week {week}</span>
        <span className="ml-auto">
          <AiTag />
        </span>
      </div>
      <p className={compact ? 'text-base font-medium' : 'text-xl leading-snug font-semibold'}>{q.question}</p>
    </div>
  )
}

export function QuizOptions({ q, onPick }: { q: QuizQuestion; onPick: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {q.options.map((o, i) => (
        <button
          key={i}
          className="min-h-13 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-left text-base leading-snug font-medium active:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:active:bg-slate-800"
          onClick={(e) => {
            e.stopPropagation()
            onPick(i)
          }}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function QuizFeedback({ q, correct, given }: { q: QuizQuestion; correct: boolean; given: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`rounded-2xl px-4 py-3 font-semibold ${correct ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200'}`}
      >
        {correct ? '✓ Correct' : `✗ You said ${given}. Answer: ${q.options[q.answerIndex]}`}
      </div>
      <p className="text-base">{q.explanation}</p>
    </div>
  )
}

export function ConceptFace({ conceptId, showExample }: { conceptId: string; showExample?: boolean }) {
  const c = conceptById.get(conceptId)
  const g = generated.concepts[conceptId]
  const week = weekOfConcept(conceptId)
  if (!c) return null
  return (
    <div className="flex flex-col gap-3">
      <div className={`text-sm ${muted}`}>
        <span className="font-semibold tracking-wide uppercase">Concept</span> · Week {week} · {getWeek(week)?.title}
      </div>
      <p className="text-lg leading-snug font-semibold">{c.text}</p>
      {g && (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800/60">
          <AiTag />
          <p className="text-base">{g.explainer}</p>
        </div>
      )}
      {showExample && g?.example && <Example ex={g.example} />}
    </div>
  )
}

export function Example({ ex }: { ex: NonNullable<(typeof generated.concepts)[string]['example']> }) {
  return (
    <details className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
      <summary className="min-h-8 cursor-pointer font-semibold">Worked example</summary>
      <div className="mt-2 flex flex-col gap-2 text-base">
        <p>{ex.setup}</p>
        <ol className="list-decimal space-y-1 pl-5">
          {ex.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="font-semibold">{ex.result}</p>
      </div>
    </details>
  )
}
