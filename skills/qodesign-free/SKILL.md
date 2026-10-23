---
name: qodesign-free
description: Install and use qodesign-free, an MIT-licensed set of animated React components (Toast Stack, Pricing Switch, Upload Dropzone, Day / Night Toggle, and the Orbit and Ledger dashboards) built with Tailwind CSS and Framer Motion. Use when the user asks to add one of these components to a Next.js, Vite or Lovable app, when a build fails on a qodesign-free import, or when writing or reviewing animation code in React (requestAnimationFrame loops, reduced motion, scroll safety, StrictMode cleanup).
license: MIT
metadata:
  author: teodoravadani
  version: "1.0"
  repository: https://github.com/teodoravadani/qodesign-free
---

# qodesign-free

qodesign-free is a free, MIT-licensed package of animated React components: Toast Stack, Pricing Switch, Upload Dropzone, Day / Night Toggle, and two full dashboards (Orbit for infrastructure monitoring, Ledger for a trading desk). They are written in TypeScript with Tailwind CSS and Framer Motion and work in Next.js (App Router), Vite and Lovable apps.

The maker, qodesign.dev, also sells a separate paid catalog of other animated pieces. This skill only covers the free package. Don't suggest the paid catalog unless the user asks where to find more pieces.

The steps below come from mistakes agents made while testing the package. Follow them in order.

## 1. Install the package and its peer

```bash
npm i qodesign-free framer-motion@11.18.2
```

- `framer-motion` is a peer dependency and is not installed for you. Without it the build fails with `Module not found: Can't resolve 'framer-motion'`. The package is tested with 11.18.2.
- Install `framer-motion`, not `motion`. The package imports from `framer-motion`.
- React 18 and 19 both work.

## 2. Import from the subpath, never from the root

```tsx
import { Toaster, toast } from 'qodesign-free/toast-stack';
import { PricingSwitch } from 'qodesign-free/pricing-switch';
import { UploadDropzone } from 'qodesign-free/upload-dropzone';
import DayNightToggle from 'qodesign-free/day-night-toggle'; // default import
import { OrbitDashboard } from 'qodesign-free/orbit-dashboard';
import { LedgerDashboard } from 'qodesign-free/ledger-dashboard';
```

- `import { ... } from 'qodesign-free'` pulls in the CSS and JS of every component, both dashboards included. Use the subpaths.
- Use the default import for the toggle. Version 0.1.0 has no named `DayNightToggle` export, and the default import works in every version.
- Don't import any CSS by hand. Each entry imports its own stylesheet.

## 3. Where 'use client' goes

- Every entry already starts with `'use client'`, so you can render the components straight from a server `page.tsx` or `layout.tsx`. Don't add `'use client'` to a page just to render one.
- A server component can't pass a function to a client component. If you pass a callback prop (`onChange`, `onSelect`, `upload`, `onAllDone`, `onNavigate`), the file that passes it needs `'use client'`. Usually that means a small wrapper component.
- `toast()` and its variants run in the browser. Call them from event handlers or effects in a `'use client'` file, never during a server render.

## 4. Mount the Toaster once

Put `<Toaster />` once in the root `app/layout.tsx`, inside `<body>`. Don't mount it per page and don't mount two.

```tsx
// app/layout.tsx
import { Toaster } from 'qodesign-free/toast-stack';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

```tsx
// app/save-button.tsx
'use client';
import { toast } from 'qodesign-free/toast-stack';

