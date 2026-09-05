import { useEffect, useState } from 'react'
import { days } from './data/days'
import Tabs from './components/Tabs'
import BookAhead from './components/BookAhead'
import DayTimeline from './components/DayTimeline'
import { loadJSON, saveJSON } from './lib/storage'

export default function App() {
  const [activeTab, setActiveTab] = useState('book')
  const [bookState, setBookState] = useState(() => loadJSON('booking-state', {}))
  const [userName, setUserName] = useState(() => loadJSON('user-name', ''))

  useEffect(() => {
    saveJSON('booking-state', bookState)
  }, [bookState])

  useEffect(() => {
    saveJSON('user-name', userName)
  }, [userName])

  function toggleBooked(id) {
    setBookState((prev) => {
      const current = prev[id] || { done: false, by: '' }
      const next = { done: !current.done, by: !current.done ? userName || 'someone' : '' }
      return { ...prev, [id]: next }
    })
  }

  const activeDay = days.find((d) => d.id === activeTab)

  return (
    <div className="mx-auto max-w-[640px] pb-16">
      <div className="border-b border-line px-6 pb-[22px] pt-9">
        <p className="m-0 mb-1.5 font-serif text-[15px] font-medium italic text-rome-red">Quattro giorni a Roma</p>
        <h1 className="m-0 mb-2 font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.01em]">
          Rome, 25–28 September
        </h1>
        <p className="m-0 max-w-[46ch] text-[14.5px] text-ink-soft">
          A shared plan for the trip — check off what's booked so nobody double-books, and everyone can see the day's
          shape.
        </p>
      </div>

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="px-5 pt-[22px]">
        {activeTab === 'book' ? (
          <BookAhead userName={userName} onUserNameChange={setUserName} bookState={bookState} onToggle={toggleBooked} />
        ) : (
          activeDay && <DayTimeline day={activeDay} />
        )}
      </main>

      <footer className="px-5 pt-[30px] text-center text-xs text-ink-soft">
        Tap a checkbox to mark something as booked — saved on this device.
      </footer>
    </div>
  )
}
