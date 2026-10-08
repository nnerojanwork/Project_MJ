"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LEVEL_TIME_LIMITS, type Level, type QuestionSet, type TestSession, type TestType } from "@/types";
import { generateMathTestPlan } from "@/lib/math-generators";
import { getComprehensionTestPlan } from "@/lib/comprehension";
import { saveSession } from "@/lib/storage";
import { flattenSets, type FlatQuestion } from "@/lib/flatten";
import { DataTable } from "@/components/DataTable";

const SETS_PER_TEST = 5; // 5 sets x 3 questions/set = 15 questions

function isValidType(t: string): t is TestType {
  return t === "math" || t === "comprehension";
}

function isValidLevel(l: string): l is Level {
  return l === "easy" || l === "medium" || l === "hard";
}

type Answer = TestSession["answers"][number];

export default function TestRunnerPage() {
  const params = useParams<{ type: string; level: string }>();
  const router = useRouter();

  const type = params.type;
  const level = params.level;
  const valid = isValidType(type) && isValidLevel(level);
  const timeLimit = valid ? LEVEL_TIME_LIMITS[level as Level] : 0;

  const [sets, setSets] = useState<QuestionSet[] | null>(null);
  const [flatIndex, setFlatIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());
  const startedAt = useRef<number>(Date.now());

  // Pick a fresh plan once, client-side only (avoids SSR/client randomness mismatch).
  useEffect(() => {
    if (!valid) return;
    setSets(type === "math" ? generateMathTestPlan(SETS_PER_TEST) : getComprehensionTestPlan(SETS_PER_TEST));
  }, [valid, type]);

  const flatQuestions: FlatQuestion[] = useMemo(() => (sets ? flattenSets(sets) : []), [sets]);
  const current = flatQuestions[flatIndex] ?? null;

  const advance = useMemo(
    () => (answer: Answer) => {
      if (!current) return;
      const nextAnswers = [...answers, answer];
      if (flatIndex + 1 >= flatQuestions.length) {
        const session: TestSession = {
          id: sessionId.current,
          type: type as TestType,
          level: level as Level,
          setId: (sets ?? []).map((s) => s.id).join(","),
          startedAt: startedAt.current,
          answers: nextAnswers,
        };
        saveSession(session, sets ?? []);
        router.push(`/results/${session.id}`);
        return;
      }
      setAnswers(nextAnswers);
      setFlatIndex((i) => i + 1);
      setSelectedOptionId(null);
      setLocked(false);
      setTimeLeft(timeLimit);
    },
    [answers, current, flatIndex, flatQuestions.length, sets, type, level, timeLimit, router]
  );

  // Per-question countdown.
  useEffect(() => {
    if (!current || locked) return;
    if (timeLeft <= 0) {
      setLocked(true);
      advance({
        questionId: current.key,
        selectedOptionId: null,
        correct: false,
        timeTakenSeconds: timeLimit,
        timedOut: true,
      });
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, current, locked]);

  function selectOption(optionId: string) {
    if (!current || locked) return;
    setLocked(true);
    setSelectedOptionId(optionId);
    const correct = optionId === current.question.correctOptionId;
    const timeTakenSeconds = timeLimit - timeLeft;
    setTimeout(() => {
      advance({ questionId: current.key, selectedOptionId: optionId, correct, timeTakenSeconds, timedOut: false });
    }, 500);
  }

  if (!valid) {
    return <p className="text-sm text-red-700">Invalid test type or level.</p>;
  }

  if (!sets || !current) {
    return <p className="text-sm text-ink-700">Loading test…</p>;
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-700">
            {current.set.title} &middot; {level} &middot; Question {flatIndex + 1} of {flatQuestions.length}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            timeLeft <= 10 ? "bg-red-100 text-red-700" : "bg-ink-900 text-paper"
          }`}
        >
          {timeLeft}s
        </div>
      </header>

      {current.set.dataPack && (
        <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
          <div>
            <h2 className="font-medium">{current.set.dataPack.title}</h2>
            {current.set.dataPack.description && <p className="text-sm text-ink-700">{current.set.dataPack.description}</p>}
          </div>
          <DataTable markdown={current.set.dataPack.table} />
        </section>
      )}

      {current.set.passage && (
        <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
          <h2 className="font-medium">{current.set.passage.title}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-800">{current.set.passage.text}</p>
        </section>
      )}

      <section className="space-y-3 rounded-lg border border-ink-700/20 bg-white p-4">
        <p className="font-medium">{current.question.prompt}</p>
        <div className="grid gap-2">
          {current.question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === current.question.correctOptionId;
            const showFeedback = locked;
            return (
              <button
                key={opt.id}
                onClick={() => selectOption(opt.id)}
                disabled={locked}
                className={`rounded-lg border px-4 py-2 text-left text-sm transition ${
                  showFeedback && isCorrect
                    ? "border-accent bg-accent/10"
                    : showFeedback && isSelected && !isCorrect
                    ? "border-red-400 bg-red-50"
                    : "border-ink-700/20 hover:border-accent"
                } ${locked ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="mr-2 font-medium uppercase text-ink-700">{opt.id}</span>
                {opt.text}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
