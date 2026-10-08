import { groundLine, motionArrow, rotationArc, bandLine, anchorPole, ball, bench } from '../lib/figure.js'
import { footSvg } from '../lib/foot.js'

const eyesOpen = (cx, cy) => `<circle cx="${cx - 2.5}" cy="${cy}" r="1" fill="#1f2933" /><circle cx="${cx + 2.5}" cy="${cy}" r="1" fill="#1f2933" />`
const eyesClosed = (cx, cy) => `<line x1="${cx - 3.5}" y1="${cy}" x2="${cx - 1}" y2="${cy}" stroke="#1f2933" stroke-width="1.4" stroke-linecap="round" /><line x1="${cx + 1}" y1="${cy}" x2="${cx + 3.5}" y2="${cy}" stroke="#1f2933" stroke-width="1.4" stroke-linecap="round" />`

// Every diagram is { kind: 'figure' | 'foot', start: pose, end: pose }.
// Figure poses are explicit joint coordinates on a 0-100 x 0-120 grid;
// foot poses are params for the shared foot-icon renderer (see foot.js).
export const DIAGRAMS = {
  d1e1: {
    kind: 'foot',
    start: { archLift: 0 },
    end: { archLift: 1 },
  },
  d1e2: {
    kind: 'foot',
    start: { archLift: 0, toeSpread: 0.6, extras: [`<path d="M 70 96 Q 85 96 92 96" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" />`] },
    end: { archLift: 0.2, toeSpread: -0.8, extras: [`<path d="M 70 96 Q 78 90 78 96 Q 84 100 82 94" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" />`] },
  },
  d1e3: {
    kind: 'foot',
    start: { toeSpread: 1 },
    end: { toeSpread: -0.7, archLift: 0.3 },
  },
  d1e4: {
    kind: 'foot',
    start: { ankleTilt: -18, extras: [bandLine(50, 66, 90, 40), anchorPole(90)] },
    end: { ankleTilt: 18, extras: [bandLine(50, 66, 90, 96), anchorPole(90)] },
  },
  d1e5: {
    kind: 'figure',
    start: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[40, 31], [30, 40], [22, 44]],
      armR: [[60, 31], [70, 40], [78, 44]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [58, 78], [56, 60]],
      extras: [groundLine(), eyesOpen(50, 17)],
    },
    end: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[38, 31], [28, 36], [20, 34]],
      armR: [[62, 31], [72, 36], [80, 34]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [60, 74], [64, 56]],
      extras: [groundLine(), eyesClosed(50, 17)],
    },
  },
  d1e6: {
    kind: 'figure',
    start: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[42, 31], [38, 47], [36, 60]],
      armR: [[58, 31], [62, 47], [64, 60]],
      legL: [[46, 63], [45, 85], [43, 107]],
      legR: [[54, 63], [55, 85], [57, 107]],
      extras: [groundLine()],
    },
    end: {
      head: [50, 13], neck: [50, 24], hip: [50, 58],
      armL: [[42, 26], [38, 42], [36, 55]],
      armR: [[58, 26], [62, 42], [64, 55]],
      legL: [[46, 58], [45, 80], [43, 100]],
      legR: [[54, 58], [55, 80], [57, 100]],
      extras: [groundLine(), `<line x1="40" y1="103" x2="46" y2="103" stroke="#1f2933" stroke-width="2.5" stroke-linecap="round" />`, `<line x1="54" y1="103" x2="60" y2="103" stroke="#1f2933" stroke-width="2.5" stroke-linecap="round" />`],
    },
  },
  d2e1: {
    kind: 'figure',
    start: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[42, 31], [40, 45], [42, 52]],
      armR: [[58, 31], [60, 45], [58, 52]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [55, 85], [56, 107]],
      extras: [groundLine(), anchorPole(90), bandLine(52, 50, 90, 50)],
    },
    end: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[42, 31], [46, 40], [50, 34]],
      armR: [[58, 31], [54, 40], [50, 34]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [55, 85], [56, 107]],
      extras: [groundLine(), anchorPole(90), bandLine(50, 34, 90, 34), motionArrow(50, 48, 50, 36)],
    },
  },
  d2e2: {
    kind: 'figure',
    start: {
      head: [42, 20], neck: [44, 30], hip: [50, 63],
      armL: [[38, 30], [30, 60], [26, 78]],
      armR: [[50, 30], [40, 55], [30, 72]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [55, 85], [56, 107]],
      extras: [groundLine(), anchorPole(85), bandLine(28, 75, 85, 60)],
    },
    end: {
      head: [58, 16], neck: [55, 27], hip: [50, 63],
      armL: [[50, 27], [66, 25], [78, 20]],
      armR: [[60, 27], [72, 22], [82, 18]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [55, 85], [56, 107]],
      extras: [groundLine(), anchorPole(85), bandLine(80, 19, 85, 60), rotationArc(50, 45, 30, 160, 40)],
    },
  },
  d2e3: {
    kind: 'figure',
    start: {
      head: [24, 60], neck: [34, 62], hip: [58, 64],
      armL: [[34, 62], [34, 78], [28, 84]],
      armR: [[38, 58], [50, 50], [60, 44]],
      legL: [[58, 64], [78, 62], [96, 60]],
      legR: [[58, 66], [78, 66], [96, 66]],
      extras: [groundLine(84)],
    },
    end: {
      head: [24, 72], neck: [34, 72], hip: [58, 74],
      armL: [[34, 72], [34, 84], [28, 88]],
      armR: [[38, 68], [50, 62], [60, 56]],
      legL: [[58, 74], [78, 72], [96, 70]],
      legR: [[58, 76], [78, 76], [96, 76]],
      extras: [groundLine(84)],
    },
  },
  d2e4: {
    kind: 'figure',
    start: {
      head: [20, 60], neck: [30, 60], hip: [60, 60],
      armL: [[30, 60], [22, 46], [16, 34]],
      armR: [[30, 58], [24, 70], [20, 80]],
      legL: [[60, 60], [64, 42], [64, 24]],
      legR: [[60, 62], [76, 62], [92, 62]],
      extras: [groundLine(88)],
    },
    end: {
      head: [20, 60], neck: [30, 60], hip: [60, 60],
      armL: [[30, 58], [24, 70], [20, 80]],
      armR: [[30, 60], [22, 46], [16, 34]],
      legL: [[60, 62], [76, 62], [92, 62]],
      legR: [[60, 60], [64, 42], [64, 24]],
      extras: [groundLine(88), motionArrow(60, 34, 88, 60)],
    },
  },
  d2e5: {
    kind: 'figure',
    start: {
      head: [42, 24], neck: [44, 34], hip: [52, 62],
      armL: [[40, 36], [34, 46], [46, 50]],
      armR: [[52, 34], [58, 46], [46, 50]],
      legL: [[48, 64], [36, 76], [30, 92]],
      legR: [[56, 64], [66, 78], [70, 94]],
      extras: [groundLine(96), rotationArc(48, 46, 22, 200, 340)],
    },
    end: {
      head: [58, 24], neck: [56, 34], hip: [52, 62],
      armL: [[48, 34], [42, 46], [54, 50]],
      armR: [[60, 36], [66, 46], [54, 50]],
      legL: [[48, 64], [36, 76], [30, 92]],
      legR: [[56, 64], [66, 78], [70, 94]],
      extras: [groundLine(96), rotationArc(52, 46, 22, 340, 200)],
    },
  },
  d2e6: {
    kind: 'figure',
    start: {
      head: [16, 84], neck: [26, 82], hip: [58, 76],
      armL: [[26, 82], [26, 94], [30, 100]],
      armR: [[26, 80], [26, 92], [30, 98]],
      legL: [[58, 76], [78, 78], [96, 80]],
      legR: [[58, 78], [78, 80], [96, 82]],
      extras: [groundLine(100)],
    },
    end: {
      head: [16, 68], neck: [26, 70], hip: [58, 66],
      armL: [[26, 70], [26, 84], [30, 92]],
      armR: [[26, 68], [26, 82], [30, 90]],
      legL: [[58, 66], [78, 70], [96, 74]],
      legR: [[58, 68], [78, 72], [96, 76]],
      extras: [groundLine(100)],
    },
  },
  d3e1: {
    kind: 'figure',
    start: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[42, 31], [38, 47], [36, 60]],
      armR: [[58, 31], [62, 47], [64, 60]],
      legL: [[46, 63], [45, 85], [44, 107]],
      legR: [[54, 63], [55, 85], [56, 107]],
      extras: [groundLine()],
    },
    end: {
      head: [30, 42], neck: [38, 46], hip: [56, 50],
      armL: [[38, 46], [26, 58], [16, 66]],
      armR: [[40, 44], [28, 54], [18, 60]],
      legL: [[56, 50], [58, 70], [58, 90]],
      legR: [[56, 50], [72, 46], [90, 40]],
      extras: [groundLine(92)],
    },
  },
  d3e2: {
    kind: 'figure',
    start: {
      head: [50, 24], neck: [50, 34], hip: [50, 64],
      armL: [[42, 35], [36, 44], [34, 52]],
      armR: [[58, 35], [64, 44], [66, 52]],
      legL: [[46, 64], [42, 84], [40, 104]],
      legR: [[54, 64], [58, 84], [60, 104]],
      extras: [groundLine(106), bandLine(40, 104, 60, 104)],
    },
    end: {
      head: [58, 24], neck: [58, 34], hip: [58, 64],
      armL: [[50, 35], [44, 44], [42, 52]],
      armR: [[66, 35], [72, 44], [74, 52]],
      legL: [[54, 64], [46, 84], [36, 104]],
      legR: [[62, 64], [70, 84], [80, 104]],
      extras: [groundLine(106), bandLine(36, 104, 80, 104), motionArrow(50, 60, 66, 60)],
    },
  },
  d3e3: {
    kind: 'figure',
    start: {
      head: [22, 58], neck: [32, 60], hip: [56, 62],
      armL: [[32, 60], [32, 76], [26, 82]],
      armR: [[36, 56], [46, 50], [56, 46]],
      legL: [[56, 62], [76, 60], [95, 58]],
      legR: [[56, 64], [76, 64], [95, 64]],
      extras: [groundLine(82), bench(84, 50, 16, 6)],
    },
    end: {
      head: [22, 72], neck: [32, 72], hip: [56, 74],
      armL: [[32, 72], [32, 86], [26, 90]],
      armR: [[36, 68], [46, 62], [56, 58]],
      legL: [[56, 74], [76, 62], [95, 58]],
      legR: [[56, 76], [76, 76], [95, 76]],
      extras: [groundLine(90), bench(84, 50, 16, 6)],
    },
  },
  d3e4: {
    kind: 'figure',
    start: {
      head: [18, 56], neck: [28, 58], hip: [58, 60],
      armL: [[28, 58], [28, 74], [28, 90]],
      armR: [[30, 56], [30, 72], [30, 88]],
      legL: [[58, 60], [58, 76], [58, 92]],
      legR: [[60, 58], [60, 74], [60, 90]],
      extras: [groundLine(94)],
    },
    end: {
      head: [12, 50], neck: [24, 54], hip: [58, 58],
      armL: [[24, 54], [16, 42], [8, 32]],
      armR: [[26, 52], [26, 68], [26, 86]],
      legL: [[58, 58], [58, 74], [58, 90]],
      legR: [[60, 56], [78, 54], [96, 50]],
      extras: [groundLine(94)],
    },
  },
  d3e5: {
    kind: 'foot',
    start: { ankleTilt: 0 },
    end: { ankleTilt: -14, extras: [`<line x1="10" y1="96" x2="46" y2="96" stroke="#94a3b8" stroke-width="2" stroke-dasharray="1 5" />`] },
  },
  d3e6: {
    kind: 'foot',
    start: { toeSpread: 0.3 },
    end: { toeSpread: -0.2, ankleTilt: 10, extras: [`<g transform="translate(48 40)"><path d="M0 0 L6 -4 L4 2 L10 4 L4 6 L6 12 L0 8 L-6 12 L-4 6 L-10 4 L-4 2 L-6 -4 Z" fill="none" stroke="#65a30d" stroke-width="1.6" /></g>`] },
  },
  d4e1: {
    kind: 'figure',
    start: {
      head: [36, 26], neck: [38, 36], hip: [40, 64],
      armL: [[32, 38], [22, 44], [14, 40]],
      armR: [[44, 38], [50, 46], [56, 42]],
      legL: [[36, 64], [30, 82], [24, 80]],
      legR: [[44, 64], [50, 84], [56, 104]],
      extras: [groundLine()],
    },
    end: {
      head: [70, 26], neck: [68, 36], hip: [66, 64],
      armL: [[60, 38], [50, 44], [42, 40]],
      armR: [[72, 38], [80, 44], [88, 40]],
      legL: [[62, 64], [56, 84], [50, 104]],
      legR: [[70, 64], [76, 82], [82, 80]],
      extras: [groundLine(), motionArrow(44, 96, 62, 96)],
    },
  },
  d4e2: {
    kind: 'figure',
    start: {
      head: [50, 22], neck: [50, 33], hip: [50, 62],
      armL: [[42, 34], [34, 44], [30, 54]],
      armR: [[58, 34], [66, 44], [70, 54]],
      legL: [[46, 62], [44, 82], [43, 102]],
      legR: [[54, 62], [56, 82], [57, 102]],
      extras: [groundLine(104)],
    },
    end: {
      head: [50, 20], neck: [50, 31], hip: [50, 60],
      armL: [[42, 32], [32, 40], [26, 48]],
      armR: [[58, 32], [68, 40], [74, 48]],
      legL: [[46, 60], [32, 80], [22, 100]],
      legR: [[54, 60], [68, 80], [78, 100]],
      extras: [groundLine(104), motionArrow(43, 100, 22, 100), motionArrow(57, 100, 78, 100)],
    },
  },
  d4e3: {
    kind: 'figure',
    start: {
      head: [30, 30], neck: [32, 40], hip: [36, 64],
      armL: [[28, 42], [20, 36], [14, 30]],
      armR: [[36, 42], [42, 50], [46, 58]],
      legL: [[34, 64], [30, 80], [26, 76]],
      legR: [[38, 64], [42, 84], [44, 104]],
      extras: [groundLine()],
    },
    end: {
      head: [72, 24], neck: [70, 35], hip: [66, 62],
      armL: [[62, 36], [52, 30], [44, 26]],
      armR: [[70, 36], [80, 32], [88, 28]],
      legL: [[64, 62], [60, 84], [56, 104]],
      legR: [[68, 62], [72, 80], [68, 78]],
      extras: [groundLine(), motionArrow(38, 96, 60, 96)],
    },
  },
  d4e4: {
    kind: 'figure',
    start: {
      head: [42, 20], neck: [44, 30], hip: [50, 62],
      armL: [[40, 30], [34, 42], [40, 50]],
      armR: [[50, 30], [56, 42], [40, 50]],
      legL: [[46, 62], [45, 84], [44, 106]],
      legR: [[54, 62], [55, 84], [56, 106]],
      extras: [groundLine(), ball(40, 50, 4)],
    },
    end: {
      head: [58, 18], neck: [56, 29], hip: [50, 62],
      armL: [[48, 29], [62, 24], [78, 20]],
      armR: [[58, 29], [70, 26], [82, 24]],
      legL: [[46, 62], [45, 84], [44, 106]],
      legR: [[54, 62], [55, 84], [56, 106]],
      extras: [groundLine(), ball(80, 22, 4), rotationArc(50, 45, 26, 160, 20)],
    },
  },
  d4e5: {
    kind: 'figure',
    start: {
      head: [16, 60], neck: [26, 60], hip: [56, 60],
      armL: [[26, 60], [26, 74], [26, 88]],
      armR: [[26, 58], [26, 72], [26, 86]],
      legL: [[56, 60], [76, 60], [96, 60]],
      legR: [[56, 62], [76, 62], [96, 62]],
      extras: [groundLine(62)],
    },
    end: {
      head: [24, 50], neck: [32, 54], hip: [56, 60],
      armL: [[32, 54], [40, 44], [48, 36]],
      armR: [[32, 52], [40, 42], [48, 34]],
      legL: [[56, 60], [70, 52], [84, 44]],
      legR: [[56, 62], [70, 54], [84, 46]],
      extras: [groundLine(80)],
    },
  },
  generic: {
    kind: 'figure',
    start: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[42, 31], [38, 47], [36, 60]],
      armR: [[58, 31], [62, 47], [64, 60]],
      legL: [[46, 63], [45, 85], [43, 107]],
      legR: [[54, 63], [55, 85], [57, 107]],
      extras: [groundLine(), `<text x="50" y="12" text-anchor="middle" font-size="10" fill="#94a3b8">?</text>`],
    },
    end: {
      head: [50, 18], neck: [50, 29], hip: [50, 63],
      armL: [[38, 31], [30, 40], [26, 46]],
      armR: [[62, 31], [70, 40], [74, 46]],
      legL: [[46, 63], [45, 85], [43, 107]],
      legR: [[54, 63], [55, 85], [57, 107]],
      extras: [groundLine(), `<text x="50" y="12" text-anchor="middle" font-size="10" fill="#94a3b8">?</text>`],
    },
  },
}

export function getDiagram(diagramId) {
  return DIAGRAMS[diagramId] ?? DIAGRAMS.generic
}

function footToSvgMarkup(pose) {
  return footSvg(pose)
}

export { footToSvgMarkup }
