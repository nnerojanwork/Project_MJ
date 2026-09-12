import { Level } from "./types";

export const level3: Level = {
  id: "level-3",
  number: 3,
  title: "Joins & Relational Data",
  objective: "INNER/LEFT joins across 3+ tables, and understanding fan-out and dedup risk.",
  projects: [
    {
      id: "l3-p1",
      levelId: "level-3",
      title: "Whose transaction is this",
      scenario:
        "A fraud analyst has a list of transaction IDs and needs to know which customer each one belongs to. The ledger only stores account_id — you'll need to hop through accounts to reach the customer.",
      tables: ["transactions", "accounts", "customers"],
      tasks: [
        {
          id: "l3-p1-t1",
          title: "Attach customer names to transactions",
          prompt:
            "For dining category transactions, return transaction_id, amount, and the owning customer's name (as customer_name) and segment. Join transactions to accounts to customers.",
          hints: [
            "You need two JOINs: transactions -> accounts on account_id, accounts -> customers on customer_id.",
            "JOIN accounts ON transactions.account_id = accounts.account_id, then JOIN customers ON accounts.customer_id = customers.customer_id.",
            "SELECT t.transaction_id, t.amount, c.name AS customer_name, c.segment FROM transactions t JOIN accounts a ON t.account_id = a.account_id JOIN customers c ON ____ = ____ WHERE t.category = 'dining';",
          ],
          solutionSql:
            "SELECT t.transaction_id, t.amount, c.name AS customer_name, c.segment FROM transactions t JOIN accounts a ON t.account_id = a.account_id JOIN customers c ON a.customer_id = c.customer_id WHERE t.category = 'dining';",
          explanation: "Chaining joins through a bridge table (accounts) to reach the entity you actually care about (the customer) is the most common join shape in banking data.",
        },
        {
          id: "l3-p1-t2",
          title: "Private banking travel spend",
          prompt:
            "Return transaction_id, date, amount and customer name (as customer_name) for travel category transactions belonging to customers in the 'Private Banking' segment.",
          hints: [
            "Same three-table join as before, with an extra filter on the customer's segment.",
            "Add WHERE t.category = 'travel' AND c.segment = 'Private Banking'.",
            "SELECT t.transaction_id, t.date, t.amount, c.name AS customer_name FROM transactions t JOIN accounts a ON t.account_id = a.account_id JOIN customers c ON a.customer_id = c.customer_id WHERE t.category = '____' AND c.segment = '____';",
          ],
          solutionSql:
            "SELECT t.transaction_id, t.date, t.amount, c.name AS customer_name FROM transactions t JOIN accounts a ON t.account_id = a.account_id JOIN customers c ON a.customer_id = c.customer_id WHERE t.category = 'travel' AND c.segment = 'Private Banking';",
          explanation: "Filtering on an attribute of a joined table (the customer's segment) is a routine step in any segment-specific analysis.",
        },
      ],
    },
    {
      id: "l3-p2",
      levelId: "level-3",
      title: "Customers with no activity",
      scenario:
        "The retention team wants to reach out to customers who signed up but never opened an account. An INNER JOIN would silently drop these customers — you need a LEFT JOIN to actually see who's missing.",
      tables: ["customers", "accounts"],
      tasks: [
        {
          id: "l3-p2-t1",
          title: "Find customers without any account",
          prompt: "Return customer_id and name for every customer who has no row at all in the accounts table.",
          hints: [
            "LEFT JOIN customers to accounts, then look at which rows have no match on the accounts side.",
            "A customer with no accounts will have every accounts column come back NULL after a LEFT JOIN.",
            "SELECT c.customer_id, c.name FROM customers c LEFT JOIN accounts a ON c.customer_id = a.customer_id WHERE a.account_id IS ____;",
          ],
          solutionSql:
            "SELECT c.customer_id, c.name FROM customers c LEFT JOIN accounts a ON c.customer_id = a.customer_id WHERE a.account_id IS NULL;",
          explanation: "The LEFT JOIN ... WHERE right.key IS NULL pattern is the standard way to find 'missing' relationships in SQL.",
        },
        {
          id: "l3-p2-t2",
          title: "Count of dormant customers by region",
          prompt:
            "Using the same no-account definition, return region and the count of customers with no account, as dormant_count, one row per region.",
          hints: [
            "Wrap the same LEFT JOIN / IS NULL logic, then GROUP BY region.",
            "You're grouping the filtered no-account customers by their region.",
            "SELECT c.region, COUNT(*) AS dormant_count FROM customers c LEFT JOIN accounts a ON c.customer_id = a.customer_id WHERE a.account_id IS NULL GROUP BY ____;",
          ],
          solutionSql:
            "SELECT c.region, COUNT(*) AS dormant_count FROM customers c LEFT JOIN accounts a ON c.customer_id = a.customer_id WHERE a.account_id IS NULL GROUP BY c.region;",
          explanation: "Combining the anti-join pattern with GROUP BY turns a raw list of missing customers into an actionable regional breakdown.",
        },
      ],
    },
    {
      id: "l3-p3",
      levelId: "level-3",
      title: "Loan book overview",
      scenario:
        "Credit risk wants a segment-level view of the loan book: how much is outstanding, and how many loans, per customer segment.",
      tables: ["loans", "customers"],
      tasks: [
        {
          id: "l3-p3-t1",
          title: "Outstanding balance by segment",
          prompt:
            "Join loans to customers and return segment, total outstanding balance as total_outstanding, and number of loans as loan_count, one row per segment, ordered by total_outstanding descending.",
          hints: [
            "JOIN loans to customers on customer_id, then GROUP BY segment.",
            "SUM(l.outstanding_balance) and COUNT(*) per segment group.",
            "SELECT c.segment, SUM(l.outstanding_balance) AS total_outstanding, COUNT(*) AS loan_count FROM loans l JOIN customers c ON l.customer_id = c.customer_id GROUP BY ____ ORDER BY total_outstanding ____;",
          ],
          solutionSql:
            "SELECT c.segment, SUM(l.outstanding_balance) AS total_outstanding, COUNT(*) AS loan_count FROM loans l JOIN customers c ON l.customer_id = c.customer_id GROUP BY c.segment ORDER BY total_outstanding DESC;",
          preserveOrder: true,
          explanation: "Join-then-group-by against a customer attribute is exactly how portfolio managers slice the loan book by segment.",
        },
        {
          id: "l3-p3-t2",
          title: "Delinquent loans by region",
          prompt:
            "Return region and the count of loans with status = 'delinquent', as delinquent_count, one row per region that has at least one delinquent loan.",
          hints: [
            "Join loans to customers, filter to delinquent status, then group by region.",
            "Filter with WHERE l.status = 'delinquent' before grouping.",
            "SELECT c.region, COUNT(*) AS delinquent_count FROM loans l JOIN customers c ON l.customer_id = c.customer_id WHERE l.status = '____' GROUP BY c.region;",
          ],
          solutionSql:
            "SELECT c.region, COUNT(*) AS delinquent_count FROM loans l JOIN customers c ON l.customer_id = c.customer_id WHERE l.status = 'delinquent' GROUP BY c.region;",
          explanation: "This is the kind of query that feeds a regional risk dashboard, flagging where delinquency is concentrated.",
        },
      ],
    },
    {
      id: "l3-p4",
      levelId: "level-3",
      title: "Careful with fan-out",
      scenario:
        "A junior analyst joined customers to both accounts and loans in one query and summed the account balances — but the total came out far too high. Joining a customer to multiple accounts AND multiple loans multiplies rows together, silently inflating any SUM(). You need to fix it.",
      tables: ["customers", "accounts", "loans"],
      tasks: [
        {
          id: "l3-p4-t1",
          title: "Spot the inflation",
          prompt:
            "Run this on paper first: for customer_id 1, a naive query joins accounts and loans directly and sums balance. Now write the CORRECT query: return customer_id and their true total account balance (total_balance) as SUM of DISTINCT account balances, by first aggregating accounts per customer in a subquery, then joining that to customers. Return customer_id and total_balance for every customer who has at least one account, ordered by customer_id ascending.",
          hints: [
            "Pre-aggregate accounts per customer_id first (in a subquery), so each customer appears once before you join anything else.",
            "Build a subquery: SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id — then join or use it directly.",
            "SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id ORDER BY customer_id ____;",
          ],
          solutionSql: "SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id ORDER BY customer_id ASC;",
          preserveOrder: true,
          explanation: "Pre-aggregating one side of a one-to-many relationship before joining is the standard fix for fan-out double-counting.",
        },
        {
          id: "l3-p4-t2",
          title: "Combine two pre-aggregated sides safely",
          prompt:
            "Now bring loans into the picture without fan-out. Using two subqueries — one aggregating total account balance per customer, one aggregating total outstanding loan balance per customer — return customer_id, total_balance, and total_outstanding for every customer who appears in either subquery. Use LEFT JOIN so customers with accounts but no loans still appear (missing loan totals should read as NULL, no need to convert to 0), ordered by customer_id ascending.",
          hints: [
            "Build each subquery independently (GROUP BY customer_id on accounts, GROUP BY customer_id on loans), then LEFT JOIN them together on customer_id.",
            "WITH accts AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id), lns AS (SELECT customer_id, SUM(outstanding_balance) AS total_outstanding FROM loans GROUP BY customer_id) SELECT ... FROM accts LEFT JOIN lns ON ...",
            "WITH accts AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id), lns AS (SELECT customer_id, SUM(outstanding_balance) AS total_outstanding FROM loans GROUP BY customer_id) SELECT accts.customer_id, total_balance, total_outstanding FROM accts LEFT JOIN lns ON accts.customer_id = lns.customer_id ORDER BY accts.customer_id ____;",
          ],
          solutionSql:
            "WITH accts AS (SELECT customer_id, SUM(balance) AS total_balance FROM accounts GROUP BY customer_id), lns AS (SELECT customer_id, SUM(outstanding_balance) AS total_outstanding FROM loans GROUP BY customer_id) SELECT accts.customer_id, total_balance, total_outstanding FROM accts LEFT JOIN lns ON accts.customer_id = lns.customer_id ORDER BY accts.customer_id ASC;",
          preserveOrder: true,
          explanation: "Aggregate-then-join is the safe pattern whenever a customer has multiple rows on two or more sides of a join — this is a very common interview question.",
        },
      ],
    },
  ],
};
