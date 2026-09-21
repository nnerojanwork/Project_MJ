const TABS = [
  { id: 'today', label: 'Today', icon: '🎾' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'library', label: 'Library', icon: '📋' },
]

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-lg">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              tab === t.id ? 'text-lime-700' : 'text-slate-400'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
