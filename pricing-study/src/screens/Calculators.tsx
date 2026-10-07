import { useState, type ReactNode } from 'react'
import { generated, syllabus } from '../content'
import { AiTag, card, fmt, inputCls, muted, Page } from '../components/ui'
import {
  breakEvenVolume,
  breakEvenVolumeChangePct,
  grossMarginPct,
  incrementalProfit,
  initiativeRoiPct,
  markupPct,
  mcaFee,
  pctChange,
  priceElasticity,
  priceIncreaseScenarios,
  requiredNewVolume,
  unitContribution,
} from '../lib/calc'

const formula = (id: string) => syllabus.formulaReference.formulas.find((f) => f.id === id)

function useNums<T extends Record<string, number>>(defaults: T) {
  const [raw, setRaw] = useState<Record<keyof T, string>>(
    Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, String(v)])) as Record<keyof T, string>,
  )
  const n = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v.trim() === '' ? NaN : Number(v.replace(/,/g, ''))])) as Record<keyof T, number>
  const field = (k: keyof T) => ({ value: raw[k], onChange: (v: string) => setRaw({ ...raw, [k]: v }) })
  return [n, field] as const
}

function Num({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className={`text-sm ${muted}`}>{label}</span>
      <span className="flex items-center gap-2">
        <input className={inputCls} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className={muted}>{suffix}</span>}
      </span>
    </label>
  )
}

function Out({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className={muted}>{label}</span>
      <span className={strong ? 'text-xl font-bold' : 'font-semibold'}>{value}</span>
    </div>
  )
}

