// Shared item renderers used by quick rounds, the flashcard deck and the quiz.
import type { SrsCard } from '../content'
import { conceptById, generated, getWeek, weekOfConcept } from '../content'
import type { FlashcardKind, QuizQuestion, TapQuestion } from '../content/types'
import type { CardState, Rating } from '../lib/srs'
import { intervalLabel } from '../lib/srs'
import { AiTag, muted } from './ui'

const KIND_LABEL: Record<FlashcardKind, string> = {
  term: 'Key term',
  contrast: 'Compare',
  formula: 'Formula',
  calc: 'Calculate',
  explain: 'Explain it',
  apply: 'Apply: lending',
}

export function CardFace({ item, revealed }: { item: SrsCard; revealed: boolean }) {
  const { card } = item
  return (
    <div className="flex flex-col gap-4">
      <div className={`flex items-center gap-2 text-sm ${muted}`}>
        <span className="font-semibold tracking-wide uppercase">{KIND_LABEL[card.kind]}</span>
        <span>· {item.week ? `Week ${item.week}` : 'Reference'}</span>
        <span className="ml-auto">
          <AiTag />
        </span>
      </div>
      <p className={revealed ? 'text-lg font-semibold' : 'text-2xl leading-snug font-semibold'}>{card.front}</p>
      {(card.kind === 'explain' || card.kind === 'apply' || card.kind === 'calc') && !revealed && (
        <p className={muted}>{card.kind === 'calc' ? 'Work it out, then tap to check.' : 'Think of your answer, then tap to reveal.'}</p>
      )}
      {revealed && <p className="text-lg whitespace-pre-line">{card.back}</p>}
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
        <span className="font-semibold tracking-wide uppercase">{q.type === 'mcq' ? 'Quiz' : 'Calculate'}</span>
        <span>· Week {week}</span>
        <span className="ml-auto">
          <AiTag />
        </span>
      </div>
      <p className={compact ? 'text-base font-medium' : 'text-xl leading-snug font-semibold'}>{q.question}</p>
    </div>
  )
}

export function QuizOptions({ q, onPick }: { q: TapQuestion; onPick: (i: number) => void }) {
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

export function answerText(q: QuizQuestion): string {
  if (q.type !== 'numeric') return q.options[q.answerIndex]
  const n = q.answer.toLocaleString('en-GB', { maximumFractionDigits: 2 })
  return q.unit === '%' || q.unit === 'pp' || q.unit === 'k' ? `${n}${q.unit === 'pp' ? ' pp' : q.unit}` : n
}

export function QuizFeedback({ q, correct, given }: { q: QuizQuestion; correct: boolean; given: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`rounded-2xl px-4 py-3 font-semibold ${correct ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200'}`}
      >
        {correct ? '✓ Correct' : `✗ You said ${given}. Answer: ${answerText(q)}`}
      </div>
      <p className="text-base">{q.explanation}</p>
    </div>
  )
}

export function ConceptFace({ conceptId }: { conceptId: string }) {
  const c = conceptById.get(conceptId)
  const g = generated.concepts[conceptId]
  const week = weekOfConcept(conceptId)
  if (!c) return null
  return (
    <div className="flex flex-col gap-3">
      <div className={`text-sm ${muted}`}>
        <span className="font-semibold tracking-wide uppercase">Concept</span> · Week {week} · {getWeek(week)?.title}
      </div>
      {/* Quick rounds skip the generated title so the card fits one screen; the week view shows it. */}
      <p className="text-lg leading-snug font-semibold">{c.text}</p>
      {g && (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800/60">
          <AiTag />
          <p className="text-base">{g.explainer}</p>
        </div>
      )}
    </div>
  )
}

/** Full concept detail for the week view: verbatim text, then generated explainer, examples and lending lens. */
export function ConceptDetail({ conceptId, index, total }: { conceptId: string; index: number; total: number }) {
  const c = conceptById.get(conceptId)
  const g = generated.concepts[conceptId]
  if (!c) return null
  return (
    <div className="flex flex-col gap-3">
      <div className={`text-sm ${muted}`}>
        Concept {index + 1} of {total}
      </div>
      {g && <p className="text-xl leading-snug font-bold">{g.title}</p>}
      <p className="font-semibold">{c.text}</p>
      {g && (
        <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
          <AiTag />
          <p className="font-medium text-teal-800 dark:text-teal-300">{g.oneLiner}</p>
          <p>{g.explainer}</p>
          {g.quickExample && (
            <p className={`text-base ${muted}`}>
              <span className="font-semibold">Example: </span>
              {g.quickExample}
            </p>
          )}
          {g.lendingLens && (
            <div className="rounded-xl bg-sky-50 p-3 text-base dark:bg-sky-950/40">
              <span className="font-semibold">Lending lens: </span>
              {g.lendingLens}
            </div>
          )}
          {g.example && <Example ex={g.example} title="Harbour Lane example" />}
        </div>
      )}
    </div>
  )
}

export function Example({ ex, title = 'Worked example' }: { ex: NonNullable<(typeof generated.concepts)[string]['example']>; title?: string }) {
  return (
    <details className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
      <summary className="min-h-8 cursor-pointer font-semibold">{title}</summary>
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
