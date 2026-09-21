import type { MCQOption, Question } from "@/types";

export function randInt(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  const n = Math.floor(Math.random() * (steps + 1));
  return min + n * step;
}

export function randFloat(min: number, max: number, decimals = 1): number {
  const raw = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(raw * factor) / factor;
}

/** A recorded base-variable draw, kept only so the sanity check can verify it stayed within its configured range. */
export interface Draw {
  label: string;
  value: number;
  min: number;
  max: number;
}

export function trackedInt(draws: Draw[], label: string, min: number, max: number, step = 1): number {
  const v = randInt(min, max, step);
  draws.push({ label, value: v, min, max });
  return v;
}

export function trackedFloat(draws: Draw[], label: string, min: number, max: number, decimals = 1): number {
  const v = randFloat(min, max, decimals);
  draws.push({ label, value: v, min, max });
  return v;
}

export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function pctChange(oldValue: number, newValue: number): number {
  return ((newValue - oldValue) / oldValue) * 100;
}

export function pctChangeWrongBase(oldValue: number, newValue: number): number {
  return ((newValue - oldValue) / newValue) * 100;
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("en-GB");
}

export function fmtMoney(n: number): string {
  return `£${fmtNum(n)}`;
}

export function fmtPct(n: number, decimals = 0): string {
  const rounded = round(n, decimals);
  return `${decimals === 0 ? Math.round(rounded) : rounded}%`;
}

export function fmtSignedCount(n: number, label: string): string {
  const rounded = Math.round(n);
  return rounded >= 0 ? `Increased by ${rounded}` : `Decreased by ${Math.abs(rounded)}`;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function simplifyRatio(a: number, b: number): string {
  const d = gcd(a, b);
  return `${Math.round(a / d)}:${Math.round(b / d)}`;
}

export function ratioToOne(a: number, b: number, decimals = 1): string {
  return `${round(a / b, decimals).toFixed(decimals)}:1`;
}

/**
 * Nudges the last number in a formatted answer string by a small, visible amount
 * (so two options never look identical to the user, e.g. two options reading "9%").
 * Falls back to an invisible trailing space only when the text has no number to nudge.
 */
function nudgeText(text: string): string {
  const matches = [...text.matchAll(/-?\d[\d,]*\.?\d*/g)];
  const match = matches[matches.length - 1];
  if (!match || match.index === undefined) return text + " ";

  const raw = match[0];
  const start = match.index;
  const end = start + raw.length;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const numeric = parseFloat(raw.replace(/,/g, ""));
  const delta = decimals > 0 ? 1 / Math.pow(10, decimals) : Math.abs(numeric) >= 1000 ? 100 : 1;
  const nudged = numeric + delta;
  const formatted =
    decimals > 0 ? nudged.toFixed(decimals) : Math.round(nudged).toLocaleString("en-GB");
  return text.slice(0, start) + formatted + text.slice(end);
}

/** Shuffles the correct answer among wrong options and reassigns ids a-d. */
export function buildOptions(
  correctText: string,
  wrongTexts: string[]
): { options: MCQOption[]; correctOptionId: string } {
  const seen = new Set<string>([correctText]);
  const dedupedWrongs: string[] = [];
  for (const w of wrongTexts) {
    let text = w;
    let attempts = 0;
    while (seen.has(text) && attempts < 6) {
      text = nudgeText(text);
      attempts++;
    }
    seen.add(text);
    dedupedWrongs.push(text);
  }

  const entries = [{ text: correctText, isCorrect: true }, ...dedupedWrongs.map((t) => ({ text: t, isCorrect: false }))];

  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }

  const ids = ["a", "b", "c", "d"];
  const options: MCQOption[] = entries.map((e, i) => ({ id: ids[i], text: e.text }));
  const correctOptionId = ids[entries.findIndex((e) => e.isCorrect)];
  return { options, correctOptionId };
}

export function buildQuestion(
  id: string,
  prompt: string,
  category: string,
  correctText: string,
  wrongTexts: string[],
  explanation?: string
): Question {
  const { options, correctOptionId } = buildOptions(correctText, wrongTexts);
  return { id, prompt, options, correctOptionId, category, explanation };
}

export function tableFromRows(headers: string[], rows: (string | number)[][]): string {
  const headerLine = `| ${headers.join(" | ")} |`;
  const sepLine = `|${headers.map(() => "---").join("|")}|`;
  const rowLines = rows.map((r) => `| ${r.join(" | ")} |`);
  return [headerLine, sepLine, ...rowLines].join("\n");
}
