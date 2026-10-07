import { useRef, useState } from 'react'
import { generated, getWeek, weekCount } from '../content'
import { Example } from '../components/StudyItems'
import { AiTag, Bullets, card, muted, Page, Section } from '../components/ui'
import { setCurrentWeek, toggleSelfCheck, useStore } from '../lib/store'

export default function WeekView({ week }: { week: number }) {
  const w = getWeek(week)
  const selfCheck = useStore((s) => s.selfCheck)
  const current = useStore((s) => s.currentWeek)
  if (!w) return <Page title="Not found" back="#/weeks">No week {week}.</Page>
  const done = w.selfCheck.filter((x) => selfCheck[x.id]).length

  return (
    <Page title={`Week ${w.week}`} back="#/weeks">
      <h2 className="mb-1 text-2xl leading-tight font-bold">{w.title}</h2>
      {w.programMapOutput && <p className={`mb-3 ${muted}`}>Output: {w.programMapOutput}</p>}
      {week !== current && (
        <button className="mb-3 min-h-11 text-base font-medium text-teal-700 dark:text-teal-400" onClick={() => setCurrentWeek(week)}>
          Make this my current week
        </button>
      )}

      <Section title="Outcome" defaultOpen>
        <p>{w.outcome}</p>
      </Section>

      <Section title="Core concepts" defaultOpen badge={<span className={`text-sm ${muted}`}>{w.coreConcepts.length}</span>}>
        <ConceptCarousel conceptIds={w.coreConcepts.map((c) => c.id)} texts={w.coreConcepts.map((c) => c.text)} />
      </Section>

      <Section title="Research questions">
        <Bullets items={w.researchQuestions.map((q) => q.text)} />
      </Section>

      <Section title="Learning resources">
        <ul className="flex flex-col gap-3">
          {w.resources.map((r) => (
            <li key={r.url + r.title}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline underline-offset-2 dark:text-teal-400">
                {r.title} ↗
              </a>
              <p className={muted}>{r.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Applied exercise">
        <p>{w.appliedExercise}</p>
        {w.week === 1 && (
          <a href="#/calc" className="mt-3 inline-block min-h-11 font-medium text-teal-700 dark:text-teal-400">
            Open the Week 1 scenario calculator →
          </a>
        )}
      </Section>

      <Section title="Portfolio output">
        <p>{w.portfolioOutput}</p>
      </Section>

      <Section title="Self-check" defaultOpen badge={<span className={`text-sm ${muted}`}>{done}/{w.selfCheck.length}</span>}>
        <div className="flex flex-col gap-2">
          {w.selfCheck.map((item) => (
            <label key={item.id} className={`${card} flex min-h-14 cursor-pointer items-start gap-3 active:bg-slate-100 dark:active:bg-slate-800`}>
              <input type="checkbox" checked={!!selfCheck[item.id]} onChange={() => toggleSelfCheck(item.id)} className="mt-1 h-6 w-6 shrink-0 accent-teal-700" />
              <span className={selfCheck[item.id] ? `${muted} line-through` : ''}>{item.text}</span>
            </label>
          ))}
        </div>
      </Section>

      <div className="mt-4 flex gap-2">
        {week > 1 && (
          <a href={`#/week/${week - 1}`} className="min-h-12 flex-1 rounded-xl border border-slate-300 py-3 text-center dark:border-slate-700">
            ‹ Week {week - 1}
          </a>
        )}
        {week < weekCount && (
          <a href={`#/week/${week + 1}`} className="min-h-12 flex-1 rounded-xl border border-slate-300 py-3 text-center dark:border-slate-700">
            Week {week + 1} ›
          </a>
        )}
      </div>
    </Page>
  )
}

function ConceptCarousel({ conceptIds, texts }: { conceptIds: string[]; texts: string[] }) {
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / (el.scrollWidth / conceptIds.length)))
  }
  return (
    <div>
      <div ref={ref} onScroll={onScroll} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
        {conceptIds.map((id, i) => {
          const g = generated.concepts[id]
          return (
            <article key={id} className={`${card} flex w-[85%] shrink-0 snap-center flex-col gap-3`}>
              <div className={`text-sm ${muted}`}>
                Concept {i + 1} of {conceptIds.length}
              </div>
              <p className="text-lg leading-snug font-semibold">{texts[i]}</p>
              {g && (
                <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <AiTag />
                  <p>{g.explainer}</p>
                  {g.example && <Example ex={g.example} />}
                </div>
              )}
            </article>
          )
        })}
      </div>
      <div className="mt-3 flex justify-center gap-2" aria-hidden>
        {conceptIds.map((id, i) => (
          <span key={id} className={`h-2 w-2 rounded-full ${i === index ? 'bg-teal-600 dark:bg-teal-400' : 'bg-slate-300 dark:bg-slate-700'}`} />
        ))}
      </div>
    </div>
  )
}
