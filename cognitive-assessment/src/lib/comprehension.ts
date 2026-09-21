import type { QuestionSet } from "@/types";
import comprehensionSets from "@/data/comprehension-sets.json";

const SETS = comprehensionSets as unknown as QuestionSet[];

export function getComprehensionSet(id: string): QuestionSet {
  const set = SETS.find((s) => s.id === id);
  if (!set) throw new Error(`Unknown comprehension set id: ${id}`);
  return set;
}

export function getRandomComprehensionSet(): QuestionSet {
  return SETS[Math.floor(Math.random() * SETS.length)];
}

export const COMPREHENSION_SET_IDS = SETS.map((s) => s.id);
