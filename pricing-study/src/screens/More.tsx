import { card, muted, Page } from '../components/ui'

const links = [
  { href: '#/calc', title: 'Calculators', sub: 'Every formula plus the Week 1 scenario model' },
  { href: '#/journal', title: 'Journal', sub: 'Weekly reflection and research log' },
  { href: '#/reference', title: 'Reference', sub: 'Formulas, data checks, capstone, reading list' },
  { href: '#/settings', title: 'Settings', sub: 'Export / import your data, current week' },
]

export default function More() {
  return (
    <Page title="More">
      <div className="flex flex-col gap-3">
        {links.map((l) => (
          <a key={l.href} href={l.href} className={`${card} flex items-center gap-3 active:bg-slate-100 dark:active:bg-slate-800`}>
            <div className="flex-1">
              <div className="text-lg font-semibold">{l.title}</div>
              <div className={muted}>{l.sub}</div>
            </div>
            <span className="text-slate-400">›</span>
          </a>
        ))}
      </div>
    </Page>
  )
}
