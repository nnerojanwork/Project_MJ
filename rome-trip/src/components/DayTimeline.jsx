const dotClasses = {
  meal: 'bg-rome-gold',
  flight: 'bg-ink-soft',
  default: 'bg-rome-red',
}

function TagPill({ tag }) {
  if (tag === 'meal') {
    return <span className="relative top-[-1px] ml-[7px] inline-block rounded-full bg-rome-gold-soft px-[7px] py-px text-[10.5px] font-semibold text-[#8A6A32]">meal</span>
  }
  if (tag === 'booked') {
    return <span className="relative top-[-1px] ml-[7px] inline-block rounded-full bg-rome-sage-soft px-[7px] py-px text-[10.5px] font-semibold text-rome-sage">already booked</span>
  }
  return null
}

export default function DayTimeline({ day }) {
  return (
    <div>
      <div className="mb-[18px]">
        <p className="m-0 mb-0.5 font-serif text-[15px] italic text-rome-red">{day.theme}</p>
        <p className="m-0 font-serif text-2xl font-semibold">{day.full}</p>
      </div>
      <div className="relative pl-[58px] before:absolute before:bottom-1.5 before:left-11 before:top-1.5 before:w-px before:bg-line before:content-['']">
        {day.stops.map((s, i) => (
          <div key={i} className="relative pb-[22px] last:pb-1">
            <div
              className={`absolute -left-[19.5px] top-1 h-[9px] w-[9px] rounded-full border-2 border-base ${dotClasses[s.tag] || dotClasses.default}`}
            />
            <div className="absolute -left-[58px] top-px w-11 text-right text-[12.5px] font-semibold text-ink-soft">
              {s.time}
            </div>
            <p className="m-0 mb-[3px] font-serif text-base font-semibold">
              {s.title}
              <TagPill tag={s.tag} />
            </p>
            {s.desc && (
              <p
                className="m-0 text-[13.5px] leading-[1.55] text-ink-soft [&_em]:font-medium [&_em]:not-italic [&_em]:text-ink"
                dangerouslySetInnerHTML={{ __html: s.desc }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
