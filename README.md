# qodesign-free

[![npm](https://img.shields.io/npm/v/qodesign-free?color=8B6CFF&label=npm)](https://www.npmjs.com/package/qodesign-free) [![license](https://img.shields.io/npm/l/qodesign-free?color=C6FF3D)](LICENSE)

**Free kit:** 8 AI prompts for Cursor, v0 and Lovable, a 16-prompt PDF and one more piece of your choice. [Get it at qodesign.dev/free](https://qodesign.dev/free?utm_source=github&utm_campaign=qodesign-free&utm_content=readme_top)

[![Orbit dashboard demo](dashboards/orbit-observability/preview.gif)](https://teodoravadani.github.io/qodesign-free/orbit/)

Animated React + Tailwind components for AI-first builders who ship with Cursor, Lovable, v0 or Claude Code. Every folder has a `PROMPT.md`, so your agent can install a piece, wire it to your data and restyle it.

Four components and two full dashboards, written in TypeScript with Tailwind CSS and Framer Motion. They install with the shadcn CLI and work in Next.js, Vite and Lovable apps. MIT licensed.

Tested in a clean Next.js 15 app (React 19, Tailwind v4, App Router, `next build`) and in the Vite + React 18 + Tailwind v3 demo project inside each folder. Peer dependencies are React 18 or 19 and framer-motion 11 or newer.

**[Live demos](https://teodoravadani.github.io/qodesign-free/)** · **[qodesign.dev](https://qodesign.dev/components?utm_source=github&utm_medium=readme&utm_campaign=free_repo&utm_content=nav)**

The shadcn CLI needs a `components.json` in your project. In a fresh Next.js app, run this once first:

```bash
npx shadcn@latest init
```

Then add any piece:

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/toast-stack.json
```

That copies the source into `components/<name>/` and installs `framer-motion` 11.18.2, the version we test with. The code is yours to edit from there.

This route needs Tailwind CSS in your project for the Day / Night Toggle, because its source uses Tailwind classes. The other five bring their own CSS file and work without Tailwind. The npm route below needs no Tailwind at all.

The registry index is at [`r/registry.json`](https://teodoravadani.github.io/qodesign-free/r/registry.json) and every item lives at `https://teodoravadani.github.io/qodesign-free/r/<name>.json`.

## Or let your AI agent do it

```bash
npx skills add teodoravadani/qodesign-free
```

This adds the repo's Agent Skill ([`skills/qodesign-free/SKILL.md`](skills/qodesign-free/SKILL.md)) to your project. Cursor, Claude Code and other coding agents then know how to install each piece and follow the qodesign motion rules when they add animation.

## Or install from npm

```bash
npm i qodesign-free framer-motion@11.18.2
```

Import each component from its own path. You only ship the CSS for what you use (about 10 KB of CSS for the toast stack and the toggle, against about 90 KB from the package root, which pulls in both dashboards):

```tsx
import { Toaster, toast } from 'qodesign-free/toast-stack';
import { DayNightToggle } from 'qodesign-free/day-night-toggle';
// also: 'qodesign-free/pricing-switch', 'qodesign-free/upload-dropzone',
//       'qodesign-free/orbit-dashboard', 'qodesign-free/ledger-dashboard'
```

`import { ... } from 'qodesign-free'` still works if you want everything in one line.

Each component brings its own stylesheet and starts with `'use client'`, so you can drop it into a Next.js server page. No Tailwind needed, the Day / Night Toggle included (since 0.1.1 it ships its own compiled CSS, scoped to the component). The shadcn route above is better when you want to edit the source.

| | |
|---|---|
| [![Orbit dashboard](dashboards/orbit-observability/preview.gif)](dashboards/orbit-observability) <br> **[Orbit](dashboards/orbit-observability)**: infrastructure observability dashboard. [Demo](https://teodoravadani.github.io/qodesign-free/orbit/) | [![Ledger dashboard](dashboards/ledger-trading/preview.gif)](dashboards/ledger-trading) <br> **[Ledger](dashboards/ledger-trading)**: trading desk dashboard. [Demo](https://teodoravadani.github.io/qodesign-free/ledger/) |
| [![Toast Stack](components/toast-stack/preview.gif)](components/toast-stack) <br> **[Toast Stack](components/toast-stack)**: notifications that stack like a deck and fan out. [Demo](https://teodoravadani.github.io/qodesign-free/toast-stack/) | [![Pricing Switch](components/pricing-switch/preview.gif)](components/pricing-switch) <br> **[Pricing Switch](components/pricing-switch)**: monthly / yearly switch with odometer prices. [Demo](https://teodoravadani.github.io/qodesign-free/pricing-switch/) |
| [![Upload Dropzone](components/upload-dropzone/preview.gif)](components/upload-dropzone) <br> **[Upload Dropzone](components/upload-dropzone)**: drag and drop with progress rings. [Demo](https://teodoravadani.github.io/qodesign-free/upload-dropzone/) | [![Day / Night Toggle](components/day-night-toggle/preview.gif)](components/day-night-toggle) <br> **[Day / Night Toggle](components/day-night-toggle)**: the sun rolls into a moon. [Demo](https://teodoravadani.github.io/qodesign-free/day-night-toggle/) |

## Install

| Item | shadcn CLI | Single HTML file |
|---|---|---|
| Orbit dashboard | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/orbit-dashboard.json` | [orbit.html](dashboards/orbit-observability/html/orbit.html) |
| Ledger dashboard | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/ledger-dashboard.json` | [ledger.html](dashboards/ledger-trading/html/ledger.html) |
| Toast Stack | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/toast-stack.json` | [toast-stack.html](components/toast-stack/html/toast-stack.html) |
| Pricing Switch | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/pricing-switch.json` | [pricing-switch.html](components/pricing-switch/html/pricing-switch.html) |
| Upload Dropzone | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/upload-dropzone.json` | [upload-dropzone.html](components/upload-dropzone/html/upload-dropzone.html) |
| Day / Night Toggle | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/day-night-toggle.json` | [day-night-toggle.html](components/day-night-toggle/html/day-night-toggle.html) |

No shadcn setup? Copy the folder under `react/src/components/` into your project and run `npm i framer-motion@11.18.2`.

**Next.js App Router:** every component file already starts with `'use client'`, so it works in a server page as is.

**With an AI agent:** every folder has a `PROMPT.md` with prompts for Cursor, Claude Code, v0 or Lovable: add it to my project, wire it to my data, restyle it, port it to Vue or Svelte.

**No React?** Every item also comes as one HTML file (CSS and JS inline), linked in the table above.

## Using with Cursor

The repo ships two Cursor rules files: `.cursor/rules/qodesign.mdc` (installing and using these components in Next.js) and `.cursor/rules/qodesign-motion.mdc` (motion rules for any animated component: one rAF loop that pauses off-screen, reduced motion, transform/opacity only, passive listeners, no scroll traps, StrictMode-safe cleanup). Other agents can read `AGENTS.md`.

## What you get in each folder

```
<item>/
  react/               the component, plus a Vite + React + TS + Tailwind + Framer Motion demo app
  html/<item>.html     the same thing as one HTML file
  README.md            usage, props, accessibility
  PROMPT.md            prompts for AI coding agents
  preview.gif          the loop you see above
  proof/               screenshots at 1280 / 1440 px and 390 px
```

Run any React demo:

```bash
cd dashboards/orbit-observability/react   # or any other item
npm install
npm run dev
```

## Notes

- Every demo plays by itself until you touch it. Add `?demo=0` to turn that off.
- Everything respects Reduce Motion and has visible focus states and 44 px touch targets on phones.
- The page keeps scrolling when your cursor or finger is over a component.
- Data in the dashboards is simulated. Each README says which file to swap for your API.
- Browser support: current Chrome, Edge, Firefox and Safari, Safari on iOS included. Some pieces use CSS `color-mix()`, so older browsers than Chrome and Edge 111, Safari 16.2 and Firefox 113 won't style them correctly.

## More pieces

More animated pieces live at [qodesign.dev](https://qodesign.dev/components?utm_source=github&utm_medium=readme&utm_campaign=free_repo&utm_content=more).

## Contributing

PRs welcome: bug fixes, new examples, a11y improvements. Open an issue first for big changes. [CONTRIBUTING.md](CONTRIBUTING.md) has the details.

## Licence

[MIT](LICENSE). Use anything here in personal and commercial projects. Credit is welcome, not required.

Made by [Teodor](https://github.com/teodoravadani) at [qodesign.dev](https://qodesign.dev/free?utm_source=github&utm_medium=readme&utm_campaign=free_repo&utm_content=footer).
