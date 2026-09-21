# Cognitive Assessment Practice

Practice tool for SHL/Schroders-style job cognitive assessments: numerical reasoning (data tables) and verbal comprehension (passages), timed per question.

## Stack

Next.js (App Router, TypeScript) + Tailwind CSS. No backend — sessions persist to `localStorage` in the browser.

## Development

```bash
npm install
npm run dev
```

## Math generators

`math-sets.json` (static, fixed numbers) has been replaced by `src/lib/math-generators.ts`: one generator per topic that redraws random-but-realistic figures each time a set is played, recomputes the data table and every question's correct answer, and generates plausible wrong-answer distractors (wrong base for a % change, off-by-one averaging, wrong row/column, etc.).

Verify the generators (100 runs each, checks option distinctness, configured-range compliance, and answer correctness re-derived from the generated table):

```bash
npm run sanity-check
```

Comprehension sets (`src/data/comprehension-sets.json`) are static and unchanged.

## Deploying

No extra configuration needed — connect the `cognitive-assessment` directory as the project root on Vercel, or run `vercel deploy` from inside it.
