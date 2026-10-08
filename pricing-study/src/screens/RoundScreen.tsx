import { useEffect, useRef, type ReactNode } from 'react'
import { quizById, srsCardById, srsCards } from '../content'
import { CardFace, ConceptFace, QuizFeedback, QuizOptions, QuizStem, RatingButtons } from '../components/StudyItems'
import { btn, muted } from '../components/ui'
import {
  advanceCurrent,
  answerCurrentQuiz,
  ensureRound,
  itemExists,
  QUICK_SIZE,
  rateCurrentCard,
  revealCurrent,
  skipCurrent,
  startRound,
} from '../lib/round'
import { streak } from '../lib/srs'
import { useStore } from '../lib/store'

export default function RoundScreen() {
  const round = useStore((s) => s.round)
  const srs = useStore((s) => s.srs)
  const week = useStore((s) => s.currentWeek)
  const activeDays = useStore((s) => s.activeDays)
  const swipe = useRef<{ x: number; y: number; swiped: boolean }>({ x: 0, y: 0, swiped: false })

  useEffect(() => ensureRound(), [])

  const item = round && round.finishedAt === null ? round.items[round.index] : undefined
  useEffect(() => {
    if (item && !itemExists(item)) skipCurrent()
  }, [item])

  if (!round) return null

  if (round.finishedAt !== null || !item) {
    const learned = srsCards.filter((c) => (srs[c.id]?.box ?? 0) >= 1).length
    const days = streak(activeDays, Date.now())
    const parts = [
      round.answered ? `${round.correct}/${round.answered} right` : null,
      `${days}-day streak`,
      `${learned} of ${srsCards.length} cards learned`,
    ].filter(Boolean)
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2 text-center">
          <p className="text-3xl font-bold">Round done</p>
          <p className={`text-lg ${muted}`}>{parts.join(' · ')}</p>
        </div>
        <Controls>
          <button className={btn.primary} onClick={() => startRound(QUICK_SIZE)}>
            Another round
          </button>
        </Controls>
      </Shell>
    )
  }

  const canAdvance = item.kind === 'concept' || (item.kind === 'quiz' && round.phase === 'answered')
  const onTap = () => {
    if (swipe.current.swiped) return
    if (item.kind === 'card' && round.phase === 'front') revealCurrent()
    else if (canAdvance) advanceCurrent()
  }

  let body = null
  let controls = null
  if (item.kind === 'card') {
    const c = srsCardById.get(item.id)
    if (!c) return null
    const revealed = round.phase === 'revealed'
    body = <CardFace item={c} revealed={revealed} />
    controls = revealed ? (
      <RatingButtons state={srs[item.id]} onRate={rateCurrentCard} />
    ) : (
      <button className={btn.primary} onClick={(e) => (e.stopPropagation(), revealCurrent())}>
        Show answer
      </button>
    )
  } else if (item.kind === 'quiz') {
    const e = quizById.get(item.id)
    if (!e || e.q.type === 'numeric') return null
    const q = e.q
    const answered = round.phase === 'answered' && round.choice !== null
    body = (
      <div className="flex flex-col gap-4">
        <QuizStem q={q} week={e.week} compact={answered} />
        {answered && <QuizFeedback q={q} correct={round.choice === q.answerIndex} given={q.options[round.choice!]} />}
      </div>
    )
    controls = answered ? <NextButton /> : <QuizOptions q={q} onPick={answerCurrentQuiz} />
  } else {
    body = <ConceptFace conceptId={item.id} />
    controls = <NextButton label="Got it" />
  }

  return (
    <Shell>
      <div
        className="flex min-h-0 flex-1 flex-col select-none"
        onClick={onTap}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY, swiped: false })}
        onPointerUp={(e) => {
          const dx = e.clientX - swipe.current.x
          const dy = e.clientY - swipe.current.y
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            swipe.current.swiped = true
            if (dx < 0 && canAdvance) advanceCurrent()
          }
        }}
      >
        <header className="flex items-center gap-3 py-3">
          <div className="flex flex-1 gap-1.5" aria-label={`Item ${round.index + 1} of ${round.items.length}`}>
            {round.items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < round.index ? 'bg-teal-600 dark:bg-teal-400' : i === round.index ? 'bg-teal-300 dark:bg-teal-700' : 'bg-slate-200 dark:bg-slate-800'}`}
              />
            ))}
          </div>
          <span className={`text-sm ${muted}`}>
            {round.size > QUICK_SIZE ? '5-min · ' : ''}Wk {week}
          </span>
        </header>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-2 pb-4">{body}</div>
        {canAdvance && <p className={`pb-2 text-center text-sm ${muted}`}>Tap or swipe to continue</p>}
      </div>
      <Controls>{controls}</Controls>
    </Shell>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex h-[calc(100dvh-var(--tabbar))] max-w-xl flex-col px-4 pt-safe">{children}</div>
}

/** Thumb zone: controls always sit at the bottom of the screen. */
function Controls({ children }: { children: ReactNode }) {
  return <div className="pb-3">{children}</div>
}

function NextButton({ label = 'Next' }: { label?: string }) {
  return (
    <button className={btn.primary} onClick={(e) => (e.stopPropagation(), advanceCurrent())}>
      {label} →
    </button>
  )
}
