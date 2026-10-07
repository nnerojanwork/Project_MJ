# Pricing Study

Mobile-first, offline study app for the 10-week *Pricing Strategy Profitability and Commercial Execution* syllabus. It opens straight into a quick round (up to 5 tap-only items, under 2 minutes). Your progress is saved after every tap and stays on the device.

## Run locally

```bash
cd pricing-study
npm install
npm run dev          # http://localhost:5173
npm test             # Vitest: calculators, spaced repetition, round builder, import/export
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build (service worker active, test offline here)
npm run validate-content   # check generated.json IDs, limits and recomputed quiz answers
```

To open it on your phone while developing, run `npm run dev -- --host` and visit the Network URL shown, with the phone on the same Wi-Fi. The service worker, and so offline mode, only runs in the production build or on HTTPS.

## Deploy to Vercel

This folder sits inside the `my-london-app` repo, so point Vercel at it:

1. Vercel dashboard → **Add New → Project** → import the `my-london-app` repo.
2. Set **Root Directory** to `pricing-study`. The framework preset (Vite), build command (`npm run build`) and output directory (`dist`) are detected automatically.
3. Deploy. Every push to the production branch redeploys.

Or from the CLI:

```bash
cd pricing-study
npx vercel          # first time: link or create the project, accept the detected Vite settings
npx vercel --prod
```

When you deploy a new version, the app updates itself the next time you open it with a connection.

## Add to Home Screen

**iPhone (Safari only):** open the deployed URL in Safari → Share button → **Add to Home Screen** → Add. Launch it from the icon, which opens it full-screen in Quick Round mode.
Note: on iOS the home-screen app has **separate storage from Safari**. Do your studying in the installed app. To move data between them, use Settings → Export / Import.

**Android (Chrome):** open the URL → ⋮ menu → **Add to Home screen** / **Install app** (Chrome may also show an install banner).

Open the app once while online after installing, so everything is cached. After that it works fully offline.

## Moving phones / backups

Everything (self-checks, flashcard schedule, quiz stats, journal, research log) is stored in `localStorage` under one key. **Settings → Export JSON** saves a file (on iPhone this opens the share sheet; pick "Save to Files" or AirDrop). On the new device use **Settings → Import from file**, or paste the JSON. An import replaces that device's data.

## Editing content

Content is kept separate from the UI. Edit the JSON and rebuild; no component changes are needed.

| File | What it holds |
|---|---|
| `src/content/syllabus.json` | Verbatim text from `Pricing_economics.docx`. Regenerate with `python3 scripts/extract_syllabus.py path/to/Pricing_economics.docx` (this overwrites manual edits). |
| `src/content/generated.json` | AI-generated explainers, worked examples, quiz, flashcards, "explain it" cards, formula notes. Shown in the app with an "AI-generated, verify" tag. |

Keep IDs (`w3-c2`, `fc-t-pocket-price`, `w5-q1` …) stable. Saved progress is keyed by them. After editing, run `npm run validate-content` and `npm test`.

## How it works

- **Quick round:** due cards first (oldest first), then new cards (up to 4 per round, 15 per day), then one quiz question or concept card, alternating between rounds. At least 3 items per round. Only weeks 1 to your current week are used (set it on Home or in Settings).
- **5-minute session** (Home): 12 items, about three-quarters cards and a quarter quiz/concept.
- **Spaced repetition:** Leitner boxes. Again → back in 5 minutes. Good → next box. Easy → skip a box. Intervals 1, 3, 7, 16, 35 days.
- **Weak topics:** any concept with 2 or more attempts and under 60% accuracy. Listed on the Quiz screen, with a "Weak topics" quiz mode.

## Formula interpretations

The syllabus formula table leaves a few things open. The calculators (`src/lib/calc.ts`, tested in `src/lib/calc.test.ts`) use these interpretations:

- **Price elasticity:** the doc does not say how to compute % changes. Arc (midpoint) is the default because the Week 2 exercise asks for it; simple % change is shown alongside.
- **Margin vs markup:** margin's formula says "cost of goods sold" and markup's says "cost". Both use the same unit-cost input so they are comparable.
- **Required new volume:** assumes variable cost per unit is unchanged, as the doc states. Break-even volume change = old ÷ new unit contribution − 1.
- **ROI:** net. Incremental profit already subtracts implementation cost, so ROI = incremental profit ÷ cost (not minus the cost again). Example: 137,500 / 60,000 = 229%.
- **Price inputs:** realised net price, per the doc's note to use it when discounts are material.
- **Week 1 exercise:** the price increase is applied to list price with the discount rate held constant, so net price rises by the same %.
