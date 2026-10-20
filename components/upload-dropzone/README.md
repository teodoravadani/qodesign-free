# Upload Dropzone

Drag files onto the zone and it lights up: the dashed border speeds up and turns lime, a glow follows your cursor, the icon jumps. Let go and a shockwave rolls out from the drop point while each file flies into the list as a row with a type badge and its own progress ring. Rings fill at their own pace and pop into a check with a few sparks. A file that fails shakes, turns red and offers Retry. A total bar on top adds it all up.

![Upload Dropzone preview](preview.gif)

Live demo: open [html/upload-dropzone.html](html/upload-dropzone.html) in a browser. The demo plays by itself. Drop your own files on it, or click the zone to pick some; after 4 seconds without input (and once your uploads finish) the demo starts again.

## What's inside

- `html/upload-dropzone.html`: everything in one file (HTML, CSS, plain JS). Uploads are simulated; `tick()` is the place to plug in real progress.
- `react/`: Vite + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion.
  - `react/src/components/UploadDropzone.tsx`: the drop-in component (zone, list, total bar).
  - `react/src/components/upload-dropzone.css`: its styles, tokens at the top.
  - `react/src/App.tsx`: the demo page (a release screen with a Publish button) and the scripted cursor.
- `PROMPT.md`: prompts for AI coding agents.

## Run the React demo

```bash
cd react
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in react/dist
```

## Use it

Dependencies: `react`, `react-dom`, `framer-motion`.

1. Copy `UploadDropzone.tsx` and `upload-dropzone.css` into your components folder.
2. Give it an uploader. Without one, uploads are simulated, which is handy while you build the UI.

```tsx
import { UploadDropzone, Uploader } from './components/UploadDropzone';

// XHR gives real upload progress; fetch doesn't (yet)
const upload: Uploader = (file, onProgress, signal) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100);
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Server said ${xhr.status}`)));
    xhr.onerror = () => reject(new Error('Network error'));
    signal.addEventListener('abort', () => xhr.abort());
    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });

<UploadDropzone
  upload={upload}
  maxSize={50 * 1024 * 1024}
  accept="image/*,.pdf,.zip"
  onAllDone={(files) => setCanPublish(true)}
/>
```

If the promise rejects, the row shows your error message and a Retry button.

### Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `upload` | `(file, onProgress, signal) => Promise<void>` | simulated | your uploader; call `onProgress(0-100)`, resolve when done, reject to show Retry |
| `maxSize` | `number` | 50 MB | bigger files are listed with "Too large" and no retry |
| `accept` | `string` | | passed to the file picker |
| `title` | `string` | `"Drop files here"` | zone heading |
| `hint` | `string` | `"up to 50 MB each"` | text after "or browse your computer" |
| `chips` | `string[]` | PDF, PNG, ZIP, MD, MP4 | small type chips in the zone (hidden on phones) |
| `onChange` | `(items) => void` | | every progress or status change |
| `onAllDone` | `(items) => void` | | every file finished |
| `onUserActivity` | `() => void` | | a real drag moved over the page |

A ref gives you `addFiles(files, from?)`, `retry(id)`, `clear(animated?)`, `items()`, `setDragOver(on, count?, at?)` and `shock(x, y)`. The demo uses them to drive the component with fake files (`{ name, size, simulate: { speed, failAt } }`).

## Accessibility

- "Browse your computer" is a real button: Tab to it and press Enter or Space to open the file picker. The whole zone is also clickable. Drag and drop is never the only way in.
- The total bar and each ring are `progressbar`s with live values. A polite live region says when files are added, finish or fail.
- Retry and Remove are real buttons with labels that name the file, at least 44 px.
- With Reduce Motion on, rows fade in where they belong and the decorative effects are off. Progress still updates.

## Customise

Tokens at the top of `upload-dropzone.css`: `--volt` (border on drag, rings, total bar), `--err`, `--panel`, `--line`. Type colours sit in `TYPES` in the component. Timing: rows fly in over 0.76 s with a 95 ms stagger and a small arc; the drag-over zone scales to 1.025 on a spring; the shockwave grows 9x in 0.7 s.

## More like this

This one is free (MIT). The paid components are $3 each, or $29 for all of them, at [qodesign.dev](https://qodesign.dev/?utm_source=github&utm_medium=readme&utm_campaign=free_repo).
