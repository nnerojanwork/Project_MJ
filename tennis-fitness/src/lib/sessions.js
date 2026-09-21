import { toDateKey } from './date.js'

export function findSession(sessions, dateKey, dayId) {
  return sessions.find((s) => s.date === dateKey && s.dayId === dayId)
}

// Update (or create) the session for a given date+day, via an updater that
// receives the current session (or a fresh blank one) and returns the next.
export function upsertSession(setSessions, dateKey, dayId, updater) {
  setSessions((prev) => {
    const idx = prev.findIndex((s) => s.date === dateKey && s.dayId === dayId)
    const blank = {
      id: `${dateKey}-${dayId}`,
      date: dateKey,
      dayId,
      completedExerciseIds: [],
      exerciseNotes: {},
      note: '',
      loggedAt: new Date().toISOString(),
    }
    const current = idx === -1 ? blank : prev[idx]
    const next = updater(current)
    next.loggedAt = new Date().toISOString()

    if (idx === -1) {
      return [...prev, next]
    }
    const copy = prev.slice()
    copy[idx] = next
    return copy
  })
}

export function toggleExercise(setSessions, dateKey, dayId, exerciseId) {
  upsertSession(setSessions, dateKey, dayId, (session) => {
    const has = session.completedExerciseIds.includes(exerciseId)
    return {
      ...session,
      completedExerciseIds: has
        ? session.completedExerciseIds.filter((id) => id !== exerciseId)
        : [...session.completedExerciseIds, exerciseId],
    }
  })
}

export function setAllExercises(setSessions, dateKey, dayId, exerciseIds, done) {
  upsertSession(setSessions, dateKey, dayId, (session) => ({
    ...session,
    completedExerciseIds: done ? exerciseIds.slice() : [],
  }))
}

export function setSessionNote(setSessions, dateKey, dayId, note) {
  upsertSession(setSessions, dateKey, dayId, (session) => ({ ...session, note }))
}

export function setExerciseNote(setSessions, dateKey, dayId, exerciseId, note) {
  upsertSession(setSessions, dateKey, dayId, (session) => ({
    ...session,
    exerciseNotes: { ...session.exerciseNotes, [exerciseId]: note },
  }))
}

export function sessionsForDate(sessions, date) {
  const key = toDateKey(date)
  return sessions.filter((s) => s.date === key)
}
