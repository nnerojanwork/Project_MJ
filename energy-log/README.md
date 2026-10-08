# Energy Log

A daily energy, sleep and habits log in one self-contained HTML file (`index.html`). It has no backend, keeps everything in `localStorage`, and works offline.

- **Use it:** open `index.html`, or host the `energy-log/` folder (with `sw.js` alongside so it also opens offline from the home screen).
- **Edit it:** change `src/app.html`, then run `node build.mjs`. The build puts jsPDF (`vendor/`) inside `index.html`.

Data stays in the browser it was logged in. Different origins (file:// vs a hosted URL) don't share storage, so use the Backup tab's JSON export/import to move data between them or keep it safe.
