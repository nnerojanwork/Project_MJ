"use client";

import { Task } from "@/content/types";
import { CheckOutcome } from "@/lib/compare";
import { TaskProgress } from "@/lib/progressStore";

interface Props {
  task: Task;
  checkOutcome: CheckOutcome | null;
  taskProgress: TaskProgress;
  onUseHint: () => void;
  onRevealSolution: () => void;
  onNextTask: () => void;
  isLastTask: boolean;
  errorMessage: string | null;
}

export function FeedbackPanel({ task, checkOutcome, taskProgress, onUseHint, onRevealSolution, onNextTask, isLastTask, errorMessage }: Props) {
  const hintsUsed = taskProgress.hintsUsed;
  const canRevealSolution = taskProgress.attempts >= 3 || hintsUsed >= 3;
  const passed = checkOutcome?.pass === true;

  return (
    <div className="scrollbar-thin flex h-full flex-col gap-4 overflow-y-auto px-4 py-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Feedback</h3>

        {errorMessage && (
          <div className="mt-2 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            <div className="font-semibold">Query error</div>
            <div className="mt-1 font-mono">{errorMessage}</div>
          </div>
        )}

        {!errorMessage && checkOutcome && (
          <div
            className={`mt-2 rounded-md border px-3 py-2.5 text-sm ${
              passed ? "border-accent-light/50 bg-accent/10 text-accent-light" : "border-gold/40 bg-gold/10 text-gold"
            }`}
          >
            {passed ? (
              <div>
                <div className="font-semibold text-white">Correct</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{task.explanation}</p>
              </div>
            ) : (
              <div>
                <div className="font-semibold">Not quite</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{describeFailure(checkOutcome)}</p>
              </div>
            )}
          </div>
        )}

        {!errorMessage && !checkOutcome && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Write a query for the current task, then press <span className="text-slate-300">Check Answer</span>.
          </p>
        )}
      </div>

      {passed ? (
        <button
          onClick={onNextTask}
          className="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-light"
        >
          {isLastTask ? "Finish project" : "Next task"}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hints ({hintsUsed}/3)</h4>
              {hintsUsed < 3 && (
                <button onClick={onUseHint} className="text-xs font-medium text-accent-light hover:text-accent">
                  Reveal next hint
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {task.hints.slice(0, hintsUsed).map((hint, i) => (
                <div key={i} className="rounded-md border border-ink-700 bg-ink-900/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
                  <span className="mr-1.5 font-semibold text-slate-500">{i + 1}.</span>
                  {i === 2 ? <code className="font-mono text-slate-200">{hint}</code> : hint}
                </div>
              ))}
              {hintsUsed === 0 && <p className="text-xs text-slate-600">No hints revealed yet.</p>}
            </div>
          </div>

          {canRevealSolution && (
            <div>
              {!taskProgress.solutionRevealed ? (
                <button onClick={onRevealSolution} className="text-xs font-medium text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-slate-200">
                  Show full solution
                </button>
              ) : (
                <div className="rounded-md border border-ink-700 bg-ink-950 px-3 py-2">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Solution</div>
                  <pre className="scrollbar-thin overflow-x-auto whitespace-pre-wrap font-mono text-xs text-slate-300">{task.solutionSql}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function describeFailure(outcome: CheckOutcome): string {
  if (outcome.pass) return "";
  switch (outcome.reason) {
    case "empty":
      return "Your query returned 0 rows, but the expected result has rows — check your WHERE clause and joins.";
    case "column_count":
      return `Expected ${outcome.expectedColumns} column(s) in the result, your query returned ${outcome.actualColumns}. Check your SELECT list.`;
    case "row_count":
      return `Expected ${outcome.expectedRows} row(s), your query returned ${outcome.actualRows}. Check your GROUP BY, WHERE, or JOIN conditions.`;
    case "value_mismatch":
      return "Your query returns the right shape, but some values don't match what's expected. Double check your filters, aggregates, or expressions.";
    default:
      return "That's not quite right yet.";
  }
}
