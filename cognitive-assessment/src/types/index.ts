// Shared schema for the cognitive-assessment practice app.
// Two question types: 'math' (numerical reasoning) and 'comprehension' (verbal reasoning).

export type TestType = 'math' | 'comprehension';

export type Level = 'easy' | 'medium' | 'hard';

export const LEVEL_TIME_LIMITS: Record<Level, number> = {
  easy: 105,   // seconds per question
  medium: 70,
  hard: 45,
};

export interface MCQOption {
  id: string;      // 'a' | 'b' | 'c' | 'd'
  text: string;
}

export interface Question {
  id: string;               // unique within the set, e.g. 'q1'
  prompt: string;
  options: MCQOption[];     // always 4 options
  correctOptionId: string;  // must match one option's id
  category: string;         // e.g. 'percentages', 'inference', 'main-idea'
  explanation?: string;     // plain-English rationale for the correct answer, shown in the downloadable report
}

// For math sets: one reference table/data pack the user "flicks through"
// before answering the questions tied to it.
export interface DataPack {
  title: string;
  description?: string;    // one-line context for the table
  table: string;           // markdown table
}

// For comprehension sets: one passage the user reads before answering.
export interface Passage {
  title: string;
  text: string;
}

export interface QuestionSet {
  id: string;               // e.g. 'math-01', 'comp-07'
  type: TestType;
  title: string;             // topic label shown in the set picker
  dataPack?: DataPack;       // present when type === 'math'
  passage?: Passage;         // present when type === 'comprehension'
  questions: Question[];
}

export interface TestSession {
  id: string;
  type: TestType;
  level: Level;
  setId: string;
  startedAt: number;
  answers: {
    questionId: string;
    selectedOptionId: string | null; // null = timed out, no answer given
    correct: boolean;
    timeTakenSeconds: number;
    timedOut: boolean;
  }[];
}
