"use client";

import { QueryResult } from "@/lib/sqlEngine";

export function ResultsTable({ result, maxRows = 100 }: { result: QueryResult; maxRows?: number }) {
  if (result.columns.length === 0) {
    return <p className="px-1 py-2 text-xs text-slate-500">Query returned no columns.</p>;
  }

  const rows = result.rows.slice(0, maxRows);

  return (
    <div className="scrollbar-thin overflow-auto rounded border border-ink-700">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-ink-800">
          <tr>
            {result.columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-2.5 py-1.5 font-medium text-slate-300">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-ink-800 odd:bg-ink-950/40">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-2.5 py-1.5 font-mono text-slate-300">
                  {cell === null ? <span className="italic text-slate-600">NULL</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length > maxRows && (
        <div className="border-t border-ink-800 px-2.5 py-1.5 text-[11px] text-slate-500">
          Showing first {maxRows} of {result.rows.length} rows.
        </div>
      )}
      {result.rows.length === 0 && <div className="px-2.5 py-3 text-xs text-slate-500">0 rows returned.</div>}
    </div>
  );
}
