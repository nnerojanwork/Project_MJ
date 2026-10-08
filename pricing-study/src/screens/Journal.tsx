import { useState } from 'react'
import { syllabus, weekCount } from '../content'
import { btn, card, inputCls, muted, Page } from '../components/ui'
import { update, useStore, type ResearchLogEntry } from '../lib/store'

type Field = 'source' | 'claim' | 'evidence' | 'limitations' | 'decisionImpact'
const FIELDS: Field[] = ['source', 'claim', 'evidence', 'limitations', 'decisionImpact']
// Column names come verbatim from the syllabus research log template.
const LABELS = Object.fromEntries(FIELDS.map((f, i) => [f, syllabus.researchLogTemplate.columns[i] ?? f])) as Record<Field, string>

export default function Journal() {
  const [tab, setTab] = useState<'reflection' | 'log'>('reflection')
  return (
    <Page title="Journal" back="#/more">
      <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-200 p-1 dark:bg-slate-800">
        {(['reflection', 'log'] as const).map((t) => (
          <button
            key={t}
            className={`min-h-11 rounded-xl font-medium ${tab === t ? 'bg-white shadow-sm dark:bg-slate-950' : muted}`}
            onClick={() => setTab(t)}
          >
            {t === 'reflection' ? 'Weekly reflection' : 'Research log'}
          </button>
        ))}
      </div>
      {tab === 'reflection' ? <Reflection /> : <ResearchLog />}
    </Page>
  )
}

function Reflection() {
  const current = useStore((s) => s.currentWeek)
  const [week, setWeek] = useState(current)
  const answers = useStore((s) => s.journal.reflections[String(week)] ?? {})
  const set = (promptId: string, text: string) =>
    update((s) => ({
      ...s,
      journal: {
        ...s.journal,
        reflections: { ...s.journal.reflections, [String(week)]: { ...(s.journal.reflections[String(week)] ?? {}), [promptId]: text } },
      },
    }))
  return (
    <div className="flex flex-col gap-4">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            className={`min-h-11 min-w-11 shrink-0 rounded-xl border font-semibold ${w === week ? 'border-teal-700 bg-teal-700 text-white dark:border-teal-500 dark:bg-teal-500 dark:text-slate-950' : 'border-slate-300 dark:border-slate-700'}`}
            onClick={() => setWeek(w)}
          >
            {w}
          </button>
        ))}
      </div>
      {syllabus.reflectionTemplate.prompts.map((p) => (
        <label key={p.id} className="flex flex-col gap-1">
          <span className="font-medium">{p.prompt}…</span>
          <textarea className={`${inputCls} min-h-24`} value={answers[p.id] ?? ''} onChange={(e) => set(p.id, e.target.value)} />
        </label>
      ))}
      <p className={`text-sm ${muted}`}>Saved as you type.</p>
    </div>
  )
}

function emptyEntry(week: number): ResearchLogEntry {
  const t = Date.now()
  return { id: `log-${t}`, week, source: '', claim: '', evidence: '', limitations: '', decisionImpact: '', createdAt: t, updatedAt: t }
}

function ResearchLog() {
  const log = useStore((s) => s.journal.researchLog)
  const current = useStore((s) => s.currentWeek)
  const [editing, setEditing] = useState<string | null>(null)
  const save = (e: ResearchLogEntry) =>
    update((s) => {
      const exists = s.journal.researchLog.some((x) => x.id === e.id)
      const researchLog = exists ? s.journal.researchLog.map((x) => (x.id === e.id ? e : x)) : [e, ...s.journal.researchLog]
      return { ...s, journal: { ...s.journal, researchLog } }
    })
  const remove = (id: string) => update((s) => ({ ...s, journal: { ...s.journal, researchLog: s.journal.researchLog.filter((x) => x.id !== id) } }))

  const entry = editing ? log.find((x) => x.id === editing) : undefined
  if (editing && entry) {
    const set = (patch: Partial<ResearchLogEntry>) => save({ ...entry, ...patch, updatedAt: Date.now() })
    return (
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Week</span>
          <select className={inputCls} value={entry.week ?? ''} onChange={(e) => set({ week: e.target.value ? Number(e.target.value) : null })}>
            <option value="">—</option>
            {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </label>
        {FIELDS.map((f) => (
          <label key={f} className="flex flex-col gap-1">
            <span className="font-medium">{LABELS[f]}</span>
            <textarea className={`${inputCls} ${f === 'source' ? 'min-h-12' : 'min-h-20'}`} value={entry[f]} onChange={(e) => set({ [f]: e.target.value })} />
          </label>
        ))}
        <button className={btn.primary} onClick={() => setEditing(null)}>
          Done
        </button>
        <button
          className="min-h-11 text-rose-600"
          onClick={() => {
            if (confirm('Delete this entry?')) {
              remove(entry.id)
              setEditing(null)
            }
          }}
        >
          Delete entry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className={muted}>{syllabus.researchLogTemplate.intro}</p>
      <button
        className={btn.primary}
        onClick={() => {
          const e = emptyEntry(current)
          save(e)
          setEditing(e.id)
        }}
      >
        + New entry
      </button>
      {log.map((e) => (
        <button key={e.id} className={`${card} text-left active:bg-slate-100 dark:active:bg-slate-800`} onClick={() => setEditing(e.id)}>
          <div className={`text-sm ${muted}`}>
            {e.week ? `Week ${e.week} · ` : ''}
            {new Date(e.updatedAt).toLocaleDateString('en-GB')}
          </div>
          <div className="font-semibold">{e.source || 'Untitled source'}</div>
          {e.claim && <div className="line-clamp-2">{e.claim}</div>}
        </button>
      ))}
    </div>
  )
}
