import type { TestSession } from "@/types";
import type { FlatQuestion } from "@/lib/flatten";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}

export function buildReportHtml(session: TestSession, flatQuestions: FlatQuestion[]): string {
  const byKey = new Map(flatQuestions.map((fq) => [fq.key, fq]));
  const total = session.answers.length;
  const correctCount = session.answers.filter((a) => a.correct).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const startedDate = new Date(session.startedAt).toLocaleString();

  const rows = session.answers
    .map((a, i) => {
      const fq = byKey.get(a.questionId);
      if (!fq) return "";
      const { question, set } = fq;
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const statusLabel = a.timedOut ? "Timed out" : a.correct ? "Correct" : "Incorrect";
      const statusColor = a.timedOut ? "#dc2626" : a.correct ? "#2f6f4f" : "#dc2626";

      const optionsHtml = question.options
        .map((o) => {
          const isCorrect = o.id === question.correctOptionId;
          const isSelected = o.id === a.selectedOptionId;
          const marker = isCorrect ? " ✓ correct" : isSelected ? " ✗ your answer" : "";
          const weight = isCorrect || isSelected ? "font-weight:600;" : "";
          return `<li style="${weight}">${escapeHtml(o.id.toUpperCase())}. ${escapeHtml(o.text)}${marker}</li>`;
        })
        .join("");

      return `
        <section style="margin-bottom:24px;padding:16px;border:1px solid #d8dee8;border-radius:8px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.03em;color:#5c6b85;">
            Question ${i + 1} &middot; ${escapeHtml(set.title)} &middot; ${escapeHtml(question.category)}
          </div>
          <p style="font-weight:600;margin:8px 0;">${escapeHtml(question.prompt)}</p>
          <ul style="margin:0 0 8px 20px;padding:0;">${optionsHtml}</ul>
          <p style="margin:4px 0;color:${statusColor};font-weight:600;">${statusLabel}${
        !a.timedOut ? ` &middot; ${a.timeTakenSeconds}s` : ""
      }</p>
          ${
            question.explanation
              ? `<p style="margin:8px 0 0;padding:8px 12px;background:#f4f6f9;border-radius:6px;font-size:14px;">${escapeHtml(
                  question.explanation
                )}</p>`
              : correctOption
              ? `<p style="margin:8px 0 0;color:#2f6f4f;">Correct answer: ${escapeHtml(correctOption.text)}</p>`
              : ""
          }
        </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Cognitive Assessment Report</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f1521; background: #f4f6f9; margin: 0; padding: 32px; }
  .wrap { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .meta { color: #5c6b85; font-size: 13px; margin-bottom: 24px; }
  .score-row { display: flex; gap: 16px; margin-bottom: 24px; }
  .score-box { flex: 1; background: white; border: 1px solid #d8dee8; border-radius: 8px; padding: 16px; }
  .score-box .label { font-size: 12px; color: #5c6b85; }
  .score-box .value { font-size: 24px; font-weight: 700; }
  ul { list-style: none; }
  @media print { body { background: white; } }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Cognitive Assessment Report</h1>
    <div class="meta">${escapeHtml(session.type)} &middot; ${escapeHtml(session.level)} &middot; ${escapeHtml(startedDate)}</div>
    <div class="score-row">
      <div class="score-box"><div class="label">Score</div><div class="value">${correctCount} / ${total}</div></div>
      <div class="score-box"><div class="label">Accuracy</div><div class="value">${accuracy}%</div></div>
    </div>
    ${rows}
    <p style="color:#5c6b85;font-size:12px;margin-top:24px;">Tip: use your browser's Print &rarr; Save as PDF for a PDF copy of this report.</p>
  </div>
</body>
</html>`;
}

export function downloadTextFile(filename: string, content: string, mime = "text/html"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
