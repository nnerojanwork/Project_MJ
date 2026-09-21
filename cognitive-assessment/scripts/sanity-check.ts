// Manual sanity check for the math generators (Part 1 of the build spec).
// Run with: npm run sanity-check
//
// For each of the 10 generators, runs 100 times and asserts:
//   1. all 4 options on every question are distinct
//   2. every base-variable draw stayed within its configured [min, max] range
//   3. the correct answer is arithmetically correct, re-derived independently
//      from the generated markdown table (not from the generator's internal vars)

import { MATH_SET_IDS, generateMathSetWithDraws } from "../src/lib/math-generators";

const RUNS = 100;
let failures = 0;

function fail(msg: string) {
  failures++;
  console.error(`FAIL: ${msg}`);
}

function approxEqual(a: number, b: number, tolerance: number): boolean {
  return Math.abs(a - b) <= tolerance;
}

/** Parses a markdown table into { headers, rows: { label, cells } }. */
function parseTable(markdown: string) {
  const lines = markdown.split("\n").filter(Boolean);
  const headers = lines[0]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const rows = lines.slice(2).map((line) => {
    const cells = line
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    return { label: cells[0], cells: cells.slice(1) };
  });
  return { headers, rows };
}

function num(cell: string): number {
  return parseFloat(cell.replace(/[£,]/g, ""));
}

function findRow(rows: { label: string; cells: string[] }[], label: string) {
  const row = rows.find((r) => r.label === label);
  if (!row) throw new Error(`Row not found: ${label}`);
  return row.cells.map(num);
}

function parseAnswerNumber(text: string): number {
  // Strips currency, thousands separators, percent signs, units, and signed-count phrasing.
  const incMatch = text.match(/Increased by ([\d,]+)/);
  if (incMatch) return parseFloat(incMatch[1].replace(/,/g, ""));
  const decMatch = text.match(/Decreased by ([\d,]+)/);
  if (decMatch) return -parseFloat(decMatch[1].replace(/,/g, ""));
  const cleaned = text.replace(/[£,%]/g, "").replace(/\s*kWh/, "").trim();
  return parseFloat(cleaned);
}

function correctText(q: { options: { id: string; text: string }[]; correctOptionId: string }): string {
  const opt = q.options.find((o) => o.id === q.correctOptionId);
  if (!opt) throw new Error("correctOptionId does not match any option");
  return opt.text;
}

function checkDistinctOptions(setId: string, qId: string, options: { text: string }[]) {
  const texts = options.map((o) => o.text);
  const unique = new Set(texts);
  if (unique.size !== 4) {
    fail(`${setId}/${qId}: options not all distinct -> ${JSON.stringify(texts)}`);
  }
}

function checkDrawsInRange(setId: string, draws: { label: string; value: number; min: number; max: number }[]) {
  for (const d of draws) {
    if (d.value < d.min - 1e-9 || d.value > d.max + 1e-9) {
      fail(`${setId}: draw ${d.label} = ${d.value} outside configured range [${d.min}, ${d.max}]`);
    }
  }
}

