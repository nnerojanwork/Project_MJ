"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { QuestionSet, TestSession } from "@/types";
import { getSession, getSessionSets } from "@/lib/storage";
import { flattenSets } from "@/lib/flatten";
import { buildReportHtml, downloadTextFile } from "@/lib/report";

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<TestSession | null | undefined>(undefined);
  const [sets, setSets] = useState<QuestionSet[] | null>(null);

  useEffect(() => {
    setSession(getSession(sessionId));
    setSets(getSessionSets(sessionId));
  }, [sessionId]);

  const flatQuestions = useMemo(() => (sets ? flattenSets(sets) : []), [sets]);
  const questionsByKey = useMemo(() => new Map(flatQuestions.map((fq) => [fq.key, fq])), [flatQuestions]);

  if (session === undefined) {
    return <p className="text-sm text-ink-700">Loading results…</p>;
  }

  if (!session || !sets) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-700">Session not found.</p>
        <Link href="/" className="text-sm text-accent hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const total = session.answers.length;
  const correctCount = session.answers.filter((a) => a.correct).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const times = session.answers.map((a) => a.timeTakenSeconds).sort((a, b) => a - b);
  const p75Index = Math.floor(times.length * 0.75);
  const p75Threshold = times[Math.min(p75Index, times.length - 1)] ?? 0;

  const chartData = session.answers.map((a, i) => {
    const fq = questionsByKey.get(a.questionId);
    return {
      label: `Q${i + 1}`,
      seconds: a.timeTakenSeconds,
      slow: a.timeTakenSeconds >= p75Threshold && a.timeTakenSeconds > 0,
      timedOut: a.timedOut,
      category: fq?.question.category ?? "unknown",
    };
  });

  const categoryStats = new Map<string, { correct: number; total: number }>();
  for (const a of session.answers) {
    const fq = questionsByKey.get(a.questionId);
    const category = fq?.question.category ?? "unknown";
    const stat = categoryStats.get(category) ?? { correct: 0, total: 0 };
    stat.total += 1;
    if (a.correct) stat.correct += 1;
    categoryStats.set(category, stat);
  }

  const missed = session.answers.filter((a) => !a.correct);

  function handleDownloadReport() {
    if (!session) return;
    const html = buildReportHtml(session, flatQuestions);
    downloadTextFile(`cognitive-assessment-report-${session.id}.html`, html);
  }

  return (
    <main className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-ink-700">
            {session.type} &middot; {session.level} &middot; {total} questions
          </p>
          <h1 className="text-2xl font-semibold">Results</h1>
        </div>
        <button
          onClick={handleDownloadReport}
          className="shrink-0 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-800"
        >
          Download Report
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-ink-700/20 bg-white p-4">
          <div className="text-sm text-ink-700">Score</div>
          <div className="text-2xl font-semibold">
            {correctCount} / {total}
          </div>
        </div>
        <div className="rounded-lg border border-ink-700/20 bg-white p-4">
          <div className="text-sm text-ink-700">Accuracy</div>
          <div className="text-2xl font-semibold">{accuracy}%</div>
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
        <h2 className="font-medium">Time per Question</h2>
        <p className="text-xs text-ink-700">
          Gold bars are in the slowest 25% for this session; red bars timed out.
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c274022" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "seconds", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, _name, props) => [`${value}s`, props.payload.category]}
                labelFormatter={(label) => `Question ${label}`}
              />
              <Bar dataKey="seconds" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.timedOut ? "#dc2626" : d.slow ? "#b98c3d" : "#2f6f4f"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
        <h2 className="font-medium">Accuracy by Category</h2>
        <ul className="space-y-1 text-sm">
          {[...categoryStats.entries()].map(([category, stat]) => (
            <li key={category} className="flex items-center justify-between border-b border-ink-700/10 py-1 last:border-0">
              <span className="capitalize">{category}</span>
              <span className="text-ink-700">
                {stat.correct}/{stat.total} ({Math.round((stat.correct / stat.total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-lg border border-ink-700/20 bg-white p-4">
        <h2 className="font-medium">Missed &amp; Timed-Out Questions</h2>
        {missed.length === 0 ? (
          <p className="text-sm text-ink-700">No missed questions — nice work.</p>
        ) : (
          <ul className="space-y-3">
            {missed.map((a) => {
              const fq = questionsByKey.get(a.questionId);
              if (!fq) return null;
              const { question } = fq;
              const correctOption = question.options.find((o) => o.id === question.correctOptionId);
              const selectedOption = question.options.find((o) => o.id === a.selectedOptionId);
              return (
                <li key={a.questionId} className="rounded-md border border-ink-700/10 p-3 text-sm">
                  <p className="font-medium">{question.prompt}</p>
                  <p className="mt-1 text-ink-700">
                    {a.timedOut ? "Timed out — no answer given." : `Your answer: ${selectedOption?.text ?? "—"}`}
                  </p>
                  <p className="text-accent">Correct answer: {correctOption?.text}</p>
                  {question.explanation && <p className="mt-1 text-xs text-ink-700">{question.explanation}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex gap-4 text-sm">
        <Link href="/" className="text-accent hover:underline">
          Back to home
        </Link>
        <Link href="/history" className="text-accent hover:underline">
          View history
        </Link>
      </div>
    </main>
  );
}
