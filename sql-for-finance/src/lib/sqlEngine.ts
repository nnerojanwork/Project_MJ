import type { Database, QueryExecResult, SqlJsStatic } from "sql.js";

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export interface QueryError {
  error: string;
}

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
let dbPromise: Promise<Database> | null = null;

function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = import("sql.js").then((mod) =>
      mod.default({
        locateFile: (file: string) => `/data/${file}`,
      })
    );
  }
  return sqlJsPromise;
}

export function getDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await loadSqlJs();
      const res = await fetch("/data/finance.sqlite");
      const buf = await res.arrayBuffer();
      return new SQL.Database(new Uint8Array(buf));
    })();
  }
  return dbPromise;
}

function execResultToQueryResult(res: QueryExecResult[]): QueryResult {
  if (res.length === 0) return { columns: [], rows: [] };
  const { columns, values } = res[0];
  return { columns, rows: values };
}

export async function runQuery(sql: string): Promise<QueryResult | QueryError> {
  try {
    const db = await getDatabase();
    const res = db.exec(sql);
    return execResultToQueryResult(res);
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export function isQueryError(res: QueryResult | QueryError): res is QueryError {
  return (res as QueryError).error !== undefined;
}

export async function getSampleRows(table: string, limit = 5): Promise<QueryResult> {
  const res = await runQuery(`SELECT * FROM ${table} LIMIT ${limit}`);
  if (isQueryError(res)) return { columns: [], rows: [] };
  return res;
}
