// Shapes of syllabus.json (verbatim source) and generated.json (AI-generated).
// Edit the JSON files freely; keep IDs stable so saved progress still matches.

export interface IdText {
  id: string
  text: string
}

export interface Resource {
  title: string
  url: string
  note: string
}

export interface Week {
  week: number
  id: string
  title: string
  programMapOutput: string | null
  outcome: string
  coreConcepts: IdText[]
  researchQuestions: IdText[]
  resources: Resource[]
  appliedExercise: string
  portfolioOutput: string
  selfCheck: IdText[]
}

export interface Formula {
  id: string
  measure: string
  calculation: string
  interpretation: string
}

export interface Syllabus {
  meta: { source: string; note: string }
  program: {
    label: string
    title: string
    subtitle: string
    intro: string
    facts: { label: string; value: string }[]
    howToUse: string[]
  }
  learningOutcomes: { intro: string; items: string[] }
  programMap: { week: number; subject: string; output: string }[]
  weeklyRhythm: { activity: string; time: string; whatToDo: string }[]
  studySetup: string[]
  weeks: Week[]
  capstone: {
    structure: { number: number; section: string; requiredContent: string }[]
    scoringGuide: {
      areas: { area: string; points: number; evidence: string }[]
      passingStandard: string
    }
  }
  formulaReference: { intro: string; formulas: Formula[] }
  minimumDataset: { intro: string; groups: { group: string; fields: string[] }[] }
  dataQualityChecks: string[]
  researchLogTemplate: { intro: string; columns: string[] }
  reflectionTemplate: { prompts: { id: string; prompt: string }[] }
  readingList: {
    intro: string
    books: { text: string; title?: string; authors?: string }[]
    coursesAndOrganizations: Resource[]
  }
  completionStandard: string
}

export interface WorkedExample {
  setup: string
  steps: string[]
  result: string
}

export interface QuizQuestionBase {
  id: string
  conceptIds: string[]
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface McqQuestion extends QuizQuestionBase {
  type: 'mcq'
}

export interface CalcQuestion extends QuizQuestionBase {
  type: 'calc'
  answer: number
  unit: string
  decimals: number
}

export type QuizQuestion = McqQuestion | CalcQuestion

export interface Flashcard {
  id: string
  kind: 'formula' | 'term'
  week: number
  formulaId?: string
  front: string
  back: string
}

export interface ExplainCard {
  id: string
  week: number
  conceptIds: string[]
  prompt: string
  answer: string
}

export interface Generated {
  meta: { label: string; note: string; priceConvention: string }
  case: { name: string; summary: string; assumptions: string[] }
  concepts: Record<string, { explainer: string; example: WorkedExample | null }>
  quiz: Record<string, QuizQuestion[]>
  flashcards: Flashcard[]
  explainCards: ExplainCard[]
  formulaNotes: Record<string, { interpretation: string; example: string }>
}
