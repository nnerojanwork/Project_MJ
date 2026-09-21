import type { QuestionSet, TestSession } from "@/types";

const SESSIONS_KEY = "cog-assessment:sessions";
// Math sets are regenerated with fresh random numbers on every play, so the exact
// questions/options/correct answers shown to the user only exist at play time.
// We snapshot the played set here so the results page can review it later.
const SET_SNAPSHOTS_KEY = "cog-assessment:set-snapshots";

function readJSON<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSession(session: TestSession, playedSet: QuestionSet): void {
  const sessions = readJSON<TestSession>(SESSIONS_KEY);
  sessions[session.id] = session;
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

  const snapshots = readJSON<QuestionSet>(SET_SNAPSHOTS_KEY);
  snapshots[session.id] = playedSet;
  window.localStorage.setItem(SET_SNAPSHOTS_KEY, JSON.stringify(snapshots));
}

export function getSession(id: string): TestSession | null {
  return readJSON<TestSession>(SESSIONS_KEY)[id] ?? null;
}

export function getSessionSet(id: string): QuestionSet | null {
  return readJSON<QuestionSet>(SET_SNAPSHOTS_KEY)[id] ?? null;
}

export function getAllSessions(): TestSession[] {
  return Object.values(readJSON<TestSession>(SESSIONS_KEY)).sort((a, b) => b.startedAt - a.startedAt);
}
