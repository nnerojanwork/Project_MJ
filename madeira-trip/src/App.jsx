import { useState, useEffect, useMemo, useCallback } from 'react'
import activitiesData from './data/madeira_activities.json'
import seasonalData from './data/madeira_seasonal_costs.json'

const MONTHS = [
  { key: 'jan', label: 'January' },
  { key: 'feb', label: 'February' },
  { key: 'mar', label: 'March' },
  { key: 'apr', label: 'April' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'June' },
  { key: 'jul', label: 'July' },
  { key: 'aug', label: 'August' },
  { key: 'sep', label: 'September' },
  { key: 'oct', label: 'October' },
  { key: 'nov', label: 'November' },
  { key: 'dec', label: 'December' },
]

const TRIP_LENGTHS = [4, 5, 6, 7]

const FOOD_PER_DAY = 30
const SANE_HOURS_PER_DAY = 6

const allActivities = Object.entries(activitiesData.zones).flatMap(
  ([zoneId, zone]) => zone.activities.map((a) => ({ ...a, zoneId, zoneName: zone.name }))
)

const defaultSelectedIds = new Set(
  allActivities.filter((a) => a.defaultSelected).map((a) => a.id)
)

function formatEUR(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

function ActivityImage({ wikipediaTitle, name, imageCache }) {
  const [src, setSrc] = useState(imageCache.current.get(wikipediaTitle) ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (imageCache.current.has(wikipediaTitle)) {
      setSrc(imageCache.current.get(wikipediaTitle))
      return
    }
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        wikipediaTitle
      )}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return
        const url = data?.thumbnail?.source ?? null
        imageCache.current.set(wikipediaTitle, url)
        setSrc(url)
        if (!url) setFailed(true)
      })
      .catch(() => {
        if (cancelled) return
        imageCache.current.set(wikipediaTitle, null)
        setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [wikipediaTitle, imageCache])

  if (!src || failed) {
    return (
      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 dark:from-teal-900 dark:to-cyan-900 dark:text-teal-300">
        <span className="text-sm font-medium">{name}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className="h-40 w-full object-cover"
      loading="lazy"
    />
  )
}

function ActivityCard({ activity, selected, onToggle, imageCache }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border transition-shadow ${
        selected
          ? 'border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500'
          : 'border-slate-200 dark:border-slate-700'
      } bg-white dark:bg-slate-800`}
    >
      <ActivityImage
        wikipediaTitle={activity.wikipediaTitle}
        name={activity.name}
        imageCache={imageCache}
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {activity.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{activity.durationHours}h</span>
          <span aria-hidden="true">·</span>
          <span>
            {activity.pricePerPerson === 0
              ? 'Free'
              : `${formatEUR(activity.pricePerPerson)} pp`}
            {!activity.sourced && (
              <span className="ml-1 text-amber-600 dark:text-amber-400">
                (est.)
              </span>
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{activity.category}</span>
        </div>
        <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">
          {activity.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          {activity.bookingUrl ? (
            <a
              href={activity.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              Booking info ↗
            </a>
          ) : (
            <span className="text-xs text-slate-400">No booking needed</span>
          )}
          <button
            type="button"
            onClick={() => onToggle(activity.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              selected
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {selected ? 'Selected ✓' : 'Add to trip'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [month, setMonth] = useState('jul')
  const [tripLength, setTripLength] = useState(6)
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds)
  const imageCache = useMemo(() => ({ current: new Map() }), [])

  const toggleActivity = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectedActivities = useMemo(
    () => allActivities.filter((a) => selectedIds.has(a.id)),
    [selectedIds]
  )

  const totals = useMemo(() => {
    const activitiesCost = selectedActivities.reduce(
      (sum, a) => sum + a.pricePerPerson,
      0
    )
    const totalHours = selectedActivities.reduce(
      (sum, a) => sum + a.durationHours,
      0
    )
    const flight = seasonalData.madeira.flightFromLondon[month] ?? 0
    const nights = tripLength - 1
    const airbnbNightly = seasonalData.madeira.airbnbPerNightGroupOf8[month] ?? 0
    const airbnb = (airbnbNightly / 8) * nights
    const food = FOOD_PER_DAY * tripLength
    const total = flight + airbnb + activitiesCost + food

    return { activitiesCost, totalHours, flight, airbnb, food, total }
  }, [selectedActivities, month, tripLength])

  const avgHoursPerDay = totals.totalHours / tripLength
  const showDurationWarning = avgHoursPerDay > SANE_HOURS_PER_DAY

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-10 text-white dark:border-slate-700">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">
            Group trip pitch
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            Madeira — Build Your Days
          </h1>
          <p className="mt-2 max-w-2xl text-teal-50">
            One base in Funchal, day trips radiating out. Pick your month and
            trip length, then toggle activities on or off to build your own
            itinerary.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-8 grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Travel month
            </h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {MONTHS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMonth(m.key)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                    month === m.key
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {m.label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Trip length
            </h2>
            <div className="flex gap-2">
              {TRIP_LENGTHS.map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setTripLength(len)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    tripLength === len
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {len} days
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {tripLength} days / {tripLength - 1} nights in Funchal
            </p>
          </div>
        </section>

        {showDurationWarning && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            <span className="text-lg" aria-hidden="true">⚠️</span>
            <p className="text-sm">
              You've selected {totals.totalHours.toFixed(1)} hours of
              activities across {tripLength} days — that's an average of{' '}
              {avgHoursPerDay.toFixed(1)}h/day. Consider trimming a few
              activities or adding a day so the trip doesn't feel rushed.
            </p>
          </div>
        )}

        {Object.entries(activitiesData.zones).map(([zoneId, zone]) => (
          <section key={zoneId} className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
              {zone.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {zone.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  selected={selectedIds.has(activity.id)}
                  onToggle={toggleActivity}
                  imageCache={imageCache}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
              <span>Flight: {formatEUR(totals.flight)} pp</span>
              <span>Airbnb: {formatEUR(totals.airbnb)} pp</span>
              <span>Activities: {formatEUR(totals.activitiesCost)} pp</span>
              <span>Food: {formatEUR(totals.food)} pp</span>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total per person
              </p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {formatEUR(totals.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
