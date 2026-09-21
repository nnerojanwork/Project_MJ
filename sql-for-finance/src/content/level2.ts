import { Level } from "./types";

export const level2: Level = {
  id: "level-2",
  number: 2,
  title: "Grouping & Conditional Aggregation",
  objective: "GROUP BY, HAVING, and CASE WHEN inside aggregates.",
  projects: [
    {
      id: "l2-p1",
      levelId: "level-2",
      title: "Spend by category",
      scenario:
        "The head of retail banking wants a one-page breakdown of where customer money is going, by category — not just a single total, but a table she can scan in seconds.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l2-p1-t1",
          title: "Totals per category",
          prompt:
            "For every category, return category, total spend as total_amount (SUM of amount), and count of transactions as txn_count, ordered by total_amount ascending (most negative / biggest spend first).",
          hints: [
            "GROUP BY collapses the table into one row per distinct category value.",
            "GROUP BY category, then SUM(amount) and COUNT(*) per group.",
            "SELECT category, SUM(amount) AS total_amount, COUNT(*) AS txn_count FROM transactions GROUP BY ____ ORDER BY total_amount ____;",
          ],
          solutionSql:
            "SELECT category, SUM(amount) AS total_amount, COUNT(*) AS txn_count FROM transactions GROUP BY category ORDER BY total_amount ASC;",
          preserveOrder: true,
          explanation: "GROUP BY + ORDER BY is the backbone of every 'spend by X' report you'll ever build.",
        },
        {
          id: "l2-p1-t2",
          title: "Average ticket by channel",
          prompt: "For every channel, return channel and the average transaction amount as avg_amount.",
          hints: [
            "Same shape as before, just grouping on a different column.",
            "GROUP BY channel, aggregate with AVG(amount).",
            "SELECT channel, AVG(amount) AS avg_amount FROM transactions GROUP BY ____;",
          ],
          solutionSql: "SELECT channel, AVG(amount) AS avg_amount FROM transactions GROUP BY channel;",
          explanation: "Average-per-segment queries like this reveal behavioural differences (e.g. card vs. direct debit spend patterns).",
        },
      ],
    },
    {
      id: "l2-p2",
      levelId: "level-2",
      title: "Which months mattered",
      scenario:
        "You need to find months where spend in a category was unusually high, to flag for the monthly business review — not every month, just the ones that crossed a threshold.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l2-p2-t1",
          title: "Monthly totals",
          prompt:
            "For the groceries category, return year_month (format 'YYYY-MM', derived from date) and total spend as total_amount, one row per month, ordered by year_month ascending.",
          hints: [
            "Derive the grouping key with strftime('%Y-%m', date), then group by that same expression.",
            "You can GROUP BY an expression, not just a column name.",
            "SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY ____ ORDER BY year_month ____;",
          ],
          solutionSql:
            "SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY strftime('%Y-%m', date) ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "Grouping by a derived date expression is exactly how monthly trend reports are built from raw transaction data.",
        },
        {
          id: "l2-p2-t2",
          title: "Months above threshold",
          prompt:
            "Using the same monthly groceries totals, return only the months (year_month, total_amount) where the absolute total spend exceeds 15000, ordered by year_month ascending.",
          hints: [
            "You can't filter on an aggregate with WHERE — you need a clause that runs after grouping.",
            "HAVING ABS(SUM(amount)) > 15000 applies the threshold post-aggregation.",
            "SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY strftime('%Y-%m', date) HAVING ____ > 15000 ORDER BY year_month ASC;",
          ],
          solutionSql:
            "SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY strftime('%Y-%m', date) HAVING ABS(SUM(amount)) > 15000 ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "HAVING is the WHERE clause for aggregated results — essential for any 'flag the outlier groups' task.",
        },
      ],
    },
    {
      id: "l2-p3",
      levelId: "level-2",
      title: "Conditional aggregation",
      scenario:
        "Ops wants a single-query pivot: for each channel, how many transactions were 'large' (over £200 absolute) versus everything else — without running two separate queries.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l2-p3-t1",
          title: "Flagged vs. not, per channel",
          prompt:
            "For every channel, return channel, the count of transactions with absolute amount over 200 as large_count, and the count of all other transactions as other_count.",
          hints: [
            "You can put a CASE WHEN inside COUNT() or SUM() to count conditionally within a group.",
            "SUM(CASE WHEN condition THEN 1 ELSE 0 END) counts rows matching condition, per group.",
            "SELECT channel, SUM(CASE WHEN ABS(amount) > 200 THEN 1 ELSE 0 END) AS large_count, SUM(CASE WHEN ABS(amount) <= 200 THEN 1 ELSE 0 END) AS other_count FROM transactions GROUP BY ____;",
          ],
          solutionSql:
            "SELECT channel, SUM(CASE WHEN ABS(amount) > 200 THEN 1 ELSE 0 END) AS large_count, SUM(CASE WHEN ABS(amount) <= 200 THEN 1 ELSE 0 END) AS other_count FROM transactions GROUP BY channel;",
          explanation: "SUM(CASE WHEN ...) is the single most useful pattern for building pivot-style summaries in one pass over the data.",
        },
        {
          id: "l2-p3-t2",
          title: "Net position by category",
          prompt:
            "For every category, return category, total inflows as inflow (SUM of amounts where amount > 0), and total outflows as outflow (SUM of amounts where amount < 0).",
          hints: [
            "Same conditional-sum idea, but summing the amount itself rather than counting 1s.",
            "SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) for inflow, mirrored for outflow.",
            "SELECT category, SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS inflow, SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS outflow FROM transactions GROUP BY ____;",
          ],
          solutionSql:
            "SELECT category, SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS inflow, SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS outflow FROM transactions GROUP BY category;",
          explanation: "This pattern turns a single signed 'amount' column into the separate inflow/outflow view every finance report actually needs.",
        },
      ],
    },
  ],
};
