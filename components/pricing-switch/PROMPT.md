# AI agent prompts: Pricing Switch

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

---

## Prompt 1: add it to my pricing page

```
Add the "Pricing Switch" from this folder to my pricing page.

Source of truth: react/src/components/PricingSwitch.tsx and react/src/components/pricing-switch.css (React + TypeScript + Framer Motion). If my project is not React, port html/pricing-switch.html instead.

Steps:
1. Look at my stack and find my current pricing page (ask me if there isn't one).
2. Copy PricingSwitch.tsx and pricing-switch.css into my components folder. Install framer-motion if it's missing.
3. Read my real plans (names, monthly and yearly prices in USD, features) from my code or config. Don't invent prices. If yearly prices are missing, ask me.
4. Replace my pricing cards with <PricingSwitch plans={...} header={...} />. Wire onSelect to my checkout or signup, passing the plan id and the billing period.
5. If the yearly discount isn't "2 months free", change yearlyBadge to the real one.
6. Run my type-check and build.

Done when: the build passes, the console is clean, switching to Yearly rolls every price and shows the badge, arrow keys move the switch, the featured plan has the spinning border, and on a 390 px wide screen the cards swipe as a carousel. Tell me which files you changed.
```

---

## Prompt 2: restyle it to my brand

```
Restyle the Pricing Switch (react/src/components/pricing-switch.css) to my design system.

1. Read my tokens and fonts.
2. Map the variables at the top of the file to mine: --volt (pill, featured button, checks), --ultra (badge), --panel, --line, --line2, --text, --muted, --faint. Change colours only through these variables.
3. Use my display font for the prices (.qd-odo) and plan names. Keep the digits tabular so they line up while they roll.
4. Keep the timings (pill spring, digit roll, 70 ms stagger) unless I ask. Keep the focus rings and the Reduce Motion block.

Show me screenshots of Monthly, Yearly mid-roll, and Yearly settled, at 1280 px and 390 px.
```

---

## Prompt 3: port it to another framework

```
Rebuild the Pricing Switch in the framework my project uses (Vue 3 with <script setup>, Svelte 5, or a vanilla Web Component). Ask me if you can't tell. No UI libraries.

What it is:
- A segmented Monthly / Yearly switch (role="radiogroup", two role="radio" buttons, arrow keys, Home/End). A lime pill sits behind the active option. Its left and right edges are animated separately: the leading edge moves first (0.34 s spring), the trailing edge follows 70 ms later (0.46 s), so the pill stretches and snaps back.
- On Yearly a violet "2 months free" badge pops from scale 0 / -14deg to scale 1 / -4deg on a spring, and 12 sparks fly out of it.
- Prices are an odometer. Each digit is a 1em-tall window over a strip of 40 digits (0-9 four times). The strip rests in the second copy. On a change it moves to the same digit at least ten places away in the direction of the switch (up for Yearly, down for Monthly), so every digit spins a full turn. Duration 0.9 s + 0.16 s per place from the right, delay 70 ms per place from the left, cubic-bezier(.18,.9,.22,1.04). After it lands, snap back to the second copy with no transition. Mask the window top and bottom with a gradient.
- Three plan cards. The featured one is lifted (-12px, scale 1.02), has a 2px conic-gradient border spinning every 4 s (masked ring with mask-composite exclude; it speeds up to 0.9 s for a second after a switch), a blurred violet and lime halo, and a "MOST POPULAR" tag.
- On every switch a light sweeps across each card (staggered 80 ms), the "SAVE $X/YR" chips pop in or out, and the feature checkmarks redraw (stroke-dashoffset, 60 ms apart).
- Under 900 px the cards are a scroll-snap carousel with dots, featured card centred.
- Each card has a screen-reader price; a polite live region announces billing changes. 44 px targets, visible focus, a Reduce Motion fallback that swaps prices with a fade.

Reference: html/pricing-switch.html (rollOdo() is the odometer) and react/src/components/PricingSwitch.tsx.
Give me one component file plus a demo page, and tell me how to run it.
```
