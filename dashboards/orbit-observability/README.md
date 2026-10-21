# Orbit: infrastructure observability dashboard

A dark ops dashboard for a fleet of services. Six KPI cards count up and draw their sparklines, a service map sends packets along its edges, the latency chart shows p50, p95 and p99 with a crosshair and morphs when you change the range, and there are uptime strips, regions on a small globe, cluster capacity rings, a deploy feed with an error budget, and an events table you can filter, search, sort and page through. On a phone the sidebar becomes a drawer and the service map turns vertical.

![Orbit preview](preview.gif)

**Live demo:** [HTML version](https://teodoravadani.github.io/qodesign-free/orbit/) · [React version](https://teodoravadani.github.io/qodesign-free/orbit/react/)

The demo plays by itself: it hovers the chart, switches ranges, filters the table. Touch anything and it stops; leave it for 4 seconds and it picks up again. Add `?demo=0` to the URL to turn the tour off.

## What's inside

- `html/orbit.html`: the whole dashboard in one file (HTML, CSS, plain JS, no build step, no dependencies besides Google Fonts).
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/orbit/OrbitDashboard.tsx`: the page shell (sidebar, top bar, layout, demo tour).
  - `Kpis.tsx`, `ServiceMap.tsx`, `LatencyChart.tsx`, `Panels.tsx` (uptime, regions, clusters, deploys), `EventsTable.tsx`: one file per section.
  - `data.ts`: the mock data and the simulated live feed. Replace this with your own API.
  - `kit.tsx`: small shared pieces (count-up, sparkline, tooltip, interval hook).
  - `motionPresets.ts`: the springs and easings, in one place.
  - `orbit.css`: styles, scoped under `.orbit`, tokens at the top.
- `PROMPT.md`: prompts for AI coding agents.

## Next.js
Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4.

Copy `react/src/components` into your app and import it from any page, server pages included.
Checked on Oct 20, 2026 in a clean Next.js 15 + React 19 + Tailwind v4 app (strict TypeScript, `next build`, static prerender, no hydration warnings) and in the Vite + React 18 + Tailwind v3 project in `react/`.

- The demo data is live and random, so the dashboard draws itself right after mount. The server HTML is an empty panel with the same background, which keeps hydration clean.

## Install

shadcn CLI (copies the React files into your project):

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/orbit-dashboard.json
```

Or grab the single HTML file:

```bash
curl -O https://raw.githubusercontent.com/teodoravadani/qodesign-free/main/dashboards/orbit-observability/html/orbit.html
```

## Run the React demo

```bash
cd react
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in react/dist
```

## Use it

Dependencies: `react`, `react-dom`, `framer-motion` 11.18.2. Fonts: Space Grotesk and JetBrains Mono.

```tsx
import { OrbitDashboard } from './components/orbit/OrbitDashboard';

export default function Page() {
  return <OrbitDashboard autoplayDemo={false} onNavigate={(item) => console.log(item)} />;
}
```

| Prop | Type | Default | What it does |
|---|---|---|---|
| `autoplayDemo` | `boolean` | `true` | run the hands-free tour while nobody touches the page |
| `onNavigate` | `(label: string) => void` | | called when a sidebar item is picked |

To show real numbers, edit `data.ts`. The sections read what it exports: `KPIS`, `NODES` and `EDGES` for the map, `genLatency()` for the chart, `UPTIME`, `REGIONS`, `RESOURCES`, `DEPLOYS`, and `seedEvents()` / `mkEvent()` for the table. The live ticking is a `useInterval` in `OrbitDashboard.tsx`; swap it for your websocket.

## Accessibility

- Every chart has a text label, and the KPI values are real text, not canvas.
- The range picker and table filters are keyboard reachable with visible focus rings. The table headers are buttons with `aria-sort`.
- The mobile drawer closes on `Esc`, on a tap on the scrim, and when you pick a page. The scrim blurs the page behind it.
- Touch targets are at least 44 px on phones.
- With Reduce Motion on, numbers appear without counting, packets stop, and the tour still works without movement.

## Licence

MIT. Use it in anything, commercial included. A link back is nice but not required.

More dashboards and components (paid) at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
