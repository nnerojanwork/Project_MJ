"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LEVELS } from "@/content";
import { useProgressStore } from "@/lib/progressStore";

export default function LandingPage() {
  const projects = useProgressStore((s) => s.projects);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const flatProjects = LEVELS.flatMap((l) => l.projects.map((p) => ({ ...p, levelNumber: l.number })));
  const inProgress = flatProjects.find((p) => projects[p.id]?.status === "in_progress");
  const firstIncomplete = flatProjects.find((p) => projects[p.id]?.status !== "complete");
  const continueProject = inProgress ?? firstIncomplete;
  const hasProgress = hydrated && Object.keys(projects).length > 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Analyst training</div>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">SQL for Finance</h1>
      <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-300">
        Learn SQL from complete first principles to the standard expected of a junior financial analyst — through real
        banking, lending and markets scenarios, not abstract exercises. Every query runs against a live in-browser
        database. No signup, no setup.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        {hasProgress && continueProject ? (
          <Link
            href={`/project/${continueProject.id}`}
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-light"
          >
            Continue: {continueProject.title}
          </Link>
        ) : (
          <Link
            href={`/project/${LEVELS[0].projects[0].id}`}
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-light"
          >
            Start Level 1
          </Link>
        )}
        <Link href="/levels" className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-slate-200">
          View the full curriculum map
        </Link>
      </div>

      <div className="mt-16 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {LEVELS.map((level) => (
          <div key={level.id} className="rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-3 text-left">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Level {level.number}</div>
            <div className="mt-1 text-sm font-medium text-slate-200">{level.title}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
