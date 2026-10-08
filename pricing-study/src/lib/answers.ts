import type { CalcQuestion, NumericQuestion } from '../content/types'

/**
 * Accept "1,627,500", "£1627500", "30%", "−3 pp" etc. Calc questions allow rounding to the shown decimals;
 * study-pack questions use their own tolerance, and answers "in thousands" also accept the full number.
 */
export function checkTyped(q: CalcQuestion | NumericQuestion, input: string): boolean | null {
  const cleaned = input.replace(/[£,%\s]|pp/gi, '').replace(/[−–]/g, '-')
  if (!cleaned || cleaned.toLowerCase() === 'k') return null
  const thousands = /k$/i.test(cleaned)
  const n = Number(cleaned.replace(/k$/i, '')) * (thousands && q.unit !== 'k' ? 1000 : 1)
  if (!Number.isFinite(n)) return null
  const tol = q.type === 'calc' ? Math.max(0.5 * 10 ** -q.decimals, Math.abs(q.answer) * 0.005) : q.tolerance + 1e-9
  const close = (x: number) => Math.abs(x - q.answer) <= tol
  return close(n) || (q.unit === 'k' && close(n / 1000))
}
