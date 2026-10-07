import { quizEntries } from '../content'
import { Badge, card, muted, Page } from '../components/ui'
import { dueCards, newCardAllowance, newCards } from '../lib/round'
import { useStore } from '../lib/store'

export default function Practice() {
  const s = useStore((x) => x)
  const now = Date.now()
  const due = dueCards(s, now).length
  const fresh = Math.min(newCards(s).length, newCardAllowance(s, now))
  const questions = quizEntries.filter((e) => e.week <= s.currentWeek).length
  return (
    <Page title="Practice">
      <div className="flex flex-col gap-3">
        <a href="#/cards" className={`${card} flex items-center gap-3 active:bg-slate-100 dark:active:bg-slate-800`}>
          <div className="flex-1">
            <div className="text-lg font-semibold">Flashcards</div>
            <div className={muted}>
              {due} due · {fresh} new available today
            </div>
          </div>
          <Badge n={due} />
          <span className="text-slate-400">›</span>
        </a>
        <a href="#/quiz" className={`${card} flex items-center gap-3 active:bg-slate-100 dark:active:bg-slate-800`}>
          <div className="flex-1">
            <div className="text-lg font-semibold">Quiz</div>
            <div className={muted}>
              {questions} questions in weeks 1–{s.currentWeek}, weak-topic tracking
            </div>
          </div>
          <span className="text-slate-400">›</span>
        </a>
      </div>
    </Page>
  )
}
