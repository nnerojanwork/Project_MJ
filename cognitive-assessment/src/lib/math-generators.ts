import type { QuestionSet } from "@/types";
import {
  buildQuestion,
  fmtMoney,
  fmtNum,
  fmtPct,
  fmtSignedCount,
  pctChange,
  pctChangeWrongBase,
  randFloat,
  randInt,
  ratioToOne,
  round,
  simplifyRatio,
  tableFromRows,
  type Draw,
} from "./math-utils";

// Every base-variable draw (the "config of random ranges" per topic) made during the
// current generator call is recorded here so the sanity-check script can confirm
// nothing fell outside its configured range. Reset in generateMathSetWithDraws.
let currentDraws: Draw[] = [];

function ri(min: number, max: number, step = 1): number {
  const v = randInt(min, max, step);
  currentDraws.push({ label: `${min}:${max}:${step}`, value: v, min, max });
  return v;
}

function rf(min: number, max: number, decimals = 1): number {
  const v = randFloat(min, max, decimals);
  currentDraws.push({ label: `${min}:${max}:${decimals}`, value: v, min, max });
  return v;
}

// ---------------------------------------------------------------------------
// math-01: Retail Sales by Quarter
// ---------------------------------------------------------------------------
function genRetailSales(): QuestionSet {
  const eQ1_24 = ri(380, 460, 10);
  const eQ1Growth = ri(8, 20);
  const eQ1_25 = round((eQ1_24 * (1 + eQ1Growth / 100)) / 5) * 5;

  const eQ2_24 = ri(370, 410, 10);
  const eQ2Growth = ri(0, 12);
  const eQ2_25 = round((eQ2_24 * (1 + eQ2Growth / 100)) / 5) * 5;

  const cQ1_24 = ri(280, 340, 10);
  const cQ1Growth = ri(5, 15);
  const cQ1_25 = round((cQ1_24 * (1 + cQ1Growth / 100)) / 5) * 5;

  const cQ2_24 = ri(330, 380, 10);
  const cQ2Growth = ri(3, 12);
  const cQ2_25 = round((cQ2_24 * (1 + cQ2Growth / 100)) / 5) * 5;

  const hQ1_24 = ri(160, 210, 10);
  const hQ1Growth = ri(5, 15);
  const hQ1_25 = round((hQ1_24 * (1 + hQ1Growth / 100)) / 5) * 5;

  const hQ2_24 = ri(190, 220, 10);
  const hQ2Growth = ri(2, 10);
  const hQ2_25 = round((hQ2_24 * (1 + hQ2Growth / 100)) / 5) * 5;

  const table = tableFromRows(["Category", "Q1 2024", "Q1 2025", "Q2 2024", "Q2 2025"], [
    ["Electronics", eQ1_24, eQ1_25, eQ2_24, eQ2_25],
    ["Clothing", cQ1_24, cQ1_25, cQ2_24, cQ2_25],
    ["Homeware", hQ1_24, hQ1_25, hQ2_24, hQ2_25],
  ]);

  const q1Correct = round(pctChange(eQ1_24, eQ1_25));
  const q1 = buildQuestion(
    "q1",
    "What was the percentage increase in Electronics revenue from Q1 2024 to Q1 2025?",
    "percentages",
    fmtPct(q1Correct),
    [fmtPct(round(pctChangeWrongBase(eQ1_24, eQ1_25))), fmtPct(q1Correct + 5), fmtPct(round(pctChange(cQ1_24, cQ1_25)))]
  );

  const q2Total = eQ2_25 + cQ2_25 + hQ2_25;
  const q2Correct = round((cQ2_25 / q2Total) * 100);
  const q2 = buildQuestion(
    "q2",
    "In Q2 2025, what proportion of total revenue (all three categories) came from Clothing?",
    "proportions",
    fmtPct(q2Correct),
    [
      fmtPct(round((cQ2_25 / (q2Total - cQ2_25)) * 100)),
      fmtPct(round((cQ2_24 / q2Total) * 100)),
      fmtPct(round((eQ2_25 / q2Total) * 100)),
    ]
  );

  const q3Avg = (eQ1_25 + cQ1_25 + hQ1_25) / 3;
  const q3Correct = Math.round(q3Avg);
  const q3 = buildQuestion(
    "q3",
    "What is the average Q1 2025 revenue across the three categories, to the nearest £1,000?",
    "averages",
    fmtMoney(q3Correct * 1000),
    [
      fmtMoney(Math.round((eQ1_25 + cQ1_25 + hQ1_25) / 2) * 1000),
      fmtMoney(Math.round((eQ1_24 + cQ1_24 + hQ1_24) / 3) * 1000),
      fmtMoney((q3Correct + 5) * 1000),
    ]
  );

  return {
    id: "math-01",
    type: "math",
    title: "Retail Sales by Quarter",
    dataPack: {
      title: "Store Sales Revenue (£000s)",
      description: "Quarterly sales revenue for three store categories, 2024 vs 2025.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-02: Staff Headcount by Department
// ---------------------------------------------------------------------------
function genStaffHeadcount(): QuestionSet {
  const salesLast = ri(40, 55);
  const salesGrowth = ri(3, 15);
  const salesThis = Math.round(salesLast * (1 + salesGrowth / 100));

  const opsLast = ri(55, 70);
  const opsGrowth = ri(-12, -3);
  const opsThis = Math.round(opsLast * (1 + opsGrowth / 100));

  const supportLast = ri(25, 35);
  const supportGrowth = ri(25, 45);
  const supportThis = Math.round(supportLast * (1 + supportGrowth / 100));

  const financeLast = ri(15, 22);
  const financeGrowth = ri(5, 15);
  const financeThis = Math.round(financeLast * (1 + financeGrowth / 100));

  const table = tableFromRows(["Department", "Last Year", "This Year"], [
    ["Sales", salesLast, salesThis],
    ["Operations", opsLast, opsThis],
    ["Customer Support", supportLast, supportThis],
    ["Finance", financeLast, financeThis],
  ]);

  const depts = [
    { name: "Sales", last: salesLast, now: salesThis },
    { name: "Operations", last: opsLast, now: opsThis },
    { name: "Customer Support", last: supportLast, now: supportThis },
    { name: "Finance", last: financeLast, now: financeThis },
  ];
  const withPct = depts.map((d) => ({ ...d, pct: pctChange(d.last, d.now) }));
  const winner = withPct.reduce((a, b) => (b.pct > a.pct ? b : a));
  const q1 = buildQuestion(
    "q1",
    "Which department had the largest percentage increase in headcount?",
    "percentages",
    winner.name,
    depts.filter((d) => d.name !== winner.name).map((d) => d.name)
  );

  const q2Correct = simplifyRatio(salesThis, opsThis);
  const q2 = buildQuestion(
    "q2",
    "What is the ratio of Sales staff to Operations staff this year, in its simplest form?",
    "ratios",
    q2Correct,
    [simplifyRatio(opsThis, salesThis), `${salesThis}:${opsThis}`, simplifyRatio(salesThis, supportThis)]
  );

  const totalLast = salesLast + opsLast + supportLast + financeLast;
  const totalThis = salesThis + opsThis + supportThis + financeThis;
  const diff = totalThis - totalLast;
  const q3 = buildQuestion(
    "q3",
    "By how much did total headcount across all four departments change this year compared to last year?",
    "differences",
    fmtSignedCount(diff, "headcount"),
    [
      fmtSignedCount(-diff, "headcount"),
      fmtSignedCount(supportThis - supportLast, "headcount"),
      fmtSignedCount(diff + (diff >= 0 ? 4 : -4), "headcount"),
    ]
  );

  return {
    id: "math-02",
    type: "math",
    title: "Staff Headcount by Department",
    dataPack: {
      title: "Headcount by Department",
      description: "Number of staff employed in each department, current vs one year ago.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-03: Marketing Spend by Channel
// ---------------------------------------------------------------------------
function genMarketingSpend(): QuestionSet {
  const socialMar = ri(10000, 14000, 500);
  const socialGrowth = ri(15, 30);
  const socialApr = round((socialMar * (1 + socialGrowth / 100)) / 100) * 100;

  const searchMar = ri(8000, 11000, 500);
  const searchGrowth = ri(-12, -2);
  const searchApr = round((searchMar * (1 + searchGrowth / 100)) / 100) * 100;

  const emailMar = ri(1500, 2500, 100);
  const emailGrowth = ri(0, 10);
  const emailApr = round((emailMar * (1 + emailGrowth / 100)) / 100) * 100;

  const printMar = ri(3500, 5000, 250);
  const printGrowth = ri(-35, -15);
  const printApr = round((printMar * (1 + printGrowth / 100)) / 100) * 100;

  const table = tableFromRows(["Channel", "March", "April"], [
    ["Social Media", fmtNum(socialMar), fmtNum(socialApr)],
    ["Search Ads", fmtNum(searchMar), fmtNum(searchApr)],
    ["Email", fmtNum(emailMar), fmtNum(emailApr)],
    ["Print", fmtNum(printMar), fmtNum(printApr)],
  ]);

  const totalApr = socialApr + searchApr + emailApr + printApr;
  const q1 = buildQuestion(
    "q1",
    "What was the total marketing spend in April?",
    "totals",
    fmtMoney(totalApr),
    [fmtMoney(totalApr - printApr), fmtMoney(socialMar + searchMar + emailMar + printMar), fmtMoney(totalApr + 400)]
  );

  const q2Correct = round((socialApr / totalApr) * 100);
  const q2 = buildQuestion(
    "q2",
    "Social Media spend as a percentage of total April spend is closest to:",
    "percentages",
    fmtPct(q2Correct),
    [
      fmtPct(round((socialApr / (totalApr - socialApr)) * 100)),
      fmtPct(round((socialMar / totalApr) * 100)),
      fmtPct(round((searchApr / totalApr) * 100)),
    ]
  );

  const channels = [
    { name: "Social Media", pct: pctChange(socialMar, socialApr) },
    { name: "Search Ads", pct: pctChange(searchMar, searchApr) },
    { name: "Email", pct: pctChange(emailMar, emailApr) },
    { name: "Print", pct: pctChange(printMar, printApr) },
  ];
  const biggestDrop = channels.reduce((a, b) => (b.pct < a.pct ? b : a));
  const q3 = buildQuestion(
    "q3",
    "Which channel had the largest percentage decrease in spend from March to April?",
    "percentages",
    biggestDrop.name,
    channels.filter((c) => c.name !== biggestDrop.name).map((c) => c.name)
  );

  return {
    id: "math-03",
    type: "math",
    title: "Marketing Spend by Channel",
    dataPack: {
      title: "Monthly Marketing Spend (£)",
      description: "Spend across four channels for March and April.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-04: Production Output by Factory Line
// ---------------------------------------------------------------------------
function genProductionOutput(): QuestionSet {
  const gen5 = (mean: number, spread: number) =>
    Array.from({ length: 5 }, () => round((mean + ri(-spread, spread, 5)) / 5) * 5);

  const lineA = gen5(ri(395, 440, 5), 20);
  const lineB = gen5(ri(365, 395, 5), 15);
  const lineC = gen5(ri(480, 525, 5), 20);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const table = tableFromRows(["Line", ...days], [
    ["Line A", ...lineA],
    ["Line B", ...lineB],
    ["Line C", ...lineC],
  ]);

  const avgA = lineA.reduce((a, b) => a + b, 0) / 5;
  const q1Correct = Math.round(avgA);
  const q1 = buildQuestion(
    "q1",
    "What is Line A's average daily output for the week?",
    "averages",
    fmtNum(q1Correct),
    [
      fmtNum(lineA.reduce((a, b) => a + b, 0) / 4),
      fmtNum(lineB.reduce((a, b) => a + b, 0) / 5),
      fmtNum(q1Correct + 8),
    ]
  );

  const friIdx = 4;
  const monIdx = 0;
  const q2Correct = round(pctChange(lineB[friIdx], lineC[friIdx]), 1);
  const q2 = buildQuestion(
    "q2",
    "On Friday, Line C produced what percentage more units than Line B?",
    "percentages",
    fmtPct(q2Correct, 1),
    [
      fmtPct(round(pctChangeWrongBase(lineB[friIdx], lineC[friIdx]), 1), 1),
      fmtPct(round(pctChange(lineB[monIdx], lineC[monIdx]), 1), 1),
      fmtPct(round(((lineB[friIdx] - lineC[friIdx]) / lineC[friIdx]) * -100, 1), 1),
    ]
  );

  const wedIdx = 2;
  const thuIdx = 3;
  const q3Correct = lineA[wedIdx] + lineB[wedIdx] + lineC[wedIdx];
  const q3 = buildQuestion(
    "q3",
    "What was the total combined output of all three lines on Wednesday?",
    "totals",
    fmtNum(q3Correct),
    [
      fmtNum(lineA[wedIdx] + lineB[wedIdx]),
      fmtNum(lineA[thuIdx] + lineB[thuIdx] + lineC[thuIdx]),
      fmtNum(q3Correct + 10),
    ]
  );

  return {
    id: "math-04",
    type: "math",
    title: "Production Output by Factory Line",
    dataPack: {
      title: "Units Produced per Day",
      description: "Average daily output across three production lines over a working week.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-05: Monthly Energy Usage by Site
// ---------------------------------------------------------------------------
function genEnergyUsage(): QuestionSet {
  const aJan = ri(7500, 9000, 100);
  const aGrowth = ri(-14, -6);
  const aFeb = round((aJan * (1 + aGrowth / 100)) / 100) * 100;

  const bJan = ri(4800, 6000, 100);
  const bGrowth = ri(2, 8);
  const bFeb = round((bJan * (1 + bGrowth / 100)) / 100) * 100;

  const cJan = ri(10000, 12000, 200);
  const cGrowth = ri(-12, -5);
  const cFeb = round((cJan * (1 + cGrowth / 100)) / 100) * 100;

  const table = tableFromRows(["Site", "January", "February"], [
    ["Site A", fmtNum(aJan), fmtNum(aFeb)],
    ["Site B", fmtNum(bJan), fmtNum(bFeb)],
    ["Site C", fmtNum(cJan), fmtNum(cFeb)],
  ]);

  const sites = [
    { name: "Site A", pct: pctChange(aJan, aFeb) },
    { name: "Site B", pct: pctChange(bJan, bFeb) },
    { name: "Site C", pct: pctChange(cJan, cFeb) },
  ];
  const decreasing = sites.filter((s) => s.pct < 0);
  const biggestDrop = decreasing.reduce((a, b) => (b.pct < a.pct ? b : a));
  const q1 = buildQuestion(
    "q1",
    "Which site had the largest percentage reduction in usage from January to February?",
    "percentages",
    biggestDrop.name,
    [...sites.filter((s) => s.name !== biggestDrop.name).map((s) => s.name), "None decreased"].slice(0, 3)
  );

  const q2Correct = ratioToOne(cFeb, bFeb, 1);
  const q2 = buildQuestion(
    "q2",
    "What is the ratio of Site C's February usage to Site B's February usage, rounded to one decimal place?",
    "ratios",
    q2Correct,
    [ratioToOne(bFeb, cFeb, 1), ratioToOne(cFeb, aFeb, 1), ratioToOne(cJan, bJan, 1)]
  );

  const totalJan = aJan + bJan + cJan;
  const totalFeb = aFeb + bFeb + cFeb;
  const q3Correct = totalJan - totalFeb;
  const q3 = buildQuestion(
    "q3",
    "What was the combined reduction in total usage (all three sites) from January to February?",
    "differences",
    `${fmtNum(q3Correct)} kWh`,
    [
      `${fmtNum((aJan - aFeb) + (cJan - cFeb))} kWh`,
      `${fmtNum(Math.abs((aJan - aFeb) - (bFeb - bJan)))} kWh`,
      `${fmtNum(q3Correct + 200)} kWh`,
    ]
  );

  return {
    id: "math-05",
    type: "math",
    title: "Monthly Energy Usage by Site",
    dataPack: {
      title: "Energy Usage (kWh)",
      description: "Monthly electricity usage at three company sites.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-06: Subscription Plan Revenue by Tier
// ---------------------------------------------------------------------------
function genSubscriptionRevenue(): QuestionSet {
  const basicSubs = ri(2000, 2800, 100);
  const basicPrice = ri(4, 6);
  const standardSubs = ri(900, 1300, 50);
  const standardPrice = ri(10, 14);
  const premiumSubs = ri(280, 420, 10);
  const premiumPrice = ri(20, 30);

  const table = tableFromRows(["Plan", "Subscribers", "Price/month"], [
    ["Basic", fmtNum(basicSubs), `£${basicPrice}`],
    ["Standard", fmtNum(standardSubs), `£${standardPrice}`],
    ["Premium", fmtNum(premiumSubs), `£${premiumPrice}`],
  ]);

  const basicRev = basicSubs * basicPrice;
  const standardRev = standardSubs * standardPrice;
  const premiumRev = premiumSubs * premiumPrice;
  const totalRev = basicRev + standardRev + premiumRev;

  const q1 = buildQuestion(
    "q1",
    "What is the total monthly recurring revenue across all three plans?",
    "totals",
    fmtMoney(totalRev),
    [
      fmtMoney(totalRev - premiumRev),
      fmtMoney(basicSubs * basicPrice + standardSubs * premiumPrice + premiumSubs * standardPrice),
      fmtMoney(totalRev + 200),
    ]
  );

  const q2Correct = round((premiumRev / totalRev) * 100);
  const q2 = buildQuestion(
    "q2",
    "What percentage of total revenue comes from the Premium plan? (round to nearest whole %)",
    "percentages",
    fmtPct(q2Correct),
    [
      fmtPct(round((premiumRev / (totalRev - premiumRev)) * 100)),
      fmtPct(round((standardRev / totalRev) * 100)),
      fmtPct(round((premiumSubs / (basicSubs + standardSubs + premiumSubs)) * 100)),
    ]
  );

  const q3Correct = Math.round(standardSubs * 0.2);
  const q3 = buildQuestion(
    "q3",
    "If Standard plan subscribers grew by 20%, how many additional monthly subscribers would that be?",
    "percentages",
    fmtNum(q3Correct),
    [fmtNum(Math.round(basicSubs * 0.2)), fmtNum(Math.round(standardSubs * 1.2)), fmtNum(q3Correct + 20)]
  );

  return {
    id: "math-06",
    type: "math",
    title: "Subscription Plan Revenue by Tier",
    dataPack: {
      title: "Monthly Recurring Revenue by Plan",
      description: "Number of subscribers and monthly price for each plan tier.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-07: Profit Margins by Product Line
// ---------------------------------------------------------------------------
function genProfitMargins(): QuestionSet {
  const xRev = ri(800, 1000, 50);
  const xMarginPct = ri(25, 35);
  const xCost = round((xRev * (1 - xMarginPct / 100)) / 10) * 10;

  const yRev = ri(500, 700, 50);
  const yMarginPct = ri(15, 25);
  const yCost = round((yRev * (1 - yMarginPct / 100)) / 10) * 10;

  const zRev = ri(1100, 1300, 50);
  const zMarginPct = ri(30, 40);
  const zCost = round((zRev * (1 - zMarginPct / 100)) / 10) * 10;

  const table = tableFromRows(["Product", "Revenue", "Cost"], [
    ["Product X", xRev, xCost],
    ["Product Y", yRev, yCost],
    ["Product Z", zRev, zCost],
  ]);

  const zMarginActual = round(((zRev - zCost) / zRev) * 100);
  const q1 = buildQuestion(
    "q1",
    "What is the profit margin (profit ÷ revenue) for Product Z?",
    "percentages",
    fmtPct(zMarginActual),
    [fmtPct(round((zCost / zRev) * 100)), fmtPct(round(((zRev - zCost) / zCost) * 100)), fmtPct(zMarginActual + 5)]
  );

  const products = [
    { name: "Product X", margin: (xRev - xCost) / xRev },
    { name: "Product Y", margin: (yRev - yCost) / yRev },
    { name: "Product Z", margin: (zRev - zCost) / zRev },
  ];
  const lowest = products.reduce((a, b) => (b.margin < a.margin ? b : a));
  const q2 = buildQuestion(
    "q2",
    "Which product has the lowest profit margin?",
    "percentages",
    lowest.name,
    [...products.filter((p) => p.name !== lowest.name).map((p) => p.name), "All are equal"].slice(0, 3)
  );

  const totalProfit = (xRev - xCost) + (yRev - yCost) + (zRev - zCost);
  const q3 = buildQuestion(
    "q3",
    "What is the combined total profit across all three product lines?",
    "totals",
    fmtMoney(totalProfit * 1000),
    [
      fmtMoney((totalProfit - (zRev - zCost)) * 1000),
      fmtMoney((xRev + yRev + zRev) * 1000),
      fmtMoney((totalProfit + 30) * 1000),
    ]
  );

  return {
    id: "math-07",
    type: "math",
    title: "Profit Margins by Product Line",
    dataPack: {
      title: "Revenue and Cost by Product Line (£000s)",
      description: "Annual revenue and cost of goods sold for three product lines.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-08: Warehouse Inventory Levels by Month
// ---------------------------------------------------------------------------
function genWarehouseInventory(): QuestionSet {
  const northApr = ri(2800, 3600, 100);
  const northMayGrowth = ri(-15, -3);
  const northMay = round((northApr * (1 + northMayGrowth / 100)) / 100) * 100;
  const northJunGrowth = ri(8, 20);
  const northJun = round((northMay * (1 + northJunGrowth / 100)) / 100) * 100;

  const southApr = ri(2500, 3000, 100);
  const southMayGrowth = ri(5, 18);
  const southMay = round((southApr * (1 + southMayGrowth / 100)) / 100) * 100;
  const southJunGrowth = ri(-18, -5);
  const southJun = round((southMay * (1 + southJunGrowth / 100)) / 100) * 100;

  const table = tableFromRows(["Warehouse", "April", "May", "June"], [
    ["North", fmtNum(northApr), fmtNum(northMay), fmtNum(northJun)],
    ["South", fmtNum(southApr), fmtNum(southMay), fmtNum(southJun)],
  ]);

  const q1Correct = round(pctChange(northApr, northMay), 1);
  const q1 = buildQuestion(
    "q1",
    "What was the percentage change in North warehouse stock from April to May?",
    "percentages",
    fmtPct(q1Correct, 1),
    [
      fmtPct(round(pctChangeWrongBase(northApr, northMay), 1), 1),
      fmtPct(round(pctChange(northMay, northJun), 1), 1),
      fmtPct(round(pctChange(southApr, southMay), 1), 1),
    ]
  );

  const q2Correct = ratioToOne(northJun, southJun, 1);
  const q2 = buildQuestion(
    "q2",
    "In June, what is the ratio of North stock to South stock, rounded to one decimal place?",
    "ratios",
    q2Correct,
    [ratioToOne(southJun, northJun, 1), ratioToOne(northApr, southApr, 1), ratioToOne(northJun, southApr, 1)]
  );

  const combinedApr = northApr + southApr;
  const combinedMay = northMay + southMay;
  const combinedJun = northJun + southJun;
  const q3Correct = Math.round((combinedApr + combinedMay + combinedJun) / 3);
  const q3 = buildQuestion(
    "q3",
    "What is the average combined (North + South) stock level across the three months?",
    "averages",
    fmtNum(q3Correct),
    [
      fmtNum(Math.round((combinedApr + combinedMay) / 2)),
      fmtNum(Math.round((northApr + northMay + northJun) / 3) * 2),
      fmtNum(q3Correct + 60),
    ]
  );

  return {
    id: "math-08",
    type: "math",
    title: "Warehouse Inventory Levels by Month",
    dataPack: {
      title: "Units in Stock (end of month)",
      description: "Stock levels for two warehouses across three months.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-09: Customer Satisfaction Scores by Region
// ---------------------------------------------------------------------------
function genCustomerSatisfaction(): QuestionSet {
  const northR1 = rf(6.5, 7.8, 1);
  const northR2 = round(northR1 * (1 + ri(5, 12) / 100), 1);
  const southR1 = rf(7.8, 8.5, 1);
  const southR2 = round(southR1 * (1 + ri(-5, -1) / 100), 1);
  const eastR1 = rf(6.0, 6.8, 1);
  const eastR2 = round(eastR1 * (1 + ri(4, 10) / 100), 1);
  const westR1 = rf(7.5, 8.2, 1);
  const westR2 = round(westR1 * (1 + ri(1, 6) / 100), 1);

  const table = tableFromRows(["Region", "Round 1", "Round 2"], [
    ["North", northR1.toFixed(1), northR2.toFixed(1)],
    ["South", southR1.toFixed(1), southR2.toFixed(1)],
    ["East", eastR1.toFixed(1), eastR2.toFixed(1)],
    ["West", westR1.toFixed(1), westR2.toFixed(1)],
  ]);

  const regions = [
    { name: "North", r1: northR1, r2: northR2 },
    { name: "South", r1: southR1, r2: southR2 },
    { name: "East", r1: eastR1, r2: eastR2 },
    { name: "West", r1: westR1, r2: westR2 },
  ];
  const withPct = regions.map((r) => ({ ...r, pct: pctChange(r.r1, r.r2) }));
  const best = withPct.reduce((a, b) => (b.pct > a.pct ? b : a));
  const q1 = buildQuestion(
    "q1",
    "Which region showed the largest percentage improvement from Round 1 to Round 2?",
    "percentages",
    best.name,
    regions.filter((r) => r.name !== best.name).map((r) => r.name)
  );

  const avgR2 = round((northR2 + southR2 + eastR2 + westR2) / 4, 1);
  const avgR1 = round((northR1 + southR1 + eastR1 + westR1) / 4, 1);
  const q2 = buildQuestion(
    "q2",
    "What is the average Round 2 score across all four regions?",
    "averages",
    avgR2.toFixed(1),
    [
      round((northR2 + southR2 + eastR2) / 3, 1).toFixed(1),
      avgR1.toFixed(1),
      round(avgR2 + 0.2, 1).toFixed(1),
    ]
  );

  const declined = regions.find((r) => r.r2 < r.r1)!;
  const q3 = buildQuestion(
    "q3",
    "Which region is the only one to have scored lower in Round 2 than Round 1?",
    "data-reading",
    declined.name,
    regions.filter((r) => r.name !== declined.name).map((r) => r.name)
  );

  return {
    id: "math-09",
    type: "math",
    title: "Customer Satisfaction Scores by Region",
    dataPack: {
      title: "Average Customer Satisfaction Score (out of 10)",
      description: "Survey results across four regions, two survey rounds.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

// ---------------------------------------------------------------------------
// math-10: Delivery Times by Courier
// ---------------------------------------------------------------------------
function genDeliveryTimes(): QuestionSet {
  const c1Days = rf(1.8, 2.5, 1);
  const c1Parcels = ri(12000, 16000, 500);
  const c2Days = rf(2.8, 3.8, 1);
  const c2Parcels = ri(8000, 11000, 500);
  const c3Days = rf(1.4, 2.0, 1);
  const c3Parcels = ri(5000, 7500, 500);

  const table = tableFromRows(["Courier", "Avg. Delivery Days", "Parcels Delivered"], [
    ["CourierOne", c1Days.toFixed(1), fmtNum(c1Parcels)],
    ["CourierTwo", c2Days.toFixed(1), fmtNum(c2Parcels)],
    ["CourierThree", c3Days.toFixed(1), fmtNum(c3Parcels)],
  ]);

  const totalParcels = c1Parcels + c2Parcels + c3Parcels;
  const q1 = buildQuestion(
    "q1",
    "What is the total number of parcels delivered by all three couriers combined?",
    "totals",
    fmtNum(totalParcels),
    [fmtNum(totalParcels - c1Parcels), fmtNum(totalParcels - c3Parcels), fmtNum(totalParcels + 500)]
  );

  const q2Correct = round((c1Parcels / totalParcels) * 100);
  const q2 = buildQuestion(
    "q2",
    "What percentage of all parcels delivered were handled by CourierOne? (round to nearest whole %)",
    "percentages",
    fmtPct(q2Correct),
    [
      fmtPct(round((c1Parcels / (totalParcels - c1Parcels)) * 100)),
      fmtPct(round((c2Parcels / totalParcels) * 100)),
      fmtPct(round((c3Parcels / totalParcels) * 100)),
    ]
  );

  const q3Correct = round(pctChange(c3Days, c2Days));
  const q3 = buildQuestion(
    "q3",
    "CourierTwo's average delivery time is what percentage slower than CourierThree's?",
    "percentages",
    fmtPct(q3Correct),
    [
      fmtPct(round(pctChangeWrongBase(c3Days, c2Days))),
      fmtPct(round(pctChange(c1Days, c2Days))),
      fmtPct(q3Correct + 8),
    ]
  );

  return {
    id: "math-10",
    type: "math",
    title: "Delivery Times by Courier",
    dataPack: {
      title: "Average Delivery Time (days) and Volume",
      description: "Performance of three courier partners over one quarter.",
      table,
    },
    questions: [q1, q2, q3],
  };
}

export const MATH_GENERATORS: Record<string, () => QuestionSet> = {
  "math-01": genRetailSales,
  "math-02": genStaffHeadcount,
  "math-03": genMarketingSpend,
  "math-04": genProductionOutput,
  "math-05": genEnergyUsage,
  "math-06": genSubscriptionRevenue,
  "math-07": genProfitMargins,
  "math-08": genWarehouseInventory,
  "math-09": genCustomerSatisfaction,
  "math-10": genDeliveryTimes,
};

export const MATH_SET_IDS = Object.keys(MATH_GENERATORS);

export function generateMathSet(id: string): QuestionSet {
  const gen = MATH_GENERATORS[id];
  if (!gen) throw new Error(`Unknown math set id: ${id}`);
  currentDraws = [];
  return gen();
}

export function generateRandomMathSet(): QuestionSet {
  const id = MATH_SET_IDS[Math.floor(Math.random() * MATH_SET_IDS.length)];
  return generateMathSet(id);
}

/** Same as generateMathSet, but also returns every base-variable draw for range verification (used by the sanity check). */
export function generateMathSetWithDraws(id: string): { set: QuestionSet; draws: Draw[] } {
  const set = generateMathSet(id);
  return { set, draws: currentDraws };
}
