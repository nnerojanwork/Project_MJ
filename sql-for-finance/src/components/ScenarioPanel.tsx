"use client";

import { Project, Task } from "@/content/types";

export function ScenarioPanel({
  project,
  currentTaskIndex,
  completedTaskIds,
}: {
  project: Project;
  currentTaskIndex: number;
  completedTaskIds: Set<string>;
}) {
  return (
    <div className="scrollbar-thin flex h-full flex-col overflow-y-auto px-5 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scenario</h3>
      <h2 className="mt-2 text-lg font-semibold text-white">{project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.scenario}</p>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Tasks</h3>
      <ol className="mt-2 flex flex-col gap-2">
        {project.tasks.map((task: Task, i: number) => {
          const isCurrent = i === currentTaskIndex;
          const isDone = completedTaskIds.has(task.id);
          return (
            <li
              key={task.id}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                isCurrent
                  ? "border-accent-light/60 bg-accent/10"
                  : isDone
                  ? "border-ink-700 bg-ink-900/40"
                  : "border-ink-800 bg-ink-950/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    isDone ? "bg-accent text-white" : isCurrent ? "border border-accent-light text-accent-light" : "border border-slate-700 text-slate-500"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <div>
                  <div className={`font-medium ${isCurrent ? "text-white" : "text-slate-300"}`}>{task.title}</div>
                  {isCurrent && <div className="mt-1 text-xs leading-relaxed text-slate-400">{task.prompt}</div>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
