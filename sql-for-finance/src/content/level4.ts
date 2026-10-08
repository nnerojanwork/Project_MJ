import { Level } from "./types";

export const level4: Level = {
  id: "level-4",
  number: 4,
  title: "Window Functions & Time-Series Analytics",
  objective: "RANK/DENSE_RANK/ROW_NUMBER, LAG/LEAD, running totals, and moving averages.",
  projects: [
    {
      id: "l4-p1",
      levelId: "level-4",
      title: "Ranking customers by value",
      scenario:
        "Relationship managers want to know, within each customer segment, who their most valuable customers are by total account balance — without losing the segment breakdown by sorting the whole bank into one list.",
      tables: ["customers", "accounts"],
      tasks: [
        {
          id: "l4-p1-t1",
          title: "Rank within segment",
          prompt:
            "First build each customer's total balance across all their accounts, joined to their segment. Then return customer_id, segment, total_balance, and a rank column (as balance_rank) using RANK() ordered by total_balance descending, restarting within each segment.",
          hints: [
            "Pre-aggregate accounts by customer_id first (a CTE works well), then join to customers to get segment.",
            "RANK() OVER (PARTITION BY segment ORDER BY total_balance DESC) gives you a per-segment ranking.",
            "WITH balances AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id) SELECT c.customer_id, c.segment, b.total_balance, RANK() OVER (PARTITION BY ____ ORDER BY ____ DESC) AS balance_rank FROM balances b JOIN customers c ON b.customer_id = c.customer_id;",
          ],
          solutionSql:
            "WITH balances AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id) SELECT c.customer_id, c.segment, b.total_balance, RANK() OVER (PARTITION BY c.segment ORDER BY b.total_balance DESC) AS balance_rank FROM balances b JOIN customers c ON b.customer_id = c.customer_id;",
          explanation: "PARTITION BY resets the ranking per group — this exact pattern powers 'top customers per segment/region/product' reports.",
        },
      ],
    },
    {
      id: "l4-p2",
      levelId: "level-4",
      title: "Month-over-month change",
      scenario:
        "The CFO's deck needs a month-over-month view of spending in the groceries category: not just the raw monthly totals, but how much each month changed versus the one before it.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l4-p2-t1",
          title: "Previous month's total",
          prompt:
            "Build monthly totals for the groceries category (year_month, total_amount), then add a prev_month_amount column showing the previous month's total_amount using LAG(), ordered by year_month ascending.",
          hints: [
            "First get one row per month with SUM(amount) grouped by strftime('%Y-%m', date), then apply LAG() over that ordered by year_month.",
            "LAG(total_amount) OVER (ORDER BY year_month) reaches back one row.",
            "WITH monthly AS (SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY year_month) SELECT year_month, total_amount, LAG(total_amount) OVER (ORDER BY ____) AS prev_month_amount FROM monthly ORDER BY year_month ____;",
          ],
          solutionSql:
            "WITH monthly AS (SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY strftime('%Y-%m', date)) SELECT year_month, total_amount, LAG(total_amount) OVER (ORDER BY year_month) AS prev_month_amount FROM monthly ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "LAG() is how you bring a prior period's value onto the same row as the current period, without a self-join.",
        },
        {
          id: "l4-p2-t2",
          title: "Percent change",
          prompt:
            "Extend the previous query: add a pct_change column, the percentage change of total_amount versus prev_month_amount (as (total_amount - prev_month_amount) / ABS(prev_month_amount) * 100). Keep year_month, total_amount, prev_month_amount and pct_change, ordered by year_month ascending.",
          hints: [
            "Wrap the LAG() query in a CTE, then compute the percentage in an outer SELECT so you can reference prev_month_amount by name.",
            "pct_change = (total_amount - prev_month_amount) / ABS(prev_month_amount) * 100 — the first month will have a NULL result, which is expected.",
            "WITH monthly AS (...), with_lag AS (SELECT year_month, total_amount, LAG(total_amount) OVER (ORDER BY year_month) AS prev_month_amount FROM monthly) SELECT year_month, total_amount, prev_month_amount, (total_amount - prev_month_amount) * 100.0 / ABS(prev_month_amount) AS pct_change FROM with_lag ORDER BY year_month ____;",
          ],
          solutionSql:
            "WITH monthly AS (SELECT strftime('%Y-%m', date) AS year_month, SUM(amount) AS total_amount FROM transactions WHERE category = 'groceries' GROUP BY strftime('%Y-%m', date)), with_lag AS (SELECT year_month, total_amount, LAG(total_amount) OVER (ORDER BY year_month) AS prev_month_amount FROM monthly) SELECT year_month, total_amount, prev_month_amount, (total_amount - prev_month_amount) * 100.0 / ABS(prev_month_amount) AS pct_change FROM with_lag ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "This LAG-then-compute pattern is exactly how MoM/YoY growth metrics are built in real reporting pipelines.",
        },
      ],
    },
    {
      id: "l4-p3",
      levelId: "level-4",
      title: "Running balance",
      scenario:
        "A customer service rep needs to see how an account's balance evolved over time, transaction by transaction — a running (cumulative) total, not just the final number.",
      tables: ["transactions"],
      tasks: [
        {
          id: "l4-p3-t1",
          title: "Cumulative total for one account",
          prompt:
            "For account_id 1, return date, amount, and a running_total column: the cumulative sum of amount ordered by date (and transaction_id to break ties), from the earliest transaction onward.",
          hints: [
            "SUM() OVER (ORDER BY ...) with no PARTITION BY accumulates across the whole result set in order.",
            "ROWS UNBOUNDED PRECEDING makes the window include every row up to and including the current one.",
            "SELECT date, amount, SUM(amount) OVER (ORDER BY date, transaction_id ROWS UNBOUNDED PRECEDING) AS running_total FROM transactions WHERE account_id = ____ ORDER BY date, transaction_id;",
          ],
          solutionSql:
            "SELECT date, amount, SUM(amount) OVER (ORDER BY date, transaction_id ROWS UNBOUNDED PRECEDING) AS running_total FROM transactions WHERE account_id = 1 ORDER BY date, transaction_id;",
          preserveOrder: true,
          explanation: "A running total via SUM() OVER (ORDER BY ...) is the standard way to reconstruct a balance history from a transaction log.",
        },
        {
          id: "l4-p3-t2",
          title: "Running balance per account",
          prompt:
            "Generalise the previous query to every account: return account_id, date, amount, and running_total (cumulative sum of amount within each account_id, ordered by date and transaction_id), for accounts 1, 2 and 3 only.",
          hints: [
            "Add PARTITION BY account_id so the running total resets for each account.",
            "SUM(amount) OVER (PARTITION BY account_id ORDER BY date, transaction_id ROWS UNBOUNDED PRECEDING).",
            "SELECT account_id, date, amount, SUM(amount) OVER (PARTITION BY ____ ORDER BY date, transaction_id ROWS UNBOUNDED PRECEDING) AS running_total FROM transactions WHERE account_id IN (1, 2, 3) ORDER BY account_id, date, transaction_id;",
          ],
          solutionSql:
            "SELECT account_id, date, amount, SUM(amount) OVER (PARTITION BY account_id ORDER BY date, transaction_id ROWS UNBOUNDED PRECEDING) AS running_total FROM transactions WHERE account_id IN (1, 2, 3) ORDER BY account_id, date, transaction_id;",
          preserveOrder: true,
          explanation: "PARTITION BY account_id keeps each account's running balance independent within a single query — no loops or per-account queries needed.",
        },
      ],
    },
    {
      id: "l4-p4",
      levelId: "level-4",
      title: "Moving average",
      scenario:
        "The markets desk wants a smoothed view of price action: a 7-day moving average of the closing price for each ticker, the same technique used in technical analysis charting.",
      tables: ["stock_prices"],
      tasks: [
        {
          id: "l4-p4-t1",
          title: "7-day moving average for one ticker",
          prompt:
            "For symbol 'ALBC', return date, close, and a moving_avg_7d column: the average of close over the current row and the 6 preceding rows (ordered by date).",
          hints: [
            "AVG() OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) is the moving-window syntax.",
            "The window frame 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW' spans 7 rows total.",
            "SELECT date, close, AVG(close) OVER (ORDER BY date ROWS BETWEEN ____ PRECEDING AND CURRENT ROW) AS moving_avg_7d FROM stock_prices WHERE symbol = 'ALBC' ORDER BY date;",
          ],
          solutionSql:
            "SELECT date, close, AVG(close) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d FROM stock_prices WHERE symbol = 'ALBC' ORDER BY date;",
          preserveOrder: true,
          explanation: "This ROWS BETWEEN frame is the textbook implementation of a simple moving average directly in SQL.",
        },
        {
          id: "l4-p4-t2",
          title: "Moving average per ticker",
          prompt:
            "Generalise to all tickers: return symbol, date, close, and moving_avg_7d (7-day moving average of close, reset per symbol), ordered by symbol then date.",
          hints: [
            "Add PARTITION BY symbol so the window doesn't blend one ticker's prices into another's.",
            "AVG(close) OVER (PARTITION BY symbol ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).",
            "SELECT symbol, date, close, AVG(close) OVER (PARTITION BY ____ ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d FROM stock_prices ORDER BY symbol, date;",
          ],
          solutionSql:
            "SELECT symbol, date, close, AVG(close) OVER (PARTITION BY symbol ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d FROM stock_prices ORDER BY symbol, date;",
          preserveOrder: true,
          explanation: "PARTITION BY symbol is what makes a single query correctly compute independent moving averages for every ticker at once.",
        },
      ],
    },
    {
      id: "l4-p5",
      levelId: "level-4",
      title: "Top N per group",
      scenario:
        "A relationship manager wants, for each customer, their 3 largest transactions by size — not the top 3 across the whole bank, but the top 3 within each customer individually.",
      tables: ["transactions", "accounts"],
      tasks: [
        {
          id: "l4-p5-t1",
          title: "Rank transactions within each customer",
          prompt:
            "Join transactions to accounts to get customer_id, then return customer_id, transaction_id, amount, and a rn column using ROW_NUMBER() partitioned by customer_id and ordered by absolute amount descending.",
          hints: [
            "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY ABS(amount) DESC) numbers each customer's transactions 1, 2, 3... by size.",
            "You need the join to accounts first so customer_id is available to partition by.",
            "SELECT a.customer_id, t.transaction_id, t.amount, ROW_NUMBER() OVER (PARTITION BY a.customer_id ORDER BY ABS(t.amount) DESC) AS rn FROM transactions t JOIN accounts a ON t.account_id = a.account_id;",
          ],
          solutionSql:
            "SELECT a.customer_id, t.transaction_id, t.amount, ROW_NUMBER() OVER (PARTITION BY a.customer_id ORDER BY ABS(t.amount) DESC) AS rn FROM transactions t JOIN accounts a ON t.account_id = a.account_id;",
          explanation: "ROW_NUMBER() with PARTITION BY assigns a rank within each group — the first step toward any 'top N per group' query.",
        },
        {
          id: "l4-p5-t2",
          title: "Filter to the top 3",
          prompt:
            "SQLite has no QUALIFY clause, so wrap the previous ranking in a CTE and filter in an outer query. Return customer_id, transaction_id, amount for only the top 3 transactions (by absolute amount) per customer, for customers 1, 2 and 3 only, ordered by customer_id ascending then rn ascending.",
          hints: [
            "Put the ROW_NUMBER() query in a WITH clause, then SELECT ... FROM that CTE WHERE rn <= 3.",
            "The outer query needs its own ORDER BY since window function order isn't guaranteed to persist.",
            "WITH ranked AS (SELECT a.customer_id, t.transaction_id, t.amount, ROW_NUMBER() OVER (PARTITION BY a.customer_id ORDER BY ABS(t.amount) DESC) AS rn FROM transactions t JOIN accounts a ON t.account_id = a.account_id) SELECT customer_id, transaction_id, amount FROM ranked WHERE rn <= ____ AND customer_id IN (1, 2, 3) ORDER BY customer_id, rn;",
          ],
          solutionSql:
            "WITH ranked AS (SELECT a.customer_id, t.transaction_id, t.amount, ROW_NUMBER() OVER (PARTITION BY a.customer_id ORDER BY ABS(t.amount) DESC) AS rn FROM transactions t JOIN accounts a ON t.account_id = a.account_id) SELECT customer_id, transaction_id, amount FROM ranked WHERE rn <= 3 AND customer_id IN (1, 2, 3) ORDER BY customer_id, rn;",
          preserveOrder: true,
          explanation: "Wrapping a window function in a CTE so you can filter on it afterward is the standard workaround in engines without QUALIFY, and it's a very common interview question.",
        },
      ],
    },
  ],
};
