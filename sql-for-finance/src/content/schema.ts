import { TableDef } from "./types";

export const TABLES: Record<string, TableDef> = {
  customers: {
    name: "customers",
    description: "One row per customer of the bank.",
    columns: [
      { name: "customer_id", type: "INTEGER", description: "Primary key" },
      { name: "name", type: "TEXT" },
      { name: "segment", type: "TEXT", description: "Retail, Mass Affluent, Private Banking, Student" },
      { name: "signup_date", type: "TEXT", description: "ISO date" },
      { name: "region", type: "TEXT" },
    ],
  },
  accounts: {
    name: "accounts",
    description: "Bank accounts, each belonging to one customer.",
    columns: [
      { name: "account_id", type: "INTEGER", description: "Primary key" },
      { name: "customer_id", type: "INTEGER", description: "Foreign key -> customers" },
      { name: "account_type", type: "TEXT", description: "current, savings, isa" },
      { name: "opened_date", type: "TEXT", description: "ISO date" },
      { name: "balance", type: "REAL", description: "Current balance, GBP" },
    ],
  },
  transactions: {
    name: "transactions",
    description: "Individual account transactions. Amounts are negative for outflows, positive for inflows (e.g. salary).",
    columns: [
      { name: "transaction_id", type: "INTEGER", description: "Primary key" },
      { name: "account_id", type: "INTEGER", description: "Foreign key -> accounts" },
      { name: "date", type: "TEXT", description: "ISO date" },
      { name: "amount", type: "REAL", description: "GBP, negative = spend, positive = credit" },
      { name: "category", type: "TEXT", description: "May be NULL" },
      { name: "merchant", type: "TEXT", description: "Raw merchant name, inconsistently cased/spaced. May be NULL." },
      { name: "channel", type: "TEXT", description: "card, online, direct_debit, atm, transfer" },
    ],
  },
  loans: {
    name: "loans",
    description: "Loan book, one row per loan.",
    columns: [
      { name: "loan_id", type: "INTEGER", description: "Primary key" },
      { name: "customer_id", type: "INTEGER", description: "Foreign key -> customers" },
      { name: "principal", type: "REAL", description: "Original loan amount, GBP" },
      { name: "interest_rate", type: "REAL", description: "Annual %, e.g. 4.5" },
      { name: "origination_date", type: "TEXT", description: "ISO date" },
      { name: "status", type: "TEXT", description: "current, delinquent, paid_off, default" },
      { name: "outstanding_balance", type: "REAL", description: "GBP still owed" },
    ],
  },
  stock_prices: {
    name: "stock_prices",
    description: "Daily OHLC price history for 5 fictional tickers, weekdays only, 2023-2024.",
    columns: [
      { name: "symbol", type: "TEXT" },
      { name: "date", type: "TEXT", description: "ISO date" },
      { name: "open", type: "REAL" },
      { name: "high", type: "REAL" },
      { name: "low", type: "REAL" },
      { name: "close", type: "REAL" },
      { name: "volume", type: "INTEGER" },
    ],
  },
  portfolios: {
    name: "portfolios",
    description: "One row per investment portfolio, owned by a customer.",
    columns: [
      { name: "portfolio_id", type: "INTEGER", description: "Primary key" },
      { name: "customer_id", type: "INTEGER", description: "Foreign key -> customers" },
      { name: "name", type: "TEXT" },
    ],
  },
  holdings: {
    name: "holdings",
    description: "Monthly quantity snapshots of each symbol held in a portfolio.",
    columns: [
      { name: "holding_id", type: "INTEGER", description: "Primary key" },
      { name: "portfolio_id", type: "INTEGER", description: "Foreign key -> portfolios" },
      { name: "symbol", type: "TEXT" },
      { name: "quantity", type: "REAL" },
      { name: "date", type: "TEXT", description: "ISO date of the snapshot" },
    ],
  },
};
