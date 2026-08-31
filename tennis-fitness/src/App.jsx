import { useState } from 'react'
import { usePersistentState } from './lib/storage.js'
import { DEFAULT_PROGRAM } from './data/defaultProgram.js'
import BottomNav from './components/BottomNav.jsx'
import TodayView from './components/TodayView.jsx'
import HistoryView from './components/HistoryView.jsx'
import ProgressView from './components/ProgressView.jsx'
import LibraryView from './components/LibraryView.jsx'

export default function App() {
  const [tab, setTab] = useState('today')
  const [program, setProgram] = usePersistentState('program', DEFAULT_PROGRAM)
  const [sessions, setSessions] = usePersistentState('sessions', [])

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
