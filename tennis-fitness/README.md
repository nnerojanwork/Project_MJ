# Tennis Fitness Tracker

A single-page app for tracking a 4-day/week tennis performance, ankle stability,
and rotational core program, and your adherence to it.

## Features

- **Today view** — the 4-day program with tap-to-complete checkboxes per
  exercise, and a one-tap "Mark whole session done" button per day.
- **Session logging** — date, which exercises were done, and an optional
  note per session or per exercise (e.g. "used heavier band", "left ankle
  felt tight"). You can also log a missed day retroactively via the date
  picker on the Today screen.
- **Adherence tracking** — % of scheduled sessions completed this week/month,
  plus a current streak of consecutive weeks with all 4 sessions done.
- **History** — a calendar heatmap of the last 10 weeks, plus a list of
  recent sessions.
- **Progress chart** — weekly adherence % over the last 8 weeks.
- **Editable exercise library** — adjust sets/reps or swap exercises for any
  day without touching code (Library tab).
- **Rest timer** — 30/60/90s presets with a sound + vibration when time's up.

All data (program edits, logged sessions) is stored locally in the browser
(`localStorage`) so it survives reloads and new visits on the same device.

## Installing on iPhone (offline-capable app, no App Store needed)

This app is a installable PWA (Progressive Web App):

1. Deploy it (e.g. to Vercel) or run it locally and open the URL in **Safari**
   on your iPhone.
2. Tap the **Share** icon, then **Add to Home Screen**.
3. Launch it from the home screen icon — it opens full-screen, without
   Safari's UI, and keeps working offline (a service worker caches the app
   shell).

Since data lives in that installed instance's local storage, keep using the
same home-screen icon so your history stays intact.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```
