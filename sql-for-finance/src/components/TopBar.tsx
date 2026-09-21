"use client";

import Link from "next/link";
import { Level, Project } from "@/content/types";

export function TopBar({
  level,
  project,
  taskIndex,
  totalTasks,
}: {
  level: Level;
  project: Project;
  taskIndex: number;
  totalTasks: number;
}) {
  const progressPct = Math.min(100, Math.round(((taskIndex + (taskIndex >= totalTasks ? 1 : 0)) / totalTasks) * 100));
  const displayTaskNum = Math.min(taskIndex + 1, totalTasks);

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink-700 bg-ink-900/80 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3 overflow-hidden">
        <Link href="/levels" className="shrink-0 text-xs text-slate-500 hover:text-slate-300">
          &larr; Levels
        </Link>
        <div className="h-4 w-px shrink-0 bg-ink-700" />
        <div className="truncate">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Level {level.number}</span>
          <span className="mx-1.5 text-slate-600">/</span>
          <span className="truncate text-sm font-medium text-slate-200">{project.title}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="whitespace-nowrap text-xs text-slate-400">
          Task {displayTaskNum} of {totalTasks}
        </span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </header>
  );
}
