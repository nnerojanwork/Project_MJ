export function DataTable({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n").filter(Boolean);
  const headers = lines[0]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const rows = lines.slice(2).map((line) =>
    line
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-700/20">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink-900 text-paper">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-ink-950/[0.03]"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
