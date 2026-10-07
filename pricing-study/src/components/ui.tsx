import { useState, type ReactNode } from 'react'

export const btn = {
  primary:
    'min-h-14 w-full rounded-2xl bg-teal-700 px-5 text-lg font-semibold text-white active:bg-teal-800 disabled:opacity-40 dark:bg-teal-500 dark:text-slate-950 dark:active:bg-teal-400',
  secondary:
    'min-h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg font-medium active:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:active:bg-slate-800',
  small:
    'min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-base font-medium active:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:active:bg-slate-800',
}

export const card = 'rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'
export const muted = 'text-slate-500 dark:text-slate-400'
export const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900 focus:outline-2 focus:outline-teal-600'

export function AiTag() {
  return (
    <span
      className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
      title="Generated content: check numbers and claims"
    >
      AI-generated, verify
    </span>
  )
}

export function Page({ title, back, children, action }: { title: string; back?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 pb-6">
      <header className="pt-safe sticky top-0 z-10 -mx-4 mb-3 flex items-center gap-2 bg-slate-50/95 px-4 py-3 backdrop-blur dark:bg-slate-950/95">
        {back && (
          <a href={back} className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl active:bg-slate-200 dark:active:bg-slate-800" aria-label="Back">
            ‹
          </a>
        )}
        <h1 className="flex-1 text-xl font-bold">{title}</h1>
        {action}
      </header>
      {children}
    </div>
  )
}

export function Section({ title, children, defaultOpen = false, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-b border-slate-200 dark:border-slate-800">
      <button
        className="flex min-h-14 w-full items-center gap-3 py-3 text-left text-lg font-semibold"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex-1">{title}</span>
        {badge}
        <span className={`text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </section>
  )
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div>
      {label && (
        <div className={`mb-1 flex justify-between text-sm ${muted}`}>
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-teal-600 dark:bg-teal-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  )
}

export function Badge({ n }: { n: number }) {
  if (n <= 0) return null
  return (
    <span className="min-w-6 rounded-full bg-rose-600 px-1.5 text-center text-xs leading-6 font-bold text-white">{n > 99 ? '99+' : n}</span>
  )
}

/** Number formatting: "—" for NaN/∞, thousands separators, optional £ or %. */
export function fmt(n: number, opts: { dp?: number; unit?: '£' | '%' | '' } = {}): string {
  if (!Number.isFinite(n)) return '—'
  const dp = opts.dp ?? 0
  const s = Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })
  const sign = n < 0 ? '−' : ''
  if (opts.unit === '£') return `${sign}£${s}`
  if (opts.unit === '%') return `${sign}${s}%`
  return `${sign}${s}`
}