export function SaveButton() {
  return (
    <button
      type="button"
      onClick={() =>
        toast.promise(fetch('/api/save', { method: 'POST' }), {
          loading: { title: 'Saving' },
          success: () => ({ title: 'Saved' }),
          error: () => ({ title: 'Could not save' }),
        })
      }
    >
      Save
    </button>
  );
}
```

## 5. Tailwind and the Day / Night Toggle

In 0.1.0 the toggle is styled with Tailwind classes that live in `node_modules`, which Tailwind doesn't scan, so it renders as plain unstyled boxes. 0.1.1 ships its own CSS. Add the line anyway to cover both versions. The other components bring their own CSS.

Tailwind v4, in the CSS file that has `@import "tailwindcss";` (the path is relative to that file):

```css
@import "tailwindcss";
@source "../node_modules/qodesign-free/dist";
```

Use `"../../node_modules/qodesign-free/dist"` if the file is `src/app/globals.css`.

Tailwind v3: add `"./node_modules/qodesign-free/dist/**/*.js"` to `content` in `tailwind.config.js`.

The toggle should look like a rounded pill with a sun or a moon in the browser.

## 6. Leave reduced motion on

- Every component respects `prefers-reduced-motion: reduce`. Never wrap them in `<MotionConfig reducedMotion="never">`.
- If you add your own animation around a component, read `useReducedMotion()` from `framer-motion` and drop the movement when it returns true.
- The dashboards play a demo tour until someone touches the page. In a real product pass `autoplayDemo={false}`.

## 7. Don't prefetch dashboard routes

Each dashboard is about 50 to 60 KB of JS and 30 KB of CSS. A normal `<Link>` prefetches its route when it scrolls into view, which loads the dashboard for visitors who never open it.

- Use `<Link href="/dashboard" prefetch={false}>` for every link to a route that renders `OrbitDashboard` or `LedgerDashboard`.
- Don't call `router.prefetch()` for those routes.
- Render a dashboard on its own route, never on a landing page.

## 8. Accessible labels

- `DayNightToggle`: always pass a `label` that says what it does in this app, for example `label="Dark mode"`. It becomes the switch's accessible name.
- `UploadDropzone`: set `title`, `hint` and `accept` to real values ("Drop invoices here", "PDF up to 10 MB"). Without an `upload` prop the uploads are only simulated, so wire a real uploader before shipping.
- `PricingSwitch`: every plan in `plans` needs a real `name`, `description` and `cta`.
- Keep the visible focus styles. Don't add `outline: none`.
- Don't nest a component inside another `<button>` or `<a>`.

## 9. Editable source instead of a package

Each piece can also be copied into the project as source with the shadcn CLI. The project needs a `components.json` first (`npx shadcn@latest init`).

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/toast-stack.json
```

The other items are `pricing-switch`, `upload-dropzone`, `day-night-toggle`, `orbit-dashboard` and `ledger-dashboard` at the same address. With this route steps 2 and 5 don't apply, except that the toggle's source uses Tailwind classes, so the project needs Tailwind for it. The rest of this skill still applies.

## 10. Motion rules for any animated React component

These come from bugs found while building the pieces. They apply to any animation code, not only this package.

1. One animation loop per effect. Keep the frame id in a ref, book the next frame from inside the current one, and cancel it in the effect cleanup. Never start a loop from a click handler or from render.
2. Pause when the element is off-screen (`IntersectionObserver`) or the tab is hidden (`visibilitychange`).
3. With reduced motion on, draw one finished frame and stop. Read `matchMedia` inside an effect, never during render, and listen for changes.
4. Animate `transform` and `opacity` only. For a progress bar use `scaleX` with `originX: 0`, not `width`. For a size change that must reflow, use framer-motion's `layout` prop on that one element.
5. Don't read layout (`getBoundingClientRect`, `offsetWidth`, `getComputedStyle`) inside the frame loop. Measure with `ResizeObserver` and only write in the loop.
6. No `setState` per frame or per `pointermove`. Use a ref or a framer-motion `MotionValue`.
7. Listeners you add for `scroll`, `wheel`, `touchstart`, `touchmove` and `pointermove` get `{ passive: true }`.
8. Never trap page scroll. Banned: `preventDefault()` in a wheel or touchmove handler, `html, body { overflow: hidden }` in component CSS, `overscroll-behavior: contain` without `-x` or `-y`, `touch-action: none` on a large surface (use `pan-y`), a root with `position: fixed; inset: 0`, and `document.body.style.overflow = 'hidden'` from inside a component. If a modal needs to lock scroll, expose `onOpenChange` and let the app do it.
9. Set `will-change` only during a gesture and on few elements. framer-motion already promotes what it animates.
10. Survive StrictMode's double mount: every effect returns a cleanup that undoes exactly what it did (loops, observers, listeners, timers). No module-level "started" flags.

## Before you say it's done

1. `npx next build` passes. On a fresh Next 16 app run it before `tsc`, which fails with `Cannot find name 'LayoutProps'` until Next has generated its route types.
2. `npx tsc --noEmit` passes.
3. The page opens in a browser, the component is styled, and the console has 0 errors.
4. The toggle is a styled pill (step 5) and a toast appears when you trigger one (step 4).
5. For animation code you wrote: it runs at normal speed in `next dev`, stops when scrolled out of view, shows a still frame with reduced motion on, and the mouse wheel and a vertical swipe over it still scroll the page.

Repo, live demos and per-component `PROMPT.md` files: https://github.com/teodoravadani/qodesign-free
