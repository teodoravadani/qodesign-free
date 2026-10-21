// Adds 'use client' and the matching stylesheet import to each built entry,
// so `import { Toaster } from 'qodesign-free'` works in a Next.js server page as is.
import fs from 'node:fs';
const dist = new URL('../dist/', import.meta.url);
for (const f of fs.readdirSync(dist)) {
  if (!f.endsWith('.js')) continue;
  const css = f.replace(/\.js$/, '.css');
  let src = fs.readFileSync(new URL(f, dist), 'utf8').replace(/^(['"])use client\1;?\s*/m, '');
  const head = ["'use client';"];
  if (fs.existsSync(new URL(css, dist))) head.push(`import './${css}';`);
  fs.writeFileSync(new URL(f, dist), head.join('\n') + '\n' + src);
}
