# AI agent prompts: Toast Stack

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4. In a Next.js app, put the files under `components/` and import them from any page.

---

## Prompt 1: add it to my project

```
Add the "Toast Stack" notifications from this folder to my web project.

Source of truth: react/src/components/ToastStack.tsx and react/src/components/toast-stack.css (React + TypeScript + Framer Motion). If my project is not React, use html/toast-stack.html instead; everything is in its <script>.

Steps:
1. Look at my stack: framework, TypeScript or not, where components live, how CSS gets loaded.
2. Copy ToastStack.tsx and toast-stack.css into my components folder. Install framer-motion if it's missing.
3. Render <Toaster /> once in my root layout.
4. If I already use another toast library (sonner, react-hot-toast, react-toastify), list every call site and replace it with toast.success / toast.error / toast.info / toast.promise. Keep the messages the same.
5. Wire one real async action of mine (a save, an upload, a deploy) to toast.promise so it shows the spinner and then the check.
6. Run my type-check and build.

Done when: the build passes, the console is clean, toasts stack into a deck, fan out on hover and on keyboard focus with the page blurred behind them, swipe away sideways, and a promise toast turns into a check. Tell me which files you changed.
```

---

## Prompt 2: restyle it to my brand

```
Restyle the Toast Stack (react/src/components/toast-stack.css) to match my design system.

1. Read my tokens (CSS variables, Tailwind theme, or tokens file) and my fonts.
2. Map the variables at the top of toast-stack.css to mine: --volt (success + payoff), --err, --ultra (info), --cyan (loading), --text, --muted, --faint, --line2. Change colours only through these variables.
3. Match the toast radius, surface colour and shadow to my cards. Keep the 44 px minimum height on buttons.
4. Keep the motion as it is (spring 420/27, 35 ms stagger, 16 px peek) unless I ask.
5. Keep focus rings visible and keep the Reduce Motion block.

Show me screenshots of the collapsed deck, the open deck, and the promise toast right after it resolves.
```

---

## Prompt 3: port it to another framework

```
Rebuild the Toast Stack in the framework my project uses (Vue 3 with <script setup>, Svelte 5, or a vanilla Web Component). Ask me if you can't tell. No UI libraries.

What it is: a toast queue with a small store (create, update, dismiss, clear) and a toaster that renders newest first.
- Collapsed deck: the newest toast sits in front. Each older one moves up 16 px and shrinks 5.5% (transform-origin top centre), takes the front toast's height and hides its content. Only 3 are visible.
- Open deck (hover, or focus inside the region): toasts spread into a list with a 10 px gap, staggered 35 ms each, on a spring. A full-cover layer behind it fades in: backdrop-filter blur(10px) plus rgba(6,6,10,.5). A header above the list shows the count and a "Clear all" button.
- Swipe: horizontal drag moves the toast, rotates it 0.025deg per px and fades it. Past 100 px, or faster than 0.6 px/ms, it flies off 440 px with a 14deg rotation. Otherwise it springs back.
- Auto-dismiss after 5 s with a draining 2 px bar along the bottom. The timer pauses while the deck is open or a toast is loading.
- Promise toast: a 2 px conic-gradient ring runs around the toast border (masked with mask-composite exclude) and a stroke spinner turns in the icon. On resolve the ring flashes lime and fades, the spinner arc closes into a full circle, a lime disc scales in with overshoot, a dark check draws (stroke-dashoffset with pathLength=1), 16 sparks fly out of the icon, and the toast pops 4.5%. Then the text swaps to the success message.
- Accessibility: aria-live polite list, role="alert" on errors, Alt+T focuses the newest toast, Escape/Delete dismisses the focused one, hidden deck cards are inert, 44 px buttons, a Reduce Motion fallback that only fades.

Reference: html/toast-stack.html (layout() holds the whole deck geometry) and react/src/components/ToastStack.tsx.
Give me one component file, a toast() helper with success/error/info/promise/dismiss/clear, and a demo page. Tell me how to run it.
```
