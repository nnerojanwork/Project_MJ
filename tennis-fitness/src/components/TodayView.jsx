import { useMemo, useState } from 'react'
import DayCard from './DayCard.jsx'
import RestTimer from './RestTimer.jsx'
import { findSession, toggleExercise, setAllExercises, setSessionNote, setExerciseNote } from '../lib/sessions.js'
import { toDateKey, todayKey, formatShort, getWeekKey } from '../lib/date.js'
import { weeklyAdherence, currentStreak } from '../lib/adherence.js'

export default function TodayView({ program, sessions, setSessions }) {
  const [dateKey, setDateKey] = useState(todayKey())
  const [timerOpen, setTimerOpen] = useState(false)

  const isToday = dateKey === todayKey()
  const week = useMemo(() => weeklyAdherence(sessions, getWeekKey(dateKey)), [sessions, dateKey])
  const streak = useMemo(() => currentStreak(sessions), [sessions])

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isToday ? 'Today' : formatShort(dateKey)}</h1>
          <p className="text-sm text-slate-500">{isToday ? formatShort(dateKey) : 'Logging a past session'}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setDateKey(todayKey())}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              Back to today
            </button>
          )}
          <input
            type="date"
            value={dateKey}
            max={todayKey()}
            onChange={(e) => setDateKey(toDateKey(e.target.value))}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
          />
        </div>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">This week</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">
            {week.completed}
            <span className="text-base font-medium text-slate-400">/{week.scheduled} days</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Streak</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">
            {streak}
            <span className="text-base font-medium text-slate-400"> {streak === 1 ? 'week' : 'weeks'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {program.map((day) => {
          const session = findSession(sessions, dateKey, day.id)
          return (
            <DayCard
              key={day.id}
              day={day}
              session={session}
              onToggleExercise={(exId) => toggleExercise(setSessions, dateKey, day.id, exId)}
              onMarkAllDone={() =>
                setAllExercises(
                  setSessions,
                  dateKey,
                  day.id,
                  day.exercises.map((e) => e.id),
                  true,
                )
              }
              onUnmarkAll={() => setAllExercises(setSessions, dateKey, day.id, [], false)}
              onSessionNoteChange={(note) => setSessionNote(setSessions, dateKey, day.id, note)}
              onExerciseNoteChange={(exId, note) => setExerciseNote(setSessions, dateKey, day.id, exId, note)}
              onOpenTimer={() => setTimerOpen(true)}
            />
          )
        })}
      </div>

      <RestTimer open={timerOpen} onClose={() => setTimerOpen(false)} />
    </div>
  )
}
