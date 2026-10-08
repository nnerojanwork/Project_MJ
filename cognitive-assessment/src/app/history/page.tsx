"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TestSession } from "@/types";
import { getAllSessions } from "@/lib/storage";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<TestSession[] | null>(null);

  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm text-ink-700">All practice sessions saved on this device.</p>
      </header>

      {!sessions ? (
        <p className="text-sm text-ink-700">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-ink-700">No sessions yet.</p>
      ) : (
        <ul className="divide-y divide-ink-700/10 rounded-lg border border-ink-700/20 bg-white">
          {sessions.map((s) => {
            const total = s.answers.length;
            const correct = s.answers.filter((a) => a.correct).length;
            const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
            return (
              <li key={s.id}>
                <Link href={`/results/${s.id}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-ink-950/[0.03]">
                  <span className="capitalize">
                    {s.type} &middot; {s.level}
                  </span>
                  <span className="text-ink-700">{new Date(s.startedAt).toLocaleString()}</span>
                  <span className="font-medium">
                    {correct}/{total} ({accuracy}%)
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/" className="text-sm text-accent hover:underline">
        Back to home
      </Link>
    </main>
  );
}
