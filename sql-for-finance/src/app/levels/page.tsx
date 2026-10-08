"use client";

import Link from "next/link";
import { LEVELS } from "@/content";
import { useProgressStore } from "@/lib/progressStore";

export default function LevelMapPage() {
  const isProjectComplete = useProgressStore((s) => s.isProjectComplete);
  const projects = useProgressStore((s) => s.projects);

  let previousLevelDone = true;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-14">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
            &larr; Home
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Curriculum map</h1>
          <p className="mt-1 text-sm text-slate-400">Six levels, each building on the last. Complete a level's projects to unlock the next.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {LEVELS.map((level) => {
          const completedCount = level.projects.filter((p) => isProjectComplete(p.id, p.tasks.length)).length;
          const totalCount = level.projects.length;
          const unlocked = previousLevelDone;
          const levelDone = completedCount === totalCount;
          previousLevelDone = levelDone;

          return (
            <section
              key={level.id}
              className={`rounded-xl border px-6 py-5 ${
                unlocked ? "border-ink-700 bg-ink-900/60" : "border-ink-800 bg-ink-900/20 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gold">Level {level.number}</div>
                  <h2 className="mt-1 text-lg font-semibold text-white">{level.title}</h2>
                  <p className="mt-1 max-w-xl text-sm text-slate-400">{level.objective}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-medium text-slate-200">
                    {completedCount} / {totalCount}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">projects</div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {level.projects.map((project) => {
                  const status = isProjectComplete(project.id, project.tasks.length)
                    ? "complete"
                    : projects[project.id]?.status === "in_progress"
                    ? "in_progress"
                    : "not_started";
                  return (
                    <Link
                      key={project.id}
                      href={unlocked ? `/project/${project.id}` : "#"}
                      aria-disabled={!unlocked}
                      className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition ${
                        unlocked
                          ? "border-ink-700 bg-ink-950/60 hover:border-accent-light hover:bg-ink-800"
                          : "pointer-events-none border-ink-800 bg-ink-950/30"
                      }`}
                    >
                      <span className="text-slate-200">{project.title}</span>
                      <StatusBadge status={status} />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: "complete" | "in_progress" | "not_started" }) {
  if (status === "complete") {
    return <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-light">Done</span>;
  }
  if (status === "in_progress") {
    return <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">In progress</span>;
  }
  return <span className="rounded-full bg-ink-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Not started</span>;
}
