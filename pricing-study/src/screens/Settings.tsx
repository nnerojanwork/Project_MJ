import { useRef, useState } from 'react'
import { weekCount } from '../content'
import { btn, card, inputCls, muted, Page } from '../components/ui'
import { exportJson, parseImport, resetAll, setCurrentWeek, setState, useStore } from '../lib/store'

export default function Settings() {
  const current = useStore((s) => s.currentWeek)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [paste, setPaste] = useState('')

  const doExport = async () => {
    const json = exportJson()
    const name = `pricing-study-${new Date().toISOString().slice(0, 10)}.json`
    const file = new File([json], name, { type: 'application/json' })
    // On iPhone the share sheet ("Save to Files", AirDrop) is more reliable than a download link.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: name })
        setMsg({ ok: true, text: 'Exported.' })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMsg({ ok: true, text: `Downloaded ${name}.` })
  }

  const doImport = (text: string) => {
    try {
      const next = parseImport(text)
      if (!confirm('Replace all progress on this device with the imported data?')) return
      setState(next)
      setPaste('')
      setMsg({ ok: true, text: 'Imported. Your progress has been restored.' })
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message })
    }
  }

  return (
    <Page title="Settings" back="#/more">
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Current week</span>
          <select className={inputCls} value={current} onChange={(e) => setCurrentWeek(Number(e.target.value))}>
            {Array.from({ length: weekCount }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
          <span className={`text-sm ${muted}`}>Quick rounds, flashcards and mixed quizzes use weeks 1 to this week.</span>
        </label>

        <div className={`${card} flex flex-col gap-3`}>
          <h2 className="text-lg font-semibold">Back up and move devices</h2>
          <p className={muted}>
            Progress, checkboxes, card scheduling and journal entries are stored on this device only. Export before switching phones, then import on the new one.
          </p>
          <button className={btn.primary} onClick={doExport}>
            Export JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]
            if (f) doImport(await f.text())
            e.target.value = ''
          }} />
          <button className={btn.secondary} onClick={() => fileRef.current?.click()}>
            Import from file
          </button>
          <details>
            <summary className={`min-h-11 cursor-pointer ${muted}`}>Or paste exported JSON</summary>
            <textarea className={`${inputCls} mt-2 min-h-28 font-mono text-sm`} value={paste} onChange={(e) => setPaste(e.target.value)} />
            <button className={`${btn.small} mt-2`} disabled={!paste.trim()} onClick={() => doImport(paste)}>
              Import pasted data
            </button>
          </details>
          {msg && <p className={msg.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}>{msg.text}</p>}
        </div>

        <div className={`${card} flex flex-col gap-2`}>
          <h2 className="text-lg font-semibold">Reset</h2>
          <p className={muted}>Deletes all progress on this device. Export first if you might want it back.</p>
          <button
            className="min-h-12 rounded-2xl border border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-400"
            onClick={() => {
              if (confirm('Delete all progress on this device? This cannot be undone.')) {
                resetAll()
                setMsg({ ok: true, text: 'All progress reset.' })
              }
            }}
          >
            Reset all progress
          </button>
        </div>

        <p className={`text-sm ${muted}`}>
          Content: syllabus text is verbatim from your document. Items tagged “AI-generated, verify” come from generated.json.
        </p>
      </div>
    </Page>
  )
}
