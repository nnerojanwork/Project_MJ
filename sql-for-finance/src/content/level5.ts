import { Level } from "./types";

export const level5: Level = {
  id: "level-5",
  number: 5,
  title: "Subqueries & CTEs",
  objective: "Correlated and non-correlated subqueries, WITH clauses, and building readable layered queries.",
  projects: [
    {
      id: "l5-p1",
      levelId: "level-5",
      title: "Above the average",
      scenario:
        "Wealth management wants a shortlist of customers whose total balance sits above the bank-wide average — a natural first filter for a targeted outreach campaign.",
      tables: ["customers", "accounts"],
      tasks: [
        {
          id: "l5-p1-t1",
          title: "Customers above the average balance",
          prompt:
            "First compute each customer's total balance across their accounts. Then return customer_id and total_balance only for customers whose total_balance is greater than the average total_balance across all customers who have at least one account.",
          hints: [
            "Build a CTE of per-customer total balances, then compare each row's total to the AVG() of that same CTE via a subquery in WHERE.",
            "WHERE total_balance > (SELECT AVG(total_balance) FROM <the same per-customer totals>) — the subquery has to be a separate reference to the aggregated set, not the raw accounts table.",
            "WITH balances AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id) SELECT customer_id, total_balance FROM balances WHERE total_balance > (SELECT AVG(total_balance) FROM ____);",
          ],
          solutionSql:
            "WITH balances AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id) SELECT customer_id, total_balance FROM balances WHERE total_balance > (SELECT AVG(total_balance) FROM balances);",
          explanation: "A subquery in WHERE that references an aggregate over the whole set is the simplest way to filter rows relative to a global benchmark.",
        },
      ],
    },
    {
      id: "l5-p2",
      levelId: "level-5",
      title: "Correlated subquery",
      scenario:
        "You need to flag customers whose most recent transaction was unusually large for them personally — not large in absolute terms, but large relative to their own typical spending. That means comparing each customer's latest transaction to a number computed just for that customer.",
      tables: ["transactions", "accounts"],
      tasks: [
        {
          id: "l5-p2-t1",
          title: "Latest transaction above personal average",
          prompt:
            "For each account, find its most recent transaction (by date, breaking ties by the highest transaction_id) and its all-time average transaction amount. Return account_id, latest_date, latest_amount and avg_amount, but only for accounts where ABS(latest_amount) is greater than ABS(avg_amount).",
          hints: [
            "This needs a correlated subquery: for each account, look up its own MAX(date) (and among same-date rows, MAX(transaction_id)) inside the outer query's row context.",
            "One workable shape: a CTE of per-account averages, then join to each account's single latest transaction (found via a correlated subquery keyed on account_id), then filter.",
            "WITH avgs AS (SELECT account_id, AVG(amount) AS avg_amount FROM transactions GROUP BY account_id), latest AS (SELECT t.account_id, t.date AS latest_date, t.amount AS latest_amount FROM transactions t WHERE t.transaction_id = (SELECT t2.transaction_id FROM transactions t2 WHERE t2.account_id = t.account_id ORDER BY t2.date DESC, t2.transaction_id DESC LIMIT 1)) SELECT l.account_id, l.latest_date, l.latest_amount, a.avg_amount FROM latest l JOIN avgs a ON l.account_id = a.account_id WHERE ABS(l.latest_amount) > ABS(a.avg_amount);",
          ],
          solutionSql:
            "WITH avgs AS (SELECT account_id, AVG(amount) AS avg_amount FROM transactions GROUP BY account_id), latest AS (SELECT t.account_id, t.date AS latest_date, t.amount AS latest_amount FROM transactions t WHERE t.transaction_id = (SELECT t2.transaction_id FROM transactions t2 WHERE t2.account_id = t.account_id ORDER BY t2.date DESC, t2.transaction_id DESC LIMIT 1)) SELECT l.account_id, l.latest_date, l.latest_amount, a.avg_amount FROM latest l JOIN avgs a ON l.account_id = a.account_id WHERE ABS(l.latest_amount) > ABS(a.avg_amount);",
          explanation: "A correlated subquery — one that references a column from the outer row — is what lets you compute a 'per-row personalised' benchmark like each account's own latest transaction.",
        },
      ],
    },
    {
      id: "l5-p3",
      levelId: "level-5",
      title: "Refactor with CTEs",
      scenario:
        "A colleague hands you a working but unreadable query, nested three subqueries deep, and asks you to rebuild it so the next person can actually follow the logic. Readability isn't a nice-to-have here — it's what separates a query that works from one a team can maintain.",
      tables: ["customers", "accounts", "loans"],
      tasks: [
        {
          id: "l5-p3-t1",
          title: "One logical step per CTE",
          prompt:
            "Rebuild this idea using WITH clauses, one clear step at a time: (1) total outstanding loan balance per customer, (2) join that to customers to get segment, (3) average outstanding balance per segment. Return segment and avg_outstanding, ordered by avg_outstanding descending.",
          hints: [
            "Structure it as three named steps: a CTE for per-customer loan totals, a CTE (or plain join) that attaches segment, then a final GROUP BY segment.",
            "Each CTE should do exactly one thing: aggregate, then join, then aggregate again — resist the urge to combine steps.",
            "WITH customer_loans AS (SELECT customer_id, SUM(outstanding_balance) AS total_outstanding FROM loans GROUP BY customer_id), with_segment AS (SELECT cl.total_outstanding, c.segment FROM customer_loans cl JOIN customers c ON cl.customer_id = c.customer_id) SELECT segment, AVG(total_outstanding) AS avg_outstanding FROM with_segment GROUP BY segment ORDER BY avg_outstanding ____;",
          ],
          solutionSql:
            "WITH customer_loans AS (SELECT customer_id, SUM(outstanding_balance) AS total_outstanding FROM loans GROUP BY customer_id), with_segment AS (SELECT cl.total_outstanding, c.segment FROM customer_loans cl JOIN customers c ON cl.customer_id = c.customer_id) SELECT segment, AVG(total_outstanding) AS avg_outstanding FROM with_segment GROUP BY segment ORDER BY avg_outstanding DESC;",
          preserveOrder: true,
          explanation: "Chaining small, named CTEs — aggregate, then join, then aggregate again — is exactly the discipline that makes complex analyst queries reviewable by someone else.",
        },
      ],
    },
  ],
};
