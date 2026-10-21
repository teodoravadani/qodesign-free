# Pricing Switch

A pricing section with a Monthly / Yearly switch. The lime pill stretches as it slides, every digit of every price spins a full turn like an odometer before it lands, a "2 months free" badge pops in with sparks, and a light sweeps across the cards. The featured plan floats above the others with a spinning gradient border. Checkmarks draw themselves in. Prices are in USD.

![Pricing Switch preview](preview.gif)

Live demo: open [html/pricing-switch.html](html/pricing-switch.html) in a browser. The demo plays by itself; click anything and it's yours. After 4 seconds without input the demo starts again.

## What's inside

- `html/pricing-switch.html`: everything in one file (HTML, CSS, plain JS).
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/PricingSwitch.tsx`: the drop-in component (switch, odometer, cards).
  - `react/src/components/pricing-switch.css`: its styles, tokens at the top.
  - `react/src/App.tsx`: the demo page and the scripted cursor.
- `PROMPT.md`: prompts for AI coding agents.

## Next.js
Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4.

Copy `react/src/components` into your app and import it from any page, server pages included.
Checked on Oct 20, 2026 in a clean Next.js 15 + React 19 + Tailwind v4 app (strict TypeScript, `next build`, static prerender, no hydration warnings) and in the Vite + React 18 + Tailwind v3 project in `react/`.

## Run the React demo

```bash
cd react
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in react/dist
```

## Use it

Dependencies: `react`, `react-dom`, `framer-motion` 11.18.2.

1. Copy `PricingSwitch.tsx` and `pricing-switch.css` into your components folder.
2. Pass your plans.

```tsx
import { PricingSwitch, Plan } from './components/PricingSwitch';

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', description: 'For side projects.', monthly: 12, yearly: 10,
    cta: 'Start free', features: ['3 projects', '10 GB storage'] },
  { id: 'pro', name: 'Pro', description: 'For small teams.', monthly: 30, yearly: 25,
    cta: 'Get Pro', featured: true, features: ['Unlimited projects', 'Custom domains'] },
  { id: 'team', name: 'Team', description: 'For companies.', monthly: 84, yearly: 70,
    cta: 'Talk to sales', features: ['SSO and audit log', '1 TB storage'] },
];

<PricingSwitch
  plans={plans}
  header={<h2>Plans that grow with your team</h2>}
  onSelect={(plan, yearly) => startCheckout(plan.id, yearly ? 'year' : 'month')}
/>
```

### Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `plans` | `Plan[]` | required | `{ id, name, note?, description, monthly, yearly, cta, features, featured? }`; prices are USD per month |
| `header` | `ReactNode` | | heading shown left of the switch |
| `yearly` | `boolean` | | controlled billing period |
| `defaultYearly` | `boolean` | `false` | starting period when uncontrolled |
| `onYearlyChange` | `(yearly) => void` | | the switch moved |
| `onSelect` | `(plan, yearly) => void` | | a plan's button was pressed |
| `yearlyBadge` | `string` | `"2 months free"` | badge text on Yearly |
| `selectedLabel` | `(plan) => string` | `"Pro selected"` / `"Selected"` | button label right after a press |
| `highlight` | `string \| null` | `null` | force the hover lift on one plan (scripted demos) |
| `currency` | `string` | `"$"` | currency sign |

A ref gives you `centre(planId)`, which scrolls a plan to the middle of the phone carousel.

## Accessibility

- The switch is a `radiogroup` with two `radio` buttons. Arrow keys flip it, Home and End jump to Monthly and Yearly.
- The rolling digits are hidden from screen readers. Each card has a plain text price ("$25 per month, $300 billed yearly"), and a polite live region says when billing changes or a plan is picked.
- Every button is at least 44 px tall, with a visible focus ring.
- Under 900 px the cards become a swipeable carousel with the featured plan in the middle.
- With Reduce Motion on, prices change in place with a short fade and the decorative motion stays still.

## Customise

Tokens at the top of `pricing-switch.css`: `--volt` (pill, featured button, checks), `--ultra` (badge), `--panel`, `--line`. Timing: pill edges move on a spring (0.34 s leading edge, 0.46 s trailing edge 70 ms later); each digit rolls 0.9 s plus 0.16 s per place from the right, staggered 70 ms; featured border turns every 4 s and speeds up to 0.9 s for a second after a switch.

## More like this

This one is free (MIT). The paid components are $3 each, or $29 for all of them, at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
