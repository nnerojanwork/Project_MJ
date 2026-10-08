"use client";

import { useEffect, useState } from "react";
import { TABLES } from "@/content/schema";
import { getSampleRows } from "@/lib/sqlEngine";

export function SchemaPanel({ tables }: { tables: string[] }) {
  const [openTable, setOpenTable] = useState<string | null>(tables[0] ?? null);
  const [samples, setSamples] = useState<Record<string, { columns: string[]; rows: unknown[][] }>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenTable(tables[0] ?? null);
    setSamples({});
  }, [tables.join(",")]);

  useEffect(() => {
    if (!openTable || samples[openTable] || loading[openTable]) return;
    setLoading((s) => ({ ...s, [openTable]: true }));
    getSampleRows(openTable).then((res) => {
      setSamples((s) => ({ ...s, [openTable]: res }));
      setLoading((s) => ({ ...s, [openTable]: false }));
    });
  }, [openTable]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-ink-700 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Schema</h3>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {tables.map((tableName) => {
          const table = TABLES[tableName];
          if (!table) return null;
          const isOpen = openTable === tableName;
          const sample = samples[tableName];
          return (
            <div key={tableName} className="border-b border-ink-800">
              <button
                onClick={() => setOpenTable(isOpen ? null : tableName)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-ink-800/50"
              >
                <span className="font-mono text-sm text-slate-200">{table.name}</span>
                <span className="text-xs text-slate-500">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-3">
                  <p className="mb-2 text-xs leading-relaxed text-slate-400">{table.description}</p>
                  <div className="scrollbar-thin overflow-x-auto rounded border border-ink-700">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-ink-800/60 text-slate-400">
                          <th className="px-2 py-1.5 font-medium">column</th>
                          <th className="px-2 py-1.5 font-medium">type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col) => (
                          <tr key={col.name} className="border-t border-ink-800">
                            <td className="px-2 py-1.5 font-mono text-slate-200">{col.name}</td>
                            <td className="px-2 py-1.5 text-slate-500">{col.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Sample rows</div>
                    {!sample ? (
                      <div className="text-xs text-slate-500">Loading…</div>
                    ) : (
                      <div className="scrollbar-thin overflow-x-auto rounded border border-ink-700">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-ink-800/60 text-slate-400">
                              {sample.columns.map((c) => (
                                <th key={c} className="whitespace-nowrap px-2 py-1.5 font-medium">
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sample.rows.map((row, i) => (
                              <tr key={i} className="border-t border-ink-800">
                                {row.map((cell, j) => (
                                  <td key={j} className="whitespace-nowrap px-2 py-1.5 font-mono text-slate-300">
                                    {cell === null ? <span className="italic text-slate-600">NULL</span> : String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
