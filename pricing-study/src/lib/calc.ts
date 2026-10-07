// Pure pricing formulas from the syllabus formula reference.
// Invalid inputs (e.g. division by zero) return NaN; the UI shows "—".
// Interpretation choices for ambiguous formulas are documented per function.

const div = (a: number, b: number) => (b === 0 || !Number.isFinite(a) || !Number.isFinite(b) ? NaN : a / b)

/** Gross margin % = (price − cost) / price. Price should be realised net price. */
export function grossMarginPct(price: number, cost: number): number {
  return div(price - cost, price) * 100
}

/** Markup % = (price − cost) / cost. Uses the same unit cost as margin so the two are comparable. */
export function markupPct(price: number, cost: number): number {
  return div(price - cost, cost) * 100
}

export function marginToMarkupPct(marginPct: number): number {
  const m = marginPct / 100
  return div(m, 1 - m) * 100
}

export function markupToMarginPct(markupPctValue: number): number {
  const k = markupPctValue / 100
  return div(k, 1 + k) * 100
}

/** Unit contribution = net price − variable cost per unit. */
export function unitContribution(netPrice: number, variableCost: number): number {
  return netPrice - variableCost
}

/** Break-even volume = fixed cost / unit contribution. NaN when contribution ≤ 0 (never breaks even). */
export function breakEvenVolume(fixedCost: number, unitContrib: number): number {
  return unitContrib <= 0 ? NaN : div(fixedCost, unitContrib)
}

export type ElasticityMethod = 'arc' | 'simple'

/** % change. Arc (midpoint) divides by the average of old and new; simple divides by old. */
export function pctChange(from: number, to: number, method: ElasticityMethod): number {
  const base = method === 'arc' ? (from + to) / 2 : from
  return div(to - from, base) * 100
}

/**
 * Price elasticity = % change in quantity / % change in price.
 * The doc does not specify the % method; Week 2 asks for arc elasticity, so 'arc' is the default.
 */
export function priceElasticity(
  p0: number,
  p1: number,
  q0: number,
  q1: number,
  method: ElasticityMethod = 'arc',
): number {
  return div(pctChange(q0, q1, method), pctChange(p0, p1, method))
}

/**
 * Required new volume = old volume × old unit contribution / new unit contribution.
 * Assumes variable cost per unit is stable (as the syllabus states).
 */
export function requiredNewVolume(oldVolume: number, oldUnitContrib: number, newUnitContrib: number): number {
  return newUnitContrib <= 0 ? NaN : div(oldVolume * oldUnitContrib, newUnitContrib)
}

/** Volume change (%) that leaves total contribution unchanged. Negative = volume you can afford to lose. */
export function breakEvenVolumeChangePct(oldUnitContrib: number, newUnitContrib: number): number {
  return newUnitContrib <= 0 ? NaN : (div(oldUnitContrib, newUnitContrib) - 1) * 100
}

/** Incremental profit = new contribution − old contribution − implementation cost. */
export function incrementalProfit(newContribution: number, oldContribution: number, implementationCost: number): number {
  return newContribution - oldContribution - implementationCost
}

/**
 * Pricing initiative ROI = incremental profit / implementation cost.
 * Net ROI: incremental profit already has the implementation cost subtracted, so it is not subtracted again.
 */
export function initiativeRoiPct(incProfit: number, implementationCost: number): number {
  return div(incProfit, implementationCost) * 100
}

/** MCA fee = advance × (factor rate − 1). */
export function mcaFee(advance: number, factorRate: number): number {
  return advance * (factorRate - 1)
}

export interface Baseline {
  units: number
  listPrice: number
  /** Average discounts and deductions per unit (list − net). */
  discountPerUnit: number
  variableCostPerUnit: number
  fixedCost: number
}

export interface ScenarioRow {
  volumeChangePct: number
  units: number
  grossListSales: number
  discounts: number
  netRevenue: number
  variableCost: number
  contribution: number
  operatingProfit: number
  contributionChange: number
}

export interface ScenarioResult {
  baseline: ScenarioRow
  rows: ScenarioRow[]
  newNetPrice: number
  oldUnitContribution: number
  newUnitContribution: number
  /** Volume loss (positive %) at which total contribution equals baseline. */
  breakEvenVolumeLossPct: number
}

/**
 * Week 1 exercise: baseline plus a price increase under several volume changes.
 * The increase applies to list price with the discount rate held constant, so net price rises by the same %.
 */
export function priceIncreaseScenarios(b: Baseline, priceIncreasePct: number, volumeChangesPct: number[]): ScenarioResult {
  const discountRate = div(b.discountPerUnit, b.listPrice)
  const oldNet = b.listPrice - b.discountPerUnit
  const factor = 1 + priceIncreasePct / 100
  const newList = b.listPrice * factor
  const newNet = oldNet * factor
  const oldUC = unitContribution(oldNet, b.variableCostPerUnit)
  const newUC = unitContribution(newNet, b.variableCostPerUnit)
  const baseContribution = b.units * oldUC

  const row = (units: number, list: number, volumeChangePct: number): ScenarioRow => {
    const grossListSales = units * list
    const discounts = grossListSales * discountRate
    const netRevenue = grossListSales - discounts
    const variableCost = units * b.variableCostPerUnit
    const contribution = netRevenue - variableCost
    return {
      volumeChangePct,
      units,
      grossListSales,
      discounts,
      netRevenue,
      variableCost,
      contribution,
      operatingProfit: contribution - b.fixedCost,
      contributionChange: contribution - baseContribution,
    }
  }

  return {
    baseline: row(b.units, b.listPrice, 0),
    rows: volumeChangesPct.map((v) => row(b.units * (1 + v / 100), newList, v)),
    newNetPrice: newNet,
    oldUnitContribution: oldUC,
    newUnitContribution: newUC,
    breakEvenVolumeLossPct: -breakEvenVolumeChangePct(oldUC, newUC),
  }
}
