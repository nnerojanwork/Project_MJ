import { useEffect, useState } from 'react'
import { usePersistentState } from './lib/storage.js'
import { DEFAULT_PROGRAM } from './data/defaultProgram.js'
import BottomNav from './components/BottomNav.jsx'
import TodayView from './components/TodayView.jsx'
import HistoryView from './components/HistoryView.jsx'
import ProgressView from './components/ProgressView.jsx'
import LibraryView from './components/LibraryView.jsx'

const DEFAULTS_BY_ID = Object.fromEntries(DEFAULT_PROGRAM.flatMap((day) => day.exercises.map((ex) => [ex.id, ex])))

export default function App() {
  const [tab, setTab] = useState('today')
  const [program, setProgram] = usePersistentState('program', DEFAULT_PROGRAM)
  const [sessions, setSessions] = usePersistentState('sessions', [])

  // Backfill diagramId/formCue for program data saved before diagrams existed,
  // without touching any names/prescriptions the user has already edited.
  useEffect(() => {
    setProgram((prev) => {
      let changed = false
      const next = prev.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.diagramId && ex.formCue !== undefined) return ex
          changed = true
          const fallback = DEFAULTS_BY_ID[ex.id]
          return { ...ex, diagramId: ex.diagramId ?? fallback?.diagramId ?? 'generic', formCue: ex.formCue ?? fallback?.formCue ?? '' }
        }),
      }))
      return changed ? next : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f6f5]">
      {tab === 'today' && <TodayView program={program} sessions={sessions} setSessions={setSessions} />}
      {tab === 'history' && <HistoryView program={program} sessions={sessions} />}
      {tab === 'progress' && <ProgressView sessions={sessions} />}
      {tab === 'library' && <LibraryView program={program} setProgram={setProgram} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
