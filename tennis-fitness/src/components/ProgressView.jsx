import { useMemo } from 'react'
import { weeklyAdherenceSeries, monthlyAdherence, currentStreak } from '../lib/adherence.js'
import { formatWeekRange } from '../lib/date.js'

export default function ProgressView({ sessions }) {
  const series = useMemo(() => weeklyAdherenceSeries(sessions, 8), [sessions])
  const month = useMemo(() => monthlyAdherence(sessions), [sessions])
  const streak = useMemo(() => currentStreak(sessions), [sessions])

  const chartHeight = 160
  const barWidth = 28
  const gap = 14

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Progress</h1>
      <p className="mb-5 text-sm text-slate-500">Weekly adherence over the last {series.length} weeks.</p>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">This month</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{month.percent}%</div>
          <div className="text-xs text-slate-400">
            {month.completed}/{month.scheduled} sessions
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Current streak</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{streak}</div>
          <div className="text-xs text-slate-400">consecutive full weeks</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <svg
            width={series.length * (barWidth + gap)}
            height={chartHeight + 40}
            className="mx-auto block"
          >
            {[0, 25, 50, 75, 100].map((mark) => {
              const y = chartHeight - (mark / 100) * chartHeight + 10
              return (
                <line
                  key={mark}
                  x1={0}
                  x2={series.length * (barWidth + gap)}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )
            })}
            {series.map((wk, i) => {
              const x = i * (barWidth + gap) + gap / 2
              const barH = (wk.percent / 100) * chartHeight
              const y = chartHeight - barH + 10
              const isFull = wk.percent >= 100
              return (
                <g key={wk.weekKey}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barH, 2)}
                    rx={6}
                    fill={isFull ? '#65a30d' : wk.percent > 0 ? '#a3e635' : '#e2e8f0'}
                  />
                  <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="#64748b">
                    {wk.percent}%
                  </text>
                  <text x={x + barWidth / 2} y={chartHeight + 26} textAnchor="middle" fontSize="9" fill="#94a3b8">
                    {formatWeekRange(wk.weekKey).split('–')[0].trim()}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
