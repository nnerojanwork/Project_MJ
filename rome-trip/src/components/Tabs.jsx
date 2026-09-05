import { days } from '../data/days'

const allTabs = [{ id: 'book', label: 'Book ahead' }, ...days.map((d) => ({ id: d.id, label: d.label }))]

export default function Tabs({ activeTab, onChange }) {
  return (
    <nav className="tabs sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-line bg-base px-4 py-3.5">
      {allTabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-none whitespace-nowrap rounded-full border border-transparent px-3.5 py-2 font-sans text-[13.5px] font-semibold ${
            activeTab === t.id ? 'bg-ink text-base' : 'bg-transparent text-ink-soft'
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
