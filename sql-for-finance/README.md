# SQL for Finance

An interactive, project-based SQL curriculum for aspiring financial analysts — from `SELECT` basics
to window functions, CTEs, and multi-step capstone deliverables. Runs entirely client-side: SQLite
(via [sql.js](https://github.com/sql-js/sql.js), compiled to WebAssembly) executes queries directly in
the browser against a pre-generated synthetic banking dataset. No backend, no auth, no API routes.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- sql.js for in-browser SQLite
- Monaco Editor for the SQL input
- Zustand + localStorage for progress persistence

## Getting started

```bash
npm install
npm run seed   # generates public/data/finance.sqlite from scratch
npm run dev
```

Open http://localhost:3000.

## Regenerating or extending the dataset

`scripts/seed.ts` generates all seed data (customers, accounts, transactions, loans, stock prices,
portfolios, holdings) with a fixed random seed for reproducibility, and writes `public/data/finance.sqlite`
plus the sql.js wasm binaries needed at runtime. Re-run `npm run seed` any time you change the generation
logic.

## Adding curriculum content

Each level's scenarios, tasks, hints and solutions live in `src/content/level{1-6}.ts` as plain TypeScript
objects (see `src/content/types.ts`). Answer checking works by running the task's `solutionSql` against
the live database at check-time and comparing it to the learner's result set (`src/lib/compare.ts`) — so
adding a new task only requires a scenario, prompt, three hints, and a correct solution query; no need to
hand-author expected result JSON.

## Deploying

Zero-config on Vercel — connect the repo (or the `sql-for-finance` directory as the project root) and
deploy. There are no environment variables or server-side secrets required.
