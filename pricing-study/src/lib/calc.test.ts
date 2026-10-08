import { describe, expect, it } from 'vitest'
import {
  breakEvenVolume,
  breakEvenVolumeChangePct,
  grossMarginPct,
  incrementalProfit,
  initiativeRoiPct,
  marginToMarkupPct,
  markupPct,
  markupToMarginPct,
  mcaFee,
  pctChange,
  priceElasticity,
  priceIncreaseScenarios,
  requiredNewVolume,
  unitContribution,
} from './calc'

// Hand-worked examples. Harbour Lane case: net fee £5,000, variable cost £3,500, 1,000 deals, fixed £1m.

describe('gross margin %', () => {
  it('textbook: price 100, cost 60 → 40%', () => expect(grossMarginPct(100, 60)).toBeCloseTo(40, 10))
  it('case: 5,000 / 3,500 → 30%', () => expect(grossMarginPct(5000, 3500)).toBeCloseTo(30, 10))
  it('loss-making price gives a negative margin', () => expect(grossMarginPct(80, 100)).toBeCloseTo(-25, 10))
  it('zero price is undefined', () => expect(grossMarginPct(0, 10)).toBeNaN())
})

describe('markup %', () => {
  it('textbook: price 100, cost 60 → 66.67%', () => expect(markupPct(100, 60)).toBeCloseTo(66.6667, 3))
  it('case: 1,500 / 3,500 → 42.86%', () => expect(markupPct(5000, 3500)).toBeCloseTo(42.857, 3))
  it('zero cost is undefined', () => expect(markupPct(10, 0)).toBeNaN())
  it('converts 30% margin ↔ 42.86% markup', () => {
    expect(marginToMarkupPct(30)).toBeCloseTo(42.857, 3)
    expect(markupToMarginPct(42.857142857)).toBeCloseTo(30, 6)
  })
  it('cost + 30% markup gives only a 23.08% margin', () => {
    expect(grossMarginPct(3500 * 1.3, 3500)).toBeCloseTo(23.077, 3)
  })
})

describe('unit contribution and break-even volume', () => {
  it('5,000 − 3,500 = 1,500', () => expect(unitContribution(5000, 3500)).toBe(1500))
  it('£1m fixed / £1,500 = 666.67 deals', () => expect(breakEvenVolume(1_000_000, 1500)).toBeCloseTo(666.667, 3))
  it('textbook: 50,000 / (25 − 15) = 5,000 units', () => expect(breakEvenVolume(50_000, unitContribution(25, 15))).toBe(5000))
  it('never breaks even with non-positive contribution', () => {
    expect(breakEvenVolume(1000, 0)).toBeNaN()
    expect(breakEvenVolume(1000, -5)).toBeNaN()
  })
})

describe('price elasticity', () => {
  it('arc: fee 5,000→6,000, deals 1,000→900 → −0.579', () => {
    // %ΔQ = −100/950 = −10.526%, %ΔP = 1,000/5,500 = 18.182%
    expect(priceElasticity(5000, 6000, 1000, 900, 'arc')).toBeCloseTo(-0.5789, 4)
  })
  it('simple: same data → −10% / 20% = −0.5', () => {
    expect(priceElasticity(5000, 6000, 1000, 900, 'simple')).toBeCloseTo(-0.5, 10)
  })
  it('arc is symmetric in direction; simple is not', () => {
    expect(priceElasticity(6000, 5000, 900, 1000, 'arc')).toBeCloseTo(priceElasticity(5000, 6000, 1000, 900, 'arc'), 10)
    expect(priceElasticity(6000, 5000, 900, 1000, 'simple')).not.toBeCloseTo(-0.5, 3)
  })
  it('defaults to arc', () => expect(priceElasticity(5000, 6000, 1000, 900)).toBeCloseTo(-0.5789, 4))
  it('factor rate 1.25→1.30 with −10% volume (simple) → −2.5', () => {
    expect(priceElasticity(1.25, 1.3, 1000, 900, 'simple')).toBeCloseTo(-2.5, 10)
  })
  it('no price change is undefined', () => expect(priceElasticity(10, 10, 100, 90)).toBeNaN())
  it('pctChange arc uses the midpoint', () => expect(pctChange(100, 120, 'arc')).toBeCloseTo(18.1818, 3))
})

