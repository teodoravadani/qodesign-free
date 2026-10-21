
# AGENTS.md: using qodesign-free

The same rules as `.cursor/rules/qodesign.mdc`, for Claude Code, Codex, Copilot, v0, Lovable and any other agent that reads AGENTS.md. Keep the two files in sync.

Follow these steps in order when the user asks for a qodesign-free component. Each one fixes a mistake agents made in testing.

## 1. Install the package and its peer

```bash
npm i qodesign-free framer-motion
```

- `framer-motion` (11 or newer) is a peer dependency. It is not installed for you. Without it the build fails with `Module not found: Can't resolve 'framer-motion'`.
- Don't install `motion` instead of `framer-motion`. The package imports from `framer-motion`.
- React 18 and 19 both work.

## 2. Import from the subpath, never from the root

```tsx
// yes
import { Toaster, toast } from 'qodesign-free/toast-stack';
import { PricingSwitch } from 'qodesign-free/pricing-switch';
import { UploadDropzone } from 'qodesign-free/upload-dropzone';
import DayNightToggle from 'qodesign-free/day-night-toggle'; // default import, see below
import { OrbitDashboard } from 'qodesign-free/orbit-dashboard';
import { LedgerDashboard } from 'qodesign-free/ledger-dashboard';

// no: the root entry pulls in CSS and JS for every component, both dashboards included
import { Toaster } from 'qodesign-free';
```

- Import the toggle with the default import exactly as above. In 0.1.0, `qodesign-free/day-night-toggle` has no named `DayNightToggle` export, so `import { DayNightToggle } from 'qodesign-free/day-night-toggle'` fails the build. 0.1.1 adds the named export, but the default import works in every version, so use it.
- For the other five, use the named imports shown.
- Don't import any CSS by hand. Each entry imports its own stylesheet.

## 3. 'use client': where it goes and where it doesn't

- Every entry already starts with `'use client'`. You can render `<PricingSwitch />`, `<DayNightToggle />`, `<UploadDropzone />` and the dashboards straight from a server `page.tsx` or `layout.tsx`. Don't add `'use client'` to a page only to render one of them.
- Functions can't be passed from a server component to a client component. If you pass any callback prop (`onChange`, `onSelect`, `upload`, `onAllDone`, `onNavigate`), the file that passes it needs `'use client'` at the top. Usually that means a small wrapper component.
- `toast()`, `toast.success()`, `toast.promise()` and friends run in the browser. Call them from event handlers or effects inside a `'use client'` file, never during a server render.

## 4. Mount the Toaster once

Put `<Toaster />` in the root `app/layout.tsx`, inside `<body>`, a single time. Don't mount it per page and don't mount two.

```tsx
// app/layout.tsx (a server component, no 'use client' needed)
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

## 5. Tailwind: add the @source line for the Day / Night Toggle

In 0.1.0 the toggle is styled with Tailwind utility classes that live inside `node_modules`. Tailwind doesn't scan `node_modules`, so without this line the toggle renders as unstyled boxes. 0.1.1 also ships the toggle's own CSS. Add the line anyway; it does no harm and covers 0.1.0. The other components bring their own CSS and don't need it.

Tailwind v4: add this to the CSS file that has `@import "tailwindcss";` (usually `app/globals.css`). The path is relative to that CSS file.

```css
@import "tailwindcss";
@source "../node_modules/qodesign-free/dist";
```

- `app/globals.css` → `"../node_modules/qodesign-free/dist"`
- `src/app/globals.css` → `"../../node_modules/qodesign-free/dist"`

Tailwind v3: add `"./node_modules/qodesign-free/dist/**/*.js"` to `content` in `tailwind.config.js`.

Check it: in the browser the toggle should be a rounded pill with a sun or a moon, not stacked plain divs.

## 6. Reduced motion: leave it on

- Every component already respects `prefers-reduced-motion: reduce`. Don't override it. Never wrap these components in `<MotionConfig reducedMotion="never">`.
- If you add your own animation around a component, read `useReducedMotion()` from `framer-motion` and drop the movement when it returns true.
- The dashboards play a hands-free demo tour until someone touches the page. In a real product pass `autoplayDemo={false}`.

## 7. Don't prefetch routes that render a dashboard

The Orbit and Ledger dashboards are each about 50 to 60 KB of JS and 30 KB of CSS. A normal `<Link>` prefetches its route when it scrolls into view. In a production build that pulls the dashboard's route payload, CSS and JS on page load, even for visitors who never open it.

```tsx
import Link from 'next/link';

<Link href="/dashboard" prefetch={false}>Dashboard</Link>
```

- Use `prefetch={false}` on every link to a route that renders `OrbitDashboard` or `LedgerDashboard`.
- Don't call `router.prefetch()` for those routes.
- Render a dashboard only on its own route, never on a landing page.

## 8. Accessible labels

- `DayNightToggle`: always pass `label` that describes what it does in this app, for example `label="Dark mode"` or `label="Night theme"`. It becomes the switch's accessible name.
- `UploadDropzone`: set `title` and `hint` to real words ("Drop invoices here", "PDF up to 10 MB") and `accept` to the file types you actually take. Without an `upload` prop, uploads are only simulated, so wire a real uploader before shipping.
- `PricingSwitch`: every plan in `plans` needs a real `name`, `description` and `cta`. Don't pass empty strings.
- Keep visible focus styles. Don't add `outline: none` to these components or their buttons.
- Don't put a component inside another `<button>` or `<a>`. Each one has its own interactive elements.

## 9. Before you say it's done

1. `npx next build` passes. Run it first: on a fresh Next 16 app, `tsc` fails with `Cannot find name 'LayoutProps'` until Next has generated its route types (`next build`, `next dev` or `npx next typegen` does that).
2. `npx tsc --noEmit` passes.
3. Open the page in a browser. The component renders, styled, with 0 errors in the console.
4. The toggle is styled (step 5). A toast appears when you trigger one (step 4).

## Want the source instead?

Each component can also be installed as editable source with the shadcn CLI, for example:

```bash
npx shadcn@latest add https://teodoravadani.github.io/qodesign-free/r/toast-stack.json
```

Then the files live in your repo and steps 2 and 5 don't apply. The rest still does. Repo: https://github.com/teodoravadani/qodesign-free
