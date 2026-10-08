import { weeks } from '../content'
import { card, muted, Page, ProgressBar } from '../components/ui'
import { useStore } from '../lib/store'

export default function Weeks() {
  const selfCheck = useStore((s) => s.selfCheck)
  const current = useStore((s) => s.currentWeek)
  return (
    <Page title="Weeks">
      <div className="flex flex-col gap-3">
        {weeks.map((w) => {
          const done = w.selfCheck.filter((x) => selfCheck[x.id]).length
          return (
            <a key={w.id} href={`#/week/${w.week}`} className={`${card} flex flex-col gap-2 active:bg-slate-100 dark:active:bg-slate-800`}>
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-semibold ${w.week === current ? 'text-teal-700 dark:text-teal-400' : muted}`}>
                  Week {w.week}
                  {w.week === current ? ' · current' : ''}
                </span>
                <span className={`ml-auto text-sm ${muted}`}>
                  {done}/{w.selfCheck.length} checked
                </span>
              </div>
              <span className="text-lg leading-snug font-semibold">{w.title}</span>
              <ProgressBar value={done / w.selfCheck.length} />
            </a>
          )
        })}
      </div>
    </Page>
  )
}
