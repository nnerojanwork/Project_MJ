import { useMemo, useState } from 'react'
import { addDays, startOfWeek, toDateKey, formatShort } from '../lib/date.js'

const WEEKS_SHOWN = 10

function sessionsOnDate(sessions, dateKey) {
  return sessions.filter((s) => s.date === dateKey && s.completedExerciseIds.length > 0)
}

export default function HistoryView({ program, sessions }) {
  const [selected, setSelected] = useState(null)

  const dayNameById = useMemo(() => {
    const m = {}
    for (const d of program) m[d.id] = d.name
    return m
  }, [program])

  const grid = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today)
    const weeks = []
    for (let w = WEEKS_SHOWN - 1; w >= 0; w--) {
      const start = addDays(weekStart, -7 * w)
      const days = []
      for (let d = 0; d < 7; d++) {
        const date = addDays(start, d)
        const key = toDateKey(date)
        const isFuture = date > today
        days.push({ key, date, isFuture, count: isFuture ? 0 : sessionsOnDate(sessions, key).length })
      }
      weeks.push(days)
    }
    return weeks
  }, [sessions])

  const recent = useMemo(
    () =>
      sessions
        .filter((s) => s.completedExerciseIds.length > 0)
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 25),
    [sessions],
  )

  function colorFor(count) {
    if (count <= 0) return 'bg-slate-100'
    if (count === 1) return 'bg-lime-300'
    return 'bg-lime-600'
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">History</h1>
      <p className="mb-5 text-sm text-slate-500">Last {WEEKS_SHOWN} weeks of logged sessions.</p>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {grid.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day) => (
                <button
                  key={day.key}
                  disabled={day.isFuture}
                  onClick={() => setSelected(day.key)}
                  className={`aspect-square rounded-md ${day.isFuture ? 'bg-transparent' : colorFor(day.count)} ${
                    selected === day.key ? 'ring-2 ring-slate-800' : ''
                  }`}
                  title={day.key}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-400">
          <span>Less</span>
          <span className="h-3 w-3 rounded bg-slate-100" />
          <span className="h-3 w-3 rounded bg-lime-300" />
          <span className="h-3 w-3 rounded bg-lime-600" />
          <span>More</span>
        </div>
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Recent sessions</h2>
      <ul className="space-y-2">
        {recent.length === 0 && <li className="text-sm text-slate-400">No sessions logged yet.</li>}
        {recent.map((s) => (
          <li key={s.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">{dayNameById[s.dayId] ?? s.dayId}</span>
              <span className="text-xs text-slate-400">{formatShort(s.date)}</span>
            </div>
            <div className="mt-0.5 text-xs text-slate-500">{s.completedExerciseIds.length} exercises done</div>
            {s.note && <div className="mt-1 text-sm text-slate-600">📝 {s.note}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
