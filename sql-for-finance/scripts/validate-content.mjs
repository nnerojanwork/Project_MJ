import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

// Transpile the TS content files to plain JS on the fly using esbuild (bundled with tsx) is overkill;
// instead we just regex-extract solutionSql strings directly from the TS source, which is all this
// validator needs to sanity check.

const contentDir = path.join(process.cwd(), "src", "content");
const files = ["level1.ts", "level2.ts", "level3.ts", "level4.ts", "level5.ts", "level6.ts"];

function extractSolutions(src, file) {
  const results = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?solutionSql:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  // Simpler: find each task block by scanning for `solutionSql:` and the preceding `id:`.
  const lines = src.split("\n");
  let currentId = null;
  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)",?\s*$/);
    if (idMatch && !lines[i].includes("levelId")) currentId = idMatch[1];
    if (lines[i].includes("solutionSql:")) {
      // solutionSql may span this line (string literal, possibly with escaped quotes), collect until the line ending in `",`
      let buffer = lines[i];
      let j = i;
      while (!/",\s*$/.test(buffer) && j < lines.length - 1) {
        j++;
        buffer += "\n" + lines[j];
      }
      const strMatch = buffer.match(/solutionSql:\s*"((?:[^"\\]|\\.)*)"/s);
      if (strMatch) {
        const sql = strMatch[1].replace(/\\"/g, '"').replace(/\\n/g, " ");
        results.push({ id: currentId, file, sql });
      }
      i = j;
    }
  }
  return results;
}

async function main() {
  const SQL = await initSqlJs({ locateFile: (f) => path.join(process.cwd(), "node_modules/sql.js/dist", f) });
  const buf = fs.readFileSync(path.join(process.cwd(), "public", "data", "finance.sqlite"));
  const db = new SQL.Database(new Uint8Array(buf));

  let total = 0;
  let failed = 0;
  for (const file of files) {
    const src = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const solutions = extractSolutions(src, file);
    for (const { id, sql } of solutions) {
      total++;
      try {
        const res = db.exec(sql);
        const rowCount = res.length ? res[0].values.length : 0;
        const colCount = res.length ? res[0].columns.length : 0;
        if (rowCount === 0) {
          console.warn(`WARN  ${file} ${id}: query returned 0 rows`);
        } else {
          console.log(`OK    ${file} ${id}: ${rowCount} rows, ${colCount} cols`);
        }
      } catch (err) {
        failed++;
        console.error(`FAIL  ${file} ${id}: ${err.message}`);
        console.error(`      SQL: ${sql}`);
      }
    }
  }
  console.log(`\n${total} solution queries checked, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
