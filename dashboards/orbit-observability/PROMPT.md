# AI agent prompts: Orbit

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4. In a Next.js app, put the files under `components/` and import them from any page.

---

## Prompt 1: add it to my project

```
Add the "Orbit" dashboard from this folder to my web app as a new page.

Source of truth: react/src/components/orbit/ (React + TypeScript + Framer Motion, styles in react/src/components/orbit/orbit.css, scoped under one class so they won't leak). If my project is not React, use html/orbit.html instead; all the logic is in its <script>.

Steps:
1. Look at my stack: framework and router, TypeScript or not, where components live, how global CSS is loaded.
2. Copy the react/src/components/orbit/ folder into my components folder. Install framer-motion@11.18.2 if it's missing. Load Space Grotesk and JetBrains Mono (or tell me which of my fonts you mapped them to).
3. Add a route that renders <OrbitDashboard autoplayDemo={false} />.
4. If I use Next.js App Router, add "use client" at the top of OrbitDashboard.tsx.
5. Run my type-check and build.

Done when: the build passes, the console is clean, the page looks like preview.png at 1440 px and has no horizontal scroll at 390 px. The service map animates packets, the latency chart crosshair follows the pointer, the range switch morphs the lines, and the events table filters, searches, sorts and pages. Tell me which files you changed.
```

---

## Prompt 2: connect it to my data

```
Replace the mock data in the Orbit dashboard with my real data.

The data lives in react/src/components/orbit/data.ts: KPIS (six headline numbers with history), NODES and EDGES (the service map), genLatency() (p50/p95/p99 series per range), UPTIME, REGIONS, RESOURCES (cluster capacity), DEPLOYS, and seedEvents()/mkEvent() for the events table. The live tick is a useInterval in OrbitDashboard.tsx.

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
Restyle the Orbit dashboard (react/src/components/orbit/orbit.css) to match my design system.

1. Read my tokens (CSS variables, Tailwind theme, or tokens file) and my fonts.
2. Map the variables at the top of react/src/components/orbit/orbit.css to mine: --ink, --panel, --panel-2, --line, --text, --muted, --lime (accent), --violet, --cyan, --amber, --red, plus the C object in data.ts (the SVG charts read their colours from it). Change colours only through these variables.
3. Match card radius, borders and shadows to my existing cards.
4. Keep the motion timings, the 44 px touch targets, the focus rings and the Reduce Motion block.

Show me screenshots at 1440 px and 390 px.
```

---

## Prompt 4: port it to another framework

```
Rebuild the Orbit dashboard in the framework my project uses (Vue 3 with <script setup>, Svelte 5, Angular, or plain Web Components). Ask me if you can't tell. No chart or UI libraries: the charts are hand-written SVG, keep them that way.

What it is: a single-page observability dashboard: sidebar nav (drawer on phones), six KPI cards with count-up and sparklines, an SVG service map with moving packets (vertical layout under 560 px), a latency chart with p50/p95/p99, crosshair and range switch, uptime strips, a regions card with a small globe, cluster capacity rings, a deploy feed with an error budget, and an events table with level filters, search, sortable headers and pagination. A scripted demo tour runs while idle and stops on any input.

Use html/orbit.html as the visual and behavioural reference, and the React files for the component split. Keep the colours, the motion, the keyboard support and the Reduce Motion behaviour.

Done when: side-by-side with the HTML version at 1440 px and 390 px you can't tell them apart, and the console is clean.
```

---

More dashboards and components at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=prompt&utm_campaign=free_repo).
