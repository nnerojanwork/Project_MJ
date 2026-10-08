import { bookItems } from '../data/bookItems'

const badgeClasses = {
  p1: 'bg-rome-red-soft text-rome-red',
  p2: 'bg-rome-gold-soft text-[#8A6A32]',
  p3: 'bg-rome-sage-soft text-rome-sage',
  p4: 'bg-surface-2 text-ink-soft',
}

export default function BookAhead({ userName, onUserNameChange, bookState, onToggle }) {
  return (
    <div>
      <p className="mb-1 mt-1 font-serif text-[21px] font-semibold">What to book now</p>
      <p className="mb-[18px] text-[13.5px] leading-[1.5] text-ink-soft">
        Everything else on the trip is walk-up. These five need a reservation, in roughly the order they're worth doing.
      </p>

      <div className="mb-5 flex items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-2.5">
        <label htmlFor="nameInput" className="whitespace-nowrap text-[12.5px] text-ink-soft">
          Your name
        </label>
        <input
          id="nameInput"
          type="text"
          placeholder="so we know who's booked what"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          className="min-w-0 flex-1 border-none bg-transparent font-sans text-[13.5px] text-ink outline-none"
        />
      </div>

      <div>
        {bookItems.map((item) => {
          const state = bookState[item.id] || { done: false, by: '' }
          return (
            <div
              key={item.id}
              className={`mb-3 flex items-start gap-3.5 rounded-[14px] border border-line bg-surface p-4 ${state.done ? 'opacity-55' : ''}`}
            >
              <button
                aria-label={state.done ? 'Mark as not booked' : 'Mark as booked'}
                onClick={() => onToggle(item.id)}
                className={`mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-md border-[1.5px] border-ink-soft ${
                  state.done ? 'border-rome-sage bg-rome-sage text-surface' : 'bg-surface'
                }`}
              >
                {state.done && <span className="text-[13px] font-bold">✓</span>}
              </button>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className={`m-0 font-serif text-[16.5px] font-semibold ${state.done ? 'text-ink-soft line-through' : ''}`}>
                    {item.title}
                  </p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClasses[item.priority]}`}>
                    {item.priorityLabel}
                  </span>
                </div>
                <p className="mb-1 text-[13.5px] leading-[1.5] text-ink-soft">{item.desc}</p>
                <p className="m-0 text-[12px] italic text-ink-soft">{item.meta}</p>
                {state.done && state.by && <p className="mt-1 text-[11.5px] text-rome-sage">Booked by {state.by}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-[22px] rounded-lg border-l-[3px] border-rome-gold bg-surface-2 px-4 py-3.5 text-[13px] leading-[1.6] text-ink-soft">
        <strong className="font-semibold text-ink">Good to know:</strong> the Vatican Museums + Sistine Chapel tour is
        already booked (3 people, Sat 10:30 English guided) — just bring ID matching the names on the voucher. Sunday
        27th is also the month's last Sunday, when the Vatican is free 09:00–14:00 — irrelevant to your Saturday slot,
        but expect the area to be busier on Sunday. Pope Leo XIV is in France the whole trip, so no audience to work
        around.
      </div>
    </div>
  )
}
