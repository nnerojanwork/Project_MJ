import { useEffect, useState } from 'react'
import { Badge } from './components/ui'
import { dueCards } from './lib/round'
import { setLastRoute, useStore } from './lib/store'
import { useRoute, type Route } from './router'
import Calculators from './screens/Calculators'
import Flashcards from './screens/Flashcards'
import Home from './screens/Home'
import Journal from './screens/Journal'
import More from './screens/More'
import Practice from './screens/Practice'
import Quiz from './screens/Quiz'
import Reference from './screens/Reference'
import RoundScreen from './screens/RoundScreen'
import Settings from './screens/Settings'
import WeekView from './screens/WeekView'
import Weeks from './screens/Weeks'

type Tab = 'round' | 'home' | 'weeks' | 'practice' | 'more'

function tabOf(r: Route): Tab {
  switch (r.name) {
    case 'round':
    case 'home':
    case 'weeks':
    case 'practice':
    case 'more':
      return r.name
    case 'week':
      return 'weeks'
    case 'cards':
    case 'quiz':
      return 'practice'
    default:
      return 'more'
  }
}

function screen(r: Route) {
  switch (r.name) {
    case 'round':
      return <RoundScreen />
    case 'home':
      return <Home />
    case 'weeks':
      return <Weeks />
    case 'week':
      return <WeekView week={r.week} />
    case 'practice':
      return <Practice />
    case 'cards':
      return <Flashcards />
    case 'quiz':
      return <Quiz />
    case 'calc':
      return <Calculators />
    case 'journal':
      return <Journal />
    case 'reference':
      return <Reference />
    case 'settings':
      return <Settings />
    case 'more':
      return <More />
  }
}

/** Re-render every minute so due counts stay current while the app is open. */
function useMinuteTick() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function App() {
  const [route, hash] = useRoute()
  const tab = tabOf(route)
  const now = useMinuteTick()
  const due = useStore((s) => dueCards(s, now).length)

  useEffect(() => {
    // "Continue where I left off" targets proper study screens, not the hubs.
    if (!['round', 'home', 'more', 'practice', 'weeks', 'settings'].includes(route.name)) setLastRoute(hash)
  }, [route.name, hash])

  return (
    <div className="[--tabbar:calc(4rem+env(safe-area-inset-bottom))]">
      <main className="pb-[var(--tabbar)]">{screen(route)}</main>
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto grid h-16 max-w-xl grid-cols-5">
          <TabLink href="#/round" active={tab === 'round'} icon="▶" label="Round" />
          <TabLink href="#/home" active={tab === 'home'} icon="⌂" label="Home" />
          <TabLink href="#/weeks" active={tab === 'weeks'} icon="▤" label="Weeks" />
          <TabLink href="#/practice" active={tab === 'practice'} icon="◧" label="Practice" badge={due} />
          <TabLink href="#/more" active={tab === 'more'} icon="⋯" label="More" />
        </div>
      </nav>
    </div>
  )
}

function TabLink({ href, active, icon, label, badge = 0 }: { href: string; active: boolean; icon: string; label: string; badge?: number }) {
  return (
    <a
      href={href}
      className={`relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${active ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="text-xl leading-none" aria-hidden>
        {icon}
      </span>
      {label}
      {badge > 0 && (
        <span className="absolute top-1.5 left-1/2 ml-2">
          <Badge n={badge} />
        </span>
      )}
    </a>
  )
}
