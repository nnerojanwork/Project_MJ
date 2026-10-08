import { useEffect, useRef, useState } from 'react'

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.45)
  } catch {
    // audio unsupported — vibration fallback below still fires
  }
  if (navigator.vibrate) navigator.vibrate([120, 60, 120])
}

const PRESETS = [30, 60, 90]

export default function RestTimer({ open, onClose }) {
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          beep()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  if (!open) return null

  function pick(seconds) {
    setDuration(seconds)
    setRemaining(seconds)
    setRunning(false)
  }

  function toggle() {
    if (remaining === 0) setRemaining(duration)
    setRunning((r) => !r)
  }

  function reset() {
    setRunning(false)
    setRemaining(duration)
  }

  const pct = Math.max(0, Math.min(1, remaining / duration))

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-t-3xl bg-white p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Rest timer</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#65a30d"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="text-4xl font-bold tabular-nums text-slate-800">{remaining}s</span>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => pick(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                duration === p ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {p}s
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggle}
            className="flex-1 rounded-2xl bg-lime-600 py-3 text-base font-semibold text-white active:bg-lime-700"
          >
            {running ? 'Pause' : remaining === 0 ? 'Restart' : 'Start'}
          </button>
          <button onClick={reset} className="rounded-2xl bg-slate-100 px-5 py-3 text-base font-medium text-slate-600">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
