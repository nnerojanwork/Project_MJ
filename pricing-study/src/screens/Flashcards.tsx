import { useState } from 'react'
import { srsCardById, srsCards, weeks } from '../content'
import { CardFace, RatingButtons } from '../components/StudyItems'
import { AiTag, btn, card, muted, Page, Section } from '../components/ui'
import { dueCards, newCardAllowance, newCards } from '../lib/round'
import type { Rating } from '../lib/srs'
import { applyCardReview, markActive, update, useStore } from '../lib/store'

const NEW_BATCH = 10

export default function Flashcards() {
  const s = useStore((x) => x)
  const [session, setSession] = useState<{ queue: string[]; revealed: boolean; done: number } | null>(null)
  const now = Date.now()
  const due = dueCards(s, now)
  const fresh = newCards(s).slice(0, Math.min(NEW_BATCH, newCardAllowance(s, now)))

  if (session) {
    const id = session.queue[0]
    const item = id ? srsCardById.get(id) : undefined
    if (!item) {
      return (
        <Page title="Flashcards" back="#/practice">
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-2xl font-bold">Deck done</p>
            <p className={muted}>{session.done} reviews</p>
            <button className={btn.primary} onClick={() => setSession(null)}>
              Back to decks
            </button>
          </div>
        </Page>
      )
    }
    const rate = (r: Rating) => {
      const t = Date.now()
      update((x) => markActive(applyCardReview(x, item.id, r, t), t))
      const rest = session.queue.slice(1)
      setSession({ queue: r === 'again' ? [...rest, item.id] : rest, revealed: false, done: session.done + 1 })
    }
    return (
      <div className="mx-auto flex h-[calc(100dvh-var(--tabbar))] max-w-xl flex-col px-4 pt-safe">
        <header className="flex items-center gap-2 py-3">
          <button className="h-11 px-2 text-base font-medium text-teal-700 dark:text-teal-400" onClick={() => setSession(null)}>
            ‹ Stop
          </button>
          <span className={`ml-auto text-sm ${muted}`}>{session.queue.length} left</span>
        </header>
        <div
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto select-none"
          onClick={() => !session.revealed && setSession({ ...session, revealed: true })}
        >
          <CardFace item={item} revealed={session.revealed} />
        </div>
        <div className="pb-3">
          {session.revealed ? (
            <RatingButtons state={s.srs[item.id]} onRate={rate} />
          ) : (
            <button className={btn.primary} onClick={() => setSession({ ...session, revealed: true })}>
              Show answer
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Page title="Flashcards" back="#/practice">
      <div className="flex flex-col gap-3">
        <p className={muted}>Cards from weeks 1–{s.currentWeek}. Change the current week on Home.</p>
        <button className={btn.primary} disabled={!due.length} onClick={() => setSession({ queue: due.map((c) => c.id), revealed: false, done: 0 })}>
          Review due ({due.length})
        </button>
        <button className={btn.secondary} disabled={!fresh.length} onClick={() => setSession({ queue: fresh.map((c) => c.id), revealed: false, done: 0 })}>
          Learn new ({fresh.length})
        </button>
        <div className="mt-2">
          <Section title="Browse all cards" badge={<AiTag />}>
            {weeks.map((w) => {
              const list = srsCards.filter((c) => c.week === w.week)
              if (!list.length) return null
              return (
                <div key={w.id} className="mb-4">
                  <h3 className={`mb-2 text-sm font-semibold ${muted}`}>Week {w.week}</h3>
                  <div className="flex flex-col gap-2">
                    {list.map((c) => (
                      <details key={c.id} className={card}>
                        <summary className="cursor-pointer font-medium">
                          {c.type === 'explain' ? c.card.prompt : c.card.front}
                          <span className={`ml-2 text-xs ${muted}`}>{s.srs[c.id] ? `box ${s.srs[c.id].box}` : 'new'}</span>
                        </summary>
                        <p className="mt-2 whitespace-pre-line">{c.type === 'explain' ? c.card.answer : c.card.back}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )
            })}
          </Section>
        </div>
      </div>
    </Page>
  )
}
