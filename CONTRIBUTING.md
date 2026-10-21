# Contributing

Thanks for taking a look. PRs are welcome, especially:

- bug fixes
- new examples (a new way to use a component, a Next.js or Vite setup we don't cover)
- accessibility improvements (keyboard, focus, screen readers, reduced motion)

For anything big, like a new component or an API change, open an issue first so we can talk it through before you spend the time.

## Before you open a PR

- Keep the React and the HTML version of an item in sync. If you fix one, fix the other.
- Run the demo for the item you changed (`cd components/<item>/react && npm install && npm run dev`) and check it on a phone-sized screen too.
- Respect Reduce Motion, keep visible focus states and 44 px touch targets.
- The components are tested with `framer-motion` 11.18.2. If your change needs another version, say why in the PR.
- One change per PR is easier to review than five.

## Reporting a bug

Open an issue with the item name, your framework (Next.js, Vite, Lovable...), your React and framer-motion versions, and what you expected versus what happened. A screenshot or a short clip helps a lot.

By contributing you agree that your work is released under the [MIT licence](LICENSE).
