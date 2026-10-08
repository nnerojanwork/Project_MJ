"use client";

import Link from "next/link";
import { Level, Project } from "@/content/types";

export function CompletionScreen({
  level,
  project,
  nextProjectId,
}: {
  level: Level;
  project: Project;
  nextProjectId: string | null;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Project complete</div>
      <h1 className="text-2xl font-semibold text-white">{project.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        You've completed every task in this project as part of <span className="text-slate-300">Level {level.number}: {level.title}</span>. The
        techniques here map directly onto the kind of ad-hoc analysis and reporting a junior analyst is asked to produce in their first weeks
        on the job.
      </p>
      <div className="mt-8 flex items-center gap-3">
        {nextProjectId ? (
          <Link href={`/project/${nextProjectId}`} className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light">
            Next project
          </Link>
        ) : (
          <Link href="/levels" className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light">
            Back to curriculum map
          </Link>
        )}
        <Link href="/levels" className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-slate-200">
          Level map
        </Link>
      </div>
    </div>
  );
}
