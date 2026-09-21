"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LEVEL_TIME_LIMITS, type Level, type QuestionSet, type TestSession, type TestType } from "@/types";
import { generateRandomMathSet } from "@/lib/math-generators";
import { getRandomComprehensionSet } from "@/lib/comprehension";
import { saveSession } from "@/lib/storage";
import { DataTable } from "@/components/DataTable";

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

  const [set, setSet] = useState<QuestionSet | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());
  const startedAt = useRef<number>(Date.now());

  // Pick a fresh set once, client-side only (avoids SSR/client randomness mismatch).
  useEffect(() => {
    if (!valid) return;
    setSet(type === "math" ? generateRandomMathSet() : getRandomComprehensionSet());
  }, [valid, type]);

  const currentQuestion = set?.questions[questionIndex] ?? null;

  const advance = useMemo(
    () => (answer: Answer) => {
      if (!set) return;
      const nextAnswers = [...answers, answer];
      if (questionIndex + 1 >= set.questions.length) {
        const session: TestSession = {
          id: sessionId.current,
          type: type as TestType,
          level: level as Level,
          setId: set.id,
          startedAt: startedAt.current,
          answers: nextAnswers,
        };
        saveSession(session, set);
        router.push(`/results/${session.id}`);
        return;
      }
      setAnswers(nextAnswers);
      setQuestionIndex((i) => i + 1);
      setSelectedOptionId(null);
      setLocked(false);
      setTimeLeft(timeLimit);
    },
    [answers, set, questionIndex, type, level, timeLimit, router]
  );

  // Per-question countdown.
  useEffect(() => {
    if (!currentQuestion || locked) return;
    if (timeLeft <= 0) {
      setLocked(true);
      advance({
        questionId: currentQuestion.id,
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
  }, [timeLeft, currentQuestion, locked]);

  function selectOption(optionId: string) {
    if (!currentQuestion || locked) return;
    setLocked(true);
    setSelectedOptionId(optionId);
    const correct = optionId === currentQuestion.correctOptionId;
    const timeTakenSeconds = timeLimit - timeLeft;
    setTimeout(() => {
      advance({ questionId: currentQuestion.id, selectedOptionId: optionId, correct, timeTakenSeconds, timedOut: false });
    }, 500);
  }

  if (!valid) {
    return <p className="text-sm text-red-700">Invalid test type or level.</p>;
  }

  if (!set || !currentQuestion) {
    return <p className="text-sm text-ink-700">Loading test…</p>;
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-700">
            {set.title} &middot; {level} &middot; Question {questionIndex + 1} of {set.questions.length}
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

      {set.dataPack && (
        <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
          <div>
            <h2 className="font-medium">{set.dataPack.title}</h2>
            {set.dataPack.description && <p className="text-sm text-ink-700">{set.dataPack.description}</p>}
          </div>
          <DataTable markdown={set.dataPack.table} />
        </section>
      )}

      {set.passage && (
        <section className="space-y-2 rounded-lg border border-ink-700/20 bg-white p-4">
          <h2 className="font-medium">{set.passage.title}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-800">{set.passage.text}</p>
        </section>
      )}

      <section className="space-y-3 rounded-lg border border-ink-700/20 bg-white p-4">
        <p className="font-medium">{currentQuestion.prompt}</p>
        <div className="grid gap-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === currentQuestion.correctOptionId;
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
