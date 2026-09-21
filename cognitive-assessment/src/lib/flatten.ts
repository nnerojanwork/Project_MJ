import type { Question, QuestionSet } from "@/types";

export interface FlatQuestion {
  /** Composite key, unique across every set in a multi-set test run. */
  key: string;
  set: QuestionSet;
  question: Question;
}

export function flattenSets(sets: QuestionSet[]): FlatQuestion[] {
  return sets.flatMap((set) => set.questions.map((question) => ({ key: `${set.id}:${question.id}`, set, question })));
}
