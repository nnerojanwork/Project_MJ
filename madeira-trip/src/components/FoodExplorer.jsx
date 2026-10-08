import { useState } from 'react'
import ActivityImage from './ActivityImage'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'light', label: 'Light' },
  { id: 'decadent', label: 'Decadent' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'specialty', label: 'Specialty' },
]

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'gluten-free', label: 'Gluten-free' },
]

const SPICE_LEVELS = [
  { id: 'any', label: 'Any spice' },
  { id: 'none', label: 'None' },
  { id: 'mild', label: 'Mild or less' },
  { id: 'medium', label: 'Medium or less' },
  { id: 'hot', label: 'Hot or less' },
]

const SPICE_RANK = { none: 0, mild: 1, medium: 2, hot: 3 }
const SPICE_LABEL = { none: 'No spice', mild: '🌶️ Mild', medium: '🌶️🌶️ Medium', hot: '🌶️🌶️🌶️ Hot' }
const RICHNESS_LABEL = { light: 'Light', moderate: 'Moderate', rich: 'Rich' }

function chipClasses(active) {
  return `rounded-full px-3 py-1 text-xs font-medium transition-colors ${
    active
      ? 'bg-brick-600 text-white'
      : 'bg-volcanic-100 text-volcanic-700 hover:bg-brick-100 dark:bg-volcanic-700 dark:text-volcanic-100 dark:hover:bg-volcanic-700/70'
  }`
}

function DishCard({ dish, imageCache }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-volcanic-100 bg-white dark:border-volcanic-700 dark:bg-volcanic-800">
      <div className="relative">
        <ActivityImage
          wikipediaTitle={dish.wikipediaTitle}
          name={dish.name}
          imageCache={imageCache}
        />
        {(dish.spiceLevel || dish.richness) && (
          <div className="absolute bottom-0 left-0 flex w-full flex-wrap gap-1 bg-volcanic-950/70 px-2 py-1">
            {dish.spiceLevel && (
              <span className="text-xs text-volcanic-50">{SPICE_LABEL[dish.spiceLevel]}</span>
            )}
            {dish.richness && (
              <>
                <span className="text-xs text-volcanic-50/60" aria-hidden="true">·</span>
                <span className="text-xs text-volcanic-50">{RICHNESS_LABEL[dish.richness]}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold leading-snug text-volcanic-900 dark:text-volcanic-50">
          {dish.name}
          {dish.isDrink && <span aria-hidden="true"> 🍹</span>}
        </h3>
        <p className="text-xs italic text-volcanic-700/60 dark:text-volcanic-100/50">
          {dish.portugueseName}
        </p>
        <p className="mt-1 flex-1 text-sm text-volcanic-700/90 dark:text-volcanic-100/80">
          {dish.description}
        </p>
        {(dish.dietary?.length > 0 || dish.safeOption) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dish.safeOption && (
              <span className="rounded-full bg-portugal-green-100 px-2 py-0.5 text-xs font-medium text-portugal-green-800 dark:bg-portugal-green-800/30 dark:text-portugal-green-100">
                gentle option
              </span>
            )}
            {dish.dietary?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-volcanic-100 px-2 py-0.5 text-xs text-volcanic-700 dark:bg-volcanic-700 dark:text-volcanic-100"
              >
                {tag.replace('-', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FoodExplorer({ dishes, imageCache }) {
  const [category, setCategory] = useState('all')
  const [dietary, setDietary] = useState([])
  const [maxSpice, setMaxSpice] = useState('any')

  function toggleDietary(id) {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const filtered = dishes.filter((d) => {
    if (category !== 'all' && d.category !== category) return false
    if (dietary.length > 0 && !d.dietary?.some((t) => dietary.includes(t))) {
      return false
    }
    if (
      maxSpice !== 'any' &&
      SPICE_RANK[d.spiceLevel ?? 'none'] > SPICE_RANK[maxSpice]
    ) {
      return false
    }
    return true
  })

  return (
    <section className="mb-10">
      <h2 className="mb-1 text-xl font-bold text-volcanic-900 dark:text-volcanic-50">
        Food to Try
      </h2>
      <p className="mb-4 text-sm text-volcanic-700/60 dark:text-volcanic-100/50">
        A reference guide, not a bookable extra — these are widely available
        across Funchal rather than tied to one place, so they don't add to
        the cost total below.
      </p>

      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-volcanic-100 bg-white p-4 dark:border-volcanic-700 dark:bg-volcanic-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-volcanic-700/60 dark:text-volcanic-100/50">
            Category
          </span>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={chipClasses(category === c.id)}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-volcanic-700/60 dark:text-volcanic-100/50">
            Dietary
          </span>
          {DIETARY_OPTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              className={chipClasses(dietary.includes(d.id))}
              onClick={() => toggleDietary(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-volcanic-700/60 dark:text-volcanic-100/50">
            Spice tolerance
          </span>
          {SPICE_LEVELS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={chipClasses(maxSpice === s.id)}
              onClick={() => setMaxSpice(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-volcanic-700/60 dark:text-volcanic-100/50">
          No dishes match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dish) => (
            <DishCard key={dish.id} dish={dish} imageCache={imageCache} />
          ))}
        </div>
      )}
    </section>
  )
}