// Independent re-derivation of each question's correct answer, from the parsed table only.
const CHECKERS: Record<string, (table: ReturnType<typeof parseTable>, questions: any[]) => void> = {
  "math-01": (t, qs) => {
    const [eQ1_24, eQ1_25, eQ2_24, eQ2_25] = findRow(t.rows, "Electronics");
    const [, , , cQ2_25] = findRow(t.rows, "Clothing");
    const clothingAll = findRow(t.rows, "Clothing");
    const homewareAll = findRow(t.rows, "Homeware");
    const expected1 = ((eQ1_25 - eQ1_24) / eQ1_24) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), expected1, 1))
      fail(`math-01/q1: expected ~${expected1.toFixed(1)}%, got ${correctText(qs[0])}`);

    const q2Total = eQ2_25 + clothingAll[3] + homewareAll[3];
    const expected2 = (cQ2_25 / q2Total) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[1])), expected2, 1))
      fail(`math-01/q2: expected ~${expected2.toFixed(1)}%, got ${correctText(qs[1])}`);

    const expected3 = Math.round((eQ1_25 + clothingAll[1] + homewareAll[1]) / 3);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])) / 1000, expected3, 1))
      fail(`math-01/q3: expected ~£${expected3}k, got ${correctText(qs[2])}`);
  },
  "math-02": (t, qs) => {
    const [salesLast, salesThis] = findRow(t.rows, "Sales");
    const [opsLast, opsThis] = findRow(t.rows, "Operations");
    const [supportLast, supportThis] = findRow(t.rows, "Customer Support");
    const [financeLast, financeThis] = findRow(t.rows, "Finance");
    const depts = [
      { name: "Sales", pct: ((salesThis - salesLast) / salesLast) * 100 },
      { name: "Operations", pct: ((opsThis - opsLast) / opsLast) * 100 },
      { name: "Customer Support", pct: ((supportThis - supportLast) / supportLast) * 100 },
      { name: "Finance", pct: ((financeThis - financeLast) / financeLast) * 100 },
    ];
    const winner = depts.reduce((a, b) => (b.pct > a.pct ? b : a));
    if (correctText(qs[0]) !== winner.name) fail(`math-02/q1: expected ${winner.name}, got ${correctText(qs[0])}`);

    const gcdFn = (a: number, b: number): number => (b === 0 ? a : gcdFn(b, a % b));
    const d = gcdFn(salesThis, opsThis);
    const expectedRatio = `${salesThis / d}:${opsThis / d}`;
    if (correctText(qs[1]) !== expectedRatio)
      fail(`math-02/q2: expected ${expectedRatio}, got ${correctText(qs[1])}`);

    const diff = salesThis + opsThis + supportThis + financeThis - (salesLast + opsLast + supportLast + financeLast);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), diff, 0.5))
      fail(`math-02/q3: expected ${diff}, got ${correctText(qs[2])}`);
  },
  "math-03": (t, qs) => {
    const rows = ["Social Media", "Search Ads", "Email", "Print"].map((label) => ({
      label,
      vals: findRow(t.rows, label),
    }));
    const totalApr = rows.reduce((sum, r) => sum + r.vals[1], 0);
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), totalApr, 1))
      fail(`math-03/q1: expected £${totalApr}, got ${correctText(qs[0])}`);

    const social = rows[0].vals;
    const expected2 = (social[1] / totalApr) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[1])), expected2, 1))
      fail(`math-03/q2: expected ~${expected2.toFixed(1)}%, got ${correctText(qs[1])}`);

    const withPct = rows.map((r) => ({ label: r.label, pct: ((r.vals[1] - r.vals[0]) / r.vals[0]) * 100 }));
    const biggestDrop = withPct.reduce((a, b) => (b.pct < a.pct ? b : a));
    if (correctText(qs[2]) !== biggestDrop.label)
      fail(`math-03/q3: expected ${biggestDrop.label}, got ${correctText(qs[2])}`);
  },
  "math-04": (t, qs) => {
    const lineA = findRow(t.rows, "Line A");
    const lineB = findRow(t.rows, "Line B");
    const lineC = findRow(t.rows, "Line C");
    const avgA = lineA.reduce((a, b) => a + b, 0) / 5;
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), Math.round(avgA), 1))
      fail(`math-04/q1: expected ${Math.round(avgA)}, got ${correctText(qs[0])}`);

    const expected2 = ((lineC[4] - lineB[4]) / lineB[4]) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[1])), expected2, 1))
      fail(`math-04/q2: expected ~${expected2.toFixed(1)}%, got ${correctText(qs[1])}`);

    const expected3 = lineA[2] + lineB[2] + lineC[2];
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), expected3, 1))
      fail(`math-04/q3: expected ${expected3}, got ${correctText(qs[2])}`);
  },
  "math-05": (t, qs) => {
    const a = findRow(t.rows, "Site A");
    const b = findRow(t.rows, "Site B");
    const c = findRow(t.rows, "Site C");
    const sites = [
      { name: "Site A", pct: ((a[1] - a[0]) / a[0]) * 100 },
      { name: "Site B", pct: ((b[1] - b[0]) / b[0]) * 100 },
      { name: "Site C", pct: ((c[1] - c[0]) / c[0]) * 100 },
    ];
    const decreasing = sites.filter((s) => s.pct < 0);
    const biggestDrop = decreasing.reduce((x, y) => (y.pct < x.pct ? y : x));
    if (correctText(qs[0]) !== biggestDrop.name)
      fail(`math-05/q1: expected ${biggestDrop.name}, got ${correctText(qs[0])}`);

    const expected2 = c[1] / b[1];
    if (!approxEqual(parseFloat(correctText(qs[1])), expected2, 0.15))
      fail(`math-05/q2: expected ~${expected2.toFixed(1)}:1, got ${correctText(qs[1])}`);

    const expected3 = a[0] + b[0] + c[0] - (a[1] + b[1] + c[1]);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), expected3, 1))
      fail(`math-05/q3: expected ${expected3} kWh, got ${correctText(qs[2])}`);
  },
  "math-06": (t, qs) => {
    const parseMoney = (s: string) => parseFloat(s.replace(/[£,]/g, ""));
    const basicRow = t.rows.find((r) => r.label === "Basic")!;
    const standardRow = t.rows.find((r) => r.label === "Standard")!;
    const premiumRow = t.rows.find((r) => r.label === "Premium")!;
    const basicSubs = num(basicRow.cells[0]);
    const basicPrice = parseMoney(basicRow.cells[1]);
    const standardSubs = num(standardRow.cells[0]);
    const standardPrice = parseMoney(standardRow.cells[1]);
    const premiumSubs = num(premiumRow.cells[0]);
    const premiumPrice = parseMoney(premiumRow.cells[1]);

    const basicRev = basicSubs * basicPrice;
    const standardRev = standardSubs * standardPrice;
    const premiumRev = premiumSubs * premiumPrice;
    const totalRev = basicRev + standardRev + premiumRev;

    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), totalRev, 1))
      fail(`math-06/q1: expected £${totalRev}, got ${correctText(qs[0])}`);

    const expected2 = (premiumRev / totalRev) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[1])), expected2, 1))
      fail(`math-06/q2: expected ~${expected2.toFixed(1)}%, got ${correctText(qs[1])}`);

    const expected3 = Math.round(standardSubs * 0.2);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), expected3, 1))
      fail(`math-06/q3: expected ${expected3}, got ${correctText(qs[2])}`);
  },
  "math-07": (t, qs) => {
    const x = findRow(t.rows, "Product X");
    const y = findRow(t.rows, "Product Y");
    const z = findRow(t.rows, "Product Z");
    const expected1 = ((z[0] - z[1]) / z[0]) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), expected1, 1))
      fail(`math-07/q1: expected ~${expected1.toFixed(1)}%, got ${correctText(qs[0])}`);

    const products = [
      { name: "Product X", margin: (x[0] - x[1]) / x[0] },
      { name: "Product Y", margin: (y[0] - y[1]) / y[0] },
      { name: "Product Z", margin: (z[0] - z[1]) / z[0] },
    ];
    const lowest = products.reduce((a, b) => (b.margin < a.margin ? b : a));
    if (correctText(qs[1]) !== lowest.name) fail(`math-07/q2: expected ${lowest.name}, got ${correctText(qs[1])}`);

    const totalProfit = (x[0] - x[1]) + (y[0] - y[1]) + (z[0] - z[1]);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])) / 1000, totalProfit, 1))
      fail(`math-07/q3: expected £${totalProfit}k, got ${correctText(qs[2])}`);
  },
  "math-08": (t, qs) => {
    const north = findRow(t.rows, "North");
    const south = findRow(t.rows, "South");
    const expected1 = ((north[1] - north[0]) / north[0]) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), expected1, 1))
      fail(`math-08/q1: expected ~${expected1.toFixed(1)}%, got ${correctText(qs[0])}`);

    const expected2 = north[2] / south[2];
    if (!approxEqual(parseFloat(correctText(qs[1])), expected2, 0.15))
      fail(`math-08/q2: expected ~${expected2.toFixed(1)}:1, got ${correctText(qs[1])}`);

    const combined = [north[0] + south[0], north[1] + south[1], north[2] + south[2]];
    const expected3 = Math.round(combined.reduce((a, b) => a + b, 0) / 3);
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), expected3, 1))
      fail(`math-08/q3: expected ${expected3}, got ${correctText(qs[2])}`);
  },
  "math-09": (t, qs) => {
    const regions = ["North", "South", "East", "West"].map((label) => ({
      name: label,
      vals: findRow(t.rows, label),
    }));
    const withPct = regions.map((r) => ({ name: r.name, r1: r.vals[0], r2: r.vals[1], pct: ((r.vals[1] - r.vals[0]) / r.vals[0]) * 100 }));
    const best = withPct.reduce((a, b) => (b.pct > a.pct ? b : a));
    if (correctText(qs[0]) !== best.name) fail(`math-09/q1: expected ${best.name}, got ${correctText(qs[0])}`);

    const avgR2 = withPct.reduce((sum, r) => sum + r.r2, 0) / 4;
    if (!approxEqual(parseFloat(correctText(qs[1])), avgR2, 0.15))
      fail(`math-09/q2: expected ~${avgR2.toFixed(1)}, got ${correctText(qs[1])}`);

    const declined = withPct.find((r) => r.r2 < r.r1);
    if (!declined || correctText(qs[2]) !== declined.name)
      fail(`math-09/q3: expected ${declined?.name}, got ${correctText(qs[2])}`);
  },
  "math-10": (t, qs) => {
    const c1 = findRow(t.rows, "CourierOne");
    const c2 = findRow(t.rows, "CourierTwo");
    const c3 = findRow(t.rows, "CourierThree");
    const total = c1[1] + c2[1] + c3[1];
    if (!approxEqual(parseAnswerNumber(correctText(qs[0])), total, 1))
      fail(`math-10/q1: expected ${total}, got ${correctText(qs[0])}`);

    const expected2 = (c1[1] / total) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[1])), expected2, 1))
      fail(`math-10/q2: expected ~${expected2.toFixed(1)}%, got ${correctText(qs[1])}`);

    const expected3 = ((c2[0] - c3[0]) / c3[0]) * 100;
    if (!approxEqual(parseAnswerNumber(correctText(qs[2])), expected3, 1))
      fail(`math-10/q3: expected ~${expected3.toFixed(1)}%, got ${correctText(qs[2])}`);
  },
};

for (const setId of MATH_SET_IDS) {
  for (let run = 0; run < RUNS; run++) {
    const { set, draws } = generateMathSetWithDraws(setId);
    checkDrawsInRange(setId, draws);
    for (const q of set.questions) {
      checkDistinctOptions(setId, q.id, q.options);
    }
    const checker = CHECKERS[setId];
    if (!checker) {
      fail(`${setId}: no checker defined`);
      continue;
    }
    try {
      checker(parseTable(set.dataPack!.table), set.questions);
    } catch (e) {
      fail(`${setId} run ${run}: checker threw - ${(e as Error).message}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} failure(s) across ${RUNS} runs x ${MATH_SET_IDS.length} sets.`);
  process.exit(1);
} else {
  console.log(`OK: all ${MATH_SET_IDS.length} generators passed ${RUNS} runs each (options distinct, draws in range, answers arithmetically correct).`);
}
