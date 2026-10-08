import { describe, expect, it } from 'vitest'
import { quizById } from '../content'
import type { CalcQuestion, NumericQuestion } from '../content/types'
import { checkTyped } from './answers'

const q = (id: string) => quizById.get(id)!.q as CalcQuestion | NumericQuestion

describe('checkTyped', () => {
  it('calc: accepts rounding to the shown decimals and formatting', () => {
    expect(checkTyped(q('w1-q2'), '42.9')).toBe(true) // 42.857
    expect(checkTyped(q('w1-q2'), '42.9%')).toBe(true)
    expect(checkTyped(q('w1-q4'), '£1,627,500')).toBe(true)
    expect(checkTyped(q('w1-q4'), '1,600,000')).toBe(false)
  })
  it('numeric: uses the question tolerance', () => {
    expect(checkTyped(q('w2-p7'), '-0.88')).toBe(true) // true value −0.875, tolerance 0.01
    expect(checkTyped(q('w2-p7'), '−0.875')).toBe(true)
    expect(checkTyped(q('w2-p7'), '-0.9')).toBe(false)
    expect(checkTyped(q('w8-p5'), '-1 pp')).toBe(true)
  })
  it('answers "in thousands" accept 418.5, 418.5k or 418,500', () => {
    expect(checkTyped(q('w1-p7'), '418.5')).toBe(true)
    expect(checkTyped(q('w1-p7'), '418.5k')).toBe(true)
    expect(checkTyped(q('w1-p7'), '418,500')).toBe(true)
    expect(checkTyped(q('w1-p7'), '400')).toBe(false)
  })
  it('empty or junk input is not checkable', () => {
    expect(checkTyped(q('w3-p6'), '')).toBeNull()
    expect(checkTyped(q('w3-p6'), 'abc')).toBeNull()
  })
})
