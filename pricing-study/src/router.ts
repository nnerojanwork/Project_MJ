import { useEffect, useState } from 'react'

export type Route =
  | { name: 'round' }
  | { name: 'home' }
  | { name: 'weeks' }
  | { name: 'week'; week: number }
  | { name: 'practice' }
  | { name: 'cards' }
  | { name: 'quiz' }
  | { name: 'calc' }
  | { name: 'journal' }
  | { name: 'reference' }
  | { name: 'settings' }
  | { name: 'more' }

const simple = ['round', 'home', 'weeks', 'practice', 'cards', 'quiz', 'calc', 'journal', 'reference', 'settings', 'more'] as const

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/')
  if (parts[0] === 'week' && Number(parts[1]) > 0) return { name: 'week', week: Number(parts[1]) }
  const name = simple.find((n) => n === parts[0])
  return name ? ({ name } as Route) : { name: 'round' }
}

export function go(path: string) {
  window.location.hash = path
}

export function useRoute(): [Route, string] {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return [parseHash(hash), hash || '#/round']
}

export const routeLabels: Record<string, string> = {
  weeks: 'Weeks',
  week: 'Week',
  practice: 'Practice',
  cards: 'Flashcards',
  quiz: 'Quiz',
  calc: 'Calculators',
  journal: 'Journal',
  reference: 'Reference',
  settings: 'Settings',
}