function Calc({ title, formulaIds, children }: { title: string; formulaIds: string[]; children: ReactNode }) {
  return (
    <details className={card} open={false}>
      <summary className="min-h-10 cursor-pointer text-lg font-semibold">{title}</summary>
      <div className="mt-3 flex flex-col gap-3">
        {children}
        <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
          {formulaIds.map((id) => {
            const f = formula(id)
            const note = generated.formulaNotes[id]
            return (
              <div key={id} className="flex flex-col gap-1">
                {f && (
                  <p>
                    <span className="font-semibold">{f.measure}:</span> {f.calculation}. <span className={muted}>{f.interpretation}</span>
                  </p>
                )}
                {note && (
                  <p className={muted}>
                    <AiTag /> {note.interpretation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </details>
  )
}

const grid2 = 'grid grid-cols-2 gap-3'

function MarginMarkup() {
  const [n, f] = useNums({ price: 5000, cost: 3500 })
  return (
    <Calc title="Margin and markup" formulaIds={['gross-margin-pct', 'markup-pct']}>
      <div className={grid2}>
        <Num label="Price (net)" {...f('price')} />
        <Num label="Cost" {...f('cost')} />
      </div>
      <Out label="Gross margin" value={fmt(grossMarginPct(n.price, n.cost), { dp: 1, unit: '%' })} strong />
      <Out label="Markup" value={fmt(markupPct(n.price, n.cost), { dp: 1, unit: '%' })} strong />
    </Calc>
  )
}

function UnitContribution() {
  const [n, f] = useNums({ price: 5000, vc: 3500 })
  const uc = unitContribution(n.price, n.vc)
  return (
    <Calc title="Unit contribution" formulaIds={['unit-contribution']}>
      <div className={grid2}>
        <Num label="Net price" {...f('price')} />
        <Num label="Variable cost / unit" {...f('vc')} />
      </div>
      <Out label="Unit contribution" value={fmt(uc, { unit: '£', dp: 2 })} strong />
      <Out label="Contribution margin" value={fmt(grossMarginPct(n.price, n.vc), { dp: 1, unit: '%' })} />
    </Calc>
  )
}

function BreakEven() {
  const [n, f] = useNums({ fixed: 1000000, uc: 1500 })
  const v = breakEvenVolume(n.fixed, n.uc)
  return (
    <Calc title="Break-even volume" formulaIds={['break-even-volume']}>
      <div className={grid2}>
        <Num label="Fixed cost" {...f('fixed')} />
        <Num label="Unit contribution" {...f('uc')} />
      </div>
      <Out label="Break-even volume" value={fmt(v, { dp: 1 })} strong />
      <Out label="Units to target (rounded up)" value={Number.isFinite(v) ? fmt(Math.ceil(v)) : '—'} />
    </Calc>
  )
}

function Elasticity() {
  const [n, f] = useNums({ p0: 5000, p1: 6000, q0: 1000, q1: 900 })
  const arc = priceElasticity(n.p0, n.p1, n.q0, n.q1, 'arc')
  const simple = priceElasticity(n.p0, n.p1, n.q0, n.q1, 'simple')
  const label = !Number.isFinite(arc) ? '' : Math.abs(arc) < 1 ? 'Inelastic: revenue moves with price' : Math.abs(arc) > 1 ? 'Elastic: revenue moves against price' : 'Unit elastic'
  return (
    <Calc title="Price elasticity" formulaIds={['price-elasticity']}>
      <div className={grid2}>
        <Num label="Old price" {...f('p0')} />
        <Num label="New price" {...f('p1')} />
        <Num label="Old quantity" {...f('q0')} />
        <Num label="New quantity" {...f('q1')} />
      </div>
      <Out label="Arc (midpoint) elasticity" value={fmt(arc, { dp: 2 })} strong />
      <Out label="Simple elasticity" value={fmt(simple, { dp: 2 })} />
      <Out label="%Δ price / %Δ qty (arc)" value={`${fmt(pctChange(n.p0, n.p1, 'arc'), { dp: 1, unit: '%' })} / ${fmt(pctChange(n.q0, n.q1, 'arc'), { dp: 1, unit: '%' })}`} />
      <Out label="Revenue change" value={fmt(n.p1 * n.q1 - n.p0 * n.q0, { unit: '£' })} />
      {label && <p className={muted}>{label}</p>}
    </Calc>
  )
}

function RequiredVolume() {
  const [n, f] = useNums({ vol: 1000, p0: 5000, p1: 5250, vc: 3500 })
  const uc0 = unitContribution(n.p0, n.vc)
  const uc1 = unitContribution(n.p1, n.vc)
  return (
    <Calc title="Required new volume after a price change" formulaIds={['required-new-volume']}>
      <div className={grid2}>
        <Num label="Old volume" {...f('vol')} />
        <Num label="Variable cost / unit" {...f('vc')} />
        <Num label="Old net price" {...f('p0')} />
        <Num label="New net price" {...f('p1')} />
      </div>
      <Out label="Unit contribution old → new" value={`${fmt(uc0, { unit: '£' })} → ${fmt(uc1, { unit: '£' })}`} />
      <Out label="Required new volume" value={fmt(requiredNewVolume(n.vol, uc0, uc1), { dp: 1 })} strong />
      <Out label="Break-even volume change" value={fmt(breakEvenVolumeChangePct(uc0, uc1), { dp: 1, unit: '%' })} strong />
    </Calc>
  )
}

function ProfitRoi() {
  const [n, f] = useNums({ newC: 1697500, oldC: 1500000, cost: 60000 })
  const inc = incrementalProfit(n.newC, n.oldC, n.cost)
  return (
    <Calc title="Incremental profit and ROI" formulaIds={['incremental-profit', 'initiative-roi']}>
      <div className={grid2}>
        <Num label="New contribution" {...f('newC')} />
        <Num label="Old contribution" {...f('oldC')} />
        <Num label="Implementation cost" {...f('cost')} />
      </div>
      <Out label="Incremental profit" value={fmt(inc, { unit: '£' })} strong />
      <Out label="Initiative ROI (net)" value={fmt(initiativeRoiPct(inc, n.cost), { dp: 1, unit: '%' })} strong />
    </Calc>
  )
}

function McaFee() {
  const [n, f] = useNums({ advance: 20000, factor: 1.25 })
  return (
    <Calc title="MCA fee from factor rate" formulaIds={[]}>
      <div className={grid2}>
        <Num label="Advance" {...f('advance')} />
        <Num label="Factor rate" {...f('factor')} />
      </div>
      <Out label="Fee" value={fmt(mcaFee(n.advance, n.factor), { unit: '£', dp: 2 })} strong />
      <Out label="Total repayable" value={fmt(n.advance * n.factor, { unit: '£', dp: 2 })} />
      <p className={`text-sm ${muted}`}>
        <AiTag /> Fee = advance × (factor rate − 1). Not in the syllabus formula table; used by the running case.
      </p>
    </Calc>
  )
}

function Week1Exercise() {
  const [n, f] = useNums({ units: 1000, list: 6000, disc: 1000, vc: 3500, fixed: 1000000, inc: 5, v1: 0, v2: -3, v3: -7, v4: -12 })
  const r = priceIncreaseScenarios(
    { units: n.units, listPrice: n.list, discountPerUnit: n.disc, variableCostPerUnit: n.vc, fixedCost: n.fixed },
    n.inc,
    [n.v1, n.v2, n.v3, n.v4],
  )
  const rows = [{ ...r.baseline, label: 'Baseline' }, ...r.rows.map((x) => ({ ...x, label: `${fmt(n.inc, { dp: 1 })}% price, ${fmt(x.volumeChangePct, { dp: 1 })}% vol` }))]
  return (
    <Calc title="Week 1 exercise: price increase scenarios" formulaIds={['unit-contribution', 'required-new-volume']}>
      <p className={`text-sm ${muted}`}>One-year baseline. The increase applies to list price with the discount rate held constant, so net price rises by the same %.</p>
      <div className={grid2}>
        <Num label="Units" {...f('units')} />
        <Num label="List price / unit" {...f('list')} />
        <Num label="Discounts / unit" {...f('disc')} />
        <Num label="Variable cost / unit" {...f('vc')} />
        <Num label="Fixed cost" {...f('fixed')} />
        <Num label="Price increase" suffix="%" {...f('inc')} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Num label="Vol A %" {...f('v1')} />
        <Num label="Vol B %" {...f('v2')} />
        <Num label="Vol C %" {...f('v3')} />
        <Num label="Vol D %" {...f('v4')} />
      </div>
      <div className="rounded-xl bg-teal-50 p-3 dark:bg-teal-950/50">
        <Out label="Unit contribution" value={`${fmt(r.oldUnitContribution, { unit: '£' })} → ${fmt(r.newUnitContribution, { unit: '£' })}`} />
        <Out label="Break-even volume loss" value={fmt(r.breakEvenVolumeLossPct, { dp: 1, unit: '%' })} strong />
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((x) => (
          <details key={x.label} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer">
              <span className="font-semibold">{x.label}</span>
              <span className="float-right">
                {fmt(x.contribution, { unit: '£' })}
                {x.label !== 'Baseline' && (
                  <span className={x.contributionChange >= 0 ? ' text-emerald-600 dark:text-emerald-400' : ' text-rose-600 dark:text-rose-400'}>
                    {' '}
                    ({x.contributionChange >= 0 ? '+' : ''}
                    {fmt(x.contributionChange, { unit: '£' })})
                  </span>
                )}
              </span>
            </summary>
            <div className="mt-2 text-base">
              <Out label="Units" value={fmt(x.units, { dp: 1 })} />
              <Out label="Gross list sales" value={fmt(x.grossListSales, { unit: '£' })} />
              <Out label="Discounts" value={fmt(-x.discounts, { unit: '£' })} />
              <Out label="Net revenue" value={fmt(x.netRevenue, { unit: '£' })} />
              <Out label="Variable cost" value={fmt(-x.variableCost, { unit: '£' })} />
              <Out label="Contribution" value={fmt(x.contribution, { unit: '£' })} />
              <Out label="Fixed cost" value={fmt(-n.fixed, { unit: '£' })} />
              <Out label="Operating profit" value={fmt(x.operatingProfit, { unit: '£' })} />
            </div>
          </details>
        ))}
      </div>
    </Calc>
  )
}

export default function Calculators() {
  return (
    <Page title="Calculators" back="#/more">
      <p className={`mb-3 ${muted}`}>Defaults use the Harbour Lane case. Change any input.</p>
      <div className="flex flex-col gap-3">
        <Week1Exercise />
        <MarginMarkup />
        <UnitContribution />
        <BreakEven />
        <Elasticity />
        <RequiredVolume />
        <ProfitRoi />
        <McaFee />
      </div>
    </Page>
  )
}