describe('required new volume', () => {
  it('1,000 × 1,500 / 1,750 = 857.14', () => expect(requiredNewVolume(1000, 1500, 1750)).toBeCloseTo(857.143, 3))
  it('break-even volume change after +5% fee = −14.29%', () => {
    expect(breakEvenVolumeChangePct(1500, 1750)).toBeCloseTo(-14.2857, 3)
  })
  it('price cut needs more volume: 1,500 → 1,250 needs +20%', () => {
    expect(requiredNewVolume(1000, 1500, 1250)).toBeCloseTo(1200, 10)
    expect(breakEvenVolumeChangePct(1500, 1250)).toBeCloseTo(20, 10)
  })
  it('adverse selection: loss rises £100 → contribution 1,650 → −9.09%', () => {
    expect(breakEvenVolumeChangePct(1500, 5250 - 3600)).toBeCloseTo(-9.0909, 3)
  })
  it('undefined when the new contribution is not positive', () => expect(requiredNewVolume(1000, 1500, 0)).toBeNaN())
})

describe('incremental profit and ROI', () => {
  it('base case: 1,697,500 − 1,500,000 − 60,000 = 137,500', () => {
    expect(incrementalProfit(1_697_500, 1_500_000, 60_000)).toBe(137_500)
  })
  it('downside: 1,540,000 − 1,500,000 − 60,000 = −20,000', () => {
    expect(incrementalProfit(1_540_000, 1_500_000, 60_000)).toBe(-20_000)
  })
  it('net ROI: 137,500 / 60,000 = 229.17%', () => expect(initiativeRoiPct(137_500, 60_000)).toBeCloseTo(229.1667, 3))
  it('ROI undefined with zero cost', () => expect(initiativeRoiPct(1000, 0)).toBeNaN())
})

describe('MCA fee', () => {
  it('£20,000 at 1.25 → £5,000', () => expect(mcaFee(20_000, 1.25)).toBeCloseTo(5000, 8))
  it('£20,000 at 1.2625 → £5,250 (+5%)', () => expect(mcaFee(20_000, 1.2625)).toBeCloseTo(5250, 8))
})

describe('Week 1 exercise: +5% price under 0 / −3 / −7 / −12% volume', () => {
  const r = priceIncreaseScenarios(
    { units: 1000, listPrice: 6000, discountPerUnit: 1000, variableCostPerUnit: 3500, fixedCost: 1_000_000 },
    5,
    [0, -3, -7, -12],
  )

  it('baseline: £6.0m list, £1.0m discounts, £5.0m net, £1.5m contribution, £0.5m profit', () => {
    expect(r.baseline.grossListSales).toBeCloseTo(6_000_000, 6)
    expect(r.baseline.discounts).toBeCloseTo(1_000_000, 6)
    expect(r.baseline.netRevenue).toBeCloseTo(5_000_000, 6)
    expect(r.baseline.variableCost).toBeCloseTo(3_500_000, 6)
    expect(r.baseline.contribution).toBeCloseTo(1_500_000, 6)
    expect(r.baseline.operatingProfit).toBeCloseTo(500_000, 6)
  })

  it('net price 5,000 → 5,250; unit contribution 1,500 → 1,750', () => {
    expect(r.newNetPrice).toBeCloseTo(5250, 8)
    expect(r.oldUnitContribution).toBeCloseTo(1500, 8)
    expect(r.newUnitContribution).toBeCloseTo(1750, 8)
  })

  it('contribution by scenario: 1,750,000 / 1,697,500 / 1,627,500 / 1,540,000', () => {
    expect(r.rows.map((x) => Math.round(x.contribution))).toEqual([1_750_000, 1_697_500, 1_627_500, 1_540_000])
    expect(r.rows.map((x) => Math.round(x.contributionChange))).toEqual([250_000, 197_500, 127_500, 40_000])
  })

  it('−7% scenario detail: 930 units, £5,859,000 list, £4,882,500 net', () => {
    const s = r.rows[2]
    expect(s.units).toBeCloseTo(930, 8)
    expect(s.grossListSales).toBeCloseTo(930 * 6300, 4)
    expect(s.netRevenue).toBeCloseTo(930 * 5250, 4)
    expect(s.operatingProfit).toBeCloseTo(627_500, 4)
  })

  it('break-even volume loss = 14.29%', () => expect(r.breakEvenVolumeLossPct).toBeCloseTo(14.2857, 3))

  it('textbook check: price £10, VC £6, +10% → break-even loss 20%', () => {
    const t = priceIncreaseScenarios({ units: 100, listPrice: 10, discountPerUnit: 0, variableCostPerUnit: 6, fixedCost: 0 }, 10, [-20])
    // UC 4 → 5; required volume 80; at −20% contribution unchanged
    expect(t.breakEvenVolumeLossPct).toBeCloseTo(20, 10)
    expect(t.rows[0].contributionChange).toBeCloseTo(0, 8)
  })
})
