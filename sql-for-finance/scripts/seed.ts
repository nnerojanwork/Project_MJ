/**
 * Generates the SQLite database used by the app.
 * Run with: npm run seed
 * Output: public/data/finance.sqlite (loaded client-side by sql.js)
 */
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
const round2 = (n: number) => Math.round(n * 100) / 100;

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(process.cwd(), "node_modules/sql.js/dist", file),
  });
  const db = new SQL.Database();

  db.run(`
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      segment TEXT NOT NULL,
      signup_date TEXT NOT NULL,
      region TEXT NOT NULL
    );

    CREATE TABLE accounts (
      account_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      account_type TEXT NOT NULL,
      opened_date TEXT NOT NULL,
      balance REAL NOT NULL
    );

    CREATE TABLE transactions (
      transaction_id INTEGER PRIMARY KEY,
      account_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      merchant TEXT,
      channel TEXT
    );

    CREATE TABLE loans (
      loan_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      principal REAL NOT NULL,
      interest_rate REAL NOT NULL,
      origination_date TEXT NOT NULL,
      status TEXT NOT NULL,
      outstanding_balance REAL NOT NULL
    );

    CREATE TABLE stock_prices (
      symbol TEXT NOT NULL,
      date TEXT NOT NULL,
      open REAL NOT NULL,
      high REAL NOT NULL,
      low REAL NOT NULL,
      close REAL NOT NULL,
      volume INTEGER NOT NULL
    );

    CREATE TABLE portfolios (
      portfolio_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE holdings (
      holding_id INTEGER PRIMARY KEY,
      portfolio_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);

  // ---------- customers ----------
  const segments = ["Retail", "Mass Affluent", "Private Banking", "Student"];
  const regions = ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol", "Leeds"];
  const firstNames = ["Olivia", "Liam", "Amara", "Noah", "Priya", "Jack", "Fatima", "George", "Ines", "Mohammed", "Grace", "Tom", "Aisha", "Harry", "Sofia", "Leo", "Chloe", "Omar", "Ellie", "Ravi"];
  const lastNames = ["Smith", "Patel", "Jones", "Khan", "Taylor", "Brown", "Ahmed", "Wilson", "Evans", "Hussain", "Clarke", "Roberts", "Walker", "Hughes", "Green", "Baker", "Ali", "Scott", "King", "Ward"];

  const NUM_CUSTOMERS = 220;
  const customers: { customer_id: number; name: string; segment: string; signup_date: string; region: string }[] = [];
  for (let i = 1; i <= NUM_CUSTOMERS; i++) {
    const signup = addDays(new Date("2021-01-01"), randInt(0, 1400));
    customers.push({
      customer_id: i,
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      segment: pick(segments),
      signup_date: toISO(signup),
      region: pick(regions),
    });
  }

  // Leave a handful of customers with no accounts at all, for LEFT JOIN tasks.
  const customersWithNoActivity = new Set([customers[5].customer_id, customers[42].customer_id, customers[100].customer_id, customers[150].customer_id]);

  // ---------- accounts ----------
  const accountTypes = ["current", "savings", "isa"];
  const accounts: { account_id: number; customer_id: number; account_type: string; opened_date: string; balance: number }[] = [];
  let accountIdSeq = 1;
  for (const c of customers) {
    if (customersWithNoActivity.has(c.customer_id)) continue;
    const numAccounts = randInt(1, 2);
    for (let a = 0; a < numAccounts; a++) {
      const opened = addDays(new Date(c.signup_date), randInt(0, 30));
      accounts.push({
        account_id: accountIdSeq++,
        customer_id: c.customer_id,
        account_type: pick(accountTypes),
        opened_date: toISO(opened),
        balance: round2(randInt(50, 45000) + rand()),
      });
    }
  }

  // ---------- transactions ----------
  const categories = ["groceries", "rent", "salary", "entertainment", "travel", "utilities", "dining", "transport", "healthcare", "subscriptions"];
  const merchantsByCategory: Record<string, string[]> = {
    groceries: ["Tesco", "SAINSBURYS", "aldi ", " Waitrose", "Lidl"],
    rent: ["Landlord Ltd", "RentCo Property Mgmt"],
    salary: ["Employer Payroll"],
    entertainment: ["Netflix", "  Spotify", "CINEWORLD", "steam games"],
    travel: ["National Rail", "BRITISH AIRWAYS", "uber  ", "TFL Travel"],
    utilities: ["British Gas", "THAMES WATER", "EE Mobile"],
    dining: ["Pret A Manger", "  Deliveroo", "NANDOS", "costa coffee"],
    transport: ["TFL Travel", "Uber", " Trainline"],
    healthcare: ["Boots Pharmacy", "NHS Dental"],
    subscriptions: ["Amazon Prime", "disney+", "GYM MEMBERSHIP"],
  };
  const channels = ["card", "online", "direct_debit", "atm", "transfer"];

  const transactions: { transaction_id: number; account_id: number; date: string; amount: number; category: string | null; merchant: string | null; channel: string | null }[] = [];
  let txnIdSeq = 1;
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2024-12-31");

  for (const acc of accounts) {
    const numTxns = randInt(25, 70);
    for (let t = 0; t < numTxns; t++) {
      const daySpan = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
      const date = addDays(startDate, randInt(0, daySpan));
      const category = pick(categories);
      let amount: number;
      if (category === "salary") amount = round2(randInt(1800, 5200));
      else if (category === "rent") amount = -round2(randInt(700, 2200));
      else amount = -round2(randInt(3, 400) + rand());

      // sprinkle in some messiness: occasional nulls, occasional very large "whale" txns
      const isNullMerchant = rand() < 0.03;
      const isNullCategory = rand() < 0.02;
      let finalAmount = amount;
      if (rand() < 0.01 && amount < 0) finalAmount = round2(amount * randInt(5, 12));

      transactions.push({
        transaction_id: txnIdSeq++,
        account_id: acc.account_id,
        date: toISO(date),
        amount: finalAmount,
        category: isNullCategory ? null : category,
        merchant: isNullMerchant ? null : pick(merchantsByCategory[category]),
        channel: pick(channels),
      });
    }
  }
  // A few duplicate-looking rows (same account/date/amount/merchant) for realism.
  for (let i = 0; i < 15; i++) {
    const src = transactions[randInt(0, transactions.length - 1)];
    transactions.push({ ...src, transaction_id: txnIdSeq++ });
  }
  transactions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  // ---------- loans ----------
  const loanStatuses = ["current", "delinquent", "paid_off", "default"];
  const loans: { loan_id: number; customer_id: number; principal: number; interest_rate: number; origination_date: string; status: string; outstanding_balance: number }[] = [];
  let loanIdSeq = 1;
  for (const c of customers) {
    if (customersWithNoActivity.has(c.customer_id)) continue;
    if (rand() < 0.55) continue; // not everyone has a loan
    const numLoans = rand() < 0.15 ? 2 : 1;
    for (let l = 0; l < numLoans; l++) {
      const principal = round2(randInt(2000, 350000));
      const origination = addDays(new Date(c.signup_date), randInt(10, 900));
      const status = pick(loanStatuses);
      const paidFraction = status === "paid_off" ? 1 : status === "default" ? rand() * 0.3 : rand() * 0.85;
      loans.push({
        loan_id: loanIdSeq++,
        customer_id: c.customer_id,
        principal,
        interest_rate: round2(randInt(250, 1200) / 100),
        origination_date: toISO(origination),
        status,
        outstanding_balance: status === "paid_off" ? 0 : round2(principal * (1 - paidFraction)),
      });
    }
  }

  // ---------- stock_prices ----------
  const tickers = ["ALBC", "NRTH", "WVRN", "CLDX", "FNTA"];
  const stockPrices: { symbol: string; date: string; open: number; high: number; low: number; close: number; volume: number }[] = [];
  for (const symbol of tickers) {
    let price = randInt(20, 200);
    let d = new Date("2023-01-01");
    while (d <= endDate) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        const drift = (rand() - 0.5) * (price * 0.03);
        const open = round2(price);
        const close = round2(Math.max(1, price + drift));
        const high = round2(Math.max(open, close) + rand() * (price * 0.01));
        const low = round2(Math.max(0.5, Math.min(open, close) - rand() * (price * 0.01)));
        stockPrices.push({ symbol, date: toISO(d), open, high, low, close, volume: randInt(50000, 4_000_000) });
        price = close;
      }
      d = addDays(d, 1);
    }
  }

  // ---------- portfolios / holdings ----------
  const portfolios: { portfolio_id: number; customer_id: number; name: string }[] = [];
  const holdings: { holding_id: number; portfolio_id: number; symbol: string; quantity: number; date: string }[] = [];
  let portfolioIdSeq = 1;
  let holdingIdSeq = 1;
  const investorCustomers = customers.filter((c) => c.segment === "Mass Affluent" || c.segment === "Private Banking").slice(0, 40);
  for (const c of investorCustomers) {
    const pid = portfolioIdSeq++;
    portfolios.push({ portfolio_id: pid, customer_id: c.customer_id, name: `${c.name.split(" ")[0]}'s Portfolio` });
    const heldSymbols = new Set<string>();
    const numHoldings = randInt(2, 4);
    while (heldSymbols.size < numHoldings) heldSymbols.add(pick(tickers));
    for (const symbol of heldSymbols) {
      // quantity snapshot recorded monthly across the period so daily portfolio value can be computed
      let qty = randInt(10, 500);
      let d = new Date("2023-01-01");
      while (d <= endDate) {
        holdings.push({ holding_id: holdingIdSeq++, portfolio_id: pid, symbol, quantity: qty, date: toISO(d) });
        if (rand() < 0.3) qty = Math.max(0, qty + randInt(-40, 60));
        d = addDays(d, 30);
      }
    }
  }

  // ---------- bulk insert ----------
  function insertMany(table: string, columns: string[], rows: Record<string, unknown>[]) {
    const placeholders = columns.map(() => "?").join(",");
    const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(",")}) VALUES (${placeholders})`);
    db.run("BEGIN");
    for (const row of rows) {
      stmt.run(columns.map((c) => row[c] as any));
    }
    db.run("COMMIT");
    stmt.free();
  }

  insertMany("customers", ["customer_id", "name", "segment", "signup_date", "region"], customers);
  insertMany("accounts", ["account_id", "customer_id", "account_type", "opened_date", "balance"], accounts);
  insertMany("transactions", ["transaction_id", "account_id", "date", "amount", "category", "merchant", "channel"], transactions);
  insertMany("loans", ["loan_id", "customer_id", "principal", "interest_rate", "origination_date", "status", "outstanding_balance"], loans);
  insertMany("stock_prices", ["symbol", "date", "open", "high", "low", "close", "volume"], stockPrices);
  insertMany("portfolios", ["portfolio_id", "customer_id", "name"], portfolios);
  insertMany("holdings", ["holding_id", "portfolio_id", "symbol", "quantity", "date"], holdings);

  db.run("CREATE INDEX idx_txn_account ON transactions(account_id);");
  db.run("CREATE INDEX idx_txn_date ON transactions(date);");
  db.run("CREATE INDEX idx_accounts_customer ON accounts(customer_id);");
  db.run("CREATE INDEX idx_loans_customer ON loans(customer_id);");
  db.run("CREATE INDEX idx_stock_symbol_date ON stock_prices(symbol, date);");
  db.run("CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);");

  const outDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const bytes = db.export();
  fs.writeFileSync(path.join(outDir, "finance.sqlite"), Buffer.from(bytes));

  // Copy the sql.js wasm binary into public so it can be fetched client-side.
  // sql.js's browser/ESM entry point (used by src/lib/sqlEngine.ts) requests "sql-wasm-browser.wasm".
  const distDir = path.join(process.cwd(), "node_modules", "sql.js", "dist");
  fs.copyFileSync(path.join(distDir, "sql-wasm-browser.wasm"), path.join(outDir, "sql-wasm-browser.wasm"));

  console.log(`Seeded database with:
  customers:      ${customers.length}
  accounts:       ${accounts.length}
  transactions:   ${transactions.length}
  loans:          ${loans.length}
  stock_prices:   ${stockPrices.length}
  portfolios:     ${portfolios.length}
  holdings:       ${holdings.length}
Written to public/data/finance.sqlite (${(bytes.length / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
