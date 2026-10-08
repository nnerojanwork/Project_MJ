// Inlines jsPDF into src/app.html -> index.html so the app is one self-contained, offline file.
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url);
const app = readFileSync(new URL('src/app.html', dir), 'utf8');
const lib = readFileSync(new URL('vendor/jspdf.umd.min.js', dir), 'utf8');
if (/<\/script/i.test(lib)) throw new Error('jsPDF bundle contains </script>, cannot inline');
const out = app.replace('<!-- JSPDF -->', () => `<script>\n${lib}\n</script>`);
writeFileSync(new URL('index.html', dir), out);
console.log(`index.html written (${(out.length / 1024).toFixed(0)} KB)`);
