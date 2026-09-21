import { useState } from 'react'
import { getDiagram } from '../data/diagrams.js'
import { figureSvg } from '../lib/figure.js'
import { footSvg } from '../lib/foot.js'

function renderPose(kind, pose) {
  return kind === 'foot' ? footSvg(pose) : figureSvg(pose)
}

function Panel({ kind, pose, label, size }) {
  const dim = size === 'lg' ? 140 : 56
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 100 120"
        width={dim}
        height={dim * 1.2}
        className="rounded-lg bg-slate-50"
        dangerouslySetInnerHTML={{ __html: renderPose(kind, pose) }}
      />
      {label && <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>}
    </div>
  )
}

export default function ExerciseDiagram({ diagramId, name, cue, size = 'sm' }) {
  const [open, setOpen] = useState(false)
  const diagram = getDiagram(diagramId)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-1 rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-100 active:bg-slate-100"
        aria-label={`Enlarge diagram for ${name}`}
      >
        <Panel kind={diagram.kind} pose={diagram.start} size="sm" />
        <span className="text-slate-300">→</span>
        <Panel kind={diagram.kind} pose={diagram.end} size="sm" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-800">{name}</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Panel kind={diagram.kind} pose={diagram.start} label="Start" size="lg" />
              <span className="text-2xl text-lime-500">→</span>
              <Panel kind={diagram.kind} pose={diagram.end} label="End" size="lg" />
            </div>
            {cue && (
              <p className="mt-4 rounded-xl bg-lime-50 px-3 py-2 text-sm text-lime-800 ring-1 ring-lime-100">💡 {cue}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
