// Shared drawing primitives for the exercise diagrams. Every pose is a set of
// explicit joint coordinates on a 0-100 x 0-120 grid, so both standing and
// floor poses are equally easy to express, and one renderer keeps every
// diagram visually consistent (same stroke width, head size, palette).

export const INK = '#1f2933'
export const ACCENT = '#65a30d'
export const MUTED = '#94a3b8'

export const STROKE = 4
export const HEAD_R = 7

function limb(a, b, color = INK) {
  return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" />`
}

function joint(p, r = 2.6, color = INK) {
  return `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${color}" />`
}

// pose = {
//   head:[x,y], neck:[x,y], hip:[x,y],
//   armL:[shoulder, elbow, hand], armR:[...],
//   legL:[hip, knee, foot], legR:[...],
//   extras: [rawSvgStrings...]  // arrows, bands, ground lines, props
// }
export function figureSvg(pose) {
  const parts = []
  parts.push(limb(pose.neck, pose.hip))
  if (pose.armL) {
    parts.push(limb(pose.armL[0], pose.armL[1]))
    parts.push(limb(pose.armL[1], pose.armL[2]))
  }
  if (pose.armR) {
    parts.push(limb(pose.armR[0], pose.armR[1]))
    parts.push(limb(pose.armR[1], pose.armR[2]))
  }
  if (pose.legL) {
    parts.push(limb(pose.legL[0], pose.legL[1]))
    parts.push(limb(pose.legL[1], pose.legL[2]))
  }
  if (pose.legR) {
    parts.push(limb(pose.legR[0], pose.legR[1]))
    parts.push(limb(pose.legR[1], pose.legR[2]))
  }
  if (pose.extras) parts.push(...pose.extras)
  parts.push(`<circle cx="${pose.head[0]}" cy="${pose.head[1]}" r="${HEAD_R}" fill="none" stroke="${INK}" stroke-width="${STROKE}" />`)
  ;[pose.armL?.[1], pose.armR?.[1], pose.legL?.[1], pose.legR?.[1]].forEach((j) => {
    if (j) parts.push(joint(j))
  })
  return parts.join('')
}

// --- reusable annotation helpers, all drawn in the same 0-100/0-120 space ---

export function groundLine(y = 108) {
  return `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="${MUTED}" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round" />`
}

export function motionArrow(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const ah = 5
  const p1 = [x2 - ah * Math.cos(angle - 0.5), y2 - ah * Math.sin(angle - 0.5)]
  const p2 = [x2 - ah * Math.cos(angle + 0.5), y2 - ah * Math.sin(angle + 0.5)]
  return `<g>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ACCENT}" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round" />
    <polygon points="${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${ACCENT}" />
  </g>`
}

export function rotationArc(cx, cy, r, startDeg, endDeg) {
  const s = (Math.PI / 180) * startDeg
  const e = (Math.PI / 180) * endDeg
  const p1 = [cx + r * Math.cos(s), cy + r * Math.sin(s)]
  const p2 = [cx + r * Math.cos(e), cy + r * Math.sin(e)]
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = endDeg > startDeg ? 1 : 0
  const ah = 4
  const tangent = e + (sweep ? Math.PI / 2 : -Math.PI / 2)
  const t1 = [p2[0] - ah * Math.cos(tangent - 0.4), p2[1] - ah * Math.sin(tangent - 0.4)]
  const t2 = [p2[0] - ah * Math.cos(tangent + 0.4), p2[1] - ah * Math.sin(tangent + 0.4)]
  return `<g>
    <path d="M ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${large} ${sweep} ${p2[0]} ${p2[1]}" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-dasharray="2 4" stroke-linecap="round" />
    <polygon points="${p2[0]},${p2[1]} ${t1[0]},${t1[1]} ${t2[0]},${t2[1]}" fill="${ACCENT}" />
  </g>`
}

export function bandLine(x1, y1, x2, y2, segments = 8) {
  const dx = (x2 - x1) / segments
  const dy = (y2 - y1) / segments
  const perp = { x: -dy, y: dx }
  const len = Math.hypot(perp.x, perp.y) || 1
  const nx = (perp.x / len) * 2.5
  const ny = (perp.y / len) * 2.5
  let d = `M ${x1} ${y1} `
  for (let i = 1; i < segments; i++) {
    const px = x1 + dx * i + (i % 2 === 0 ? nx : -nx)
    const py = y1 + dy * i + (i % 2 === 0 ? ny : -ny)
    d += `L ${px} ${py} `
  }
  d += `L ${x2} ${y2}`
  return `<path d="${d}" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" />`
}

export function anchorPole(x, topY = 20, bottomY = 108) {
  return `<line x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}" stroke="${MUTED}" stroke-width="3" stroke-linecap="round" />`
}

export function ball(cx, cy, r = 5) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ACCENT}" stroke-width="2.5" />`
}

export function bench(x, y, w = 22, h = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="none" stroke="${MUTED}" stroke-width="2.5" />`
}

export function spiral(cx, cy, r = 8) {
  let d = `M ${cx} ${cy} `
  for (let a = 0; a <= 540; a += 20) {
    const rad = (a / 180) * Math.PI
    const rr = (a / 540) * r
    d += `L ${cx + rr * Math.cos(rad)} ${cy + rr * Math.sin(rad)} `
  }
  return `<path d="${d}" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" />`
}
