import { Level } from "./types";

export const level6: Level = {
  id: "level-6",
  number: 6,
  title: "Capstone Projects",
  objective: "Realistic, multi-step analyst deliverables that chain everything from Levels 1-5 into a single pipeline.",
  projects: [
    {
      id: "l6-p1",
      levelId: "level-6",
      title: "Monthly lending performance pack",
      scenario:
        "Credit risk has asked for a full monthly lending pack for the next portfolio review: origination volumes, average loan size, delinquency by segment, month-over-month growth, and a cumulative originations total — the kind of multi-part pack an analyst actually gets asked to produce, not a single isolated query.",
      tables: ["loans", "customers"],
      tasks: [
        {
          id: "l6-p1-t1",
          title: "Originations per month",
          prompt: "Return year_month (derived from origination_date) and loan_count, the number of loans originated that month, ordered by year_month ascending.",
          hints: [
            "GROUP BY a derived month expression, same pattern as Level 2.",
            "strftime('%Y-%m', origination_date) is your grouping key.",
            "SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY year_month ORDER BY year_month ____;",
          ],
          solutionSql:
            "SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY strftime('%Y-%m', origination_date) ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "Origination volume by month is the first chart in almost every lending performance pack.",
        },
        {
          id: "l6-p1-t2",
          title: "Average loan size per month",
          prompt: "Extend the previous idea: return year_month, loan_count, and avg_principal (average principal) per month, ordered by year_month ascending.",
          hints: [
            "Same GROUP BY, just add AVG(principal) alongside COUNT(*).",
            "Both aggregates share the same GROUP BY expression.",
            "SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count, AVG(principal) AS avg_principal FROM loans GROUP BY year_month ORDER BY year_month ____;",
          ],
          solutionSql:
            "SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count, AVG(principal) AS avg_principal FROM loans GROUP BY strftime('%Y-%m', origination_date) ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "Average loan size alongside volume shows whether growth is coming from more loans or bigger ones.",
        },
        {
          id: "l6-p1-t3",
          title: "Delinquency rate by segment",
          prompt:
            "Join loans to customers and return segment, delinquent_count (loans with status = 'delinquent'), total_count (all loans), and delinquency_rate (delinquent_count as a fraction of total_count), one row per segment.",
          hints: [
            "SUM(CASE WHEN status = 'delinquent' THEN 1 ELSE 0 END) for the numerator, COUNT(*) for the denominator, from Level 2's conditional aggregation pattern.",
            "delinquency_rate = delinquent_count * 1.0 / total_count — the *1.0 avoids integer division.",
            "SELECT c.segment, SUM(CASE WHEN l.status = 'delinquent' THEN 1 ELSE 0 END) AS delinquent_count, COUNT(*) AS total_count, SUM(CASE WHEN l.status = 'delinquent' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS delinquency_rate FROM loans l JOIN customers c ON l.customer_id = c.customer_id GROUP BY ____;",
          ],
          solutionSql:
            "SELECT c.segment, SUM(CASE WHEN l.status = 'delinquent' THEN 1 ELSE 0 END) AS delinquent_count, COUNT(*) AS total_count, SUM(CASE WHEN l.status = 'delinquent' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS delinquency_rate FROM loans l JOIN customers c ON l.customer_id = c.customer_id GROUP BY c.segment;",
          explanation: "Delinquency rate by segment is the single most important risk metric in any lending pack.",
        },
        {
          id: "l6-p1-t4",
          title: "Month-over-month growth in originations",
          prompt:
            "Using monthly origination counts, return year_month, loan_count, and growth_pct: the percentage change in loan_count versus the previous month, ordered by year_month ascending.",
          hints: [
            "Same LAG() pattern from Level 4: build the monthly CTE first, then compute the percentage change in an outer SELECT.",
            "growth_pct = (loan_count - prev) * 100.0 / prev, where prev = LAG(loan_count) OVER (ORDER BY year_month).",
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY year_month) SELECT year_month, loan_count, (loan_count - LAG(loan_count) OVER (ORDER BY year_month)) * 100.0 / LAG(loan_count) OVER (ORDER BY year_month) AS growth_pct FROM monthly ORDER BY year_month ____;",
          ],
          solutionSql:
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY strftime('%Y-%m', origination_date)) SELECT year_month, loan_count, (loan_count - LAG(loan_count) OVER (ORDER BY year_month)) * 100.0 / LAG(loan_count) OVER (ORDER BY year_month) AS growth_pct FROM monthly ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "MoM growth turns a raw monthly count into a trend signal management can act on.",
        },
        {
          id: "l6-p1-t5",
          title: "Cumulative originations",
          prompt: "Return year_month, loan_count, and cumulative_originations: the running total of loan_count from the earliest month onward, ordered by year_month ascending.",
          hints: [
            "SUM() OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING) on top of the same monthly CTE.",
            "This is the same running-total pattern from Level 4's 'Running balance' project, applied to a monthly count instead of a transaction amount.",
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY year_month) SELECT year_month, loan_count, SUM(loan_count) OVER (ORDER BY year_month ROWS UNBOUNDED PRECEDING) AS cumulative_originations FROM monthly ORDER BY year_month ____;",
          ],
          solutionSql:
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count FROM loans GROUP BY strftime('%Y-%m', origination_date)) SELECT year_month, loan_count, SUM(loan_count) OVER (ORDER BY year_month ROWS UNBOUNDED PRECEDING) AS cumulative_originations FROM monthly ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "A cumulative originations line is the standard way boards track 'total volume written this year' at a glance.",
        },
        {
          id: "l6-p1-t6",
          title: "Assemble the full pack",
          prompt:
            "Bring it together: return one row per month with year_month, loan_count, avg_principal, growth_pct (vs. previous month) and cumulative_originations, all in a single query, ordered by year_month ascending.",
          hints: [
            "Build one CTE with year_month, loan_count and avg_principal, then layer growth_pct and cumulative_originations on top using window functions in the final SELECT.",
            "You need loan_count available twice: once for LAG() (growth_pct) and once for the running SUM() (cumulative_originations) — both can reference the same underlying column.",
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count, AVG(principal) AS avg_principal FROM loans GROUP BY year_month) SELECT year_month, loan_count, avg_principal, (loan_count - LAG(loan_count) OVER (ORDER BY year_month)) * 100.0 / LAG(loan_count) OVER (ORDER BY year_month) AS growth_pct, SUM(loan_count) OVER (ORDER BY year_month ROWS UNBOUNDED PRECEDING) AS cumulative_originations FROM monthly ORDER BY year_month ____;",
          ],
          solutionSql:
            "WITH monthly AS (SELECT strftime('%Y-%m', origination_date) AS year_month, COUNT(*) AS loan_count, AVG(principal) AS avg_principal FROM loans GROUP BY strftime('%Y-%m', origination_date)) SELECT year_month, loan_count, avg_principal, (loan_count - LAG(loan_count) OVER (ORDER BY year_month)) * 100.0 / LAG(loan_count) OVER (ORDER BY year_month) AS growth_pct, SUM(loan_count) OVER (ORDER BY year_month ROWS UNBOUNDED PRECEDING) AS cumulative_originations FROM monthly ORDER BY year_month ASC;",
          preserveOrder: true,
          explanation: "This is precisely the shape of a real monthly lending performance pack: one CTE to aggregate, window functions layered on top for trend and cumulative views.",
        },
      ],
    },
    {
      id: "l6-p2",
      levelId: "level-6",
      title: "Customer cohort & retention analysis",
      scenario:
        "Product wants to understand retention: of the customers who first transacted in a given month (their 'cohort'), how many are still active in each month afterward? This is the data behind every retention curve chart, and it takes several careful layers to build correctly.",
      tables: ["transactions", "accounts"],
      tasks: [
        {
          id: "l6-p2-t1",
          title: "Assign each customer a cohort month",
          prompt:
            "For every customer with at least one transaction, return customer_id and cohort_month: the year-month of their earliest transaction (join transactions to accounts to reach customer_id).",
          hints: [
            "Join transactions to accounts, then group by customer_id taking the earliest date.",
            "MIN(t.date) per customer_id, then format it to 'YYYY-MM' with strftime.",
            "SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY ____;",
          ],
          solutionSql:
            "SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id;",
          explanation: "Cohorting by first-activity month is the standard starting point for any retention analysis.",
        },
        {
          id: "l6-p2-t2",
          title: "Cohort sizes",
          prompt: "Using the cohort assignment from the previous task, return cohort_month and cohort_size (number of customers in that cohort), ordered by cohort_month ascending.",
          hints: [
            "Wrap the cohort-assignment query in a CTE, then GROUP BY cohort_month.",
            "COUNT(*) per cohort_month once each customer has exactly one cohort_month.",
            "WITH cohorts AS (SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id) SELECT cohort_month, COUNT(*) AS cohort_size FROM cohorts GROUP BY cohort_month ORDER BY cohort_month ____;",
          ],
          solutionSql:
            "WITH cohorts AS (SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id) SELECT cohort_month, COUNT(*) AS cohort_size FROM cohorts GROUP BY cohort_month ORDER BY cohort_month ASC;",
          preserveOrder: true,
          explanation: "Cohort size is the denominator every retention percentage will eventually be divided by.",
        },
        {
          id: "l6-p2-t3",
          title: "Active customers per cohort per month",
          prompt:
            "For every combination of cohort_month and activity_month (the year-month of any transaction), return cohort_month, activity_month, and active_customers: the number of distinct customers from that cohort who transacted in that activity month.",
          hints: [
            "Build two CTEs: one assigning cohort_month per customer, one listing every (customer_id, activity_month) they were active in. Join them on customer_id.",
            "COUNT(DISTINCT customer_id) per (cohort_month, activity_month) pair after the join.",
            "WITH cohorts AS (...), activity AS (SELECT a.customer_id, strftime('%Y-%m', t.date) AS activity_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id, activity_month) SELECT c.cohort_month, ac.activity_month, COUNT(DISTINCT ac.customer_id) AS active_customers FROM activity ac JOIN cohorts c ON ac.customer_id = c.customer_id GROUP BY ____, ____ ORDER BY c.cohort_month, ac.activity_month;",
          ],
          solutionSql:
            "WITH cohorts AS (SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id), activity AS (SELECT a.customer_id, strftime('%Y-%m', t.date) AS activity_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id, strftime('%Y-%m', t.date)) SELECT c.cohort_month, ac.activity_month, COUNT(DISTINCT ac.customer_id) AS active_customers FROM activity ac JOIN cohorts c ON ac.customer_id = c.customer_id GROUP BY c.cohort_month, ac.activity_month ORDER BY c.cohort_month, ac.activity_month;",
          preserveOrder: true,
          explanation: "This cohort-by-activity-month grid is the raw data a retention curve or cohort heatmap is drawn from.",
        },
        {
          id: "l6-p2-t4",
          title: "Months since cohort start",
          prompt:
            "Extend the previous result with months_since_cohort: the number of whole months between cohort_month and activity_month (0 for the cohort's own first month, 1 for the next month, and so on). Return cohort_month, activity_month, months_since_cohort and active_customers, ordered by cohort_month then months_since_cohort.",
          hints: [
            "You can compute a month difference between two 'YYYY-MM' strings by turning each into a full date (append '-01'), extracting year and month as integers, and combining: (year_diff * 12) + month_diff.",
            "(CAST(strftime('%Y', activity_month || '-01') AS INTEGER) - CAST(strftime('%Y', cohort_month || '-01') AS INTEGER)) * 12 + (CAST(strftime('%m', activity_month || '-01') AS INTEGER) - CAST(strftime('%m', cohort_month || '-01') AS INTEGER))",
            "SELECT cohort_month, activity_month, (CAST(strftime('%Y', activity_month || '-01') AS INTEGER) - CAST(strftime('%Y', cohort_month || '-01') AS INTEGER)) * 12 + (CAST(strftime('%m', activity_month || '-01') AS INTEGER) - CAST(strftime('%m', cohort_month || '-01') AS INTEGER)) AS months_since_cohort, active_customers FROM (<previous task's query>) ORDER BY cohort_month, months_since_cohort;",
          ],
          solutionSql:
            "WITH cohorts AS (SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id), activity AS (SELECT a.customer_id, strftime('%Y-%m', t.date) AS activity_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id, strftime('%Y-%m', t.date)), grid AS (SELECT c.cohort_month, ac.activity_month, COUNT(DISTINCT ac.customer_id) AS active_customers FROM activity ac JOIN cohorts c ON ac.customer_id = c.customer_id GROUP BY c.cohort_month, ac.activity_month) SELECT cohort_month, activity_month, (CAST(strftime('%Y', activity_month || '-01') AS INTEGER) - CAST(strftime('%Y', cohort_month || '-01') AS INTEGER)) * 12 + (CAST(strftime('%m', activity_month || '-01') AS INTEGER) - CAST(strftime('%m', cohort_month || '-01') AS INTEGER)) AS months_since_cohort, active_customers FROM grid ORDER BY cohort_month, months_since_cohort;",
          preserveOrder: true,
          explanation: "Re-basing every cohort onto 'months since start' is what lets you overlay cohorts of different ages on the same retention curve.",
        },
        {
          id: "l6-p2-t5",
          title: "Retention rate",
          prompt:
            "Finally, compute retention_rate: active_customers divided by that cohort's cohort_size, for every (cohort_month, months_since_cohort) pair. Return cohort_month, months_since_cohort, active_customers, cohort_size and retention_rate, ordered by cohort_month then months_since_cohort.",
          hints: [
            "You now need three pieces joined together: the months-since-cohort grid, plus cohort_size per cohort_month.",
            "Join the grid from the previous task to a cohort-size CTE on cohort_month, then divide.",
            "... JOIN (SELECT cohort_month, COUNT(*) AS cohort_size FROM cohorts GROUP BY cohort_month) sizes ON grid.cohort_month = sizes.cohort_month, then SELECT ..., active_customers * 1.0 / cohort_size AS retention_rate ...",
          ],
          solutionSql:
            "WITH cohorts AS (SELECT a.customer_id, strftime('%Y-%m', MIN(t.date)) AS cohort_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id), activity AS (SELECT a.customer_id, strftime('%Y-%m', t.date) AS activity_month FROM transactions t JOIN accounts a ON t.account_id = a.account_id GROUP BY a.customer_id, strftime('%Y-%m', t.date)), grid AS (SELECT c.cohort_month, ac.activity_month, COUNT(DISTINCT ac.customer_id) AS active_customers FROM activity ac JOIN cohorts c ON ac.customer_id = c.customer_id GROUP BY c.cohort_month, ac.activity_month), sized AS (SELECT g.cohort_month, (CAST(strftime('%Y', g.activity_month || '-01') AS INTEGER) - CAST(strftime('%Y', g.cohort_month || '-01') AS INTEGER)) * 12 + (CAST(strftime('%m', g.activity_month || '-01') AS INTEGER) - CAST(strftime('%m', g.cohort_month || '-01') AS INTEGER)) AS months_since_cohort, g.active_customers FROM grid g), sizes AS (SELECT cohort_month, COUNT(*) AS cohort_size FROM cohorts GROUP BY cohort_month) SELECT sized.cohort_month, sized.months_since_cohort, sized.active_customers, sizes.cohort_size, sized.active_customers * 1.0 / sizes.cohort_size AS retention_rate FROM sized JOIN sizes ON sized.cohort_month = sizes.cohort_month ORDER BY sized.cohort_month, sized.months_since_cohort;",
          preserveOrder: true,
          explanation: "This final table is exactly the data source behind a standard cohort retention curve chart.",
        },
      ],
    },
    {
      id: "l6-p3",
      levelId: "level-6",
      title: "Portfolio performance dashboard",
      scenario:
        "The wealth desk needs a dashboard covering portfolio valuation, returns, volatility, and a risk-adjusted ranking across all client portfolios — the same set of metrics that would sit behind a real investment performance report.",
      tables: ["holdings", "stock_prices", "portfolios"],
      tasks: [
        {
          id: "l6-p3-t1",
          title: "Portfolio value over time",
          prompt:
            "For portfolio_id 1, return date and portfolio_value: the sum, across all its holdings, of quantity times the most recent available closing price on or before that date. Order by date ascending.",
          hints: [
            "For each holding row, look up the latest stock_prices.close for that symbol on or before the holding's date, using a correlated subquery.",
            "(SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1) gives the 'as of' price.",
            "SELECT h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h WHERE h.portfolio_id = ____ GROUP BY h.date ORDER BY h.date ____;",
          ],
          solutionSql:
            "SELECT h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h WHERE h.portfolio_id = 1 GROUP BY h.date ORDER BY h.date ASC;",
          preserveOrder: true,
          explanation: "An 'as of' correlated subquery like this is how you value a position on a specific date without needing a matching price row on every single date.",
        },
        {
          id: "l6-p3-t2",
          title: "Period-over-period return",
          prompt:
            "Using the portfolio value series for portfolio_id 1, return date, portfolio_value and pct_return: the percentage change in portfolio_value versus the previous valuation date, ordered by date ascending.",
          hints: [
            "Wrap the value query in a CTE, then apply LAG() over date, same pattern as Level 4's month-over-month change.",
            "pct_return = (portfolio_value - prev) * 100.0 / prev.",
            "WITH vals AS (<previous task's query>) SELECT date, portfolio_value, (portfolio_value - LAG(portfolio_value) OVER (ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (ORDER BY date) AS pct_return FROM vals ORDER BY date ____;",
          ],
          solutionSql:
            "WITH vals AS (SELECT h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h WHERE h.portfolio_id = 1 GROUP BY h.date) SELECT date, portfolio_value, (portfolio_value - LAG(portfolio_value) OVER (ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (ORDER BY date) AS pct_return FROM vals ORDER BY date ASC;",
          preserveOrder: true,
          explanation: "Turning a value series into period returns is the prerequisite for every volatility or performance metric that follows.",
        },
        {
          id: "l6-p3-t3",
          title: "Rolling volatility",
          prompt:
            "Extend the return series for portfolio_id 1 with rolling_volatility: the standard deviation of pct_return over the current and 5 preceding valuation points, using SQRT(AVG(x*x) - AVG(x)*AVG(x)) as the standard-deviation formula. Return date, pct_return and rolling_volatility, ordered by date ascending.",
          hints: [
            "Layer a third CTE on top of the returns CTE, applying AVG(pct_return*pct_return) and AVG(pct_return) over the same window frame, then combine with SQRT.",
            "ROWS BETWEEN 5 PRECEDING AND CURRENT ROW spans 6 valuation points, mirroring the 7-day moving average pattern from Level 4 but for a return series.",
            "SELECT date, pct_return, SQRT(AVG(pct_return*pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) - AVG(pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) * AVG(pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW)) AS rolling_volatility FROM <returns CTE> ORDER BY date ____;",
          ],
          solutionSql:
            "WITH vals AS (SELECT h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h WHERE h.portfolio_id = 1 GROUP BY h.date), rets AS (SELECT date, (portfolio_value - LAG(portfolio_value) OVER (ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (ORDER BY date) AS pct_return FROM vals) SELECT date, pct_return, SQRT(AVG(pct_return*pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) - AVG(pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) * AVG(pct_return) OVER (ORDER BY date ROWS BETWEEN 5 PRECEDING AND CURRENT ROW)) AS rolling_volatility FROM rets ORDER BY date ASC;",
          preserveOrder: true,
          explanation: "Computing standard deviation from AVG(x^2) - AVG(x)^2 inside a window frame is a technique worth memorising — most SQL engines have no built-in rolling STDDEV window function.",
        },
        {
          id: "l6-p3-t4",
          title: "Returns for every portfolio",
          prompt:
            "Generalise the value-and-return calculation to every portfolio. Return portfolio_id, date, portfolio_value and pct_return for all portfolios, ordered by portfolio_id then date.",
          hints: [
            "Add portfolio_id to the GROUP BY in the value CTE, and PARTITION BY portfolio_id in the LAG() window.",
            "This is the same shape as task 2, just no longer filtered to a single portfolio_id and partitioned accordingly.",
            "WITH vals AS (SELECT h.portfolio_id, h.date, SUM(...) AS portfolio_value FROM holdings h GROUP BY h.portfolio_id, h.date) SELECT portfolio_id, date, portfolio_value, (portfolio_value - LAG(portfolio_value) OVER (PARTITION BY ____ ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (PARTITION BY ____ ORDER BY date) AS pct_return FROM vals ORDER BY portfolio_id, date;",
          ],
          solutionSql:
            "WITH vals AS (SELECT h.portfolio_id, h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h GROUP BY h.portfolio_id, h.date) SELECT portfolio_id, date, portfolio_value, (portfolio_value - LAG(portfolio_value) OVER (PARTITION BY portfolio_id ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (PARTITION BY portfolio_id ORDER BY date) AS pct_return FROM vals ORDER BY portfolio_id, date;",
          preserveOrder: true,
          explanation: "Partitioning by portfolio_id lets one query value and score every client's portfolio at once instead of running it 40 times.",
        },
        {
          id: "l6-p3-t5",
          title: "Rank by risk-adjusted return",
          prompt:
            "For every portfolio, compute avg_return (average pct_return) and volatility (standard deviation of pct_return, using the same SQRT(AVG(x*x)-AVG(x)*AVG(x)) formula, as a plain aggregate not a window function this time), then risk_adjusted (avg_return / volatility) and risk_rank (RANK() ordered by risk_adjusted descending). Return portfolio_id, avg_return, volatility, risk_adjusted and risk_rank, ordered by risk_rank ascending.",
          hints: [
            "Reuse the per-portfolio return series from the previous task as a CTE, then GROUP BY portfolio_id with AVG() aggregates (not window functions) to get one row per portfolio.",
            "volatility = SQRT(AVG(pct_return*pct_return) - AVG(pct_return)*AVG(pct_return)), computed with plain (non-windowed) aggregates in a GROUP BY.",
            "WITH ... rets AS (...), stats AS (SELECT portfolio_id, AVG(pct_return) AS avg_return, SQRT(AVG(pct_return*pct_return) - AVG(pct_return)*AVG(pct_return)) AS volatility FROM rets WHERE pct_return IS NOT NULL GROUP BY portfolio_id) SELECT portfolio_id, avg_return, volatility, avg_return / volatility AS risk_adjusted, RANK() OVER (ORDER BY avg_return / volatility DESC) AS risk_rank FROM stats ORDER BY risk_rank ____;",
          ],
          solutionSql:
            "WITH vals AS (SELECT h.portfolio_id, h.date, SUM(h.quantity * (SELECT sp.close FROM stock_prices sp WHERE sp.symbol = h.symbol AND sp.date <= h.date ORDER BY sp.date DESC LIMIT 1)) AS portfolio_value FROM holdings h GROUP BY h.portfolio_id, h.date), rets AS (SELECT portfolio_id, date, (portfolio_value - LAG(portfolio_value) OVER (PARTITION BY portfolio_id ORDER BY date)) * 100.0 / LAG(portfolio_value) OVER (PARTITION BY portfolio_id ORDER BY date) AS pct_return FROM vals), stats AS (SELECT portfolio_id, AVG(pct_return) AS avg_return, SQRT(AVG(pct_return*pct_return) - AVG(pct_return)*AVG(pct_return)) AS volatility FROM rets WHERE pct_return IS NOT NULL GROUP BY portfolio_id) SELECT portfolio_id, avg_return, volatility, avg_return / volatility AS risk_adjusted, RANK() OVER (ORDER BY avg_return / volatility DESC) AS risk_rank FROM stats ORDER BY risk_rank ASC;",
          preserveOrder: true,
          explanation: "Ranking by return-per-unit-of-risk (a Sharpe-ratio-style metric) rather than raw return is exactly how portfolios get compared fairly in a real performance review.",
        },
      ],
    },
    {
      id: "l6-p4",
      levelId: "level-6",
      title: "Risk flagging pipeline",
      scenario:
        "Risk wants a prioritised list of accounts that look increasingly risky: balances trending up while transaction activity trends down (a classic pattern preceding account dormancy or a customer routing activity elsewhere). You'll build the flagging logic as a layered pipeline, exactly like a query that would feed a real risk dashboard.",
      tables: ["transactions", "accounts", "customers"],
      tasks: [
        {
          id: "l6-p4-t1",
          title: "Early vs. recent activity per account",
          prompt:
            "Split the transaction history at 2024-01-01. For every account, return account_id, early_net (sum of amount before 2024-01-01), recent_net (sum of amount from 2024-01-01 onward), early_txn_count and recent_txn_count (transaction counts for the same two periods).",
          hints: [
            "Use conditional SUM/COUNT with CASE WHEN, the Level 2 pivot pattern, splitting on the date boundary.",
            "SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) for early_net, mirrored for recent_net and the two counts.",
            "SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY ____;",
          ],
          solutionSql:
            "SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY account_id;",
          explanation: "Splitting one column into 'before' and 'after' measures with conditional aggregation is the foundation of any trend-flagging pipeline.",
        },
        {
          id: "l6-p4-t2",
          title: "Flag the risky pattern",
          prompt:
            "Using the previous breakdown, return only the accounts where recent_net is greater than early_net (net position rising) AND recent_txn_count is less than early_txn_count (activity falling). Return account_id, early_net, recent_net, early_txn_count and recent_txn_count.",
          hints: [
            "Wrap the previous query in a CTE, then filter with a WHERE clause combining both conditions with AND.",
            "WHERE recent_net > early_net AND recent_txn_count < early_txn_count.",
            "WITH periods AS (<previous task's query>) SELECT * FROM periods WHERE recent_net > early_net AND recent_txn_count < ____;",
          ],
          solutionSql:
            "WITH periods AS (SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY account_id) SELECT account_id, early_net, recent_net, early_txn_count, recent_txn_count FROM periods WHERE recent_net > early_net AND recent_txn_count < early_txn_count;",
          explanation: "This is the core risk rule itself: rising balance plus falling activity, expressed as a simple filter over pre-aggregated periods.",
        },
        {
          id: "l6-p4-t3",
          title: "Score the severity",
          prompt:
            "For the flagged accounts from the previous task, add a severity column: (recent_net - early_net) + (early_txn_count - recent_txn_count) * 100. Return account_id, early_net, recent_net, early_txn_count, recent_txn_count and severity.",
          hints: [
            "Add the arithmetic expression as a new computed column in the same filtered query.",
            "The *100 weight puts the transaction-count-drop term on a comparable scale to the currency-based net-change term — an arbitrary but reasonable choice for combining two different units into one score.",
            "... SELECT account_id, early_net, recent_net, early_txn_count, recent_txn_count, (recent_net - early_net) + (early_txn_count - recent_txn_count) * ____ AS severity FROM periods WHERE recent_net > early_net AND recent_txn_count < early_txn_count;",
          ],
          solutionSql:
            "WITH periods AS (SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY account_id) SELECT account_id, early_net, recent_net, early_txn_count, recent_txn_count, (recent_net - early_net) + (early_txn_count - recent_txn_count) * 100 AS severity FROM periods WHERE recent_net > early_net AND recent_txn_count < early_txn_count;",
          explanation: "Combining two differently-scaled signals into one severity score is exactly how real risk models turn multiple flags into a single prioritisation number.",
        },
        {
          id: "l6-p4-t4",
          title: "Rank by severity",
          prompt: "Extend the previous query with risk_rank: RANK() ordered by severity descending. Return account_id, severity and risk_rank, ordered by risk_rank ascending.",
          hints: [
            "Add RANK() OVER (ORDER BY severity DESC) as a new column in the same SELECT.",
            "You can compute a window function directly alongside a CASE-derived column in the same query.",
            "... SELECT account_id, severity, RANK() OVER (ORDER BY ____ DESC) AS risk_rank FROM (<previous task's flagged+severity query>) ORDER BY risk_rank ____;",
          ],
          solutionSql:
            "WITH periods AS (SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY account_id), flagged AS (SELECT account_id, (recent_net - early_net) + (early_txn_count - recent_txn_count) * 100 AS severity FROM periods WHERE recent_net > early_net AND recent_txn_count < early_txn_count) SELECT account_id, severity, RANK() OVER (ORDER BY severity DESC) AS risk_rank FROM flagged ORDER BY risk_rank ASC;",
          preserveOrder: true,
          explanation: "Ranking, rather than just filtering, is what turns a list of flagged accounts into something a risk analyst can triage in priority order.",
        },
        {
          id: "l6-p4-t5",
          title: "Final prioritised list",
          prompt:
            "Produce the final dashboard-ready output: join back to accounts and customers to attach owner details. Return account_id, customer_id, name, segment, severity and risk_rank for the flagged accounts, ordered by risk_rank ascending.",
          hints: [
            "Join the ranked, flagged CTE to accounts (on account_id) and then to customers (on customer_id) to pull in name and segment.",
            "This is the same join-onto-a-pre-aggregated-CTE pattern from Level 3's 'fan-out' project — join AFTER aggregating, never before.",
            "... SELECT r.account_id, a.customer_id, c.name, c.segment, r.severity, r.risk_rank FROM ranked r JOIN accounts a ON r.account_id = a.account_id JOIN customers c ON a.customer_id = c.customer_id ORDER BY r.risk_rank ____;",
          ],
          solutionSql:
            "WITH periods AS (SELECT account_id, SUM(CASE WHEN date < '2024-01-01' THEN amount ELSE 0 END) AS early_net, SUM(CASE WHEN date >= '2024-01-01' THEN amount ELSE 0 END) AS recent_net, SUM(CASE WHEN date < '2024-01-01' THEN 1 ELSE 0 END) AS early_txn_count, SUM(CASE WHEN date >= '2024-01-01' THEN 1 ELSE 0 END) AS recent_txn_count FROM transactions GROUP BY account_id), flagged AS (SELECT account_id, (recent_net - early_net) + (early_txn_count - recent_txn_count) * 100 AS severity FROM periods WHERE recent_net > early_net AND recent_txn_count < early_txn_count), ranked AS (SELECT account_id, severity, RANK() OVER (ORDER BY severity DESC) AS risk_rank FROM flagged) SELECT r.account_id, a.customer_id, c.name, c.segment, r.severity, r.risk_rank FROM ranked r JOIN accounts a ON r.account_id = a.account_id JOIN customers c ON a.customer_id = c.customer_id ORDER BY r.risk_rank ASC;",
          preserveOrder: true,
          explanation: "This final layered pipeline — aggregate, flag, score, rank, then enrich with descriptive columns — is structured exactly like a query that would feed a live risk dashboard in production.",
        },
      ],
    },
  ],
};
