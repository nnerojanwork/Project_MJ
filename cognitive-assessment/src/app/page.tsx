import Link from "next/link";
import { LEVEL_TIME_LIMITS, type Level, type TestType } from "@/types";
import { HistorySummary } from "@/components/HistorySummary";

const LEVELS: Level[] = ["easy", "medium", "hard"];
const TYPES: { type: TestType; label: string; description: string }[] = [
  { type: "math", label: "Numerical Reasoning", description: "Data tables, percentages, ratios, averages" },
  { type: "comprehension", label: "Verbal Comprehension", description: "Passages, main idea, inference" },
];

export default function Home() {
  return (
    <main className="space-y-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Cognitive Assessment Practice</h1>
        <p className="text-sm text-ink-700">
          Pick a test type and difficulty level. Each test has 15 timed questions, matching common SHL-style
          assessments, and you can download a report explaining every answer afterwards.
        </p>
      </header>

      {TYPES.map(({ type, label, description }) => (
        <section key={type} className="space-y-3">
          <div>
            <h2 className="text-lg font-medium">{label}</h2>
            <p className="text-sm text-ink-700">{description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {LEVELS.map((level) => (
              <Link
                key={level}
                href={`/test/${type}/${level}`}
                className="rounded-lg border border-ink-700/20 bg-white p-4 transition hover:border-accent hover:shadow-sm"
              >
                <div className="text-base font-medium capitalize">{level}</div>
                <div className="mt-1 text-sm text-ink-700">{LEVEL_TIME_LIMITS[level]}s / question</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <HistorySummary />
    </main>
  );
}
