import { allSelfCheckIds, getWeek, srsCards, syllabus, weekCount } from '../content'
import { btn, card, muted, Page, ProgressBar } from '../components/ui'
import { go, parseHash, routeLabels } from '../router'
import { dueCards, SESSION_SIZE, startRound } from '../lib/round'
import { streak } from '../lib/srs'
import { setCurrentWeek, useStore } from '../lib/store'

export default function Home() {
  const s = useStore((x) => x)
  const now = Date.now()
  const week = getWeek(s.currentWeek)
  const checked = allSelfCheckIds.filter((id) => s.selfCheck[id]).length
  const learned = srsCards.filter((c) => (s.srs[c.id]?.box ?? 0) >= 1).length
  const stats = Object.values(s.quizStats.byQuestion)
  const attempts = stats.reduce((n, x) => n + x.a, 0)
  const correct = stats.reduce((n, x) => n + x.c, 0)
  const due = dueCards(s, now).length

  const last = s.lastRoute ? parseHash(s.lastRoute) : null
  const lastLabel = last ? (last.name === 'week' ? `Week ${last.week}: ${getWeek(last.week)?.title ?? ''}` : routeLabels[last.name]) : null

  return (
    <Page title={syllabus.program.title}>
      <div className="flex flex-col gap-4">
        <div className={card}>
          <div className="flex items-center gap-2">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl active:bg-slate-100 disabled:opacity-30 dark:active:bg-slate-800"
              disabled={s.currentWeek <= 1}
              onClick={() => setCurrentWeek(s.currentWeek - 1)}
              aria-label="Previous week"
            >
              ‹
            </button>
            <a href={`#/week/${s.currentWeek}`} className="flex-1 text-center">
              <div className={`text-sm ${muted}`}>Current week</div>
              <div className="text-2xl font-bold">Week {s.currentWeek}</div>
              <div className="leading-snug">{week?.title}</div>
            </a>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl active:bg-slate-100 disabled:opacity-30 dark:active:bg-slate-800"
              disabled={s.currentWeek >= weekCount}
              onClick={() => setCurrentWeek(s.currentWeek + 1)}
              aria-label="Next week"
            >
              ›
            </button>
          </div>
          <p className={`mt-2 text-center text-sm ${muted}`}>Rounds and practice use weeks 1–{s.currentWeek}.</p>
        </div>

        <div className={`${card} flex flex-col gap-3`}>
          <ProgressBar value={checked / allSelfCheckIds.length} label={`Self-check ${checked}/${allSelfCheckIds.length}`} />
          <ProgressBar value={learned / srsCards.length} label={`Cards learned ${learned}/${srsCards.length}`} />
          <div className={`flex justify-between text-sm ${muted}`}>
            <span>Quiz accuracy {attempts ? Math.round((correct / attempts) * 100) + '%' : '—'}</span>
            <span>{streak(s.activeDays, now)}-day streak</span>
            <span>{due} due</span>
          </div>
        </div>

        <button
          className={btn.primary}
          onClick={() => {
            startRound(SESSION_SIZE)
            go('/round')
          }}
        >
          5-minute session
        </button>
        {lastLabel && (
          <a href={s.lastRoute!} className={`${btn.secondary} flex flex-col items-center justify-center py-2`}>
            <span className={`text-sm ${muted}`}>Continue where I left off</span>
            <span>{lastLabel}</span>
          </a>
        )}
        <a href={`#/week/${s.currentWeek}`} className={`${btn.secondary} flex items-center justify-center`}>
          Open week {s.currentWeek}
        </a>
      </div>
    </Page>
  )
}
