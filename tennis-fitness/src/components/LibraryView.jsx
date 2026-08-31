import { useState } from 'react'
import { DEFAULT_PROGRAM } from '../data/defaultProgram.js'

function makeId() {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function LibraryView({ program, setProgram }) {
  const [confirmReset, setConfirmReset] = useState(false)

  function updateExercise(dayId, exId, patch) {
    setProgram((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : { ...day, exercises: day.exercises.map((ex) => (ex.id === exId ? { ...ex, ...patch } : ex)) },
      ),
    )
  }

  function removeExercise(dayId, exId) {
    setProgram((prev) =>
      prev.map((day) => (day.id !== dayId ? day : { ...day, exercises: day.exercises.filter((ex) => ex.id !== exId) })),
    )
  }

  function addExercise(dayId) {
    setProgram((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : { ...day, exercises: [...day.exercises, { id: makeId(), name: 'New exercise', prescription: '3 x 10' }] },
      ),
    )
  }

  function resetToDefault() {
    setProgram(DEFAULT_PROGRAM.map((d) => ({ ...d, exercises: d.exercises.map((e) => ({ ...e })) })))
    setConfirmReset(false)
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Exercise library</h1>
          <p className="text-sm text-slate-500">Edit sets/reps or swap exercises.</p>
        </div>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="text-xs font-semibold text-slate-400 underline">
            Reset to default
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <button onClick={resetToDefault} className="font-semibold text-red-600">
              Confirm
            </button>
            <button onClick={() => setConfirmReset(false)} className="text-slate-400">
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {program.map((day) => (
          <div key={day.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <input
              value={day.name}
              onChange={(e) =>
                setProgram((prev) => prev.map((d) => (d.id === day.id ? { ...d, name: e.target.value } : d)))
              }
              className="mb-3 w-full rounded-lg border border-transparent px-1 py-1 text-base font-semibold text-slate-800 focus:border-slate-200 focus:outline-none"
            />
            <ul className="space-y-2">
              {day.exercises.map((ex) => (
                <li key={ex.id} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2">
                  <div className="flex-1 space-y-1">
                    <input
                      value={ex.name}
                      onChange={(e) => updateExercise(day.id, ex.id, { name: e.target.value })}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-lime-500"
                    />
                    <input
                      value={ex.prescription}
                      onChange={(e) => updateExercise(day.id, ex.id, { prescription: e.target.value })}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-500 outline-none focus:border-lime-500"
                      placeholder="e.g. 3 x 12 each side"
                    />
                  </div>
                  <button
                    onClick={() => removeExercise(day.id, ex.id)}
                    className="mt-1 rounded-full p-1.5 text-slate-300 hover:bg-slate-100 hover:text-red-500"
                    aria-label={`Remove ${ex.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => addExercise(day.id)}
              className="mt-3 w-full rounded-xl border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-400 hover:border-slate-400 hover:text-slate-600"
            >
              + Add exercise
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
