import { useState } from 'react'

export default function DayCard({
  day,
  session,
  onToggleExercise,
  onMarkAllDone,
  onUnmarkAll,
  onSessionNoteChange,
  onExerciseNoteChange,
  onOpenTimer,
}) {
  const [expanded, setExpanded] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [openExerciseNote, setOpenExerciseNote] = useState(null)

  const completedIds = session?.completedExerciseIds ?? []
  const total = day.exercises.length
  const doneCount = day.exercises.filter((e) => completedIds.includes(e.id)).length
  const allDone = doneCount === total && total > 0
  const someDone = doneCount > 0 && !allDone

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{day.id.replace('day', 'Day ')}</div>
          <div className="truncate text-base font-semibold text-slate-800">{day.name}</div>
          <div className="mt-0.5 text-sm text-slate-500">
            {doneCount}/{total} exercises
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              allDone
                ? 'bg-lime-500 text-white'
                : someDone
                ? 'bg-amber-100 text-amber-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {allDone ? '✓' : `${doneCount}`}
          </div>
          <span className={`text-slate-300 transition-transform ${expanded ? 'rotate-180' : ''}`}>⌄</span>
        </div>
      </button>

      <div className="px-4 pb-3">
        <button
          onClick={() => (allDone ? onUnmarkAll() : onMarkAllDone())}
          className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${
            allDone ? 'bg-lime-50 text-lime-700 ring-1 ring-lime-200' : 'bg-slate-800 text-white active:bg-slate-700'
          }`}
        >
          {allDone ? '✓ Session complete — tap to undo' : 'Mark whole session done'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4">
          <ul className="divide-y divide-slate-100">
            {day.exercises.map((ex) => {
              const checked = completedIds.includes(ex.id)
              const note = session?.exerciseNotes?.[ex.id]
              return (
                <li key={ex.id} className="py-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleExercise(ex.id)}
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        checked ? 'border-lime-500 bg-lime-500 text-white' : 'border-slate-300 text-transparent'
                      }`}
                      aria-label={checked ? `Mark ${ex.name} not done` : `Mark ${ex.name} done`}
                    >
                      ✓
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium ${checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {ex.name}
                      </div>
                      <div className="text-sm text-slate-500">{ex.prescription}</div>
                      {note && !openExerciseNote && (
                        <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-500">📝 {note}</div>
                      )}
                      {openExerciseNote === ex.id && (
                        <input
                          autoFocus
                          defaultValue={note ?? ''}
                          placeholder="e.g. used heavier band, left ankle felt tight"
                          onBlur={(e) => {
                            onExerciseNoteChange(ex.id, e.target.value)
                            setOpenExerciseNote(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur()
                          }}
                          className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-lime-500"
                        />
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <button
                        onClick={() => onOpenTimer()}
                        className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100"
                        title="Rest timer"
                      >
                        ⏱
                      </button>
                      <button
                        onClick={() => setOpenExerciseNote(openExerciseNote === ex.id ? null : ex.id)}
                        className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100"
                        title="Add note"
                      >
                        ✎
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {!showNote && !session?.note && (
            <button onClick={() => setShowNote(true)} className="mt-2 text-sm font-medium text-slate-400">
              + Add session note
            </button>
          )}
          {(showNote || session?.note) && (
            <textarea
              defaultValue={session?.note ?? ''}
              onBlur={(e) => onSessionNoteChange(e.target.value)}
              placeholder="Notes for this session…"
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500"
            />
          )}
        </div>
      )}
    </div>
  )
}
