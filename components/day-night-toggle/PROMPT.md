# AI agent prompts: Day / Night Toggle

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

---

## Prompt 1: add it to my project as my theme switch

```
Add the Day / Night Toggle from this folder to my web project and make it switch my app's theme.

Source of truth: react/src/components/DayNightToggle.tsx (React + TypeScript + Tailwind + Framer Motion). If my project is not React, use html/day-night-toggle.html instead.

Steps:
1. Look at my stack: framework, TypeScript or not, Tailwind or not, where components live, and how my dark mode works today (class on <html>, data attribute, CSS variables, next-themes).
2. Copy the component into my components folder. If I don't use Tailwind, move its classes into a CSS module with the same values. Install framer-motion if it's missing.
3. Put it where my current theme switch is (or in the header) at width 120 to 180.
4. Wire it to my theme: controlled with night and onChange, reading the saved theme on load so it doesn't flash the wrong state.
5. Run my type-check and build.

Done when: the build passes, the console is clean, clicking it switches my whole app's theme, the choice survives a reload, and Space or Enter toggles it from the keyboard. Tell me which files you changed.
```

---

## Prompt 2: rebuild it in another framework

```
Recreate the Day / Night Toggle in the framework my project uses (Vue 3 with <script setup>, Svelte 5, or a vanilla Web Component). Ask me if you can't tell. No UI libraries.

What it is: a pill-shaped theme switch. Clicking it rolls the sun across and turns it into a moon with craters, the clouds fall out, stars drop in on a stagger, and the page background changes.

Match these details:
- knob: translateX + 360° rotate, 0.8 s, cubic-bezier(.7,-0.3,.3,1.3); sun to moon colour and glow 0.8 s; craters fade in 0.5 s after 0.3 s
- 22 stars drop from -300 px, 0.7 s cubic-bezier(.2,.8,.2,1.2), random 0 to 0.35 s stagger
- 3 clouds fall 240 px, 0.8 s ease-in, 0 / 60 / 120 ms apart
- sky #5DB8FF to #A8DBFF by day, #0B1033 to #27306B at night; page #EAF4FF / #070B1A over 0.8 s

Read react/src/components/DayNightToggle.tsx and html/day-night-toggle.html first.
API: defaultNight (boolean), night (controlled), onChange(night), width (number, default 640, scales from 640 × 256), label (string, default "Dark mode").
Requirements: role="switch" with aria-checked, keyboard toggle, visible focus ring, and under prefers-reduced-motion a 0.2 s cross-fade instead of rolling and falling.
Deliver one component file and a small demo page, and tell me how to run it.
```

---

More animated components at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=prompt&utm_campaign=free_repo).
