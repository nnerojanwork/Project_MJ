"use client";

import { useEffect, useMemo, useState } from "react";
import { Level, Project } from "@/content/types";
import { getAdjacentProject } from "@/content";
import { TopBar } from "./TopBar";
import { ScenarioPanel } from "./ScenarioPanel";
import { SchemaPanel } from "./SchemaPanel";
import { EditorPanel } from "./EditorPanel";
import { FeedbackPanel } from "./FeedbackPanel";
import { ResultsTable } from "./ResultsTable";
import { CompletionScreen } from "./CompletionScreen";
import { isQueryError, QueryError, QueryResult, runQuery } from "@/lib/sqlEngine";
import { compareResults, CheckOutcome } from "@/lib/compare";
import { useProgressStore } from "@/lib/progressStore";

export function ProjectWorkspace({ level, project }: { level: Level; project: Project }) {
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const useHintAction = useProgressStore((s) => s.useHint);
  const revealSolutionAction = useProgressStore((s) => s.revealSolution);
  const advanceTask = useProgressStore((s) => s.advanceTask);
  const projectProgress = useProgressStore((s) => s.projects[project.id]);
  const getTaskProgress = useProgressStore((s) => s.getTask);

  const totalTasks = project.tasks.length;
  const storedTaskIndex = projectProgress?.currentTaskIndex ?? 0;
  const [taskIndex, setTaskIndex] = useState(Math.min(storedTaskIndex, totalTasks - 1));
  const [query, setQuery] = useState("");
  const [runResult, setRunResult] = useState<QueryResult | QueryError | null>(null);
  const [checkOutcome, setCheckOutcome] = useState<CheckOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(projectProgress?.status === "complete");

  const task = project.tasks[taskIndex];
  const taskProgress = getTaskProgress(project.id, task?.id ?? "");
  const completedTaskIds = useMemo(
    () => new Set(Object.entries(projectProgress?.tasks ?? {}).filter(([, t]) => t.passed).map(([id]) => id)),
    [projectProgress]
  );

  const { nextId: nextProjectId } = getAdjacentProject(project.id);

  useEffect(() => {
    setQuery(taskProgress.lastQuery || "");
    setRunResult(null);
    setCheckOutcome(taskProgress.passed ? { pass: true } : null);
  }, [task?.id]);

  useEffect(() => {
    // Reset workspace state when navigating to a different project entirely.
    setTaskIndex(Math.min(storedTaskIndex, totalTasks - 1));
    setShowCompletion(false);
  }, [project.id]);

  async function handleRun() {
    setRunning(true);
    setCheckOutcome(null);
    const res = await runQuery(query);
    setRunResult(res);
    setRunning(false);
  }

  async function handleCheck() {
    if (!task) return;
    setRunning(true);
    const [actual, expected] = await Promise.all([runQuery(query), runQuery(task.solutionSql)]);
    setRunResult(actual);

    if (isQueryError(actual)) {
      setCheckOutcome(null);
      recordAttempt(project.id, task.id, query, false);
      setRunning(false);
      return;
    }
    if (isQueryError(expected)) {
      setRunning(false);
      return;
    }

    const outcome = compareResults(actual, expected, !!task.preserveOrder);
    setCheckOutcome(outcome);
    recordAttempt(project.id, task.id, query, outcome.pass);
    setRunning(false);
  }

  function handleNextTask() {
    const next = taskIndex + 1;
    advanceTask(project.id, next, totalTasks);
    if (next >= totalTasks) {
      setShowCompletion(true);
    } else {
      setTaskIndex(next);
    }
  }

  const errorMessage = runResult && isQueryError(runResult) ? runResult.error : null;

  if (showCompletion) {
    return (
      <div className="flex h-screen flex-col">
        <TopBar level={level} project={project} taskIndex={totalTasks} totalTasks={totalTasks} />
        <div className="flex-1 overflow-hidden">
          <CompletionScreen level={level} project={project} nextProjectId={nextProjectId} />
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="flex h-screen flex-col">
      <TopBar level={level} project={project} taskIndex={taskIndex} totalTasks={totalTasks} />
      <div className="scrollbar-thin grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[260px_1fr_340px] md:grid-rows-1 md:overflow-hidden">
        <div className="border-b border-ink-700 bg-ink-900/40 md:h-full md:border-b-0 md:border-r md:overflow-hidden">
          <ScenarioPanel project={project} currentTaskIndex={taskIndex} completedTaskIds={completedTaskIds} />
        </div>

        <div className="flex flex-col md:h-full md:min-h-0 md:flex-row">
          <div className="h-80 shrink-0 border-b border-ink-700 md:h-full md:flex-1 md:border-b-0 md:border-r">
            <EditorPanel value={query} onChange={setQuery} onRun={handleRun} onCheck={handleCheck} running={running} />
          </div>
          <div className="scrollbar-thin h-64 shrink-0 overflow-y-auto bg-ink-950/40 px-4 py-4 md:h-full md:max-w-sm md:flex-1">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Results</h3>
            {!runResult && <p className="text-xs text-slate-500">Run your query to see results here.</p>}
            {runResult && !isQueryError(runResult) && <ResultsTable result={runResult} />}
            {runResult && isQueryError(runResult) && (
              <div className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                <div className="font-semibold">SQL error</div>
                <div className="mt-1 font-mono">{runResult.error}</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-ink-700 bg-ink-900/40 md:h-full md:overflow-y-auto md:border-l md:border-t-0">
          <div className="border-b border-ink-700">
            <SchemaPanel tables={project.tables} />
          </div>
          <FeedbackPanel
            task={task}
            checkOutcome={checkOutcome}
            taskProgress={taskProgress}
            onUseHint={() => useHintAction(project.id, task.id)}
            onRevealSolution={() => revealSolutionAction(project.id, task.id)}
            onNextTask={handleNextTask}
            isLastTask={taskIndex === totalTasks - 1}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  );
}
