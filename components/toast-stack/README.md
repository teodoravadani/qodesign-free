# Toast Stack

Notifications that pile up like a deck of cards. Hover or focus the deck and it fans out into a list while the page behind it blurs. Swipe a toast sideways to throw it away. A promise toast shows a spinner with a light running around its border, then turns into a lime check with a small burst when the work finishes. Toasts come in success, error, info and loading, and can carry one action button (Undo, Retry).

![Toast Stack preview](preview.gif)

Live demo: open [html/toast-stack.html](html/toast-stack.html) in a browser. The demo plays by itself; click anything and it's yours. Leave it alone for 4 seconds and the demo picks up again.

## What's inside

- `html/toast-stack.html`: the whole thing in one file (HTML, CSS, plain JS). Open it, read it, copy it.
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/ToastStack.tsx`: the drop-in component and the `toast()` API.
  - `react/src/components/toast-stack.css`: its styles (tokens at the top).
  - `react/src/App.tsx`: the demo app around it (a small deploy dashboard and the scripted cursor).
- `PROMPT.md`: prompts for AI coding agents (add it to your project, restyle it, port it).

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

Dependencies: `react`, `react-dom`, `framer-motion`.

1. Copy `ToastStack.tsx` and `toast-stack.css` into your components folder.
2. Render `<Toaster />` once, near the root of your app.
3. Call `toast` from anywhere.

```tsx
import { Toaster, toast } from './components/ToastStack';

export default function App() {
  return (
    <>
      <button onClick={() => toast.success('Invoice archived', {
        description: 'Brightwater Studio · $1,240.00',
        action: { label: 'Undo', onClick: restoreInvoice },
      })}>
        Archive
      </button>
      <Toaster />
    </>
  );
}

// spinner → check when the promise resolves
toast.promise(deploy(), {
  loading: { title: 'Deploying web', description: 'Building 12 routes' },
  success: (r) => ({ title: 'Deployed to production', description: `${r.seconds} s` }),
  error: () => ({ title: 'Deploy failed', description: 'Check the build log' }),
});
```

### `toast` API

| Call | What it does |
|---|---|
| `toast(title, options?)` / `toast.info(...)` | info toast (violet) |
| `toast.success(title, options?)` | success toast (lime) |
| `toast.error(title, options?)` | error toast (red, `role="alert"`) |
| `toast.promise(promise, { loading, success, error? }, options?)` | loading toast that morphs into success or error when the promise settles |
| `toast.dismiss(id, direction?)` | remove one toast (`direction` -1 or 1 throws it sideways) |
| `toast.clear()` | remove all toasts, one after another |

Options: `description` (ReactNode), `action` (`{ label, onClick, keepOpen? }`), `duration` (ms).

### `<Toaster />` props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `width` | `number` | `432` | width of the stack in px (phones use the full width minus 24 px) |
| `gap` | `number` | `10` | gap between toasts when fanned out |
| `visibleToasts` | `number` | `3` | cards visible in the collapsed deck |
| `duration` | `number` | `5000` | auto-dismiss time in ms; the timer pauses while the deck is open or a toast is loading |
| `backdrop` | `boolean` | `true` | blur and tint the page behind the open deck |
| `strategy` | `'fixed' \| 'absolute'` | `'fixed'` | pin to the viewport, or to the nearest positioned parent |
| `expanded` | `boolean` | | control the fan-out yourself (scripted demos); leave it out for hover and focus |
| `paused` | `boolean` | `false` | stop every timer |
| `onExpandedChange` | `(open: boolean) => void` | | hover or focus wants the deck open or closed |

## Accessibility

- The list is an `aria-live="polite"` region; errors use `role="alert"`.
- `Alt+T` jumps to the newest toast. `Tab` moves through toasts and their buttons. `Escape`, `Delete` or `Backspace` dismisses the focused toast.
- Keyboard focus opens the deck, just like hover. Cards hidden in the collapsed deck are `inert`.
- Buttons are at least 44 px tall. Focus rings are always visible.
- With Reduce Motion on, toasts fade in and out where they sit, and the spinner pulses instead of turning.

## Customise

Colours live at the top of `toast-stack.css` (`--volt`, `--err`, `--ultra`, `--cyan`). Timing: deck and fan-out use a spring (stiffness 420, damping 27), the fan-out staggers 35 ms per card, the deck peeks 16 px per card and shrinks each card by 5.5%. The promise payoff: border ring flashes lime, the check fills (0.45 s), then draws (0.35 s), 16 sparks, a 4.5% pop.

## More like this

This one is free (MIT). The paid components are $3 each, or $29 for all of them, at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
