import { INK, ACCENT, MUTED, STROKE } from './figure.js'

// A simple side-profile foot outline, parameterized so the handful of
// foot-specific drills (arch, toes, ankle) share one consistent look.
// archLift: 0-1 raises the arch's midpoint; toeSpread: fans the toe tips;
// ankleTilt: degrees, rotates the whole foot about the ankle (eversion/inversion).
export function footSvg({ archLift = 0, toeSpread = 0, ankleTilt = 0, extras = [] } = {}) {
  const archY = 78 - archLift * 14
  const toes = [0, 1, 2, 3].map((i) => {
    const spread = toeSpread * (i - 1.5) * 2
    return [80 + i * 4, 62 + spread]
  })

  const outline = `
    M 25 88
    C 20 88 18 80 22 74
    C 26 68 34 ${archY} 46 ${archY - 4}
    C 58 ${archY - 8} 66 68 76 64
    ${toes.map((t) => `L ${t[0]} ${t[1]}`).join(' ')}
    L 84 70
    C 88 78 86 92 78 94
    L 30 94
    C 26 94 24 92 25 88
    Z
  `

  const heel = `<ellipse cx="27" cy="86" rx="7" ry="9" fill="none" stroke="${INK}" stroke-width="2" />`
  const ankleMark = `<line x1="30" y1="70" x2="30" y2="52" stroke="${MUTED}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 5" />`

  return `<g transform="rotate(${ankleTilt} 30 94)">
    <path d="${outline}" fill="none" stroke="${INK}" stroke-width="${STROKE}" stroke-linejoin="round" />
    ${heel}
    ${ankleMark}
    ${extras.join('')}
  </g>`
}

export function toeArrow(x, y, dx, dy) {
  return `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" marker-end="url(#footArrow)" />`
}
