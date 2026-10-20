# Ledger: trading desk dashboard

A dark trading screen for crypto, stocks and FX. Candlesticks with MA 20 and MA 50 and a volume strip, a crosshair that reads out open, high, low and close, an order book whose rows flash as sizes change, a buy and sell ticket with a slider and validation, a portfolio donut, a watchlist with sparklines (tap one to chart it) and a trades table with open orders you can cancel. Prices tick every second. Everything is simulated, so nothing here touches real money.

![Ledger preview](preview.gif)

**Live demo:** [HTML version](https://teodoravadani.github.io/qodesign-free/ledger/) · [React version](https://teodoravadani.github.io/qodesign-free/ledger/react/)

The demo plays by itself: it scrubs the chart, drags the order slider, highlights a slice of the portfolio, changes the interval and filters the table. Touch anything and it stops; after 4 seconds without input it starts again. Add `?demo=0` to the URL to turn it off.

## What's inside

- `html/ledger.html`: the whole dashboard in one file (HTML, CSS, plain JS, no build step).
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/ledger/LedgerDashboard.tsx`: the page (top bar, ticker, layout, toast, demo tour).
  - `ChartCard.tsx`: candles, moving averages, volume, crosshair, interval switch.
  - `Panels.tsx`: order book, order ticket, portfolio, watchlist, trades table.
  - `store.ts`: the simulated market (prices, candles, book, orders). Replace it with your feed.
  - `CountUp.tsx`, `motionPresets.ts`: number easing and shared springs.
  - `ledger.css`: styles, scoped under `.ledger`, tokens at the top.
- `PROMPT.md`: prompts for AI coding agents.

## Next.js
Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4.

Copy `react/src/components` into your app and import it from any page, server pages included.
Checked on Oct 20, 2026 in a clean Next.js 15 + React 19 + Tailwind v4 app (strict TypeScript, `next build`, static prerender, no hydration warnings) and in the Vite + React 18 + Tailwind v3 project in `react/`.

- The demo data is live and random, so the dashboard draws itself right after mount. The server HTML is an empty panel with the same background, which keeps hydration clean.

## Install

shadcn CLI (copies the React files into your project):

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/ledger-dashboard.json
```

Or grab the single HTML file:

```bash
curl -O https://raw.githubusercontent.com/teodoravadani/qodesign-free/main/dashboards/ledger-trading/html/ledger.html
```

## Run the React demo

```bash
cd react
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in react/dist
```

## Use it

Dependencies: `react`, `react-dom`, `framer-motion`. Fonts: Space Grotesk and JetBrains Mono.

```tsx
import { LedgerDashboard } from './components/ledger/LedgerDashboard';

export default function Page() {
  return <LedgerDashboard autoplayDemo={false} />;
}
```

| Prop | Type | Default | What it does |
|---|---|---|---|
| `autoplayDemo` | `boolean` | `true` | run the hands-free tour while nobody touches the page |
| `store` | `LedgerStore` | built-in simulation | pass your own store; when you do, the built-in one-second tick is off and you call `marketTick()` (or set fields and emit) from your feed |

`store.ts` is the only file that knows where numbers come from. The components read `assets`, `cur`, `candles`, `book`, `trades` and `cash`, and call `setAsset`, `setTf`, `place` and `cancel`. Point those at your exchange API and the UI follows.

## Accessibility

- Side (buy/sell) and the candle interval are radio groups that work with arrow keys. Table tabs, filter chips and sort headers are real buttons with `aria-selected`, `aria-pressed` and `aria-sort`.
- Order book rows are buttons: Enter copies that price into the ticket.
- The ticket says why it can't submit ("Not enough USD for this amount.") in a `role="alert"` line, and the toast is a polite live region.
- Watchlist rows have full spoken labels (name, price, change).
- Touch targets are at least 44 px on phones, and on phones the ticket comes right after the chart.
- With Reduce Motion on, numbers don't count, candles don't stagger in, and the price pulse stops.

## Licence

MIT. Use it in anything, commercial included.

More dashboards and components (paid) at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
