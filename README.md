# qodesign-free

Free animated UI components and two full dashboards. Every item comes as a single HTML file you can open and copy, and as a React component (React 18, TypeScript, Tailwind CSS 3, Framer Motion). MIT licensed.

**[Live demos](https://teodoravadani.github.io/qodesign-free/)** · **[qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo)**

| | |
|---|---|
| [![Orbit dashboard](dashboards/orbit-observability/preview.gif)](dashboards/orbit-observability) <br> **[Orbit](dashboards/orbit-observability)**: infrastructure observability dashboard. [Demo](https://teodoravadani.github.io/qodesign-free/orbit/) | [![Ledger dashboard](dashboards/ledger-trading/preview.gif)](dashboards/ledger-trading) <br> **[Ledger](dashboards/ledger-trading)**: trading desk dashboard. [Demo](https://teodoravadani.github.io/qodesign-free/ledger/) |
| [![Toast Stack](components/toast-stack/preview.gif)](components/toast-stack) <br> **[Toast Stack](components/toast-stack)**: notifications that stack like a deck and fan out. [Demo](https://teodoravadani.github.io/qodesign-free/toast-stack/) | [![Pricing Switch](components/pricing-switch/preview.gif)](components/pricing-switch) <br> **[Pricing Switch](components/pricing-switch)**: monthly / yearly switch with odometer prices. [Demo](https://teodoravadani.github.io/qodesign-free/pricing-switch/) |
| [![Upload Dropzone](components/upload-dropzone/preview.gif)](components/upload-dropzone) <br> **[Upload Dropzone](components/upload-dropzone)**: drag and drop with progress rings. [Demo](https://teodoravadani.github.io/qodesign-free/upload-dropzone/) | [![Day / Night Toggle](components/day-night-toggle/preview.gif)](components/day-night-toggle) <br> **[Day / Night Toggle](components/day-night-toggle)**: the sun rolls into a moon. [Demo](https://teodoravadani.github.io/qodesign-free/day-night-toggle/) |

## Install

Each item installs with the shadcn CLI (it copies the source into `components/<name>/` and adds `framer-motion`):

| Item | shadcn CLI | Single HTML file |
|---|---|---|
| Orbit dashboard | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/orbit-dashboard.json` | [orbit.html](dashboards/orbit-observability/html/orbit.html) |
| Ledger dashboard | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/ledger-dashboard.json` | [ledger.html](dashboards/ledger-trading/html/ledger.html) |
| Toast Stack | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/toast-stack.json` | [toast-stack.html](components/toast-stack/html/toast-stack.html) |
| Pricing Switch | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/pricing-switch.json` | [pricing-switch.html](components/pricing-switch/html/pricing-switch.html) |
| Upload Dropzone | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/upload-dropzone.json` | [upload-dropzone.html](components/upload-dropzone/html/upload-dropzone.html) |
| Day / Night Toggle | `npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/day-night-toggle.json` | [day-night-toggle.html](components/day-night-toggle/html/day-night-toggle.html) |

No shadcn setup? Copy the folder under `react/src/components/` into your project and `npm i framer-motion`. Or open the HTML file: no build step, no dependencies.

Every folder has its own README (props, data, accessibility notes) and a `PROMPT.md` with ready-made prompts for Cursor, Claude Code, v0 or Lovable: add it to my project, wire it to my data, restyle it, port it to Vue or Svelte.

## What you get in each folder

```
<item>/
  html/<item>.html     one file: HTML, CSS, plain JS
  react/               Vite + React 18 + TS + Tailwind 3 + Framer Motion
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

- Every demo plays by itself until you touch it, then gets out of your way. Add `?demo=0` to turn that off.
- Everything respects Reduce Motion and has visible focus states and 44 px touch targets on phones.
- Data in the dashboards is simulated. Each README says which file to swap for your API.

## More components (paid, $3 each or $29 for all)

The same style, more ambitious. Each one ships the same way (HTML, React, prompts).

- [Particle Morph](https://qodesign.dev/components/particle-morph?utm_source=github&utm_medium=readme&utm_campaign=free_repo): 9,000 particles that spring between a sphere, a word and a torus knot.
- [Pull-Cord Login](https://qodesign.dev/components/pull-cord-login?utm_source=github&utm_medium=readme&utm_campaign=free_repo): pull the cord, the lamp turns on, the login form appears.
- [Credit Card Checkout V1](https://qodesign.dev/components/credit-card-checkout-v1?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a live 3D card that fills in as you type and flips for the CVC.
- [Shy Eyes Login](https://qodesign.dev/components/shy-eyes-login?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a mascot that watches you type and covers his eyes for the password.
- [Hold to Delete](https://qodesign.dev/components/hold-to-delete?utm_source=github&utm_medium=readme&utm_campaign=free_repo): press and hold, then the file crumples into the bin.
- [Dynamic Island Navbar](https://qodesign.dev/components/dynamic-island?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a pill navbar that morphs for notifications, music and search.
- [Liquid Metal Blob](https://qodesign.dev/components/liquid-metal?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a drop of liquid chrome drawn live by a WebGL shader.
- [Step-Up OTP Gate](https://qodesign.dev/components/otp-verify?utm_source=github&utm_medium=readme&utm_campaign=free_repo): arcs merge into one check and the blurred dashboard behind unlocks.
- [Command-K Dashboard](https://qodesign.dev/components/dashboard-saas?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a whole SaaS app you drive from ⌘K.
- [Receipt Morph Checkout](https://qodesign.dev/components/checkout-card?utm_source=github&utm_medium=readme&utm_campaign=free_repo): your card splits, unrolls into a receipt and gets stamped PAID.
- [Liquid Glass Tab Bar](https://qodesign.dev/components/tabbar-liquid?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a glass drop that magnifies the tab under it.
- [Spotlight Lamp Login](https://qodesign.dev/components/lamp-login?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a desk lamp finds each field in the dark.
- [Stack Cart Drawer](https://qodesign.dev/components/cart-drawer?utm_source=github&utm_medium=readme&utm_campaign=free_repo): products fly into the cart and unfold into line items.
- [Analytics Dashboard V1](https://qodesign.dev/components/analytics-dashboard-v1?utm_source=github&utm_medium=readme&utm_campaign=free_repo): a dark analytics dashboard where every number counts up live ($9).

**[All-Access Pack: every component for $29](https://qodesign.dev/all-access?utm_source=github&utm_medium=readme&utm_campaign=free_repo)**

## Licence

[MIT](LICENSE). Use anything here in personal and commercial projects. Credit is welcome, not required.

Made by [Teodor](https://github.com/teodoravadani) at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
