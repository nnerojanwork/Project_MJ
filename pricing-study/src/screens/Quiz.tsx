import { useState } from 'react'
import { conceptById, quizById, quizEntries, weekCount, weekOfConcept } from '../content'
import { answerText, QuizFeedback, QuizOptions, QuizStem } from '../components/StudyItems'
import { btn, card, inputCls, muted, Page } from '../components/ui'
import { checkTyped } from '../lib/answers'
import { applyQuizAnswer, markActive, update, useStore, type State } from '../lib/store'

const MIXED_SIZE = 8

interface Answer {
  given: string
  correct: boolean
}

export function weakConcepts(s: State) {
  return Object.entries(s.quizStats.byConcept)
    .filter(([id, st]) => conceptById.has(id) && st.a >= 2 && st.c / st.a < 0.6)
    .sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a)
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const s = useStore((x) => x)
  const [session, setSession] = useState<{ title: string; ids: string[]; index: number; answers: Record<string, Answer> } | null>(null)
  const weak = weakConcepts(s)

  const start = (title: string, ids: string[]) => ids.length && setSession({ title, ids, index: 0, answers: {} })

  if (session) return <QuizSession session={session} setSession={setSession} />

  const weakIds = new Set(weak.map(([id]) => id))
  const weakQuestions = quizEntries.filter((e) => e.q.conceptIds.some((c) => weakIds.has(c))).map((e) => e.q.id)

  return (
    <Page title="Quiz" back="#/practice">
      <div className="flex flex-col gap-3">
        <button
          className={btn.primary}
          onClick={() => start(`Mixed · weeks 1–${s.currentWeek}`, shuffle(quizEntries.filter((e) => e.week <= s.currentWeek).map((e) => e.q.id)).slice(0, MIXED_SIZE))}
        >
          Mixed quiz (weeks 1–{s.currentWeek})
        </button>
        <button className={btn.secondary} disabled={!weakQuestions.length} onClick={() => start('Weak topics', shuffle(weakQuestions).slice(0, MIXED_SIZE))}>
          Weak topics ({weakQuestions.length})
        </button>

        <h2 className={`mt-3 text-sm font-semibold ${muted}`}>By week</h2>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => {
            const ids = quizEntries.filter((e) => e.week === w).map((e) => e.q.id)
            const seen = ids.filter((id) => s.quizStats.byQuestion[id]).length
            return (
              <button key={w} className={`${btn.small} flex flex-col items-center px-0 py-1`} onClick={() => start(`Week ${w}`, ids)}>
                <span className="text-lg font-semibold">{w}</span>
                <span className={`text-xs ${muted}`}>
                  {seen}/{ids.length}
                </span>
              </button>
            )
          })}
        </div>

        <h2 className={`mt-3 text-sm font-semibold ${muted}`}>Weak topics</h2>
        {weak.length === 0 ? (
          <p className={muted}>None yet. Topics appear here after two or more attempts below 60% accuracy.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weak.map(([id, st]) => (
              <li key={id}>
                <a href={`#/week/${weekOfConcept(id)}`} className={`${card} block active:bg-slate-100 dark:active:bg-slate-800`}>
                  <div className={`text-sm ${muted}`}>
                    Week {weekOfConcept(id)} · {st.c}/{st.a} right
                  </div>
                  <div className="line-clamp-2">{conceptById.get(id)?.text}</div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  )
}

type Session = { title: string; ids: string[]; index: number; answers: Record<string, Answer> }

function QuizSession({ session, setSession }: { session: Session; setSession: (s: Session | null) => void }) {
  const [input, setInput] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const id = session.ids[session.index]
  const entry = id ? quizById.get(id) : undefined

  if (!entry) {
    const total = session.ids.length
    const right = Object.values(session.answers).filter((a) => a.correct).length
    return (
      <Page title={session.title} back="#/quiz" action={<button className="h-11 text-teal-700 dark:text-teal-400" onClick={() => setSession(null)}>Done</button>}>
        <div className="mb-4 text-center">
          <p className="text-4xl font-bold">
            {right}/{total}
          </p>
          <p className={muted}>{Math.round((right / Math.max(1, total)) * 100)}% correct</p>
        </div>
        <ul className="flex flex-col gap-2">
          {session.ids.map((qid) => {
            const e = quizById.get(qid)
            const a = session.answers[qid]
            if (!e) return null
            return (
              <li key={qid}>
                <details className={card}>
                  <summary className="cursor-pointer">
                    <span className={a?.correct ? 'text-emerald-600' : 'text-rose-600'}>{a?.correct ? '✓' : '✗'}</span> {e.q.question}
                  </summary>
                  <div className="mt-2 flex flex-col gap-1 text-base">
                    {!a?.correct && <p className={muted}>You said: {a?.given ?? '—'}</p>}
                    <p className="font-semibold">Answer: {answerText(e.q)}</p>
                    <p>{e.q.explanation}</p>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
        <button className={`${btn.primary} mt-4`} onClick={() => setSession({ ...session, index: 0, answers: {} })}>
          Retry
        </button>
      </Page>
    )
  }

  const q = entry.q
  const answer = session.answers[q.id]
  const record = (given: string, correct: boolean) => {
    const t = Date.now()
    update((x) => markActive(applyQuizAnswer(x, q.id, q.conceptIds, correct, t), t))
    setSession({ ...session, answers: { ...session.answers, [q.id]: { given, correct } } })
  }
  const next = () => {
    setInput('')
    setShowOptions(false)
    setSession({ ...session, index: session.index + 1 })
  }
  const typedResult = q.type === 'mcq' ? null : checkTyped(q, input)

  return (
    <div className="mx-auto flex h-[calc(100dvh-var(--tabbar))] max-w-xl flex-col px-4 pt-safe">
      <header className="flex items-center gap-2 py-3">
        <button className="h-11 px-2 text-base font-medium text-teal-700 dark:text-teal-400" onClick={() => setSession(null)}>
          ‹ Quit
        </button>
        <span className={`ml-auto text-sm ${muted}`}>
          {session.title} · {session.index + 1}/{session.ids.length}
        </span>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-4">
        <QuizStem q={q} week={entry.week} compact={!!answer} />
        {answer && (
          <div className="mt-4">
            <QuizFeedback q={q} correct={answer.correct} given={answer.given} />
          </div>
        )}
      </div>
      <div className="pb-3">
        {answer ? (
          <button className={btn.primary} onClick={next}>
            {session.index + 1 < session.ids.length ? 'Next →' : 'See score'}
          </button>
        ) : q.type === 'mcq' || (q.type === 'calc' && showOptions) ? (
          <QuizOptions q={q} onPick={(i) => record(q.options[i], i === q.answerIndex)} />
        ) : (
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (typedResult !== null) record(input + (q.unit && !input.includes(q.unit) ? ` ${q.unit}` : ''), typedResult)
            }}
          >
            <div className="flex items-center gap-2">
              <input className={inputCls} inputMode="decimal" placeholder="Your answer" value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
              {q.unit && <span className={`text-lg ${muted}`}>{q.unit}</span>}
            </div>
            <button className={btn.primary} disabled={typedResult === null}>
              Check
            </button>
            {q.type === 'calc' && (
              <button type="button" className="min-h-11 text-base text-teal-700 dark:text-teal-400" onClick={() => setShowOptions(true)}>
                Show options instead
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
