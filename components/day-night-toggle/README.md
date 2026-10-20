# Day / Night Toggle

A theme switch you'll want to click twice. The sun rolls across and turns into a moon with craters, the clouds drop out of the sky, stars fall in one after another, and the page changes theme with it.

![Day / Night Toggle preview](preview.gif)

**Live demo:** [HTML version](https://teodoravadani.github.io/qodesign-free/day-night-toggle/) · [React version](https://teodoravadani.github.io/qodesign-free/day-night-toggle/react/)

The demo flips by itself every few seconds. Click or press a key and it stops; leave it for 4 seconds and it starts again. `?demo=0` turns it off.

## What's inside

- `html/day-night-toggle.html`: one file, plain HTML, CSS and a few lines of JS.
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/DayNightToggle.tsx`: the drop-in component.
  - `react/src/App.tsx`: the demo page.
- `PROMPT.md`: prompts for AI coding agents.

## Next.js
Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4.

Copy `react/src/components` into your app and import it from any page, server pages included.
Checked on Oct 20, 2026 in a clean Next.js 15 + React 19 + Tailwind v4 app (strict TypeScript, `next build`, static prerender, no hydration warnings) and in the Vite + React 18 + Tailwind v3 project in `react/`.

## Install

shadcn CLI:

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/day-night-toggle.json
```

Or the single HTML file:

```bash
curl -O https://raw.githubusercontent.com/teodoravadani/qodesign-free/main/components/day-night-toggle/html/day-night-toggle.html
```

## Run the React demo

```bash
cd react
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in react/dist
```

## Use it

Dependencies: `react`, `react-dom`, `framer-motion`, Tailwind CSS 3 (make sure Tailwind scans the component's folder).

```tsx
import DayNightToggle from './components/DayNightToggle';

<DayNightToggle
  width={160}
  onChange={(night) => document.documentElement.classList.toggle('dark', night)}
/>
```

| Prop | Type | Default | What it does |
|---|---|---|---|
| `defaultNight` | `boolean` | `false` | start in night mode (uncontrolled) |
| `night` | `boolean` | | control the state yourself, together with `onChange` |
| `onChange` | `(night: boolean) => void` | | called after every toggle; switch your app theme here |
| `width` | `number` | `640` | width in px; the switch scales from its 640 × 256 design |
| `label` | `string` | `"Dark mode"` | accessible name of the switch |

## Motion, if you restyle it

- Knob: slides and turns 360°, 0.8 s, `cubic-bezier(.7,-0.3,.3,1.3)` (that slight overshoot is the whole charm).
- Sun to moon colour and glow: 0.8 s. Craters fade in after 0.3 s.
- 22 stars drop from 300 px above, 0.7 s, random 0 to 0.35 s stagger.
- 3 clouds fall 240 px, 0.8 s ease-in, 0 / 60 / 120 ms apart.
- Sky: `#5DB8FF → #A8DBFF` by day, `#0B1033 → #27306B` at night.

## Accessibility

- It's a real `role="switch"` with `aria-checked`, reachable with Tab and toggled with Space or Enter. The focus ring is visible.
- With Reduce Motion on, nothing rolls or falls: the knob moves and the sky cross-fades in 0.2 s.

## Licence

MIT. Use it anywhere.

More animated components at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
