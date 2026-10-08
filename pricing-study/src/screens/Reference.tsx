import { generated, syllabus } from '../content'
import { AiTag, Bullets, card, muted, Page, Section } from '../components/ui'

export default function Reference() {
  const s = syllabus
  return (
    <Page title="Reference" back="#/more">
      <Section title="Formula reference" defaultOpen>
        <p className={`mb-3 ${muted}`}>{s.formulaReference.intro}</p>
        <div className="flex flex-col gap-2">
          {s.formulaReference.formulas.map((f) => (
            <div key={f.id} className={card}>
              <div className="font-semibold">{f.measure}</div>
              <div className="mt-1">{f.calculation}</div>
              <div className={`mt-1 ${muted}`}>{f.interpretation}</div>
              {generated.formulaNotes[f.id] && (
                <div className={`mt-2 border-t border-slate-200 pt-2 text-sm dark:border-slate-700 ${muted}`}>
                  <AiTag /> {generated.formulaNotes[f.id].example}
                </div>
              )}
            </div>
          ))}
        </div>
        <a href="#/calc" className="mt-3 inline-block min-h-11 font-medium text-teal-700 dark:text-teal-400">
          Open calculators →
        </a>
      </Section>

      <Section title="More formulas" badge={<AiTag />}>
        <p className={`mb-3 ${muted}`}>Extra formulas from the study pack, not in the syllabus table.</p>
        <div className="flex flex-col gap-2">
          {generated.extraFormulas.map((f) => (
            <div key={f.id} className={card}>
              <div className="flex justify-between gap-2 font-semibold">
                <span>{f.name}</span>
                <span className={`text-sm font-normal ${muted}`}>Week {f.week}</span>
              </div>
              <div className="mt-1 font-mono text-sm">{f.formula}</div>
              <div className={`mt-1 ${muted}`}>{f.interpretation}</div>
              <div className="mt-1 text-sm">e.g. {f.example}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data quality checks">
        <Bullets items={s.dataQualityChecks} />
      </Section>

      <Section title="Capstone structure">
        <ol className="flex flex-col gap-3">
          {s.capstone.structure.map((c) => (
            <li key={c.number} className="flex gap-3">
              <span className="w-6 shrink-0 text-right font-bold text-teal-700 dark:text-teal-400">{c.number}</span>
              <div>
                <div className="font-semibold">{c.section}</div>
                <div>{c.requiredContent}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Capstone scoring guide">
        <div className="flex flex-col gap-2">
          {s.capstone.scoringGuide.areas.map((a) => (
            <div key={a.area} className={card}>
              <div className="flex justify-between font-semibold">
                <span>{a.area}</span>
                <span>{a.points}</span>
              </div>
              <div className={muted}>{a.evidence}</div>
            </div>
          ))}
        </div>
        <h3 className="mt-4 mb-1 font-semibold">Passing standard</h3>
        <p>{s.capstone.scoringGuide.passingStandard}</p>
      </Section>

      <Section title="Reading list">
        <p className={`mb-3 ${muted}`}>{s.readingList.intro}</p>
        <h3 className="mb-2 font-semibold">Books</h3>
        <Bullets items={s.readingList.books.map((b) => b.text)} />
        <h3 className="mt-4 mb-2 font-semibold">Online courses and organizations</h3>
        <ul className="flex flex-col gap-3">
          {s.readingList.coursesAndOrganizations.map((r) => (
            <li key={r.url + r.title}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline underline-offset-2 dark:text-teal-400">
                {r.title} ↗
              </a>
              <p className={muted}>{r.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Minimum dataset">
        <p className={`mb-3 ${muted}`}>{s.minimumDataset.intro}</p>
        <dl className="flex flex-col gap-2">
          {s.minimumDataset.groups.map((g) => (
            <div key={g.group}>
              <dt className="font-semibold">{g.group}</dt>
              <dd>{g.fields.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Program overview">
        <div className="flex flex-col gap-4">
          <p className={`text-sm font-semibold tracking-wide uppercase ${muted}`}>{s.program.label}</p>
          <p className="font-semibold">{s.program.subtitle}</p>
          <p>{s.program.intro}</p>
          <dl className="flex flex-col gap-1">
            {s.program.facts.map((f) => (
              <div key={f.label} className="flex gap-2">
                <dt className="w-28 shrink-0 font-semibold">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="font-semibold">How to use this syllabus</h3>
          <Bullets items={s.program.howToUse} />
          <h3 className="font-semibold">Learning outcomes</h3>
          <p>{s.learningOutcomes.intro}</p>
          <Bullets items={s.learningOutcomes.items} />
          <h3 className="font-semibold">Program map</h3>
          <ol className="flex flex-col gap-1">
            {s.programMap.map((m) => (
              <li key={m.week}>
                <a href={`#/week/${m.week}`} className="flex gap-2">
                  <span className="w-6 shrink-0 text-right font-bold">{m.week}</span>
                  <span>
                    {m.subject} <span className={muted}>· {m.output}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <h3 className="font-semibold">Weekly rhythm</h3>
          <div className="flex flex-col gap-2">
            {s.weeklyRhythm.map((r) => (
              <div key={r.activity}>
                <div className="font-semibold">
                  {r.activity} <span className={`font-normal ${muted}`}>· {r.time}</span>
                </div>
                <div>{r.whatToDo}</div>
              </div>
            ))}
          </div>
          <h3 className="font-semibold">Study setup</h3>
          <Bullets items={s.studySetup} />
          <h3 className="font-semibold">Completion standard</h3>
          <p>{s.completionStandard}</p>
        </div>
      </Section>

      <Section title="Running case: Harbour Lane" badge={<AiTag />}>
        <p className="mb-3">{generated.case.summary}</p>
        <Bullets items={generated.case.assumptions} />
        <p className={`mt-3 text-sm ${muted}`}>{generated.meta.priceConvention}</p>
      </Section>
    </Page>
  )
}
