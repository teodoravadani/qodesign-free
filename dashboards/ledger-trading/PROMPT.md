# AI agent prompts: Ledger

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4. In a Next.js app, put the files under `components/` and import them from any page.

---

## Prompt 1: add it to my project

```
Add the "Ledger" dashboard from this folder to my web app as a new page.

Source of truth: react/src/components/ledger/ (React + TypeScript + Framer Motion, styles in react/src/components/ledger/ledger.css, scoped under one class so they won't leak). If my project is not React, use html/ledger.html instead; all the logic is in its <script>.

Steps:
1. Look at my stack: framework and router, TypeScript or not, where components live, how global CSS is loaded.
2. Copy the react/src/components/ledger/ folder into my components folder. Install framer-motion@11.18.2 if it's missing. Load Space Grotesk and JetBrains Mono (or tell me which of my fonts you mapped them to).
3. Add a route that renders <LedgerDashboard autoplayDemo={false} />.
4. If I use Next.js App Router, add "use client" at the top of LedgerDashboard.tsx.
5. Run my type-check and build.

Done when: the build passes, the console is clean, the page looks like preview.png at 1440 px and has no horizontal scroll at 390 px. Candles render with MA lines and volume, the crosshair reads OHLC, the order book flashes, the ticket validates and places a paper order, and clicking a watchlist row switches the chart. Tell me which files you changed.
```

---

## Prompt 2: connect it to my data

```
Replace the mock data in the Ledger dashboard with my real data.

react/src/components/ledger/store.ts is the only file that knows where numbers come from. Components read assets, cur, candles, book, trades and cash, and call setAsset, setTf, place and cancel. Pass your own LedgerStore via the store prop and the built-in tick switches off. Never send real orders from place() without asking me first; keep a confirm step.

1. Ask me where the data lives (REST endpoint, websocket, Supabase, tRPC) if you can't find it in my code.
2. Keep the shapes the components already read. Write small mapping functions from my API to those shapes instead of changing the components.
3. Keep the live updates: one subscription or poll at the top, not one per card.
4. Show a loading state (the cards keep their size, numbers show a dash) and an error state with a retry button.
5. Turn the demo tour off (autoplayDemo={false}).

Done when: real numbers show up, nothing jumps in size while loading, and the type-check passes.
```

---

## Prompt 3: restyle it to my brand

```
Restyle the Ledger dashboard (react/src/components/ledger/ledger.css) to match my design system.

1. Read my tokens (CSS variables, Tailwind theme, or tokens file) and my fonts.
2. Map the variables at the top of react/src/components/ledger/ledger.css to mine: --ink, --panel, --panel-2, --line, --text, --muted, --up, --down, --violet, --cyan, --amber, plus the C object in store.ts (the SVG chart reads its colours from it). Change colours only through these variables.
3. Match card radius, borders and shadows to my existing cards.
4. Keep the motion timings, the 44 px touch targets, the focus rings and the Reduce Motion block.

Show me screenshots at 1440 px and 390 px.
```

---

## Prompt 4: port it to another framework

```
Rebuild the Ledger dashboard in the framework my project uses (Vue 3 with <script setup>, Svelte 5, Angular, or plain Web Components). Ask me if you can't tell. No chart or UI libraries: the charts are hand-written SVG, keep them that way.

What it is: a trading dashboard: top bar with tabs and an animated underline, a scrolling ticker, a candlestick chart with MA 20/50, volume, crosshair and OHLC readout and an interval switch, an order book with depth bars and flashing rows, a buy/sell order ticket (limit/market, slider with stops, validation, busy and done states, toast), a portfolio donut with allocation list, a watchlist with sparklines that switches the chart, and a trades table (history/open tabs, side chips, search, sort, pagination, cancel). Prices tick every second. A scripted demo tour runs while idle and stops on any input.

Use html/ledger.html as the visual and behavioural reference, and the React files for the component split. Keep the colours, the motion, the keyboard support and the Reduce Motion behaviour.

Done when: side-by-side with the HTML version at 1440 px and 390 px you can't tell them apart, and the console is clean.
```

---

More dashboards and components at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=prompt&utm_campaign=free_repo).
