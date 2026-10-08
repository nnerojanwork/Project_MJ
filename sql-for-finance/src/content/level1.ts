import { Level } from "./types";

export const level1: Level = {
  id: "level-1",
  number: 1,
  title: "Core Functions & Filtering",
  objective: "SELECT, WHERE, ORDER BY, LIMIT, scalar functions, and simple aggregates.",
  projects: [
    {
      id: "l1-p1",
      levelId: "level-1",
      title: "First look at the ledger",
      scenario:
        "You've just joined the analytics team at a retail bank. Before building any reports, you need to get comfortable pulling rows out of the raw transactions ledger: picking columns, filtering by date and amount, and ordering results the way a stakeholder would expect to see them.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l1-p1-t1",
          title: "Look at one day",
          prompt: "Select every column for all transactions that happened on 2023-06-15.",
          hints: [
            "You only need a WHERE clause comparing the date column to a literal date string.",
            "SELECT * FROM transactions WHERE date = '<date>';",
            "SELECT * FROM transactions WHERE date = '____';",
          ],
          solutionSql: "SELECT * FROM transactions WHERE date = '2023-06-15';",
          explanation: "This is the basic row-filtering pattern behind almost every ad-hoc data pull an analyst does.",
        },
        {
          id: "l1-p1-t2",
          title: "Q1 spending",
          prompt:
            "A colleague wants a list of Q1 2023 spend. Select transaction_id, date, amount and merchant for all transactions where amount is negative (spend) and the date falls between 2023-01-01 and 2023-03-31 inclusive.",
          hints: [
            "You'll need two conditions joined with AND: one on amount, one on date.",
            "Use BETWEEN for the date range, and amount < 0 for spend.",
            "SELECT transaction_id, date, amount, merchant FROM transactions WHERE amount < 0 AND date BETWEEN '____' AND '____';",
          ],
          solutionSql:
            "SELECT transaction_id, date, amount, merchant FROM transactions WHERE amount < 0 AND date BETWEEN '2023-01-01' AND '2023-03-31';",
          explanation: "Combining range filters like this is exactly how you'd scope a query to a reporting period.",
        },
        {
          id: "l1-p1-t3",
          title: "The 10 biggest movements",
          prompt:
            "Your manager wants the 10 largest transactions by size, regardless of whether they're inflows or outflows. Select transaction_id, date, amount and merchant, ordered so the biggest absolute amount comes first, limited to 10 rows.",
          hints: [
            "Think about ABS() to compare size independent of direction, plus ORDER BY and LIMIT.",
            "ORDER BY ABS(amount) DESC, then LIMIT 10.",
            "SELECT transaction_id, date, amount, merchant FROM transactions ORDER BY ____ DESC LIMIT ____;",
          ],
          solutionSql:
            "SELECT transaction_id, date, amount, merchant FROM transactions ORDER BY ABS(amount) DESC LIMIT 10;",
          preserveOrder: true,
          explanation: "This is the classic 'top N by magnitude' query used in daily large-transaction monitoring reports.",
        },
        {
          id: "l1-p1-t4",
          title: "Biggest travel spend",
          prompt:
            "Narrow the previous idea to one category. Select transaction_id, date, amount and merchant for the 5 largest travel category transactions by absolute amount, largest first.",
          hints: [
            "Filter with WHERE category = 'travel', then apply the same ordering idea as before.",
            "WHERE category = 'travel' ORDER BY ABS(amount) DESC LIMIT 5.",
            "SELECT transaction_id, date, amount, merchant FROM transactions WHERE category = '____' ORDER BY ABS(amount) DESC LIMIT ____;",
          ],
          solutionSql:
            "SELECT transaction_id, date, amount, merchant FROM transactions WHERE category = 'travel' ORDER BY ABS(amount) DESC LIMIT 5;",
          preserveOrder: true,
          explanation: "Category-scoped 'top N' queries like this feed expense-review and fraud-triage workflows.",
        },
      ],
    },
    {
      id: "l1-p2",
      levelId: "level-1",
      title: "Cleaning up for the report",
      scenario:
        "The raw merchant names in the ledger are a mess — mixed case, stray whitespace, inconsistent formatting. Before anything gets reported to stakeholders, you need to normalise the text and pull out date parts for time-based grouping later.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l1-p2-t1",
          title: "Normalise merchant names",
          prompt:
            "For dining category transactions, select transaction_id and a cleaned merchant name (trimmed of whitespace and upper-cased) aliased as merchant_clean.",
          hints: [
            "You need two string functions layered together: one to trim, one to change case.",
            "UPPER(TRIM(merchant)) gives you a clean, comparable value.",
            "SELECT transaction_id, ____(____(merchant)) AS merchant_clean FROM transactions WHERE category = 'dining';",
          ],
          solutionSql:
            "SELECT transaction_id, UPPER(TRIM(merchant)) AS merchant_clean FROM transactions WHERE category = 'dining';",
          explanation: "Normalising free-text fields like this is a prerequisite for any merchant-level spend analysis.",
        },
        {
          id: "l1-p2-t2",
          title: "Pull out year and month",
          prompt:
            "For rent category transactions, select transaction_id, and the year and month of the date column as separate columns aliased year and month (as text, e.g. '2023' and '06').",
          hints: [
            "SQLite's date function family is built around strftime(format, column).",
            "strftime('%Y', date) gives the year; strftime('%m', date) gives the month.",
            "SELECT transaction_id, strftime('____', date) AS year, strftime('____', date) AS month FROM transactions WHERE category = 'rent';",
          ],
          solutionSql:
            "SELECT transaction_id, strftime('%Y', date) AS year, strftime('%m', date) AS month FROM transactions WHERE category = 'rent';",
          explanation: "Deriving year/month from a raw date is the building block for every monthly or annual report you'll write.",
        },
        {
          id: "l1-p2-t3",
          title: "How many distinct grocers",
          prompt:
            "After cleaning, how many distinct merchant names appear in the groceries category? Return one column, distinct_merchants, with the count of distinct cleaned (trimmed, upper-cased) merchant names.",
          hints: [
            "Combine COUNT(DISTINCT ...) with the cleaning expression from task 1.",
            "COUNT(DISTINCT UPPER(TRIM(merchant))) is the whole query, just needs the right WHERE.",
            "SELECT COUNT(DISTINCT ____(____(merchant))) AS distinct_merchants FROM transactions WHERE category = 'groceries';",
          ],
          solutionSql:
            "SELECT COUNT(DISTINCT UPPER(TRIM(merchant))) AS distinct_merchants FROM transactions WHERE category = 'groceries';",
          explanation: "Counting distinct cleaned values tells you whether your normalisation is actually collapsing duplicates correctly.",
        },
      ],
    },
    {
      id: "l1-p3",
      levelId: "level-1",
      title: "Quick totals",
      scenario:
        "Finance has asked for a handful of headline numbers before the weekly stand-up: how many transactions there are, and what the total, average, and extreme values look like for a couple of specific slices.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l1-p3-t1",
          title: "How big is the ledger",
          prompt: "Return the total number of transactions in the table as a single column named total_transactions.",
          hints: [
            "This needs exactly one aggregate function over the whole table.",
            "COUNT(*) counts every row.",
            "SELECT COUNT(*) AS ____ FROM transactions;",
          ],
          solutionSql: "SELECT COUNT(*) AS total_transactions FROM transactions;",
          explanation: "A simple row count like this is often the first sanity check before any deeper analysis.",
        },
        {
          id: "l1-p3-t2",
          title: "Entertainment spend summary",
          prompt:
            "For the entertainment category, return one row with: the count of transactions (txn_count), the total amount (total_amount), the average amount (avg_amount), the minimum amount (min_amount), and the maximum amount (max_amount).",
          hints: [
            "You can put multiple aggregate functions in the same SELECT list.",
            "COUNT(*), SUM(amount), AVG(amount), MIN(amount), MAX(amount) — one WHERE clause covers all of them.",
            "SELECT COUNT(*) AS txn_count, SUM(amount) AS total_amount, AVG(amount) AS avg_amount, MIN(amount) AS min_amount, MAX(amount) AS max_amount FROM transactions WHERE category = '____';",
          ],
          solutionSql:
            "SELECT COUNT(*) AS txn_count, SUM(amount) AS total_amount, AVG(amount) AS avg_amount, MIN(amount) AS min_amount, MAX(amount) AS max_amount FROM transactions WHERE category = 'entertainment';",
          explanation: "This five-number summary pattern is the core of almost every category-level spend report.",
        },
        {
          id: "l1-p3-t3",
          title: "Large March outflows",
          prompt:
            "Return the total value (as total_value) of transactions with an absolute amount greater than 500, dated in March 2023 (2023-03-01 to 2023-03-31).",
          hints: [
            "You need ABS(amount) > 500 combined with a date range, then a single SUM.",
            "WHERE ABS(amount) > 500 AND date BETWEEN '2023-03-01' AND '2023-03-31'.",
            "SELECT SUM(amount) AS total_value FROM transactions WHERE ABS(amount) > ____ AND date BETWEEN '____' AND '____';",
          ],
          solutionSql:
            "SELECT SUM(amount) AS total_value FROM transactions WHERE ABS(amount) > 500 AND date BETWEEN '2023-03-01' AND '2023-03-31';",
          explanation: "Filtered totals like this answer exactly the kind of 'how much did X cost us last month' question stakeholders ask.",
        },
      ],
    },
    {
      id: "l1-p4",
      levelId: "level-1",
      title: "Rounding for money",
      scenario:
        "Raw amounts have long decimal tails that look unprofessional in a report, and stakeholders think in size buckets ('small', 'medium', 'large') rather than exact pounds and pence. You'll clean both up.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l1-p4-t1",
          title: "Round for presentation",
          prompt: "For the utilities category, select transaction_id and amount rounded to 2 decimal places, aliased amount_rounded.",
          hints: [
            "One function call does this: ROUND(value, decimal_places).",
            "ROUND(amount, 2) is the expression you need.",
            "SELECT transaction_id, ROUND(amount, ____) AS amount_rounded FROM transactions WHERE category = 'utilities';",
          ],
          solutionSql: "SELECT transaction_id, ROUND(amount, 2) AS amount_rounded FROM transactions WHERE category = 'utilities';",
          explanation: "Rounding at the presentation layer (not in the source data) keeps downstream calculations precise while reports stay readable.",
        },
        {
          id: "l1-p4-t2",
          title: "Size buckets",
          prompt:
            "For dining category transactions, select transaction_id, amount, and a size_bucket column: 'small' if the absolute amount is under 50, 'medium' if under 200, otherwise 'large'.",
          hints: [
            "This is a CASE WHEN ... THEN ... ELSE ... END expression evaluated top to bottom.",
            "CASE WHEN ABS(amount) < 50 THEN 'small' WHEN ABS(amount) < 200 THEN 'medium' ELSE 'large' END.",
            "SELECT transaction_id, amount, CASE WHEN ABS(amount) < ____ THEN 'small' WHEN ABS(amount) < ____ THEN 'medium' ELSE 'large' END AS size_bucket FROM transactions WHERE category = 'dining';",
          ],
          solutionSql:
            "SELECT transaction_id, amount, CASE WHEN ABS(amount) < 50 THEN 'small' WHEN ABS(amount) < 200 THEN 'medium' ELSE 'large' END AS size_bucket FROM transactions WHERE category = 'dining';",
          explanation: "Bucketing with CASE WHEN is the standard way to turn continuous amounts into categories stakeholders can reason about.",
        },
        {
          id: "l1-p4-t3",
          title: "Rounded and bucketed",
          prompt:
            "Combine both ideas for the travel category: select transaction_id, amount rounded to 2 decimal places (amount_rounded), and the same small/medium/large size_bucket logic as before.",
          hints: [
            "You're selecting three columns: transaction_id plus one ROUND expression and one CASE expression.",
            "Reuse ROUND(amount, 2) and the CASE WHEN ABS(amount) < 50 ... structure together.",
            "SELECT transaction_id, ROUND(amount, 2) AS amount_rounded, CASE WHEN ABS(amount) < 50 THEN 'small' WHEN ABS(amount) < 200 THEN 'medium' ELSE 'large' END AS size_bucket FROM transactions WHERE category = '____';",
          ],
          solutionSql:
            "SELECT transaction_id, ROUND(amount, 2) AS amount_rounded, CASE WHEN ABS(amount) < 50 THEN 'small' WHEN ABS(amount) < 200 THEN 'medium' ELSE 'large' END AS size_bucket FROM transactions WHERE category = 'travel';",
          explanation: "This combination — cleaned numbers plus a readable bucket — is close to what actually ships in an analyst deliverable.",
        },
      ],
    },
  ],
};
