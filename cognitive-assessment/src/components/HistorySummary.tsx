"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TestSession } from "@/types";
import { getAllSessions } from "@/lib/storage";

export function HistorySummary() {
  const [sessions, setSessions] = useState<TestSession[] | null>(null);

  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  if (!sessions || sessions.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Sessions</h2>
        <Link href="/history" className="text-sm text-accent hover:underline">
          View all
        </Link>
      </div>
      <ul className="divide-y divide-ink-700/10 rounded-lg border border-ink-700/20 bg-white">
        {sessions.slice(0, 5).map((s) => {
          const correct = s.answers.filter((a) => a.correct).length;
          return (
            <li key={s.id}>
              <Link href={`/results/${s.id}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-ink-950/[0.03]">
                <span className="capitalize">
                  {s.type} &middot; {s.level}
                </span>
                <span className="text-ink-700">{new Date(s.startedAt).toLocaleDateString()}</span>
                <span className="font-medium">
                  {correct}/{s.answers.length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
